export class FileData {

    private static readonly fs = require('fs');

    /**
     * ファイルの存在チェック
     * @param filePath 
     * @returns 
     */
    public static isExist(filePath: string) {

        try {
            this.fs.statSync(filePath);
            return true;
        } catch (err) {
            return false;
        }
    }


    /**
     * ファイルの読み込み
     * @param filePath 
     * @returns 
     */
    public static read(filePath: string) {

        // ファイルの存在チェック
        if (!this.isExist(filePath)) {
            throw Error(`ファイルが存在しません。filepath:${filePath}`);
        }

        try {
            const content: string = this.fs.readFileSync(filePath, 'utf8');
            return content;
        } catch (err) {
            throw Error(`ファイルの読み込みに失敗しました。ERROR:${err}`);
        }
    };


    /**
     * 指定したディレクトリ内のファイル名を取得する
     * @param dirPath 
     * @returns 
     */
    public static getNameInDir(dirPath: string,) {

        try {
            const files: string[] = this.fs.readdirSync(dirPath);
            return files;
        } catch (err) {
            throw Error(`ディレクトリ内のファイル名の取得に失敗しました。ERROR:${err}`);
        }

    }


    /**
     * ファイル書き込み
     * @param filePath 
     * @param data 
     * @returns 
     */
    public static overWrite(filePath: string, data: string) {

        try {
            this.fs.writeFileSync(filePath, data, { encoding: 'utf8' });
        } catch (err) {
            throw Error(`ファイルの書き込みに失敗しました。filepath:${filePath} ERROR:${err}`);
        }
    }


    /**
     * ファイル書き込み(追記)
     * @param filePath 
     * @param data 
     * @returns 
     */
    public static append<T>(filePath: string, data: T) {

        try {
            this.fs.appendFileSync(filePath, data, { encoding: 'utf8' });
        } catch (err) {
            throw Error(`ファイルの追記に失敗しました。 filePath:${filePath} ERROR:${err}`);
        }
    }

}