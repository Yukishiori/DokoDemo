import { ICoord } from "./interface.service";
import config from "../../config";

const betterFetch = async (url: string) => {
    const res = await fetch(url)
    return await res.json();
}


export default {
    betterFetch
}