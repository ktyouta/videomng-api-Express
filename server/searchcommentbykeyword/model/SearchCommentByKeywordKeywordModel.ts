export class SearchCommentByKeywordKeywordModel {

    private readonly _keyword: string;

    constructor(keyword: string) {

        if (!keyword) {
            throw Error(`キーワードが設定されていません。`);
        }

        this._keyword = keyword;
    }

    get keywrod() {
        return this._keyword;
    }
}