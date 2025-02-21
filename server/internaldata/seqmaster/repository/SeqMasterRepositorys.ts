import { RepositoryType } from "../../../util/const/CommonConst";
import { SeqMasterRepositoryPostgres } from "./concrete/SeqMasterRepositoryPostgres";
import { SeqMasterRepositoryPostgresRepositoryInterface } from "./interface/SeqMasterRepositoryPostgresRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class SeqMasterRepositorys {


    private readonly repositorys: Record<RepositoryType, SeqMasterRepositoryPostgresRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, SeqMasterRepositoryPostgresRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new SeqMasterRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): SeqMasterRepositoryPostgresRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}