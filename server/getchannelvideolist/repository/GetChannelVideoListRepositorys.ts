import { RepositoryType } from "../../common/const/CommonConst";
import { GetChannelVideoListRepositoryPostgres } from "./concrete/GetChannelVideoListRepositoryPostgres";
import { GetChannelVideoListRepositoryInterface } from "./interface/GetChannelVideoListRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class GetChannelVideoListRepositorys {


    private readonly repositorys: Record<RepositoryType, GetChannelVideoListRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, GetChannelVideoListRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new GetChannelVideoListRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): GetChannelVideoListRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}