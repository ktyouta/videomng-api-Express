import { ViewStatusMaster } from "@prisma/client";
import { GetViewStatusListRepositoryInterface } from "../repository/interface/GetViewStatusListRepositoryInterface";


export class GetViewStatusListService {

    constructor(private readonly repository: GetViewStatusListRepositoryInterface) { }

    /**
     * 視聴状況リスト取得
     * @param userNameModel 
     */
    public async getViewStatusList(): Promise<ViewStatusMaster[]> {

        // 視聴状況リスト取得
        const favoriteCommentList = await this.repository.select();

        return favoriteCommentList;
    }

}