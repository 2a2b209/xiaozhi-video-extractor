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
exports.VideoController = void 0;
const common_1 = require("@nestjs/common");
const video_service_1 = require("./video.service");
let VideoController = class VideoController {
    constructor(videoService) {
        this.videoService = videoService;
    }
    async extractVideo(body) {
        console.log('[VideoController] extractVideo called with:', body);
        if (!body || !body.url) {
            throw new common_1.HttpException({
                code: 400,
                message: '请提供视频链接',
                data: null
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const { url } = body;
        if (!url.match(/^https?:\/\/.+/i)) {
            throw new common_1.HttpException({
                code: 400,
                message: '链接格式不正确',
                data: null
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.videoService.extractVideo(url);
            console.log('[VideoController] extract result:', result);
            return {
                code: 200,
                message: '解析成功',
                data: result
            };
        }
        catch (error) {
            console.error('[VideoController] extract error:', error);
            const errorMsg = error.message || '解析失败，请重试';
            throw new common_1.HttpException({
                code: 500,
                message: errorMsg,
                data: null
            }, common_1.HttpStatus.OK);
        }
    }
};
exports.VideoController = VideoController;
__decorate([
    (0, common_1.Post)('extract'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "extractVideo", null);
exports.VideoController = VideoController = __decorate([
    (0, common_1.Controller)('video'),
    __metadata("design:paramtypes", [video_service_1.VideoService])
], VideoController);
//# sourceMappingURL=video.controller.js.map