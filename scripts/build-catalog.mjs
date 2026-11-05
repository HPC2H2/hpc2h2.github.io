import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const { sections, posts } = JSON.parse(await readFile(new URL('src/data/catalog.json', root), 'utf8'));
const monthly = sections.find(section => section.id === 'collection-4');
monthly.items = posts.filter(post => post.section === monthly.id)
  .sort((a, b) => b.href.localeCompare(a.href))
  .map(post => ({ label: post.title, href: post.href }));
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const link = (href, label) => `<a href="${escape(href)}">${escape(label)}</a>`;
const byDate = entries => [...entries].sort((a, b) => b.date.localeCompare(a.date));
const count = section => posts.filter(post => post.section === section.id).length;
function sidePanel(section) {
  const entries = section && section !== monthly
    ? section.items.map(item => `<li>${link(item.href, item.label)}<span>${posts.filter(post => post.category === item.href).length}</span></li>`).join('\n')
    : sections.map(item => `<li>${link(item.href, item.name)}<span>${count(item)}</span></li>`).join('\n');
  return `<aside aria-label="侧栏"><section class="side-panel"><h2>${escape(section && section !== monthly ? section.name : '栏目目录')}</h2><ul>${entries}</ul></section><section class="side-panel"><h2>关于博客</h2><p>HPC2H2的图文小天地。</p><p>主要是知识和技术的reference，也有业余期间折腾和玩的记录，偶尔也记下生活中的小确幸。</p></section></aside>`;
}
function row(post) {
  const section = sections.find(section => section.id === post.section);
  const category = section.items.find(item => item.href === post.category);
  return `<li class="article-row">
    <div class="article-meta"><span class="collection-label">${escape(category?.label || section.name)}</span>${post.date ? `<time datetime="${escape(post.date)}" title="${escape(post.dateLabel)}">${escape(post.date.slice(0, 10).replaceAll('-', '.'))}</time>` : ''}</div>
    <div class="article-summary"><h2>${link(post.href, post.title).replace('<a ', '<a class="article-title" ')}</h2>
    <p>${escape(post.summary)}</p></div>
  </li>`;
}
function page(title, section, category, entries, home = false) {
  const crumbs = [link('index.html', '首页')];
  if (section) crumbs.push(category ? link(section.href, section.name) : escape(section.name));
  if (category) crumbs.push(escape(category.label));
  if (!section) crumbs.push('文章目录');
  return `<!doctype html>
<html lang="zh-CN"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(home ? '首页' : title)} · HPC2H2</title>
<link rel="stylesheet" href="style.css?v=20261105-refined-ice">
<script src="site-data.js?v=20261105-refined-ice" defer></script><script src="site.js?v=20261105-refined-ice" defer></script>
</head><body>
<header><div class="masthead"><a class="site-name" href="index.html">HPC2H2</a><span class="site-description">技术博客</span></div><nav aria-label="合集导航" data-site-nav></nav></header>
${home ? '<section class="home-intro" aria-label="博客简介"><h1>业余时间筑起的小小世界。</h1><p>整理会大脑会忘记的知识，也留住每月的好事情。</p></section>' : `<p class="breadcrumb">${crumbs.join(' &gt; ')}</p>`}
<main class="layout"><section class="article-panel" aria-labelledby="articles-heading">
<div class="panel-heading"><${home ? 'h2' : 'h1'} id="articles-heading">${escape(title)}</${home ? 'h2' : 'h1'}><span>共 ${entries.length} 篇</span></div>
<ul class="article-list">${byDate(entries).map(row).join('\n')}</ul>${entries.length ? '' : '<p class="empty-state">暂无文章。</p>'}
</section>${sidePanel(section)}</main><footer>HPC2H2</footer></body></html>\n`;
}
await writeFile(new URL('public/site-data.js', root), `// 由 scripts/build-catalog.mjs 根据 src/data/catalog.json 自动生成。\nwindow.siteCatalog = ${JSON.stringify({ sections, posts }, null, 2)};\n`);
await writeFile(new URL('public/index.html', root), page('最近文章', null, null, posts, true));
for (const section of sections) {
  const entries = posts.filter(post => post.section === section.id);
  await writeFile(new URL(`public/${section.href}`, root), page(section.name, section, null, entries));
  if (section === monthly) continue; // 月份直接链接正文。
  for (const category of section.items) {
    await writeFile(new URL(`public/${category.href}`, root), page(category.label, section, category, entries.filter(post => post.category === category.href)));
  }
}
// 原来的目录地址继续可用，展示原有文章的新归属。
for (const [href, label, names] of [
  ['other-notes.html', '其他笔记', ['power-system-operation-notes.html', 'quant-timing-notes.html']],
]) {
  await writeFile(new URL(`public/${href}`, root), page(label, null, null, posts.filter(post => names.includes(post.href))));
}
console.log(`已生成五个栏目、分类目录和首页，共 ${posts.length} 篇正式文章。`);
