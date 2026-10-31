import { readFile, writeFile, readdir } from 'node:fs/promises';

// 成品页面使用相对图片路径，支持直接打开本地 HTML。
for (const name of await readdir(new URL('../src/pages/', import.meta.url))) {
  if (!name.endsWith('.md')) continue;
  const html = name.replace(/\.md$/, '.html');
  const output = new URL(`../dist/${html}`, import.meta.url);
  // Astro 的 public 资源使用根路径；发布页面使用相对路径，也支持 file:// 打开。
  const content = (await readFile(output, 'utf8')).replace(/(src|href)="\/images\//g, '$1="images/');
  await writeFile(output, content);
}
