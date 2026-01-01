import { RepositoryType } from "../../common/const/CommonConst";
import { DeleteFavoriteVideoMemoRepositoryPostgres } from "./concrete/DeleteFavoriteVideoMemoRepositoryPostgres";
import { DeleteFavoriteVideoMemoRepositoryInterface } from "./interface/DeleteFavoriteVideoMemoRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class DeleteFavoriteVideoMemoRepositorys {


    private readonly repositorys: Record<RepositoryType, DeleteFavoriteVideoMemoRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, DeleteFavoriteVideoMemoRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new DeleteFavoriteVideoMemoRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): DeleteFavoriteVideoMemoRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}