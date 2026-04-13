"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let DownloadService = class DownloadService {
    constructor() {
        this.http = axios_1.default.create({
            timeout: 30000,
            responseType: 'arraybuffer',
            maxRedirects: 5,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });
    }
    async downloadFile(url) {
        console.log('[DownloadService] Starting download from:', url);
        try {
            const response = await this.http.get(url);
            console.log('[DownloadService] Download successful, size:', response.data.byteLength);
            return {
                data: response.data,
                headers: {
                    'content-type': response.headers['content-type'] || 'video/mp4',
                    'content-disposition': response.headers['content-disposition'] || `attachment; filename="video_${Date.now()}.mp4"`,
                },
            };
        }
        catch (error) {
            console.error('[DownloadService] Download failed:', error.message);
            if (error.response) {
                console.error('[DownloadService] Response status:', error.response.status);
                console.error('[DownloadService] Response data:', error.response.data?.toString().substring(0, 200));
            }
            throw new Error(`下载失败：${error.message || '未知错误'}`);
        }
    }
};
exports.DownloadService = DownloadService;
exports.DownloadService = DownloadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DownloadService);
//# sourceMappingURL=download.service.js.map