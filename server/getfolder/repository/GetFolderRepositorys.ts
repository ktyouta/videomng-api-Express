import { RepositoryType } from "../../util/const/CommonConst";
import { GetFolderRepositoryPostgres } from "./concrete/GetFolderRepositoryPostgres";
import { GetFolderRepositoryInterface } from "./interface/GetFolderInterface";


/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class GetFolderRepositorys {


    private readonly repositorys: Record<RepositoryType, GetFolderRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, GetFolderRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new GetFolderRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): GetFolderRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}