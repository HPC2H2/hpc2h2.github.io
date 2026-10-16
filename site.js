// 所有页面共用的导航。修改 name 更改合集名称；href 指向合集目录；items 配置下拉菜单。
// label 是菜单文字，href 是要打开的页面。保存后刷新页面即可。
const collections = [
  {
    "id": "collection-1",
    "name": "电子玩家",
    "href": "collection-1.html",
    "items": [
      {
        "label": "山水画摆件",
        "href": "landscape-led-badge.html"
      },
      {
        "label": "拆一个反激 220v交流转5V2A电源适配器",
        "href": "flyback-220v-5v2a.html"
      },
      {
        "label": "选项1",
        "href": "article-1.html"
      },
      {
        "label": "选项2",
        "href": "article-2.html"
      }
    ]
  },
  {
    "id": "collection-2",
    "name": "学习笔记",
    "href": "collection-2.html",
    "items": [
      {
        "label": "硬件与PCB",
        "href": "article-3.html"
      },
      {
        "label": "编程语言与程序设计",
        "href": "article-4.html"
      },
      {
        "label": "框架和库",
        "href": "article-5.html"
      },
      {
        "label": "嵌入式软件",
        "href": "article-6.html"
      },
      {
        "label": "控制理论和应用",
        "href": "article-7.html"
      },
      {
        "label": "语言学习",
        "href": "article-8.html"
      },
      {
        "label": "其他",
        "href": "other-notes.html"
      }
    ]
  },
  {
    "id": "collection-3",
    "name": "合集3",
    "href": "collection-3.html",
    "items": [
      {
        "label": "选项1",
        "href": "article-5.html"
      },
      {
        "label": "选项2",
        "href": "article-6.html"
      }
    ]
  },
  {
    "id": "collection-4",
    "name": "合集4",
    "href": "collection-4.html",
    "items": [
      {
        "label": "选项1",
        "href": "article-7.html"
      },
      {
        "label": "选项2",
        "href": "article-8.html"
      }
    ]
  }
];

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// 在每个页面生成同一份导航，不依赖第三方库或网络请求。
for (const nav of document.querySelectorAll('[data-site-nav]')) {
  const list = element('ul', 'collections');
  for (const collection of collections) {
    const item = element('li', 'collection');
    const menuId = collection.id.replace('collection-', 'menu-');
    const collectionLink = element('a', 'collection-link', collection.name);
    collectionLink.href = collection.href;
    if (collection.href === location.pathname.split('/').pop()) {
      collectionLink.setAttribute('aria-current', 'page');
    }
    const arrow = element('span', 'arrow');
    arrow.setAttribute('aria-hidden', 'true');
    collectionLink.append(arrow);
    const menu = element('ul', 'dropdown');
    menu.id = menuId;
    for (const entry of collection.items) {
      const row = element('li');
      const link = element('a', '', entry.label);
      link.href = entry.href;
      row.append(link);
      menu.append(row);
    }
    item.append(collectionLink, menu);
    list.append(item);
  }
  nav.replaceChildren(list);
}

// 同步首页分类标签、侧栏、文章路径和返回链接中的合集名称。
for (const node of document.querySelectorAll('[data-collection-name]')) {
  const collection = collections.find(item => item.id === node.dataset.collectionName);
  if (collection) node.textContent = (node.dataset.prefix || '') + collection.name;
  if (collection && node.matches('a')) {
    node.href = collection.href;
    if (collection.href === location.pathname.split('/').pop()) {
      node.setAttribute('aria-current', 'page');
    }
  }
}

// 分类目录的侧栏与顶部导航使用同一份学习笔记菜单。
for (const list of document.querySelectorAll('[data-study-links]')) {
  const collection = collections.find(item => item.id === 'collection-2');
  for (const entry of collection?.items || []) {
    const row = element('li');
    const link = element('a', '', entry.label);
    link.href = entry.href;
    if (entry.href === location.pathname.split('/').pop()) link.setAttribute('aria-current', 'page');
    row.append(link);
    list.append(row);
  }
}

// 文章路径和分类目录中的菜单名也取自共用配置。
for (const node of document.querySelectorAll('[data-menu-label]')) {
  const collection = collections.find(item => item.id === node.dataset.collection);
  const entry = collection?.items.find(item => item.href === node.dataset.menuLabel);
  if (entry) node.textContent = entry.label;
}
