import { DownloadService } from './download.service';
export declare class DownloadController {
    private readonly downloadService;
    constructor(downloadService: DownloadService);
    download(url: string, res: any): Promise<any>;
}
