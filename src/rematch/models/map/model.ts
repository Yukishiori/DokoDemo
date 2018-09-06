import { createModel, ModelConfig, getDispatch } from '@rematch/core';
import { IMapScreenState, IPlaceFromGoogle, IAddChosenPlacePayload, IUpdatePolylineCoordsPayload } from './interface';
import placeService from '../../../service/place.service';
import placeCombo from '../../../combo';
import moment from 'moment';
import { ICoord } from '../../../service/interface.service';
import haversine from 'haversine';
import _ from 'lodash';
import { IState } from '../../../components/Layout';
import { IRootState } from '../../interface';
const mapScreenModel: ModelConfig<IMapScreenState> = createModel({
    state: {
        chosenPlaces: [],
        polylineCoords: [],
        isBusy: false
    },
    reducers: {
        addChosenPlace: (
            state: IMapScreenState,
            payload: IAddChosenPlacePayload
        ): IMapScreenState => {
            return {
                ...state,
                chosenPlaces: [...state.chosenPlaces, payload.chosenPlace]
            };
        },
        updatePolylineCoords: (
            state: IMapScreenState,
            payload: IUpdatePolylineCoordsPayload
        ): IMapScreenState => {
            return {
                ...state,
                ...payload
            }
        },
        removeChosenPlace: (
            state: IMapScreenState,
            payload: { placeId: string }
        ): IMapScreenState => {
            return {
                ...state,
                chosenPlaces: state.chosenPlaces.filter((chosenPlace) => chosenPlace.place_id !== payload.placeId)
            }
        },
        updateBusyState: (
            state: IMapScreenState,
            payload: boolean
        ): IMapScreenState => {
            return {
                ...state,
                isBusy: payload
            }
        }
    },
    effects: {
        async getNearByPlaceUsingCombo(location: ICoord, state: IRootState): Promise<void> {
            try {
                const placeCombo = getCombo();

                // const chosenPlacesArray = await Promise.all(placeCombo.map(async (currentValue) => {

                //     return bestPlace
                // }));
                this.updateBusyState(true);
                await this.getAnotherPlaceFromThisPlace({ placeCombo, location, index: 0 });
                await this.getDirection(location)
            } catch (err) {
                // this.loginError({ error: err.message });
                console.log(err)
            }
        },
        async getAnotherPlaceFromThisPlace({ placeCombo, location, index }): Promise<void> {
            try {
                if (placeCombo[index]) {
                    const resultPlaces = (await placeService.betterFetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&key=AIzaSyBiBhfUvyVhrkvEtUbMavlUhmSO7DRCAKQ&rankby=distance&opennow=true&keyword=${placeCombo[index]}&language=vi`)).results;
                    const bestPlace = getNumberOfBestPlace(
                        resultPlaces,
                        location, 1);
                    this.addChosenPlace({ chosenPlace: bestPlace[0] });
                    await this.getAnotherPlaceFromThisPlace({
                        placeCombo, location: {
                            latitude: bestPlace[0].geometry.location.lat,
                            longitude: bestPlace[0].geometry.location.lng
                        }, index: index + 1
                    })
                }
                this.updateBusyState(false);
            } catch (err) {
                // this.loginError({ error: err.message });
                console.log(err)
            }
        },
        async getDirection(location: ICoord, state: IRootState): Promise<void> {
            try {
                const waypoints = state.mapScreenModel.chosenPlaces.reduce((acc, chosenPlace, index) => {
                    if (index === state.mapScreenModel.chosenPlaces.length - 1) {
                        return acc;
                    }
                    return acc + (acc === '' ? `place_id:${chosenPlace.place_id}` : `|place_id:${chosenPlace.place_id}`)
                }
                    , '')
                const polylineCoords = parsePolyline(await placeService.betterFetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${location.latitude},${location.longitude}&destination=place_id:${state.mapScreenModel.chosenPlaces[state.mapScreenModel.chosenPlaces.length - 1].place_id}&waypoints=${waypoints}&key=AIzaSyBiBhfUvyVhrkvEtUbMavlUhmSO7DRCAKQ`))
                this.updatePolylineCoords({ polylineCoords });
            } catch (err) {

            }
        }
    }
});


const parsePolyline = (response: any): ICoord[] => {
    return _.flatten(response.routes[0].legs.map(leg => {
        const route: ICoord[] = [];
        leg.steps.forEach((step, index) => {
            route.push({
                latitude: step.start_location.lat,
                longitude: step.start_location.lng
            });
            if (index === leg.steps.length - 1) {
                route.push({
                    latitude: step.end_location.lat,
                    longitude: step.end_location.lng
                });
            }
        })
        return route;
    }));
}

const getCombo = (): string[] => {
    let combo = [];
    const currentHour = moment().get('hour');
    if (currentHour >= 20) {
        combo = placeCombo[2];
    } else {
        combo = placeCombo[2];
    }
    return combo;
}

const getNumberOfBestPlace = (places: IPlaceFromGoogle[], currentLocation: ICoord, number = 1): IPlaceFromGoogle[] => {
    const returnArray: IPlaceFromGoogle[] = [];
    for (let i = 0; i < number; i++) {
        const placeScores: number[] = places.map(place =>
            (1 / haversine({
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng
            }, currentLocation, { unit: 'km' })) * (place.rating + 1)
        )
        returnArray.push(...places.splice(placeScores.indexOf(Math.max(...placeScores)), 1));
    }

    return returnArray;
}

export default mapScreenModel;
