import { RepositoryType } from "../../util/const/CommonConst";
import { FrontUserInfoUpdateRepositoryPostgres } from "./concrete/FrontUserInfoUpdateRepositoryPostgres";
import { FrontUserInfoUpdateRepositoryInterface } from "./interface/FrontUserInfoUpdateRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class FrontUserInfoUpdateRepositorys {


    private readonly repositorys: Record<RepositoryType, FrontUserInfoUpdateRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, FrontUserInfoUpdateRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new FrontUserInfoUpdateRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): FrontUserInfoUpdateRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}