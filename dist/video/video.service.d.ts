export interface VideoInfo {
    title: string;
    cover: string;
    videoUrl: string;
    author?: string;
    platform?: string;
}
export declare class VideoService {
    private readonly alapiToken;
    private readonly alapiUrl;
    private readonly akeApiKey;
    private readonly akeApiId;
    private readonly akeApiBaseUrl;
    extractVideo(url: string): Promise<VideoInfo>;
    private resolveRedirect;
    private callALAPI;
    private callAkeAPI;
    private detectPlatform;
}
