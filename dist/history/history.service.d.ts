export interface HistoryItem {
    id: string;
    url: string;
    title: string;
    cover: string;
    videoUrl: string;
    createTime: string;
}
export declare class HistoryService {
    private historyList;
    getHistoryList(): HistoryItem[];
    addHistory(item: Omit<HistoryItem, 'id' | 'createTime'>): HistoryItem;
    deleteHistory(id: string): void;
    clearHistory(): void;
}
