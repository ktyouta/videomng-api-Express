import { SearchWordType } from "../types/SearchWordType";

export class GetSearchWordResponseModel {

    private readonly _value: {
        recent: SearchWordType[];
        frequent: SearchWordType[];
    };

    constructor(recent: SearchWordType[], frequent: SearchWordType[]) {

        this._value = {
            recent,
            frequent
        };
    }

    get value() {
        return this._value;
    }
}