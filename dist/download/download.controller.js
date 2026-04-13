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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadController = void 0;
const common_1 = require("@nestjs/common");
const download_service_1 = require("./download.service");
let DownloadController = class DownloadController {
    constructor(downloadService) {
        this.downloadService = downloadService;
    }
    async download(url, res) {
        console.log('[DownloadController] Download request for URL:', url);
        if (!url) {
            throw new common_1.HttpException({
                code: 400,
                message: '请提供视频链接',
                data: null
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        if (!url.match(/^https?:\/\/.+/i)) {
            throw new common_1.HttpException({
                code: 400,
                message: '链接格式不正确',
                data: null
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.downloadService.downloadFile(url);
            console.log('[DownloadController] Sending file to client');
            res.setHeader('Content-Type', result.headers['content-type']);
            res.setHeader('Content-Disposition', result.headers['content-disposition']);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
            return res.send(result.data);
        }
        catch (error) {
            console.error('[DownloadController] Download error:', error.message);
            throw new common_1.HttpException({
                code: 500,
                message: error.message || '下载失败，请重试',
                data: null
            }, common_1.HttpStatus.OK);
        }
    }
};
exports.DownloadController = DownloadController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('url')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DownloadController.prototype, "download", null);
exports.DownloadController = DownloadController = __decorate([
    (0, common_1.Controller)('download'),
    __metadata("design:paramtypes", [download_service_1.DownloadService])
], DownloadController);
//# sourceMappingURL=download.controller.js.map