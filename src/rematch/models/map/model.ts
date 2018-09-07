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
        isBusy: false,
        currentLocation: null
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
        },
        updateCurrentLocation: (
            state: IMapScreenState,
            payload: ICoord
        ): IMapScreenState => {
            return {
                ...state,
                currentLocation: payload
            }
        },
        addToChosenPlaces: (
            state: IMapScreenState,
            payload: IPlaceFromGoogle
        ): IMapScreenState => {
            return {
                ...state,
                chosenPlaces: [...state.chosenPlaces, payload]
            }
        },
        clearChosenPlaces: (
            state: IMapScreenState
        ): IMapScreenState => {
            return {
                ...state,
                chosenPlaces: []
            }
        }
    },
    effects: {
        async getNearByPlaceUsingCombo(something, state): Promise<void> {
            const placeCombo = getCombo();

            // const chosenPlacesArray = await Promise.all(placeCombo.map(async (currentValue) => {

            //     return bestPlace
            // }));
            this.updateBusyState(true);
            await this.getAnotherPlaceFromThisPlace({ placeCombo, location: state.mapScreenModel.currentLocation, index: 0 });
            await this.getDirection()
        },
        async getAnotherPlaceFromThisPlace({ placeCombo, location, index }): Promise<void> {
            if (placeCombo[index]) {
                const resultPlaces = (await placeService.betterFetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&key=AIzaSyBiBhfUvyVhrkvEtUbMavlUhmSO7DRCAKQ&rankby=distance&opennow=true&keyword=${encodeURIComponent(placeCombo[index])}&language=vi`)).results;
                const bestPlace = getNumberOfBestPlace(
                    resultPlaces,
                    location, 1);
                console.log('bestPlace', bestPlace)
                if (bestPlace && bestPlace[0]) {
                    const firstImageUrl = (await placeService.getImageUris([bestPlace[0].photos[0].photo_reference]))[0];

                    this.addChosenPlace({ chosenPlace: { ...bestPlace[0], firstImageUrl } });
                    await this.getAnotherPlaceFromThisPlace({
                        placeCombo, location: {
                            latitude: bestPlace[0].geometry.location.lat,
                            longitude: bestPlace[0].geometry.location.lng
                        }, index: index + 1
                    })
                } else {
                    await this.getAnotherPlaceFromThisPlace({
                        placeCombo, location, index: index + 1
                    })
                }

            }
            this.updateBusyState(false);
        },
        async getDirection(location: ICoord, state: IRootState): Promise<void> {
            const waypoints = state.mapScreenModel.chosenPlaces.reduce((acc, chosenPlace, index) => {
                if (index === state.mapScreenModel.chosenPlaces.length - 1 || chosenPlace === undefined) {
                    return acc;
                }
                return acc + (acc === '' ? `place_id:${chosenPlace.place_id}` : `|place_id:${chosenPlace.place_id}`)
            }
                , '')
            const polylineCoords = parsePolyline(await placeService.betterFetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${state.mapScreenModel.currentLocation.latitude},${state.mapScreenModel.currentLocation.longitude}&destination=place_id:${state.mapScreenModel.chosenPlaces[state.mapScreenModel.chosenPlaces.length - 1].place_id}&waypoints=${waypoints}&key=AIzaSyBiBhfUvyVhrkvEtUbMavlUhmSO7DRCAKQ`))
            this.updatePolylineCoords({ polylineCoords });
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
    return placeCombo[Math.floor(Math.random() * placeCombo.length - 1)];
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
