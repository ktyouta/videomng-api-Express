import { RepositoryType } from "../../util/const/CommonConst";
import { UpdateFrontUserPasswordRepositoryPostgres } from "./concrete/UpdateFrontUserPasswordRepositoryPostgres";
import { UpdateFrontUserPasswordRepositoryInterface } from "./interface/UpdateFrontUserPasswordRepositoryPostgres";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class UpdateFrontUserPasswordRepositorys {


    private readonly repositorys: Record<RepositoryType, UpdateFrontUserPasswordRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, UpdateFrontUserPasswordRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new UpdateFrontUserPasswordRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): UpdateFrontUserPasswordRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}