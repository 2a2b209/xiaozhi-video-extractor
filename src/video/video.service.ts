import { Injectable } from '@nestjs/common'
import axios from 'axios'

export interface VideoInfo {
  title: string
  cover: string
  videoUrl: string
  author?: string
  platform?: string
}

@Injectable()
export class VideoService {
  // ALAPI配置（主要API）
  private readonly alapiToken = 'b24usmonvntuwgolo8bbwgsl5zjxsp'
  private readonly alapiUrl = 'https://v3.alapi.cn/api/video/url'

  // api.ake999.com配置（备用API）
  private readonly akeApiKey = '3277D489D851E2DAC7BBA942B14DA43351CD493C1BC8CF74A2'
  private readonly akeApiId = '202038551'
  private readonly akeApiBaseUrl = 'https://api.ake999.com/api/dsp'

  /**
   * 提取视频信息
   */
  async extractVideo(url: string): Promise<VideoInfo> {
    console.log('[VideoService] Extracting video from:', url)

    // 检测平台
    const platform = this.detectPlatform(url)
    console.log('[VideoService] Detected platform:', platform)

    // 抖音短链接需要先重定向获取真实URL
    let finalUrl = url
    if (url.includes('v.douyin.com') || url.includes('vm.douyin.com')) {
      try {
        finalUrl = await this.resolveRedirect(url)
        console.log('[VideoService] Resolved redirect:', url, '->', finalUrl)
      } catch (e) {
        console.log('[VideoService] Redirect resolution failed, using original URL')
      }
    }

    // 优先使用ALAPI
    try {
      const result = await this.callALAPI(finalUrl)
      console.log('[VideoService] ALAPI success:', result)
      return { ...result, platform }
    } catch (error) {
      console.log('[VideoService] ALAPI failed, trying backup API:', error.message)
      
      // 备用API - 尝试解析后的URL和原始URL
      try {
        // 先尝试解析后的URL
        const result = await this.callAkeAPI(finalUrl)
        console.log('[VideoService] Backup API success:', result)
        return { ...result, platform }
      } catch (backupError) {
        // 如果解析后的URL失败，尝试原始URL
        if (finalUrl !== url) {
          try {
            const result = await this.callAkeAPI(url)
            console.log('[VideoService] Backup API with original URL success:', result)
            return { ...result, platform }
          } catch (e) {
            console.error('[VideoService] All APIs failed')
            throw backupError
          }
        }
        throw backupError
      }
    }
  }

  /**
   * 解析短链接重定向 - 获取最终URL
   */
  private async resolveRedirect(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        maxRedirects: 5,
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
        }
      })
      // 获取最终重定向后的URL
      const finalUrl = response.request.res?.responseUrl || url
      console.log('[VideoService] Redirect resolved to:', finalUrl)
      return finalUrl
    } catch (error) {
      console.log('[VideoService] Redirect resolution error:', error.message)
      return url
    }
  }

  /**
   * 调用ALAPI（主要API）
   * 支持平台：抖音、快手、小红书、B站等
   */
  private async callALAPI(url: string): Promise<VideoInfo> {
    const apiUrl = `${this.alapiUrl}?token=${this.alapiToken}&url=${encodeURIComponent(url)}`
    
    console.log('[VideoService] Calling ALAPI (GET):', apiUrl.replace(this.alapiToken, '***'))

    const response = await axios.get(apiUrl, {
      timeout: 20000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    })

    console.log('[VideoService] ALAPI response:', JSON.stringify(response.data).substring(0, 500))

    if (response.data && response.data.success && response.data.code === 200) {
      const data = response.data.data || {}
      return {
        title: data.title || '未知标题',
        cover: data.cover_url || '',
        videoUrl: data.video_url || '',
        author: data.author || ''
      }
    } else {
      const errorMsg = response.data?.message || 'ALAPI解析失败'
      throw new Error(errorMsg)
    }
  }

  /**
   * 调用api.ake999.com（备用API）
   */
  private async callAkeAPI(url: string): Promise<VideoInfo> {
    const apiUrl = `${this.akeApiBaseUrl}/${this.akeApiKey}/${this.akeApiId}/?url=${encodeURIComponent(url)}`
    
    console.log('[VideoService] Calling backup API:', apiUrl.replace(this.akeApiKey, '***'))

    const response = await axios.get(apiUrl, {
      timeout: 20000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    })

    console.log('[VideoService] Backup API response:', JSON.stringify(response.data).substring(0, 500))

    if (response.data && (response.data.code === 200 || response.data.code === '200')) {
      const data = response.data.data || {}
      return {
        title: data.title || '未知标题',
        cover: data.cover || data.download_image || '',
        videoUrl: data.down || data.url || '',
        author: data.author || data.nickname || data.name || ''
      }
    } else {
      const errorMsg = response.data?.msg || response.data?.message || '解析失败'
      throw new Error(errorMsg)
    }
  }

  /**
   * 检测视频平台
   */
  private detectPlatform(url: string): string {
    const domainMap: Record<string, string> = {
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
    }

    for (const [domain, platform] of Object.entries(domainMap)) {
      if (url.includes(domain)) {
        return platform
      }
    }

    return '未知平台'
  }
}
