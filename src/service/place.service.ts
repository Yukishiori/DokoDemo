import { ICoord } from "./interface.service";
import config from "../../config";
import { IPlaceDetailFromGoogle, IPlaceFromGoogle } from "../rematch/models/map/interface";

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

const getPlaceDetail = async (placeId: string): Promise<IPlaceDetailFromGoogle> => {
    try {
        const res: IPlaceDetailFromGoogle = await betterFetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${config.apiKey}`);
        return res;
    } catch (err) {
        console.log(err);
    }
}

const getPlaceFromKeyword = async (location: ICoord, keyword: string): Promise<IPlaceFromGoogle[]> => {
    try {
        const res: IPlaceFromGoogle[] = (await betterFetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&key=AIzaSyBiBhfUvyVhrkvEtUbMavlUhmSO7DRCAKQ&rankby=distance&opennow=true&keyword=${encodeURIComponent(keyword)}&language=vi`)).results
        console.log(res)
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

        }))
        console.log(placeWithImage)
        return placeWithImage;
    } catch (err) {
        console.log(err);
    }
}

const getAutoComplete = async (input: string, location: ICoord, radius: number, sessionToken: number): Promise<string[]> => {
    const res = await betterFetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&location=${location.latitude},${location.longitude}&radius=${radius}&key=${config.apiKey}&session_token=${sessionToken}`)
    return res.predictions.map((prediction: any) => prediction.description);
}


export default {
    betterFetch,
    getImageUris,
    getPlaceDetail,
    getPlaceFromKeyword,
    getAutoComplete
}