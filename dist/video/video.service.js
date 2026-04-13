"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let VideoService = class VideoService {
    constructor() {
        this.alapiToken = 'b24usmonvntuwgolo8bbwgsl5zjxsp';
        this.alapiUrl = 'https://v3.alapi.cn/api/video/url';
        this.akeApiKey = '3277D489D851E2DAC7BBA942B14DA43351CD493C1BC8CF74A2';
        this.akeApiId = '202038551';
        this.akeApiBaseUrl = 'https://api.ake999.com/api/dsp';
    }
    async extractVideo(url) {
        console.log('[VideoService] Extracting video from:', url);
        const platform = this.detectPlatform(url);
        console.log('[VideoService] Detected platform:', platform);
        let finalUrl = url;
        if (url.includes('v.douyin.com') || url.includes('vm.douyin.com')) {
            try {
                finalUrl = await this.resolveRedirect(url);
                console.log('[VideoService] Resolved redirect:', url, '->', finalUrl);
            }
            catch (e) {
                console.log('[VideoService] Redirect resolution failed, using original URL');
            }
        }
        try {
            const result = await this.callALAPI(finalUrl);
            console.log('[VideoService] ALAPI success:', result);
            return { ...result, platform };
        }
        catch (error) {
            console.log('[VideoService] ALAPI failed, trying backup API:', error.message);
            try {
                const result = await this.callAkeAPI(finalUrl);
                console.log('[VideoService] Backup API success:', result);
                return { ...result, platform };
            }
            catch (backupError) {
                if (finalUrl !== url) {
                    try {
                        const result = await this.callAkeAPI(url);
                        console.log('[VideoService] Backup API with original URL success:', result);
                        return { ...result, platform };
                    }
                    catch (e) {
                        console.error('[VideoService] All APIs failed');
                        throw backupError;
                    }
                }
                throw backupError;
            }
        }
    }
    async resolveRedirect(url) {
        try {
            const response = await axios_1.default.get(url, {
                maxRedirects: 5,
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
                }
            });
            const finalUrl = response.request.res?.responseUrl || url;
            console.log('[VideoService] Redirect resolved to:', finalUrl);
            return finalUrl;
        }
        catch (error) {
            console.log('[VideoService] Redirect resolution error:', error.message);
            return url;
        }
    }
    async callALAPI(url) {
        const apiUrl = `${this.alapiUrl}?token=${this.alapiToken}&url=${encodeURIComponent(url)}`;
        console.log('[VideoService] Calling ALAPI (GET):', apiUrl.replace(this.alapiToken, '***'));
        const response = await axios_1.default.get(apiUrl, {
            timeout: 20000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            }
        });
        console.log('[VideoService] ALAPI response:', JSON.stringify(response.data).substring(0, 500));
        if (response.data && response.data.success && response.data.code === 200) {
            const data = response.data.data || {};
            return {
                title: data.title || '未知标题',
                cover: data.cover_url || '',
                videoUrl: data.video_url || '',
                author: data.author || ''
            };
        }
        else {
            const errorMsg = response.data?.message || 'ALAPI解析失败';
            throw new Error(errorMsg);
        }
    }
    async callAkeAPI(url) {
        const apiUrl = `${this.akeApiBaseUrl}/${this.akeApiKey}/${this.akeApiId}/?url=${encodeURIComponent(url)}`;
        console.log('[VideoService] Calling backup API:', apiUrl.replace(this.akeApiKey, '***'));
        const response = await axios_1.default.get(apiUrl, {
            timeout: 20000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            }
        });
        console.log('[VideoService] Backup API response:', JSON.stringify(response.data).substring(0, 500));
        if (response.data && (response.data.code === 200 || response.data.code === '200')) {
            const data = response.data.data || {};
            return {
                title: data.title || '未知标题',
                cover: data.cover || data.download_image || '',
                videoUrl: data.down || data.url || '',
                author: data.author || data.nickname || data.name || ''
            };
        }
        else {
            const errorMsg = response.data?.msg || response.data?.message || '解析失败';
            throw new Error(errorMsg);
        }
    }
    detectPlatform(url) {
        const domainMap = {
            'douyin.com': '抖音',
            'v.douyin.com': '抖音',
            'iesdouyin.com': '抖音',
            'kuaishou.com': '快手',
            'v.kuaishou.com': '快手',
            'chenzhongtech.com': '快手',
            'xiaohongshu.com': '小红书',
            'xhslink.com': '小红书',
            'ixigua.com': '西瓜视频',
            'toutiao.com': '今日头条',
            'weibo.com': '微博',
            'weibo.cn': '微博',
            'bilibili.com': '哔哩哔哩',
            'b23.tv': '哔哩哔哩'
        };
        for (const [domain, platform] of Object.entries(domainMap)) {
            if (url.includes(domain)) {
                return platform;
            }
        }
        return '未知平台';
    }
};
exports.VideoService = VideoService;
exports.VideoService = VideoService = __decorate([
    (0, common_1.Injectable)()
], VideoService);
//# sourceMappingURL=video.service.js.map