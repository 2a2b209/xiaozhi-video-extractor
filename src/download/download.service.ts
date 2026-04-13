import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class DownloadService {
  private http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      timeout: 30000, // 30秒超时
      responseType: 'arraybuffer', // 返回二进制数据
      maxRedirects: 5, // 允许重定向
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
  }

  async downloadFile(url: string) {
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
    } catch (error: any) {
      console.error('[DownloadService] Download failed:', error.message);

      if (error.response) {
        console.error('[DownloadService] Response status:', error.response.status);
        console.error('[DownloadService] Response data:', error.response.data?.toString().substring(0, 200));
      }

      throw new Error(`下载失败：${error.message || '未知错误'}`);
    }
  }
}
