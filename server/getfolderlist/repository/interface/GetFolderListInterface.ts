import { FolderMaster } from "@prisma/client";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { ParentFolderIdModel } from "../../../internaldata/foldermaster/model/ParentFolderIdModel";


/**
 * 永続ロジック用インターフェース
 */
export interface GetFolderListRepositoryInterface {

    /**
     * フォルダ取得
     */
    selectFolderList(frontUserIdModel: FrontUserIdModel, parentFolderId: ParentFolderIdModel): Promise<FolderMaster[]>;
}