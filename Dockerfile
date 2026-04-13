# 微信云托管 Dockerfile
# 适用于微信小程序后端服务

# ============================================
# 构建阶段
# ============================================
FROM node:18-alpine AS builder

WORKDIR /app

# 安装构建依赖
COPY package*.json ./
RUN npm install

# 复制源代码
COPY . .

# 构建 TypeScript
RUN npm run build

# ============================================
# 运行阶段
# ============================================
FROM node:18-alpine

WORKDIR /app

# 安装 dumb-init（优雅处理信号）
RUN apk add --no-cache dumb-init curl

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 复制构建产物和依赖
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# 切换到非 root 用户
USER nodejs

# 环境变量
ENV NODE_ENV=production
ENV PORT=80

# 微信云托管会自动注入 PORT 环境变量（默认80）
# 暴露端口
EXPOSE 80

# 健康检查（使用动态端口）
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:${PORT:-80}/api/health || exit 1

# 启动服务（使用 dumb-init 处理信号）
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
