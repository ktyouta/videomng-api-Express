import { RepositoryType } from "../../util/const/CommonConst";
import { GetVideoListRepositoryPostgres } from "./concrete/GetVideoListRepositoryPostgres";
import { GetVideoListRepositoryInterface } from "./interface/GetVideoListRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class GetVideoListRepositorys {


    private readonly repositorys: Record<RepositoryType, GetVideoListRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, GetVideoListRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new GetVideoListRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): GetVideoListRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}