import { FavoriteVideoTransaction } from "@prisma/client";
import { FavoriteVideoListMergedType } from "./FavoriteVideoListMergedType";

export class GetFavoriteVideoListResponseModel {

    private readonly data: FavoriteVideoTransaction[];

    constructor(favoriteVideoListMergedList: FavoriteVideoListMergedType[]) {

        this.data = favoriteVideoListMergedList;
    }

}