import { HistoryService } from './history.service';
export declare class HistoryController {
    private readonly historyService;
    constructor(historyService: HistoryService);
    getHistoryList(): Promise<{
        code: number;
        message: string;
        data: import("./history.service").HistoryItem[];
    }>;
    addHistory(body: {
        url: string;
        title: string;
        cover: string;
        videoUrl: string;
    }): Promise<{
        code: number;
        message: string;
        data: null;
    } | {
        code: number;
        message: string;
        data: import("./history.service").HistoryItem;
    }>;
    clearHistory(): Promise<{
        code: number;
        message: string;
        data: null;
    }>;
    deleteHistory(id: string): Promise<{
        code: number;
        message: string;
        data: null;
    }>;
}
