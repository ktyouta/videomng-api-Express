import { Prisma } from "@prisma/client";
import { RepositoryType } from "../../../util/const/CommonConst";
import { ViewStatusMasterRepositoryInterface } from "../../viewstatusmaster/repository/interface/ViewStatusMasterRepositoryInterface";
import { ViewStatusMasterRepositorys } from "../../viewstatusmaster/repository/ViewStatusMasterRepositorys";
import { FavoriteVideoSortMasterRepositorys } from "../repository/FavoriteVideoSortMasterRepositorys";
import { FavoriteVideoSortMasterRepositoryInterface } from "../repository/interface/FavoriteVideoSortMasterRepositoryInterface";

export class FavoriteVideoSortIdModel {

    private readonly _sortId: string;
    private static readonly _favoriteVideoSortMasterRepositoryInterface: FavoriteVideoSortMasterRepositoryInterface =
        (new FavoriteVideoSortMasterRepositorys()).get(RepositoryType.POSTGRESQL);
    private static DEFAULT = `0`;

    private constructor(viewStatus: string) {

        this._sortId = viewStatus;
    }

    static async reConstruct(sortId: string) {

        if (sortId) {

            const viewStatusList = await this._favoriteVideoSortMasterRepositoryInterface.getListByKey(sortId);

            if (!viewStatusList) {
                sortId = FavoriteVideoSortIdModel.DEFAULT;
            }
        }

        return new FavoriteVideoSortIdModel(sortId);
    }

    get sortId() {
        return this._sortId;
    }
}