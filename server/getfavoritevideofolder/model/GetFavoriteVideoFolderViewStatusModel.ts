
export class GetFavoriteVideoFolderViewStatusModel {

    // 視聴状況
    private readonly _viewStatus: string[];

    constructor(viewStatus: string) {

        const viewStatusList = viewStatus ? viewStatus.split(`,`) : [];

        this._viewStatus = viewStatusList;
    }

    public get viewStatus() {
        return this._viewStatus;
    }
}