# Custom Keyboard Database
# 客制化键盘数据库

一个用于整理和展示客制化键盘项目信息的静态网站。项目使用 Next.js + React 构建，数据存储在本地 JSON 文件中，可以按名称、工作室、配列和状态搜索，也可以按工作室或时间线浏览。

## 功能

- 首页卡片浏览与分页
- 键盘名称、工作室、配列、状态搜索和筛选
- 工作室目录页
- 键盘发布时间线
- 键盘详情弹窗与图片预览
- 管理页面，用于维护键盘数据、图片和链接
- 图片缩略图自动生成
- 本地环境与线上环境使用不同的图片加载策略

## 技术栈

- Next.js 16
- React 19
- React DOM 19
- pnpm
- 原生 CSS + 少量 CSS 变量

项目使用静态导出：

```text
output: "export"
```

## 目录结构

```text
.
├── components/        # 页面组件
├── lib/               # 通用 hooks 和工具函数
├── pages/             # Next.js 页面
├── public/
│   ├── data.json       # 键盘数据
│   ├── data-meta.json  # 数据版本信息
│   ├── images/         # 原图
│   ├── images_index.json # 管理页图片索引
│   └── thumbnails/     # 自动生成的缩略图
├── styles/
│   └── globals.css     # 全局样式
├── regenerate-assets.js # 图片匹配、缩略图生成和版本信息更新
├── generate-thumbnails.js # 缩略图生成脚本
└── next.config.js
```

## 本地开发

安装依赖：

```bash
pnpm install
```

启动开发服务器：

```bash
pnpm dev
```

默认访问地址：

```text
http://localhost:3002
```

## 常用命令

```bash
pnpm dev      # 启动开发服务器
pnpm build    # 构建静态站点
pnpm start    # 启动构建后的静态站点
pnpm assets   # 扫描图片、匹配数据、生成缩略图和版本信息
```

执行 `pnpm build` 前会自动运行一次 `pnpm assets`。

## 数据维护流程

建议按以下顺序维护键盘数据：

```text
1. 将图片放入 public/images/工作室名称/
2. 在本地管理页面维护数据，暂时不手动添加图片
3. 从管理页导出 JSON，覆盖 public/data.json
4. 运行 pnpm assets
5. 在本地确认图片显示是否正确，并调整图片顺序
6. 再次导出 JSON，覆盖 public/data.json
7. 再次运行 pnpm assets
8. 提交 data.json、images_index.json、data-meta.json、images、thumbnails
```

### 图片匹配规则

`pnpm assets` 只会尝试为没有图片数据的键盘匹配图片。

已经包含 `images` 数据的键盘会被跳过，不会被脚本覆盖，因此你可以放心地在管理页调整图片顺序。

匹配时会按照以下顺序查找：

1. 找到键盘所属工作室对应的文件夹。
2. 根据键盘名称匹配该文件夹中的图片文件。
3. 匹配到的图片会写入 `data.json` 的 `images` 字段。

### 缩略图

脚本会为 `public/images` 下的图片生成 WebP 缩略图，并保存到 `public/thumbnails`。

图片加载策略：

- 本地开发环境直接加载 `public/images` 下的原图。
- 线上环境优先加载 `public/thumbnails` 下的缩略图。
- 打开键盘详情或大图预览时加载原图。

部署时需要同时上传：

```text
public/images/
public/thumbnails/
public/images_index.json
public/data.json
public/data-meta.json
```

## 管理页面

管理页面地址：

```text
http://localhost:3002/admin
```

在本地环境访问管理页面时会自动通过认证。

管理页支持：

- 添加、编辑、删除键盘
- 导入和导出 JSON
- 搜索和筛选数据
- 浏览并选择图片
- 设置封面图
- 管理 IC / GB 时间与链接

## 数据文件说明

### `public/data.json`

键盘数据的主文件，结构为：

```json
{
  "keyboards": [
    {
      "id": "kb_1",
      "name": "***",
      "studio": "***",
      "sortTime": "202x-xx-xx",
      "layout": "60%",
      "status": "ic",
      "images": ["/images/***/***"],
      "icTime": "202x-xx-xx",
      "icLink": "https://example.com"
    }
  ]
}
```

### `public/data-meta.json`

由脚本根据 `data.json` 内容自动生成，用于前端缓存和数据版本校验。

### `public/images_index.json`

管理页图片选择器使用的图片索引，由脚本自动生成。

## 部署

项目使用静态导出，构建产物在 `out/` 目录下。

```bash
pnpm build
```

将 `out/` 目录中的内容部署到静态站点即可。

如果使用其他静态服务器，需要确保：

- 路径 `/data.json`、`/data-meta.json`、`/images_index.json` 可以正常访问。
- `/images/` 和 `/thumbnails/` 目录一起部署。
- 静态服务器对缺失的图片文件返回 404，而不是返回 200 HTML 页面。
