import { VideoService } from './video.service';
export declare class VideoController {
    private readonly videoService;
    constructor(videoService: VideoService);
    extractVideo(body: {
        url: string;
    }): Promise<{
        code: number;
        message: string;
        data: import("./video.service").VideoInfo;
    }>;
}
