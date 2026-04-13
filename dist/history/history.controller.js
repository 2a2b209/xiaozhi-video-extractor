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
exports.HistoryController = void 0;
const common_1 = require("@nestjs/common");
const history_service_1 = require("./history.service");
let HistoryController = class HistoryController {
    constructor(historyService) {
        this.historyService = historyService;
    }
    async getHistoryList() {
        console.log('[HistoryController] getHistoryList called');
        const list = this.historyService.getHistoryList();
        return {
            code: 200,
            message: '获取成功',
            data: list
        };
    }
    async addHistory(body) {
        console.log('[HistoryController] addHistory called with:', body);
        if (!body || !body.url) {
            return {
                code: 400,
                message: '参数不完整',
                data: null
            };
        }
        const result = this.historyService.addHistory(body);
        return {
            code: 200,
            message: '添加成功',
            data: result
        };
    }
    async clearHistory() {
        console.log('[HistoryController] clearHistory called');
        this.historyService.clearHistory();
        return {
            code: 200,
            message: '清空成功',
            data: null
        };
    }
    async deleteHistory(id) {
        console.log('[HistoryController] deleteHistory called with id:', id);
        this.historyService.deleteHistory(id);
        return {
            code: 200,
            message: '删除成功',
            data: null
        };
    }
};
exports.HistoryController = HistoryController;
__decorate([
    (0, common_1.Get)('list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "getHistoryList", null);
__decorate([
    (0, common_1.Post)('add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "addHistory", null);
__decorate([
    (0, common_1.Delete)('clear'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "clearHistory", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "deleteHistory", null);
exports.HistoryController = HistoryController = __decorate([
    (0, common_1.Controller)('history'),
    __metadata("design:paramtypes", [history_service_1.HistoryService])
], HistoryController);
//# sourceMappingURL=history.controller.js.map