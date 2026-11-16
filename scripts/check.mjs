import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';

const output = resolve('_site');
const prefix = ('/' + (process.env.PATH_PREFIX || '').replace(/^\/+|\/+$/g, '')).replace(/\/$/, '');
async function walk(folder) {
  const entries = await readdir(folder, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? walk(join(folder, entry.name)) : join(folder, entry.name)))).flat();
}
const files = await walk(output);
for (const path of ['index.html', 'posts/index.html', 'tags/index.html', 'about/index.html',
  '404.html', 'feed.xml', 'sitemap.xml', 'robots.txt', '.nojekyll', 'assets/style.css', 'assets/blog.js']) {
  await stat(join(output, path));
}
let count = 0;
const errors = [];
const pages = files.filter(path => path.endsWith('.html'));
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  assert.match(html, /<html lang="ko">/);
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /<main\b/);
  for (const [, raw] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const href = raw.replaceAll('&amp;', '&');
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) continue;
    const current = '/' + page.slice(output.length + 1).replaceAll('\\', '/');
    const url = new URL(href, `https://test.invalid${prefix}${current}`);
    let path = decodeURIComponent(url.pathname);
    if (prefix) {
      if (!path.startsWith(prefix + '/')) { errors.push(`Missing prefix: ${href}`); continue; }
      path = path.slice(prefix.length);
    }
    if (path.endsWith('/')) path += 'index.html';
    const target = resolve(output, '.' + path);
    if (!target.startsWith(output + '/')) { errors.push(`Invalid path: ${href}`); continue; }
    try { await stat(target); count++; } catch { errors.push(`${page}: ${href}`); }
  }
}
assert.equal(errors.length, 0, errors.join('\n'));
console.log(`PASS: ${pages.length} pages, ${count} internal links, prefix=${prefix || '/'}`);
