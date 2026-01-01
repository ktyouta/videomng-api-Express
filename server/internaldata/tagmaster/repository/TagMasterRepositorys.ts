import { RepositoryType } from "../../../common/const/CommonConst";
import { TagMasterRepositoryPostgres } from "./concrete/TagMasterRepositoryPostgres";
import { TagMasterRepositoryInterface } from "./interface/TagMasterRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class TagMasterRepositorys {


    private readonly repositorys: Record<RepositoryType, TagMasterRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, TagMasterRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new TagMasterRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): TagMasterRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}