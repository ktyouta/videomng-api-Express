export type ThumbnailType = {
    readonly default: {
        url: string;
        width: number;
        height: number;
    };
    readonly medium?: {
        url: string;
        width: number;
        height: number;
    } | undefined;
    readonly high?: {
        url: string;
        width: number;
        height: number;
    } | undefined;
}