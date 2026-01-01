import { RepositoryType } from "../../common/const/CommonConst";
import { GetFolderListRepositoryPostgres } from "./concrete/GetFolderListRepositoryPostgres";
import { GetFolderListRepositoryInterface } from "./interface/GetFolderListInterface";


/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class GetFolderListRepositorys {


    private readonly repositorys: Record<RepositoryType, GetFolderListRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, GetFolderListRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new GetFolderListRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): GetFolderListRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}