# HPC2H2 博客

使用 Astro 构建静态博客。现有 HTML 文章保留，月刊逐步改用 Markdown，线上文章地址保持不变。

## 目录

```text
src/
  pages/monthly-2026-10.md  月刊原稿
  layouts/Article.astro    文章公共模板
public/
  *.html                  旧文章、首页和合集目录
  style.css               公共样式
  site.js                 导航和合集配置
  images/                 按文章分组的图片
  vendor/                 第三方静态文件
scripts/
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

旧文章直接编辑 `public/` 中对应的 HTML。首页、合集目录和导航仍按现有方式维护；迁移文章时，删除对应的旧 HTML，避免与 Markdown 生成的同名页面冲突。

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
