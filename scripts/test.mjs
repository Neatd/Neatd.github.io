import { spawnSync } from 'node:child_process';
import { readFile, writeFile, unlink, access } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import assert from 'node:assert/strict';

const build = ['node_modules/@11ty/eleventy/cmd.cjs'];
function run(args, env) {
  const result = spawnSync(process.execPath, args, {
    stdio: 'inherit', env: { ...process.env, ...env }
  });
  assert.equal(result.status, 0, `Command failed: ${args.join(' ')}`);
}

// 실제 게시글 대신 이번 실행에서만 사용하는 자료로 검사합니다.
const id = randomUUID();
const slug = `verification-${id}`;
const publicSlug = `${slug}-public`;
const draftSlug = `${slug}-draft`;
const futureSlug = `${slug}-future`;
const marker = `BlogVerification${id}`;
const fixtures = new Map([
  [`src/assets/${slug}.svg`, '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1"/></svg>'],
  [`src/posts/${publicSlug}.md`, `---\ntitle: "${marker}Public"\ndescription: "Build verification"\ndate: 2000-01-01T09:00:00+09:00\ntopics: [Verification]\ndraft: false\n---\n## Verification\n\n![Verification image](/assets/${slug}.svg)\n`],
  [`src/posts/${draftSlug}.md`, `---\ntitle: "${marker}Draft"\ndescription: "Draft verification"\ndate: 2000-01-01T09:00:00+09:00\ntopics: [Verification]\ndraft: true\n---\nPrivate draft\n`],
  [`src/posts/${futureSlug}.md`, `---\ntitle: "${marker}Future"\ndescription: "Future verification"\ndate: 2999-01-01T09:00:00+09:00\ntopics: [Verification]\ndraft: false\n---\nFuture post\n`]
]);
const created = [];
let failure;
try {
  for (const [path, content] of fixtures) {
    await writeFile(path, content, { flag: 'wx' });
    created.push(path);
  }

  for (const prefix of ['/', '/example-repo/']) {
    const env = { PATH_PREFIX: prefix, SITE_URL: 'https://example.github.io' };
    run(build, env);
    run(['scripts/check.mjs'], env);

    const home = await readFile('_site/index.html', 'utf8');
    assert.ok(home.includes(`href="${prefix}assets/style.css"`), 'Stylesheet prefix');
    assert.ok(home.includes(`https://example.github.io${prefix}`), 'Canonical prefix');
    const article = await readFile(`_site/posts/${publicSlug}/index.html`, 'utf8');
    assert.ok(article.includes(`src="${prefix}assets/${slug}.svg"`), 'Markdown image prefix');

    for (const path of ['posts/index.html', 'tags/index.html', 'feed.xml', 'sitemap.xml']) {
      const content = await readFile(`_site/${path}`, 'utf8');
      assert.ok(!content.includes(`${marker}Draft`), `Draft leaked into ${path}`);
      assert.ok(!content.includes(`${marker}Future`), `Future post leaked into ${path}`);
      assert.ok(!content.includes(draftSlug), `Draft URL leaked into ${path}`);
      assert.ok(!content.includes(futureSlug), `Future URL leaked into ${path}`);
    }
    const listing = await readFile('_site/posts/index.html', 'utf8');
    assert.ok(listing.includes(`${marker}Public`), 'Published post missing from list');
    for (const hidden of [draftSlug, futureSlug]) {
      await assert.rejects(access(`_site/posts/${hidden}/index.html`), { code: 'ENOENT' });
    }
  }

  // 공개에서 초안으로 바꾼 글의 기존 HTML도 다음 빌드에서 제거되어야 합니다.
  const publicPath = `src/posts/${publicSlug}.md`;
  const content = await readFile(publicPath, 'utf8');
  await writeFile(publicPath, content.replace('draft: false', 'draft: true'));
  run(build, { PATH_PREFIX: '/', SITE_URL: 'https://example.github.io' });
  await assert.rejects(access(`_site/posts/${publicSlug}/index.html`), { code: 'ENOENT' });
  const listing = await readFile('_site/posts/index.html', 'utf8');
  assert.ok(!listing.includes(`${marker}Public`), 'Unpublished post remained in list');
} catch (error) {
  failure = error;
} finally {
  for (const path of created) {
    try { await unlink(path); } catch (error) { failure ||= error; }
  }
  // 임시 자료를 제외하고 사용자의 실제 글만 다시 빌드합니다.
  try {
    run(build, {
      PATH_PREFIX: process.env.PATH_PREFIX || '/',
      SITE_URL: process.env.SITE_URL || 'https://example.com'
    });
  } catch (error) { failure ||= error; }
}
if (failure) throw failure;
console.log('PASS: root/subpath, Markdown images, drafts, future posts, and unpublishing');