import { RepositoryType } from "../../util/const/CommonConst";
import { FolderShareVideosRepositoryPostgres } from "./concrete/FolderShareVideosRepositoryPostgres";
import { FolderShareVideosRepositoryInterface } from "./interface/FolderShareVideosRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class FolderShareVideosRepositorys {


    private readonly repositorys: Record<RepositoryType, FolderShareVideosRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, FolderShareVideosRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new FolderShareVideosRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): FolderShareVideosRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}