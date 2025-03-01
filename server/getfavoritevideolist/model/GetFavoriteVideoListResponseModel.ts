import { FavoriteVideoTransaction } from "@prisma/client";

export class GetFavoriteVideoListResponseModel {

    private readonly data: FavoriteVideoTransaction[];

    constructor(favoriteVideoTransaction: FavoriteVideoTransaction[]) {

        this.data = favoriteVideoTransaction;
    }

}