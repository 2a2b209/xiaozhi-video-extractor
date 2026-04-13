export declare class DownloadService {
    private http;
    constructor();
    downloadFile(url: string): Promise<{
        data: any;
        headers: {
            'content-type': any;
            'content-disposition': any;
        };
    }>;
}
