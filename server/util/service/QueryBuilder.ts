export class QueryBuilder {

    private readonly _queryParam: Record<string, string | number> = {};

    constructor(key: string, value: string | number) {

        if (!key) {
            throw Error(`クエリパラメータのキーが設定されていません。key:${key} value:${value}`);
        }

        if (!value) {
            throw Error(`クエリパラメータの値が設定されていません。key:${key} value:${value}`);
        }

        this._queryParam[key] = value;
    }

    /**
     * クエリを追加する
     * @param key 
     * @param value 
     */
    public add(key: string, value: string | number) {

        return new QueryBuilder(key, value);
    }

    /**
     * クエリパラメータを作成する
     */
    public createParam() {

        return Object.entries(this._queryParam).map(([key, value]) => {
            return {
                key,
                value,
            }
        }).filter((element) => {
            return !!element.value;
        }).map((element) => {
            return `${element.key}=${element.value}`
        }).join("&");
    }

}