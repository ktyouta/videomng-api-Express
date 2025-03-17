import { RepositoryType } from "../../util/const/CommonConst";
import { UpdateFavoriteVideoMemoRepositoryPostgres } from "./concrete/UpdateFavoriteVideoMemoRepositoryPostgres";
import { UpdateFavoriteVideoMemoRepositoryInterface } from "./interface/UpdateFavoriteVideoMemoRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class UpdateFavoriteVideoMemoRepositorys {


    private readonly repositorys: Record<RepositoryType, UpdateFavoriteVideoMemoRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, UpdateFavoriteVideoMemoRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new UpdateFavoriteVideoMemoRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): UpdateFavoriteVideoMemoRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}