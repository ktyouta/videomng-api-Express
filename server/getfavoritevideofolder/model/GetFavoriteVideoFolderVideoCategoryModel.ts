
export class GetFavoriteVideoFolderVideoCategoryModel {

    // カテゴリ
    private readonly _videoCategory: string[];

    constructor(videoCategory: string) {

        const videoCategoryList = videoCategory ? videoCategory.split(`,`) : [];

        this._videoCategory = videoCategoryList;
    }

    public get videoCategory() {
        return this._videoCategory;
    }
}