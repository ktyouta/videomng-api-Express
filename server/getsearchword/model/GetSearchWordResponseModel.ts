import { SearchWordType } from "../types/SearchWordType";

export class GetSearchWordResponseModel {

    private readonly _data: {
        recent: SearchWordType[];
        frequent: SearchWordType[];
    };

    constructor(recent: SearchWordType[], frequent: SearchWordType[]) {

        this._data = {
            recent,
            frequent
        };
    }

    get data() {
        return this._data;
    }
}