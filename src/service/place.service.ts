import { ICoord } from "./interface.service";
import config from "../../config";
import { IPlaceDetailFromGoogle } from "../rematch/models/map/interface";

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
        console.log('place detail', `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${config.apiKey}`, res);
        return res;
    } catch (err) {
        console.log(err);
    }
}


export default {
    betterFetch,
    getImageUris,
    getPlaceDetail
}