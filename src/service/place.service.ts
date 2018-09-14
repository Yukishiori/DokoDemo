import { ICoord } from "./interface.service";
import config from "../../config";
import { IPlaceFromGoogle, IPlaceDetailResult, ICombinePlaceDetail, IFirebasePlace, IComment } from "../rematch/models/map/interface";
import firebase from 'firebase';
import moment from "moment";
const betterFetch = async (url: string) => {
    const res = await fetch(url)
    return await res.json();
}

const getImageUris = async (photo_references: string[]): Promise<string[]> => {
    try {
        const res = await Promise.all(photo_references.map(async (photo_reference) => fetch(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo_reference}&key=${config.apiKey}`)))
        return res.map(res => res.url)
    } catch (err) {
        console.log(err)
    }

}

const getPlaceDetail = async (placeId: string): Promise<ICombinePlaceDetail> => {
    try {
        const res: IPlaceDetailResult = (await betterFetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${config.apiKey}`)).result;
        let combinedPlace: ICombinePlaceDetail = null;
        const doc = await firebase.firestore().collection('places').doc(placeId).get()
        if (doc && doc.exists) {
            combinedPlace = { ...res, ...doc.data() as IFirebasePlace };
        } else {
            combinedPlace = {
                ...res,
                createTime: moment().unix(),
                favoriteBy: {},
                ratings: res.rating ? res.rating : 0,
                name: '',
                types: res.types
            }
            firebase.firestore().collection('places').doc(placeId).set({
                createTime: moment().unix(),
                favoriteBy: {},
                ratings: res.rating ? res.rating : 0,
                name: res.name,
                types: res.types
            })

        }

        return combinedPlace;
    } catch (err) {
        console.log(err);
    }
}

const getPlaceFromKeyword = async (location: ICoord, orderIndex: number, keyword: string): Promise<IPlaceFromGoogle[]> => {
    try {
        const res: IPlaceFromGoogle[] = (await betterFetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(keyword)}&inputtype=textquery&locationbias=circle:1000@${location.latitude},${location.longitude}&key=${config.apiKey}&language=vi&fields=photos,formatted_address,name,opening_hours,rating,geometry,place_id`)).candidates
        const placeWithImage = await Promise.all(res.splice(0, 5).map(async (place) => {
            if (place.photos) {
                const firstImageUrl = (await getImageUris([place.photos[0].photo_reference]))[0];
                return {
                    ...place,
                    firstImageUrl
                }
            } else {
                return {
                    ...place,
                    firstImageUrl: null
                }
            }
        }));
        const searchedCollection = firebase.firestore().collection('searched');
        const wordInFirebase = await searchedCollection.where('value', '==', keyword).get();
        if (wordInFirebase && !wordInFirebase.empty) {
            const word = wordInFirebase.docs[0]
            searchedCollection.doc(word.id).set({
                ...word.data(),
                timeSearched: word.data().timeSearched + 1,
                mostRecentSearched: moment().unix(),
                users: {
                    [firebase.auth().currentUser.uid]: true
                },
                orderIndex: {
                    [orderIndex]: word.data().orderIndex[orderIndex] + 1
                }
            }, { merge: true })
        } else {
            searchedCollection.add({
                value: keyword,
                createTime: moment().unix(),
                timeSearched: 1,
                mostRecentSearched: moment().unix(),
                users: {
                    [firebase.auth().currentUser.uid]: true
                },
                orderIndex: {
                    [orderIndex]: 1
                }
            })
        }

        return placeWithImage;
    } catch (err) {
        console.log(err);
    }
}

const getAutoComplete = async (input: string, location: ICoord, radius: number, sessionToken: number): Promise<string[]> => {
    const res = await betterFetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&location=${location.latitude},${location.longitude}&radius=${radius}&key=${config.apiKey}&session_token=${sessionToken}`)
    return res.predictions.map((prediction: any) => prediction.description);
}

const getComment = async (placeId: string): Promise<IComment[]> => {
    const docs = (await firebase.firestore().collection('comments').where('placeId', '==', placeId).get()).docs;
    return docs.map(doc => doc.data() as IComment)
}

const getFacebookPlace = async (location: ICoord, keyword: string): Promise<any[]> => {
    const res = await fetch(`https://api.facebook.com/method/fql.query?query=SELECT  name, geometry, checkin_count, latitude, longitude, page_id , description FROM place WHERE  CONTAINS("${keyword}") AND   distance(latitude, longitude, "${location.latitude}", "${location.longitude}") < 1000&access_token=EAAAAUaZA8jlABAIcLZBEC8r0kSMgOlPbmaBQaDCAorGiFtPZAnrIhop3em1UoUaQocFDzRgVoUJsubVMdsN7QCag06UExFy54uQYePzIu3qGAiy7QPYQAVXj5xVZCZBZBvZCBbcXET3f5L3JaRS45xvfUeutpxsb0HP8slSSoirIAZDZD&format=json`)
    return await res.json();
}

const getDistance = async (place1: any, place2Id: string): Promise<number> => {
    let origin;
    if (place1.latitude) {
        origin = `${place1.latitude},${place1.longitude}`
    } else {
        origin = `place_id:${place1}`
    }
    const destination = `place_id:${place2Id}`
    const res = await betterFetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${config.apiKey}`)
    return res.routes[0].legs[0].distance.value;

}


export default {
    betterFetch,
    getImageUris,
    getPlaceDetail,
    getPlaceFromKeyword,
    getAutoComplete,
    getComment,
    getFacebookPlace,
    getDistance
}