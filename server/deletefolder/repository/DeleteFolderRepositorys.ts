import { RepositoryType } from "../../util/const/CommonConst";
import { DeleteFolderRepositoryPostgres } from "./concrete/DeleteFolderRepositoryPostgres";
import { DeleteFolderRepositoryInterface } from "./interface/DeleteFolderRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class DeleteFolderRepositorys {


    private readonly repositorys: Record<RepositoryType, DeleteFolderRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, DeleteFolderRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new DeleteFolderRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): DeleteFolderRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}