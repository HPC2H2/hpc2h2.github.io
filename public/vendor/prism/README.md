# Prism 语法高亮

版本：PrismJS 1.30.0，MIT 许可证（见 `LICENSE`）。

`prism.js` 使用官方源码，保留变量名、缩进和注释，并用分节注释标明每个组件及其来源。

组件按以下顺序合并：

1. `components/prism-core.js`：高亮引擎和页面自动初始化。
2. `components/prism-clike.js`：C 系语言的通用语法。
3. `components/prism-python.js`：Python。
4. `components/prism-c.js`：C，依赖 C-like。
5. `components/prism-cpp.js`：C++，依赖 C。
6. `components/prism-csharp.js`：C#，依赖 C-like。

官方源码：https://github.com/PrismJS/prism/tree/v1.30.0

更新时，从同一个官方版本取上述未压缩文件，保留依赖顺序及许可证；同步检查 `themes/prism.css`，并更新文章中脚本 URL 的版本参数以避免缓存旧文件。

文章页面在 `style.css` 之前引入 `vendor/prism/prism.css`，再使用 `defer` 引入 `vendor/prism/prism.js?v=1.30.0-languages`。代码块使用 `<pre><code class="language-python">…</code></pre>`；C、C++、C# 分别使用 `language-c`、`language-cpp`、`language-csharp`。

正文中的 `<` 和 `&` 应写成 `&lt;` 和 `&amp;`，以保持代码原文并避免被浏览器当作 HTML 解析。所有高亮资源均随网站本地提供。

`prism-markup.js` 是同版本的官方未压缩 Markup 组件，供包含 XML 示例的文章按需加载。它应放在 `prism.js` 之后，同样使用 `defer`；XML 代码块使用 `language-xml`。源码：https://raw.githubusercontent.com/PrismJS/prism/v1.30.0/components/prism-markup.js
