// 直接打开 public 中的源码页面时，转到包含 Markdown 文章的完整构建结果。
// HTTP 预览和线上访问仍使用原有地址。
if (location.protocol === 'file:' && document.currentScript) {
  const scriptUrl = new URL(document.currentScript.src);
  if (scriptUrl.pathname.endsWith('/public/site.js')) {
    const pageUrl = new URL(location.href);
    const outputUrl = new URL('../dist/' + pageUrl.pathname.split('/').pop(), scriptUrl);
    outputUrl.search = pageUrl.search;
    outputUrl.hash = pageUrl.hash;
    location.replace(outputUrl.href);
  }
}

// 导航与目录共享 src/data/catalog.json 的构建结果。
const collections = window.siteCatalog.sections;
const posts = window.siteCatalog.posts;
const currentPage = location.pathname.split('/').pop() || 'index.html';
const currentPost = posts.find(post => post.href === currentPage);
const currentCollection = collections.find(collection => collection.id === currentPost?.section ||
  collection.href === currentPage || collection.items.some(entry => entry.href === currentPage));

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

for (const nav of document.querySelectorAll('[data-site-nav]')) {
  const list = element('ul', 'collections');
  for (const collection of collections) {
    const item = element('li', 'collection');
    const collectionLink = element('a', 'collection-link', collection.name);
    collectionLink.href = collection.href;
    if (collection.href === currentPage) collectionLink.setAttribute('aria-current', 'page');
    if (collection === currentCollection) collectionLink.classList.add('is-active');
    const arrow = element('span', 'arrow');
    arrow.setAttribute('aria-hidden', 'true');
    collectionLink.append(arrow);
    const menu = element('ul', 'dropdown');
    menu.id = collection.id.replace('collection-', 'menu-');
    for (const entry of collection.items) {
      const row = element('li');
      const link = element('a', '', entry.label);
      link.href = entry.href;
      if (entry.href === currentPage) link.setAttribute('aria-current', 'page');
      if (entry.href === currentPost?.category) link.classList.add('is-active');
      row.append(link);
      menu.append(row);
    }
    item.append(collectionLink, menu);
    list.append(item);
  }
  nav.replaceChildren(list);
}

// 保持旧 HTML 和 Markdown 模板中的合集标签兼容。
for (const node of document.querySelectorAll('[data-collection-name]')) {
  const collection = collections.find(item => item.id === node.dataset.collectionName);
  if (!collection) continue;
  node.textContent = (node.dataset.prefix || '') + collection.name;
  if (node.matches('a')) node.href = collection.href;
}
for (const node of document.querySelectorAll('[data-menu-label]')) {
  const entry = collections.flatMap(collection => collection.items).find(item => item.href === node.dataset.menuLabel);
  node.textContent = entry?.label || node.textContent || '旧文章';
}
