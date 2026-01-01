import { RepositoryType } from "../../common/const/CommonConst";
import { FrontUserCheckAuthRepositoryJson } from "./concrete/FrontUserCheckAuthRepositoryJson";
import { FrontUserCheckAuthRepositoryInterface } from "./interface/FrontUserCheckAuthRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class FrontUserCheckAuthRepositorys {


    private readonly repositorys: Record<RepositoryType, FrontUserCheckAuthRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, FrontUserCheckAuthRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new FrontUserCheckAuthRepositoryJson())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): FrontUserCheckAuthRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}