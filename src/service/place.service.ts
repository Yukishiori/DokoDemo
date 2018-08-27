import { ICoord } from "./interface.service";
import config from "../../config";

const betterFetch = async (url: string) => {
    const res = await fetch(url)
    return await res.json();
}

const getImageUris = async (photo_references: string[]): Promise<string[]> => {
    try {
        const res = await Promise.all(photo_references.map(async (photo_reference) => fetch(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo_reference}&key=AIzaSyBiBhfUvyVhrkvEtUbMavlUhmSO7DRCAKQ`)))
        return res.map(res => res.url)
    } catch (err) {
        console.log(err)
    }

}


export default {
    betterFetch,
    getImageUris
}