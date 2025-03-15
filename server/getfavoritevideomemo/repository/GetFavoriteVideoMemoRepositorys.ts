import { RepositoryType } from "../../util/const/CommonConst";
import { GetFavoriteVideoMemoRepositoryPostgres } from "./concrete/GetFavoriteVideoMemoRepositoryPostgres";
import { GetFavoriteVideoMemoRepositoryInterface } from "./interface/GetFavoriteVideoMemoRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class GetFavoriteVideoMemoRepositorys {


    private readonly repositorys: Record<RepositoryType, GetFavoriteVideoMemoRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, GetFavoriteVideoMemoRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new GetFavoriteVideoMemoRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): GetFavoriteVideoMemoRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}