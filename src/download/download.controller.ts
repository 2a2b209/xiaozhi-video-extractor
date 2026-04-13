import { Controller, Get, Query, HttpException, HttpStatus, Res, Headers } from '@nestjs/common';
import { DownloadService } from './download.service';

@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @Get()
  async download(@Query('url') url: string, @Res() res: any) {
    console.log('[DownloadController] Download request for URL:', url);

    if (!url) {
      throw new HttpException({
        code: 400,
        message: '请提供视频链接',
        data: null
      }, HttpStatus.BAD_REQUEST);
    }

    // 验证链接格式
    if (!url.match(/^https?:\/\/.+/i)) {
      throw new HttpException({
        code: 400,
        message: '链接格式不正确',
        data: null
      }, HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.downloadService.downloadFile(url);

      console.log('[DownloadController] Sending file to client');

      // 设置响应头
      res.setHeader('Content-Type', result.headers['content-type']);
      res.setHeader('Content-Disposition', result.headers['content-disposition']);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

      // 发送文件数据
      return res.send(result.data);
    } catch (error: any) {
      console.error('[DownloadController] Download error:', error.message);

      throw new HttpException({
        code: 500,
        message: error.message || '下载失败，请重试',
        data: null
      }, HttpStatus.OK);
    }
  }
}
