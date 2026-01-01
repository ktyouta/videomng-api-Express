import { RepositoryType } from "../../../common/const/CommonConst";
import { ViewStatusMasterRepositoryPostgres } from "./concrete/ViewStatusMasterRepositoryPostgres";
import { ViewStatusMasterRepositoryInterface } from "./interface/ViewStatusMasterRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class ViewStatusMasterRepositorys {


    private readonly repositorys: Record<RepositoryType, ViewStatusMasterRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, ViewStatusMasterRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new ViewStatusMasterRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): ViewStatusMasterRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}