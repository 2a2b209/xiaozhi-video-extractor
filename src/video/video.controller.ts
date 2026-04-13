import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common'
import { VideoService } from './video.service'

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('extract')
  async extractVideo(@Body() body: { url: string }) {
    console.log('[VideoController] extractVideo called with:', body)
    
    if (!body || !body.url) {
      throw new HttpException({
        code: 400,
        message: '请提供视频链接',
        data: null
      }, HttpStatus.BAD_REQUEST)
    }

    const { url } = body

    // 验证链接格式
    if (!url.match(/^https?:\/\/.+/i)) {
      throw new HttpException({
        code: 400,
        message: '链接格式不正确',
        data: null
      }, HttpStatus.BAD_REQUEST)
    }

    try {
      const result = await this.videoService.extractVideo(url)
      console.log('[VideoController] extract result:', result)
      
      return {
        code: 200,
        message: '解析成功',
        data: result
      }
    } catch (error) {
      console.error('[VideoController] extract error:', error)
      
      // 返回API的实际错误信息
      const errorMsg = error.message || '解析失败，请重试'
      
      throw new HttpException({
        code: 500,
        message: errorMsg,
        data: null
      }, HttpStatus.OK)  // 使用200状态码，让前端能正常接收错误信息
    }
  }
}
