"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryService = void 0;
const common_1 = require("@nestjs/common");
let HistoryService = class HistoryService {
    constructor() {
        this.historyList = [];
    }
    getHistoryList() {
        console.log('[HistoryService] Getting history list, count:', this.historyList.length);
        return [...this.historyList].reverse();
    }
    addHistory(item) {
        const newItem = {
            ...item,
            id: Date.now().toString(),
            createTime: new Date().toISOString()
        };
        this.historyList.push(newItem);
        console.log('[HistoryService] Added history, total count:', this.historyList.length);
        return newItem;
    }
    deleteHistory(id) {
        const index = this.historyList.findIndex(item => item.id === id);
        if (index > -1) {
            this.historyList.splice(index, 1);
            console.log('[HistoryService] Deleted history:', id);
        }
    }
    clearHistory() {
        this.historyList = [];
        console.log('[HistoryService] Cleared all history');
    }
};
exports.HistoryService = HistoryService;
exports.HistoryService = HistoryService = __decorate([
    (0, common_1.Injectable)()
], HistoryService);
//# sourceMappingURL=history.service.js.map