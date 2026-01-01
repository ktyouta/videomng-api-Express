import { RepositoryType } from "../../common/const/CommonConst";
import { DeleteFavoriteVideoFolderRepositoryPostgres } from "./concrete/DeleteFavoriteVideoFolderRepositoryPostgres";
import { DeleteFavoriteVideoFolderInterface } from "./interface/DeleteFavoriteVideoFolderInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class DeleteFavoriteVideoFolderRepositorys {


    private readonly repositorys: Record<RepositoryType, DeleteFavoriteVideoFolderInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, DeleteFavoriteVideoFolderInterface> = {
            [RepositoryType.POSTGRESQL]: (new DeleteFavoriteVideoFolderRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): DeleteFavoriteVideoFolderInterface {
        return this.repositorys[repositoryType];
    }
}