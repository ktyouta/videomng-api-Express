import { TagMaster, FavoriteVideoTransaction } from "@prisma/client";

export class GetTagListResponseModel {

    private readonly _data: TagMaster[];

    constructor(tagMaster: TagMaster[]) {

        this._data = tagMaster;
    }

    get data() {
        return this._data;
    }
}