export class GetFavoriteVideoFolderPageModel {

    private readonly _page: number;

    constructor(page: string) {

        let numPage = parseInt(page);

        if (Number.isNaN(numPage)) {
            numPage = 1;
        }

        if (numPage < 1) {
            numPage = 1;
        }

        this._page = numPage;
    }

    get page() {
        return this._page;
    }
}