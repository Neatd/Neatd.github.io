import { HtmlBasePlugin } from '@11ty/eleventy';
import { rm } from 'node:fs/promises';

const prefix = '/' + (process.env.PATH_PREFIX || '').replace(/^\/+|\/+$/g, '');
const published = post => !post.data.draft && post.date <= new Date();

export default function (config) {
  config.setNunjucksEnvironmentOptions({ autoescape: true });
  config.addPlugin(HtmlBasePlugin);
  config.on('eleventy.before', () => rm('_site', { recursive: true, force: true }));
  config.addPassthroughCopy({ 'src/assets': 'assets', 'src/.nojekyll': '.nojekyll' });
  config.addCollection('articles', api => api.getFilteredByGlob('src/posts/*.md')
    .filter(published).sort((a, b) => b.date - a.date));
  config.addCollection('topics', api => [...new Set(api.getFilteredByGlob('src/posts/*.md')
    .filter(published).flatMap(post => post.data.topics || []))].sort((a, b) => a.localeCompare(b, 'ko')));
  config.addFilter('dateKo', date => new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Seoul'
  }).format(new Date(date)).replace(/\.\s*$/, ''));
  config.addFilter('iso', date => new Date(date).toISOString());
  config.addFilter('readTime', text => Math.max(1, Math.ceil(String(text).replace(/<[^>]*>/g, '').length / 700)));
  config.addFilter('take', (list, count) => list.slice(0, count));
  config.addFilter('topicCount', (list, topic) => list.filter(post => post.data.topics?.includes(topic)).length);
  config.addFilter('json', value => JSON.stringify(value).replace(/</g, '\\u003c'));
  config.addFilter('absolute', (path, origin) => new URL(prefix.replace(/\/$/, '') + path, origin).href);
  return {
    dir: { input: 'src', includes: '_includes', data: '_data', output: '_site' },
    templateFormats: ['njk', 'md'],
    markdownTemplateEngine: false,
    pathPrefix: prefix
  };
}
