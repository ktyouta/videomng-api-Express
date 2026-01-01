import { RepositoryType } from "../../common/const/CommonConst";
import { CreateFolderRepositoryPostgres } from "./concrete/CreateFolderRepositoryPostgres";
import { CreateFolderRepositoryInterface } from "./interface/CreateFolderInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class CreateFolderRepositorys {


    private readonly repositorys: Record<RepositoryType, CreateFolderRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, CreateFolderRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new CreateFolderRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): CreateFolderRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}