import { Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FolderColorModel } from "../../internaldata/foldermaster/model/FolderColorModel";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { FolderNameModel } from "../../internaldata/foldermaster/model/FolderNameModel";
import { InsertFolderEntity } from "../entity/InsertFolderEntity";
import { SelectFolderEntity } from "../entity/SelectFolderEntity";
import { CreateFolderRepositoryInterface } from "../repository/interface/CreateFolderInterface";


export class CreateFolderService {

    constructor(private readonly createFolderRepositoryInterface: CreateFolderRepositoryInterface) { }

    /**
     * フォルダの存在チェック
     * @param getUpdateFavoriteVideoTagRepository 
     * @param updateFavoriteVideoTagRequestModel 
     * @param frontUserIdModel 
     * @returns 
     */
    public async getFolder(folderNameModel: FolderNameModel,
        frontUserIdModel: FrontUserIdModel) {

        // フォルダ取得Entity
        const selectFolderEntity = new SelectFolderEntity(
            folderNameModel,
            frontUserIdModel
        );

        const folderList = await this.createFolderRepositoryInterface.selectFolder(selectFolderEntity);

        return folderList;
    }

    /**
     * フォルダーを登録する
     * @returns 
     */
    public async createFolder(frontUserIdModel: FrontUserIdModel,
        folderNameModel: FolderNameModel,
        folderColorModel: FolderColorModel,
        tx: Prisma.TransactionClient) {

        // フォルダIDを取得
        const nextTagIdList = await this.createFolderRepositoryInterface.getFolderNextSeq(frontUserIdModel);
        const nextTagId = nextTagIdList[0].nextSeq;

        const insertFolderEntity = new InsertFolderEntity(
            new FolderIdModel(nextTagId),
            folderNameModel,
            frontUserIdModel,
            folderColorModel,
        );

        // 登録
        const folder = await this.createFolderRepositoryInterface.insert(insertFolderEntity, tx);

        return folder;
    }
}