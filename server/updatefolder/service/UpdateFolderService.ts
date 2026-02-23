import { Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FolderColorModel } from "../../internaldata/foldermaster/model/FolderColorModel";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { FolderNameModel } from "../../internaldata/foldermaster/model/FolderNameModel";
import { SelectDuplicationFolderEntity } from "../entity/SelectDuplicationFolderEntity";
import { SelectExistsFolderEntity } from "../entity/SelectExistsFolderEntity";
import { UpdateFolderEntity } from "../entity/UpdateFolderEntity";
import { UpdateFolderRepositoryInterface } from "../repository/interface/UpdateFolderInterface";


export class UpdateFolderService {

    constructor(private readonly updateFolderRepositoryInterface: UpdateFolderRepositoryInterface) { }

    /**
     * フォルダの存在チェック
     * @param getUpdateFavoriteVideoTagRepository 
     * @param updateFavoriteVideoTagRequestModel 
     * @param frontUserIdModel 
     * @returns 
     */
    async getExistsFolder(folderIdModel: FolderIdModel,
        frontUserIdModel: FrontUserIdModel) {

        // フォルダ取得Entity
        const entity = new SelectExistsFolderEntity(
            folderIdModel,
            frontUserIdModel
        );

        const folderList = await this.updateFolderRepositoryInterface.selectExistsFolder(entity);

        return folderList;
    }

    /**
     * フォルダの重複チェック
     * @param getUpdateFavoriteVideoTagRepository 
     * @param updateFavoriteVideoTagRequestModel 
     * @param frontUserIdModel 
     * @returns 
     */
    async getDuplicationFolder(folderNameModel: FolderNameModel,
        frontUserIdModel: FrontUserIdModel,
        folderIdModel: FolderIdModel,
    ) {

        // フォルダ取得Entity
        const entity = new SelectDuplicationFolderEntity(
            folderNameModel,
            frontUserIdModel,
            folderIdModel
        );

        const folderList = await this.updateFolderRepositoryInterface.selectDuplicationFolder(entity);

        return folderList;
    }

    /**
     * フォルダーを更新する
     * @returns 
     */
    async update(folderIdModel: FolderIdModel,
        folderNameModel: FolderNameModel,
        frontUserIdModel: FrontUserIdModel,
        folderColorModel: FolderColorModel,
        tx: Prisma.TransactionClient) {

        const entity = new UpdateFolderEntity(
            folderIdModel,
            folderNameModel,
            frontUserIdModel,
            folderColorModel,
        );

        // 更新
        const folder = await this.updateFolderRepositoryInterface.update(entity, tx);

        return folder;
    }
}