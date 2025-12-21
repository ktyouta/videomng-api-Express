import { Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { InsertFavoriteVideoFolderEntity } from "../entity/InsertFavoriteVideoFolderEntity";
import { SelectFavoriteVideoEntity } from "../entity/SelectFavoriteVideoEntity";
import { SelectFavoriteVideoFolderEntity } from "../entity/SelectFavoriteVideoFolderEntity";
import { SelectFolderEntity } from "../entity/SelectFolderEntity";
import { CreateFavoriteVideoFolderInterface } from "../repository/interface/CreateFavoriteVideoFolderInterface";


export class CreateFavoriteVideoFolderService {

    constructor(private readonly createFavoriteVideoFolderInterface: CreateFavoriteVideoFolderInterface) { }

    /**
     * フォルダの存在チェック
     * @param getUpdateFavoriteVideoTagRepository 
     * @param updateFavoriteVideoTagRequestModel 
     * @param frontUserIdModel 
     * @returns 
     */
    async getFolder(folderIdModel: FolderIdModel,
        frontUserIdModel: FrontUserIdModel) {

        // フォルダ取得Entity
        const entity = new SelectFolderEntity(
            folderIdModel,
            frontUserIdModel
        );

        const folderList = await this.createFavoriteVideoFolderInterface.selectFolder(entity);

        return folderList;
    }

    /**
     * お気に入り動画取得
     * @param userNameModel 
     */
    async getFavoriteVideo(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel) {

        // お気に入り動画取得用Entity
        const entity = new SelectFavoriteVideoEntity(videoIdModel, frontUserIdModel);

        // お気に入り動画取得
        const favoriteVideoDetial = await this.createFavoriteVideoFolderInterface.selectFavoriteVideo(entity);

        return favoriteVideoDetial;
    }

    /**
     * お気に入り動画フォルダ登録
     * @param userNameModel 
     */
    async createFavoriteVideoFolder(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        folderIdModel: FolderIdModel,
        tx: Prisma.TransactionClient) {

        const entity = new InsertFavoriteVideoFolderEntity(folderIdModel, videoIdModel, frontUserIdModel);

        // お気に入り動画フォルダ登録
        const data = await this.createFavoriteVideoFolderInterface.insert(entity, tx);

        return data;
    }

    /**
     * フォルダ内のお気に入り動画取得
     * @param userNameModel 
     */
    async getFavoriteVideoFolder(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        folderIdModel: FolderIdModel,) {

        const entity = new SelectFavoriteVideoFolderEntity(folderIdModel, videoIdModel, frontUserIdModel);

        // 動画取得
        const favoriteVideoDetial = await this.createFavoriteVideoFolderInterface.selectFavoriteVideoFolder(entity);

        return favoriteVideoDetial;
    }
}