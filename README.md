# HPC2H2 博客

使用 Astro 构建静态博客。现有 HTML 文章保留，月刊逐步改用 Markdown，线上文章地址保持不变。

## 目录

```text
src/
  data/catalog.json       栏目与文章目录配置
  pages/monthly-2026-10.md  月刊原稿
  layouts/Article.astro    文章公共模板
public/
  *.html                  旧文章、首页和合集目录
  style.css               公共样式
  site.js                 导航渲染
  site-data.js            自动生成的导航数据
  images/                 按文章分组的图片
  vendor/                 第三方静态文件
scripts/
  build-catalog.mjs        生成首页、栏目和分类目录
  relative-image-paths.mjs 成品图片路径处理
.github/workflows/
  pages.yml               构建并发布 dist 的工作流
astro.config.mjs           Astro 配置
package.json              依赖和命令
package-lock.json         锁定依赖版本
dist/                    自动生成的网站，不提交、不手动修改
```

## 写文章

本篇月刊编辑 `src/pages/monthly-2026-10.md`。文件开头的 `---` 区域设置标题、日期和所属合集；下面是 Markdown 正文。

旧文章直接编辑 `public/` 中对应的 HTML。首页、栏目目录和导航统一在 `src/data/catalog.json` 中维护；迁移文章时，删除对应的旧 HTML，避免与 Markdown 生成的同名页面冲突。

图片放在 `public/images/` 中，按文章建立子目录。Markdown 中使用不含 `public` 的地址：

```markdown
[![图片说明](/images/monthly-2026-10/blog.png)](/images/monthly-2026-10/blog.png)
```

图片说明是替代文本，不会显示为图片下方的标题。第 3 条聊天截图的 360px 宽度在 `src/layouts/Article.astro` 中设置；第 4 条双图并排使用 Markdown 内嵌 HTML 的 `photo-pair` 容器。

Markdown 的 `/images/` 路径供 Astro 识别，构建后自动转换成相对路径，支持直接打开 `dist/monthly-2026-10.html`。

## 本地使用

使用 Node.js 22.12 或更新的受支持版本，首次安装：

```sh
npm ci
```

实时预览：

```sh
npm run dev
```

生成完整网站并预览：

```sh
npm run build
npm run preview
```

构建将 `public/` 中的文件原样复制到 `dist/`，并生成 Markdown 文章。不会回写项目根目录。`dist/`、`node_modules/` 和 `.astro/` 都是自动生成的目录，已在 Git 中忽略。

## 发布

网站发布内容为 `dist/`。仓库已提供 `.github/workflows/pages.yml`：推送到 `main` 或手动运行工作流时，安装依赖、构建并发布网站。

首次使用需要在 GitHub 仓库的 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。本地构建不会发布网站。

直接打开 `public/*.html` 时，共用脚本会自动转到 `dist/` 中的同名页面，避免旧页面链接不到 Markdown 月刊；查询参数和锚点也会保留。请先运行 `npm run build` 生成完整网站。日常写作使用 `npm run dev` 可实时预览最新内容。

## 栏目和目录

五个栏目及文章归属统一配置在 `src/data/catalog.json`：

- `sections` 设置栏目名称、下拉分类和目录地址；“每月好事情”的下拉内容由该栏目的文章生成，并按月份倒序排列。
- `posts` 设置正式文章的标题、摘要、日期、栏目 `section` 与分类目录 `category`。新增文章后，把目录信息加到这里。
- `npm run build` 和 `npm run dev` 启动前运行 `scripts/build-catalog.mjs`，生成首页、栏目目录、分类目录和 `public/site-data.js`。这些生成的目录文件应通过配置修改。
- 旧文章正文继续在原 HTML 中维护。已有文章正文 URL 保留；`article-6.html` 用于“电子世界 → 嵌入式软件”，`other-notes.html` 作为旧目录仍然可访问。

现有占位“示例文章”保留原文件，正式首页和新分类目录不计入它们。当前月刊为《2026年10月》。

## 外观

当前采用“克制冰蓝”主题，公共样式为 `public/style.css`。`--content-opacity` 控制阅读区域底色，`--nav-opacity` 控制导航底色；正文使用深色、日期使用灰色，冰蓝玻璃质感集中在页面外框和导航。首页简介在 `scripts/build-catalog.mjs` 的 `home-intro` 中修改。
