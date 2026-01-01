import { RepositoryType } from "../../../common/const/CommonConst";
import { ViewStatusMasterRepositoryInterface } from "../../viewstatusmaster/repository/interface/ViewStatusMasterRepositoryInterface";
import { ViewStatusMasterRepositorys } from "../../viewstatusmaster/repository/ViewStatusMasterRepositorys";

export class ViewStatusModel {

    private readonly _viewStatus: string;
    private static readonly _viewStatusMasterRepositoryInterface: ViewStatusMasterRepositoryInterface =
        (new ViewStatusMasterRepositorys()).get(RepositoryType.POSTGRESQL);

    private constructor(viewStatus: string) {

        this._viewStatus = viewStatus;
    }

    static async reConstruct(viewStatus: string) {

        if (viewStatus) {

            const viewStatusList = await this._viewStatusMasterRepositoryInterface.getSequenceByKey(viewStatus);

            if (!viewStatusList) {
                throw Error(`視聴状況に不正値が指定されています。status:${viewStatus}`);
            }
        }

        return new ViewStatusModel(viewStatus);
    }

    get viewStatus() {
        return this._viewStatus;
    }
}