export class QueryBuilder {

    private readonly _queryParam: Record<string, string | number> = {};

    constructor(key: string, value: string | number) {

        this.checkKeyValue(key, value);

        this._queryParam[key] = value;
    }

    /**
     * クエリを追加する
     * @param key 
     * @param value 
     */
    public add(key: string, value: string | number) {

        this.checkKeyValue(key, value);

        this._queryParam[key] = value;
    }

    /**
     * キーと値チェック
     * @param key 
     * @param value 
     */
    private checkKeyValue(key: string, value: string | number) {

        if (!key) {
            throw Error(`クエリパラメータのキーが設定されていません。key:${key} value:${value}`);
        }

        if (!value) {
            throw Error(`クエリパラメータの値が設定されていません。key:${key} value:${value}`);
        }
    }

    /**
     * クエリパラメータを作成する
     */
    public createParam() {

        const paramMap = new Map();

        Object.entries(this._queryParam).filter(([key, value]) => {
            return !!value
        }).forEach(([key, value]) => {

            // 重複キーが存在する場合
            if (paramMap.has(key)) {
                throw new Error(`重複するキーがセットされています: ${key}`);
            }

            paramMap.set(key, value);
        });

        return Array.from(paramMap.entries()).map(([key, value]) => {
            return `${key}=${value}`
        }).join("&");
    }

}