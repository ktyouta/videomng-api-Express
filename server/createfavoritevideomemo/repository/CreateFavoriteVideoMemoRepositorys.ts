import { RepositoryType } from "../../util/const/CommonConst";
import { CreateFavoriteVideoMemoRepositoryPostgres } from "./concrete/CreateFavoriteVideoMemoRepositoryPostgres";
import { CreateFavoriteVideoMemoRepositoryInterface } from "./interface/CreateFavoriteVideoMemoRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class CreateFavoriteVideoMemoRepositorys {


    private readonly repositorys: Record<RepositoryType, CreateFavoriteVideoMemoRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, CreateFavoriteVideoMemoRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new CreateFavoriteVideoMemoRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): CreateFavoriteVideoMemoRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}