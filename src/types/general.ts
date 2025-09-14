export interface IHistoryList {
    id: number;
    filename: number;
    response: {
        level: number
        status1: string // "not_dirty",
        status2: string // "severely_damaged",
    };
    thumbnail_base64: string
}

export type TStatusColors = {
  [key: string]: { bg: string; color: string }
}