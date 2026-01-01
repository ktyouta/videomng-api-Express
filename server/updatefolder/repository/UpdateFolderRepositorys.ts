import { RepositoryType } from "../../common/const/CommonConst";
import { UpdateFolderRepositoryPostgres } from "./concrete/UpdateFolderRepositoryPostgres";
import { UpdateFolderRepositoryInterface } from "./interface/UpdateFolderInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class UpdateFolderRepositorys {


    private readonly repositorys: Record<RepositoryType, UpdateFolderRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, UpdateFolderRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new UpdateFolderRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): UpdateFolderRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}