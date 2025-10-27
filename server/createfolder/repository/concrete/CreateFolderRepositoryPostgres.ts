import { FavoriteVideoTagTransaction, FolderMaster, Prisma, TagMaster } from "@prisma/client";
import { JsonFileData } from "../../../util/service/JsonFileData";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { CreateFolderRepositoryInterface } from "../interface/CreateFolderInterface";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { TagNameModel } from "../../../internaldata/tagmaster/properties/TagNameModel";
import { SelectFolderEntity } from "../../entity/SelectFolderEntity";
import { FolderNextSeqType } from "../../type/FolderNextSeqType";
import { InsertFolderEntity } from "../../entity/InsertFolderEntity";
import { FLG } from "../../../util/const/CommonConst";



/**
 * json形式の永続ロジック用クラス
 */
export class CreateFolderRepositoryPostgres implements CreateFolderRepositoryInterface {

    constructor() {
    }


    /**
     * フォルダー取得
     * @param frontFavoriteVideoTagInfoMasterModel 
     * @returns 
     */
    async selectFolder(selectFolderEntity: SelectFolderEntity): Promise<FolderMaster[]> {

        const userId = selectFolderEntity.frontUserId;
        const folderName = selectFolderEntity.folderName;

        const folderList = await PrismaClientInstance.getInstance().folderMaster.findMany({
            where: {
                userId,
                name: folderName
            },
        });

        return folderList;
    }

    /**
     * フォルダマスタのシーケンス番号取得
     * @param createFavoriteVideoMemoSeqSelectEntity 
     * @returns 
     */
    async getFolderNextSeq(frontUserIdModel: FrontUserIdModel)
        : Promise<FolderNextSeqType[]> {

        const userId = frontUserIdModel.frontUserId;

        const seqList = await PrismaClientInstance.getInstance().$queryRaw<FolderNextSeqType[]>`
                    SELECT COALESCE(MAX(folder_id), 0) + 1 as "nextSeq"
                    FROM "folder_master" 
                    WHERE user_id = CAST(${userId} AS INTEGER)
                `;

        return seqList;
    }

    /**
     * フォルダを作成
     */
    async insert(insertFolderEntity: InsertFolderEntity,
        tx: Prisma.TransactionClient): Promise<FolderMaster> {

        const userId = insertFolderEntity.frontUserId;
        const folderId = insertFolderEntity.folderId;
        const folderName = insertFolderEntity.folderName;

        const folder = await tx.folderMaster.create({
            data: {
                userId,
                folderId,
                name: folderName,
                createDate: new Date(),
                updateDate: new Date(),
            },
        });

        return folder;
    };
}