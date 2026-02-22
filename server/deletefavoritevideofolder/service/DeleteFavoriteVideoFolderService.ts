import { Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { DeleteFavoriteVideoFolderEntity } from "../entity/DeleteFavoriteVideoFolderEntity";
import { DeleteFavoriteVideoFolderInterface } from "../repository/interface/DeleteFavoriteVideoFolderInterface";


export class DeleteFavoriteVideoFolderService {

    constructor(private readonly deleteFavoriteVideoFolderInterface: DeleteFavoriteVideoFolderInterface) { }

    /**
     * お気に入り動画フォルダから削除
     * @param userNameModel 
     */
    async delete(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        folderIdModel: FolderIdModel,
        tx: Prisma.TransactionClient) {
        const entity = new DeleteFavoriteVideoFolderEntity(folderIdModel, videoIdModel, frontUserIdModel);
        // 削除
        await this.deleteFavoriteVideoFolderInterface.delete(entity, tx);
    }
}