import { CreateFavoriteVideoRepositoryPostgres } from "../../createfavoritevideo/repository/concrete/CreateFavoriteVideoRepositoryPostgres";
import { CreateFavoriteVideoRepositoryInterface } from "../../createfavoritevideo/repository/interface/CreateFavoriteVideoRepositoryInterface";
import { RepositoryType } from "../../util/const/CommonConst";
import { UploadFavoriteVideoListCsvRepositoryPostgres } from "./concrete/UploadFavoriteVideoListCsvRepositoryPostgres";
import { UploadFavoriteVideoListCsvRepositoryInterface } from "./interface/UploadFavoriteVideoListCsvRepositoryInterface";


/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class UploadFavoriteVideoListCsvRepositorys {


    private readonly repositorys: Record<RepositoryType, UploadFavoriteVideoListCsvRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, UploadFavoriteVideoListCsvRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new UploadFavoriteVideoListCsvRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }

    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): UploadFavoriteVideoListCsvRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}