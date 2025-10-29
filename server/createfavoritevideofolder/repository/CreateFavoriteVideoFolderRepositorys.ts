import { RepositoryType } from "../../util/const/CommonConst";
import { CreateFavoriteVideoFolderRepositoryPostgres } from "./concrete/CreateFavoriteVideoFolderRepositoryPostgres";
import { CreateFavoriteVideoFolderInterface } from "./interface/CreateFavoriteVideoFolderInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class CreateFavoriteVideoFolderRepositorys {


    private readonly repositorys: Record<RepositoryType, CreateFavoriteVideoFolderInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, CreateFavoriteVideoFolderInterface> = {
            [RepositoryType.POSTGRESQL]: (new CreateFavoriteVideoFolderRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): CreateFavoriteVideoFolderInterface {
        return this.repositorys[repositoryType];
    }
}