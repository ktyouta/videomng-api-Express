import { RepositoryType } from "../../../util/const/CommonConst";
import { FrontUserLoginMasterRepositoryPostgres } from "./concrete/FrontUserLoginMasterRepositoryPostgres";
import { FrontUserLoginMasterRepositoryInterface } from "./interface/FrontUserLoginMasterRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class FrontUserLoginMasterRepositorys {


    private readonly repositorys: Record<RepositoryType, FrontUserLoginMasterRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, FrontUserLoginMasterRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new FrontUserLoginMasterRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): FrontUserLoginMasterRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}