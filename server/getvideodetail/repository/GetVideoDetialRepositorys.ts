import { RepositoryType } from "../../util/const/CommonConst";
import { GetVideoDetialRepositoryPostgres } from "./concrete/GetVideoDetialRepositoryPostgres";
import { GetVideoDetialRepositoryInterface } from "./interface/GetVideoDetialRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class GetVideoDetialRepositorys {


    private readonly repositorys: Record<RepositoryType, GetVideoDetialRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, GetVideoDetialRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new GetVideoDetialRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): GetVideoDetialRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}