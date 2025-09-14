export interface IHistoryList {
    id: number;
    filename: number;
    response: {
        level: number
        status: 'dirty_car'
    };
    thumbnail_base64: string
}

export type TStatusColors = {
  [key: string]: { bg: string; text: string }
}