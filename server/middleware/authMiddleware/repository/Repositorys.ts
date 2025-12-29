import { RepositoryType } from "../../../util/const/CommonConst";
import { RepositoryJson } from "./concrete/RepositoryJson";
import { RepositoryInterface } from "./interface/RepositoryInterface";


/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class Repositorys {


    private readonly repositorys: Record<RepositoryType, RepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, RepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new RepositoryJson())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): RepositoryInterface {
        return this.repositorys[repositoryType];
    }
}