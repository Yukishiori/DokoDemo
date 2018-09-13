import { createModel, ModelConfig, getDispatch } from '@rematch/core';
import { IMapScreenState, IPlaceFromGoogle, IAddChosenPlacePayload, IUpdatePolylineCoordsPayload, IStoreDataPayload } from './interface';
import placeService from '../../../service/place.service';
import {
    drink,
    entertain,
    heavyFood,
    desert,
    quietPlace
} from '../../../combo';
import moment from 'moment';
import { ICoord } from '../../../service/interface.service';
import haversine from 'haversine';
import _ from 'lodash';
import { IState } from '../../../components/Layout';
import { IRootState } from '../../interface';
import config from '../../../../config';
import firebase from 'firebase';
import { Alert } from 'react-native';

import { AsyncStorage } from 'react-native';
const mapScreenModel: ModelConfig<IMapScreenState> = createModel({
    state: {
        chosenPlaces: [],
        polylineCoords: [],
        isBusy: false,
        currentLocation: null,
        checkedPlaces: [],
        ratingModalVisible: false,
        rating: 0
    },
    reducers: {
        addChosenPlace: (
            state: IMapScreenState,
            payload: IAddChosenPlacePayload
        ): IMapScreenState => {
            return {
                ...state,
                chosenPlaces: [...state.chosenPlaces, payload.chosenPlace],
                polylineCoords: []
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
                chosenPlaces: state.chosenPlaces.filter((chosenPlace) => chosenPlace.place_id !== payload.placeId),
                polylineCoords: []
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
        },
        updateChosenPlaces: (
            state: IMapScreenState,
            payload: { results: any }
        ): IMapScreenState => {
            return {
                ...state,
                chosenPlaces: payload.results
            }
        },
        addOrRemoveCheckedPlaces: (
            state: IMapScreenState,
            payload: {
                placeId: string,
                placeName: string
            }
        ): IMapScreenState => {
            return {
                ...state,
                checkedPlaces: state.checkedPlaces.filter(val => val.placeId === payload.placeId).length ?
                    state.checkedPlaces.filter(val => val.placeId !== payload.placeId) :
                    [...state.checkedPlaces, payload]
            }
        },
        toggleRatingModal: (
            state: IMapScreenState,
            payload?: boolean
        ): IMapScreenState => {
            return {
                ...state,
                ratingModalVisible: payload || !state.ratingModalVisible
            }
        },
        changeRating: (
            state: IMapScreenState,
            payload: number
        ): IMapScreenState => {
            return {
                ...state,
                rating: payload
            }
        },
        submitSuccess: (
            state: IMapScreenState
        ): IMapScreenState => {
            return {
                ...state,
                checkedPlaces: [],
                chosenPlaces: [],
                rating: 0,
                isBusy: false,
                ratingModalVisible: false
            }
        },
        persistChosenPlaces: (
          state: IMapScreenState,
          payload: any
        ): IMapScreenState => {
          return {
            ...state,
            chosenPlaces: payload
          }
        },
        persistCheckedPlaces: (
          state: IMapScreenState,
          payload: any
        ): IMapScreenState => {
          return {
            ...state,
            checkedPlaces: payload
          }
        }
    },
    effects: {
        async getNearByPlaceUsingCombo(something, state): Promise<void> {
            const placeCombo = getCombo();
            this.updateBusyState(true);
            await this.getAnotherPlaceFromThisPlace({ placeCombo, index: 0 });
            await this.getDirection()
        },
        async getAnotherPlaceFromThisPlace({ placeCombo, index }, state): Promise<void> {
            try {
                if (placeCombo[index]) {
                    const prevPoint = state.mapScreenModel.chosenPlaces[state.mapScreenModel.chosenPlaces.length - 1] as IPlaceFromGoogle
                    const origin = index === 0
                        ? `${state.mapScreenModel.currentLocation.latitude},${state.mapScreenModel.currentLocation.longitude}`
                        : `${prevPoint.geometry.location.lat},${prevPoint.geometry.location.lng}`
                    const search = placeCombo[index].split('_')[1] ? `types=${placeCombo[index]}` : `keyword=${placeCombo[index]}`
                    const resultPlaces: IPlaceFromGoogle[] = (await placeService.betterFetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${origin}&key=AIzaSyBiBhfUvyVhrkvEtUbMavlUhmSO7DRCAKQ&open_now=true&rankby=distance&${search}&language=vi`)).results;
                    const bestPlace = await getNumberOfBestPlace(
                        resultPlaces.splice(0, 5),
                        index === 0
                            ? state.mapScreenModel.currentLocation
                            : state.mapScreenModel.chosenPlaces[state.mapScreenModel.chosenPlaces.length - 1].place_id, 1);
                    if (bestPlace && bestPlace[0]) {
                        let firstImageUrl = '';
                        if (bestPlace[0].photos && bestPlace[0].photos[0]) {
                            firstImageUrl = (await placeService.getImageUris([bestPlace[0].photos[0].photo_reference]))[0];
                        }

                        this.addChosenPlace({ chosenPlace: { ...bestPlace[0], firstImageUrl } });
                        await this.getAnotherPlaceFromThisPlace({
                            placeCombo, location: {
                                latitude: bestPlace[0].geometry.location.lat,
                                longitude: bestPlace[0].geometry.location.lng
                            }, index: index + 1
                        })
                    } else {
                        await this.getAnotherPlaceFromThisPlace({
                            placeCombo, index: index + 1
                        })
                    }
                }
            } catch (err) {
                console.log(err)
            } finally {
                this.updateBusyState(false);
            }
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
        },
        async getEstimatedTime(payload: any, state: IRootState): Promise<void> {
            const promises = payload.chosenPlaces.map((val: any, index: number) => {
                var origin = index > 0 ? `place_id:${payload.chosenPlaces[index - 1].place_id}` : `${payload.currentLocation.latitude},${payload.currentLocation.longitude}`;
                var destination = `place_id:${val.place_id}`;
                return placeService.betterFetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${config.apiKey}`)
            })

            var estimatedTimes = await Promise.all(promises) as any;
            estimatedTimes = estimatedTimes.map((val: any) => {
                if (val.routes.length && val.routes[0].legs && val.routes[0].legs.length && val.routes[0].legs[0].duration) {
                    return val.routes[0].legs[0].duration;
                } else return null;
            })
            const results = payload.chosenPlaces.map((val: any, index: number) => {
                val.estimatedTime = estimatedTimes[index];
                return val;
            })
            this.updateChosenPlaces({ results })
        },
        async submitPlacesAndRating(payload: any, state: IRootState): Promise<void> {
            this.updateBusyState(true);
            try {
                firebase.firestore().collection('history').doc().set(
                    payload,
                    { merge: true }).then(() => {
                        this.submitSuccess();
                        return payload;
                    });
            } catch (err) {
                Alert.alert(
                    'Something went wrong! Please try again.',
                    "",
                    [
                        { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                        { text: 'OK', onPress: () => { } },
                    ],
                    { cancelable: false }
                );
                console.log(err);
                this.updateBusyState(false);
            }
        },
        async storeData(payload: IStoreDataPayload, state: IRootState): Promise<void> {
          try {
            await AsyncStorage.setItem(payload.key, JSON.stringify(payload.value));
          } catch (error) {
            console.log(error);
          }
        },
        async getData(payload: string, state: IRootState): Promise<any> {
          try {
            const result = await AsyncStorage.getItem(payload);
            return result ? JSON.parse(result) : null;
          } catch (err) {
            console.log(err);
          }
        }
    }
});


const parsePolyline = (response: any): ICoord[] => {
    return _.flatten(response.routes[0].legs.map((leg: any) => {
        const route: ICoord[] = [];
        leg.steps.forEach((step: any, index: any) => {
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
    let combo: string[] = []
    const hour = moment().get('hour')
    if (hour < 6) {
        combo.push(getRandomItem(quietPlace));
        combo.push(getRandomItem(drink));
    } else if (hour < 12) {
        combo.push(getRandomItem(drink));
        combo.push(getRandomItem(heavyFood));
        combo.push(getRandomItem(entertain));
    } else if (hour < 20) {
        combo.push(getRandomItem(heavyFood));
        combo.push(getRandomItem(drink));
        combo.push(getRandomItem(entertain));
        combo.push(getRandomItem(desert));
    } else {
        combo.push(getRandomItem(desert));
        combo.push(getRandomItem(drink));
        combo.push(getRandomItem(quietPlace));
    }
    return combo
}

const getRandomItem = (array: any[]) => {
    return array[Math.floor(Math.random() * (array.length))]
}

const getNumberOfBestPlace = async (places: IPlaceFromGoogle[], currentLocation: any, number = 1): Promise<IPlaceFromGoogle[]> => {
    const returnArray: IPlaceFromGoogle[] = [];
    const placesDistance: number[] = await Promise.all(places.map(async (place) => {
        return await placeService.getDistance(currentLocation, place.place_id)
    }))
    for (let i = 0; i < number; i++) {
        const placeScores: number[] = places.map((place, index) =>
            (Math.max(...placesDistance) / (placesDistance[index])) * (place.rating + 1)
        )
        returnArray.push(...places.splice(placeScores.indexOf(Math.max(...placeScores)), 1));
    }
    return returnArray;
}

export default mapScreenModel;
