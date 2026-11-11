import { spawnSync } from 'node:child_process';
import { readFile, writeFile, unlink, access } from 'node:fs/promises';
import assert from 'node:assert/strict';
import yaml from 'js-yaml';

function run(args, env) {
  const result = spawnSync(process.execPath, args, { stdio: 'inherit', env: { ...process.env, ...env } });
  assert.equal(result.status, 0, args.join(' '));
}
const action = yaml.load(await readFile('.github/workflows/deploy.yml', 'utf8'));
assert.equal(action.name, 'Build and deploy blog');
assert.ok('push' in action.on && 'workflow_dispatch' in action.on);
assert.equal(action.permissions.pages, 'write');
const readme = await readFile('README.md', 'utf8');
assert.doesNotMatch(readme, /사용설명|업로드|설정하세요|수정하세요|배포 가이드|스타터|ChatGPT|Codex/i);

const build = ['node_modules/@11ty/eleventy/cmd.cjs'];
for (const prefix of ['/', '/example-repo/']) {
  const env = { PATH_PREFIX: prefix, SITE_URL: 'https://example.github.io' };
  run(build, env);
  run(['scripts/check.mjs'], env);
  const html = await readFile('_site/index.html', 'utf8');
  assert.ok(html.includes(`href="${prefix}assets/style.css"`));
  assert.ok(html.includes(`https://example.github.io${prefix}`));
  const article = await readFile('_site/posts/array-transform/index.html', 'utf8');
  assert.ok(article.includes(`src="${prefix}assets/data-flow.svg"`));
  for (const file of ['index.html', 'about/index.html', 'feed.xml', 'sitemap.xml']) {
    const content = await readFile('_site/' + file, 'utf8');
    assert.doesNotMatch(content, /이 스타터|수정하세요|업로드하세요|나만의 소개로|사용설명서/);
  }
}

const draft = 'src/posts/verification-draft.md';
const future = 'src/posts/verification-future.md';
for (const file of [draft, future]) {
  try { await access(file); throw new Error(`Reserved fixture exists: ${file}`); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}
try {
  await writeFile(draft, '---\ntitle: DraftVerificationMarker\ndate: 2020-01-01\ndraft: true\n---\nDraft only\n');
  await writeFile(future, '---\ntitle: FutureVerificationMarker\ndate: 2999-01-01\n---\nFuture only\n');
  run(build, { PATH_PREFIX: '/', SITE_URL: 'https://example.github.io' });
  for (const file of ['index.html', 'posts/index.html', 'tags/index.html', 'feed.xml', 'sitemap.xml']) {
    assert.doesNotMatch(await readFile('_site/' + file, 'utf8'), /DraftVerificationMarker|FutureVerificationMarker|verification-draft|verification-future/);
  }
  for (const slug of ['verification-draft', 'verification-future']) await assert.rejects(access(`_site/posts/${slug}/index.html`));
} finally {
  await Promise.all([unlink(draft), unlink(future)]);
  run(build, { PATH_PREFIX: '/', SITE_URL: 'https://example.com' });
}
console.log('PASS: workflow structure, root/subpath, private drafts, public content separation');
