

/**
 * 永続ロジック用インターフェース
 */
export interface SeqMasterRepositoryPostgresRepositoryInterface {

    /**
     * シーケンスを取得
     */
    getSequenceByKey(key: string): Promise<{
        key: string;
        nextId: number;
        createDate: Date;
        updateDate: Date;
    } | null>;
}

