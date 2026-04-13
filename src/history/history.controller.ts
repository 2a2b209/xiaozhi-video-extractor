import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common'
import { HistoryService } from './history.service'

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get('list')
  async getHistoryList() {
    console.log('[HistoryController] getHistoryList called')
    
    const list = this.historyService.getHistoryList()
    return {
      code: 200,
      message: '获取成功',
      data: list
    }
  }

  @Post('add')
  async addHistory(@Body() body: { url: string; title: string; cover: string; videoUrl: string }) {
    console.log('[HistoryController] addHistory called with:', body)
    
    if (!body || !body.url) {
      return {
        code: 400,
        message: '参数不完整',
        data: null
      }
    }

    const result = this.historyService.addHistory(body)
    return {
      code: 200,
      message: '添加成功',
      data: result
    }
  }

  @Delete('clear')
  async clearHistory() {
    console.log('[HistoryController] clearHistory called')
    
    this.historyService.clearHistory()
    return {
      code: 200,
      message: '清空成功',
      data: null
    }
  }

  @Delete(':id')
  async deleteHistory(@Param('id') id: string) {
    console.log('[HistoryController] deleteHistory called with id:', id)
    
    this.historyService.deleteHistory(id)
    return {
      code: 200,
      message: '删除成功',
      data: null
    }
  }
}
