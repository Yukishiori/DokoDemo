import { ICoord } from "./interface.service";
import config from "../../config";
import { IPlaceDetailFromGoogle, IPlaceFromGoogle, IPlaceDetailResult, ICombinePlaceDetail, IFirebasePlace, IComment } from "../rematch/models/map/interface";
import firebase from 'firebase';
import moment, { unix } from "moment";
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
                name: ''
            }
            firebase.firestore().collection('places').doc(placeId).set({
                createTime: moment().unix(),
                favoriteBy: {},
                ratings: res.rating ? res.rating : 0,
                name: res.name
            })

        }

        return combinedPlace;
    } catch (err) {
        console.log(err);
    }
}

const getPlaceFromKeyword = async (location: ICoord, keyword: string): Promise<IPlaceFromGoogle[]> => {
    try {
        const res: IPlaceFromGoogle[] = (await betterFetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&key=AIzaSyBiBhfUvyVhrkvEtUbMavlUhmSO7DRCAKQ&rankby=distance&opennow=true&keyword=${encodeURIComponent(keyword)}&language=vi`)).results
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
                mostRecentSearched: moment().unix()
            }, { merge: true })
        } else {
            searchedCollection.add({
                value: keyword,
                createTime: moment().unix(),
                timeSearched: 1,
                mostRecentSearched: moment().unix()
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


export default {
    betterFetch,
    getImageUris,
    getPlaceDetail,
    getPlaceFromKeyword,
    getAutoComplete,
    getComment
}