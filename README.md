# 🐾 毛孩子的温馨小屋 - 宠物博客网站

一个专为比格犬和腊肠犬打造的温馨宠物博客网站，记录毛孩子们的美好时光。

## ✨ 功能特色

### 🏠 主要功能
- **个人博客首页** - 温馨的宠物主题设计，展示最新帖子和相册
- **帖子系统** - 支持发布文本、图片（最多18张）、视频和链接分享
- **相册功能** - 创建和管理宠物照片相册
- **分类管理** - 日常、搞笑、训练、健康、冒险等分类
- **标签系统** - 灵活的标签管理
- **链接分享** - 自动生成链接预览卡片
- **响应式设计** - 完美适配手机、平板和桌面设备

### 🎨 设计特色
- **宠物主题配色** - 使用 #DFAE75（金棕色）、#6A361E（深棕色）、#F7F7F7（浅灰色）
- **Material UI 组件** - 现代化的 UI 设计
- **宠物表情符号** - 丰富的宠物相关表情符号装饰
- **动画效果** - 流畅的页面转换和悬停效果

## 🛠️ 技术栈

### 前端
- **React.js** - 用户界面库
- **Material-UI** - UI 组件库
- **React Router** - 路由管理
- **Axios** - HTTP 客户端
- **React Player** - 视频播放器
- **React Image Gallery** - 图片展示组件

### 后端
- **Node.js** - 服务器运行环境
- **Express.js** - Web 应用框架
- **MongoDB** - 数据库
- **Mongoose** - MongoDB 对象建模工具
- **Multer** - 文件上传中间件
- **Cloudinary** - 图片和视频云存储

## 📦 安装和运行

### 前置要求
- Node.js (版本 14 或更高)
- MongoDB
- npm 或 yarn

### 1. 克隆项目
```bash
git clone <repository-url>
cd pet-blog-website
```

### 2. 安装依赖
```bash
# 安装所有依赖（根目录、服务器和客户端）
npm run install-all

# 或者分别安装
npm install
cd server && npm install
cd ../client && npm install
```

### 3. 环境配置

在 `server` 目录下创建 `.env` 文件：
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pet-blog
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

### 4. 启动 MongoDB
确保 MongoDB 服务正在运行：
```bash
# macOS (使用 Homebrew)
brew services start mongodb-community

# Ubuntu
sudo systemctl start mongod

# Windows
# 启动 MongoDB 服务
```

### 5. 运行项目
```bash
# 同时启动前端和后端
npm run dev

# 或者分别启动
# 启动后端 (在 server 目录)
npm run server

# 启动前端 (在 client 目录)
npm run client
```

### 6. 访问应用
- 前端：http://localhost:3000
- 后端 API：http://localhost:5000

## 📁 项目结构

```
pet-blog-website/
├── client/                 # React 前端应用
│   ├── public/
│   ├── src/
│   │   ├── components/     # 可复用组件
│   │   ├── pages/          # 页面组件
│   │   ├── theme.js        # Material-UI 主题配置
│   │   ├── App.js         # 主应用组件
│   │   └── index.js       # 应用入口
│   └── package.json
├── server/                 # Node.js 后端应用
│   ├── models/            # MongoDB 数据模型
│   ├── routes/            # API 路由
│   ├── index.js           # 服务器入口
│   └── package.json
├── package.json           # 根配置文件
└── README.md
```

## 🐕 主要功能说明

### 帖子功能
- 创建包含文本、图片、视频的帖子
- 支持最多18张图片上传
- 链接分享功能会自动获取链接预览
- 分类和标签管理
- 点赞和浏览量统计

### 相册功能
- 创建和管理照片相册
- 设置相册封面
- 图片展示和幻灯片播放

### 响应式设计
- 移动端优化的导航菜单
- 适配不同屏幕尺寸的布局
- 触摸友好的交互设计

## 🎯 API 端点

### 帖子相关
- `GET /api/posts` - 获取帖子列表
- `GET /api/posts/:id` - 获取单个帖子
- `POST /api/posts` - 创建新帖子
- `PUT /api/posts/:id` - 更新帖子
- `DELETE /api/posts/:id` - 删除帖子
- `POST /api/posts/:id/like` - 点赞帖子
- `POST /api/posts/link-preview` - 获取链接预览

### 相册相关
- `GET /api/albums` - 获取相册列表
- `GET /api/albums/:id` - 获取单个相册
- `POST /api/albums` - 创建新相册
- `PUT /api/albums/:id` - 更新相册
- `DELETE /api/albums/:id` - 删除相册

### 文件上传
- `POST /api/upload/image` - 上传单张图片
- `POST /api/upload/images` - 上传多张图片
- `POST /api/upload/video` - 上传视频
- `DELETE /api/upload/:cloudinaryId` - 删除文件

## 🔧 开发说明

### 自定义主题
项目使用了自定义的 Material-UI 主题，主要颜色：
- 主色：#DFAE75 (温暖金棕色)
- 次色：#6A361E (深棕色)
- 背景：#F7F7F7 (浅灰色)

### 图片和视频存储
项目使用 Cloudinary 作为媒体文件存储服务，需要配置相应的环境变量。

### 数据库结构
- **Posts** - 帖子数据（标题、内容、图片、视频、链接、分类、标签等）
- **Albums** - 相册数据（标题、描述、图片列表、封面等）

## 🚀 部署

### 前端部署
```bash
cd client
npm run build
# 将 build 文件夹部署到静态文件服务器
```

### 后端部署
确保生产环境中：
1. 设置正确的环境变量
2. 使用 MongoDB Atlas 或其他云数据库
3. 配置 Cloudinary 云存储
4. 使用 PM2 或类似工具管理进程

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🐾 特别鸣谢

感谢所有可爱的毛孩子们提供的灵感！特别是我们的比格犬和腊肠犬朋友们。

---

用爱记录每一个温暖瞬间 ❤️🐕