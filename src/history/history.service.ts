import { Injectable } from '@nestjs/common'

export interface HistoryItem {
  id: string
  url: string
  title: string
  cover: string
  videoUrl: string
  createTime: string
}

@Injectable()
export class HistoryService {
  // 使用内存存储历史记录（实际项目应使用数据库）
  private historyList: HistoryItem[] = []

  /**
   * 获取历史记录列表
   */
  getHistoryList(): HistoryItem[] {
    console.log('[HistoryService] Getting history list, count:', this.historyList.length)
    // 按时间倒序返回
    return [...this.historyList].reverse()
  }

  /**
   * 添加历史记录
   */
  addHistory(item: Omit<HistoryItem, 'id' | 'createTime'>): HistoryItem {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      createTime: new Date().toISOString()
    }
    
    this.historyList.push(newItem)
    console.log('[HistoryService] Added history, total count:', this.historyList.length)
    
    return newItem
  }

  /**
   * 删除历史记录
   */
  deleteHistory(id: string): void {
    const index = this.historyList.findIndex(item => item.id === id)
    if (index > -1) {
      this.historyList.splice(index, 1)
      console.log('[HistoryService] Deleted history:', id)
    }
  }

  /**
   * 清空历史记录
   */
  clearHistory(): void {
    this.historyList = []
    console.log('[HistoryService] Cleared all history')
  }
}
