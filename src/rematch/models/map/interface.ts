import { ICoord } from "../../../service/interface.service";

export interface ILocation {
    lat: number;
    lng: number;
}

export interface IGeometry {
    location: ILocation;
}

export interface IOpeningHours {
    open_now: boolean;
}

export interface IPhoto {
    height: number;
    html_attributions: any[];
    photo_reference: string;
    width: number;
}

export interface AltId {
    place_id: string;
    scope: string;
}

export interface IPlaceFromGoogle {
    geometry: IGeometry;
    icon: string;
    id: string;
    name: string;
    opening_hours: IOpeningHours;
    photos: IPhoto[];
    place_id: string;
    scope: string;
    alt_ids: AltId[];
    reference: string;
    types: string[];
    vicinity: string;
    rating: number;
}

export interface IRootObject {
    html_attributions: any[];
    results: IPlaceFromGoogle[];
    status: string;
}

export interface IMapScreenState {
    chosenPlaces: IPlaceFromGoogle[],
    polylineCoords: ICoord[]
}

export interface IAddChosenPlacePayload {
    chosenPlace: IPlaceFromGoogle
}

export interface IUpdatePolylineCoordsPayload {
    polylineCoords: ICoord[]
}