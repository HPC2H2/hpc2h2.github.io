# HPC2H2 Simple
直接打开 `index.html` 即可浏览。也可以在本目录运行：

```sh
python3 -m http.server 5174 --bind 127.0.0.1
```

然后打开 http://127.0.0.1:5174 。服务只接受本机连接。

## 修改导航

所有页面共用 `site.js` 顶部的 `collections` 配置：

- `name`：合集名称，同时用于导航、首页分类、侧栏和文章路径。
- `items`：该合集的下拉菜单；`label` 为文字，`href` 为目标页面。
- `id`：合集的固定标识，改名称时保留它。

