const root = document.documentElement;
const theme = document.querySelector('.theme');
const system = matchMedia('(prefers-color-scheme: dark)');
try {
  const saved = localStorage.getItem('blog-theme');
  if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
} catch {}
function updateTheme() {
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : system.matches;
  theme.setAttribute('aria-pressed', String(dark));
  theme.setAttribute('aria-label', dark ? '밝은 화면으로 전환' : '어두운 화면으로 전환');
}
if (theme) {
  theme.hidden = false;
  updateTheme();
  system.addEventListener('change', updateTheme);
  theme.addEventListener('click', () => {
    root.dataset.theme = theme.getAttribute('aria-pressed') === 'true' ? 'light' : 'dark';
    try { localStorage.setItem('blog-theme', root.dataset.theme); } catch {}
    updateTheme();
  });
}

document.querySelectorAll('[data-filter-scope]').forEach(scope => {
  const cards = [...scope.querySelectorAll('[data-post]')];
  const buttons = [...scope.querySelectorAll('[data-filter]')];
  const input = scope.querySelector('input[type="search"]');
  const params = new URLSearchParams(location.search);
  let selected = params.get('tag') || '';
  if (input) input.value = params.get('q') || '';
  scope.querySelectorAll('[data-filter-controls], [data-search-control]').forEach(el => { el.hidden = false; });
  function render(sync = true) {
    const query = (input?.value || '').normalize('NFC').trim().toLocaleLowerCase('ko');
    let count = 0;
    cards.forEach(card => {
      const topics = JSON.parse(card.dataset.topics);
      const text = `${card.dataset.title} ${card.dataset.description} ${topics.join(' ')}`.normalize('NFC').toLocaleLowerCase('ko');
      const match = (!selected || topics.includes(selected)) && (!query || text.includes(query));
      card.hidden = !match;
      if (match) count++;
    });
    buttons.forEach(button => {
      const active = button.dataset.filter === selected;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    scope.querySelector('[data-count]').textContent = `${selected ? `${selected} · ` : ''}${query ? '검색 결과 ' : ''}${count}개의 글`;
    scope.querySelector('[data-empty]').hidden = count > 0;
    if (sync) {
      const url = new URL(location.href);
      selected ? url.searchParams.set('tag', selected) : url.searchParams.delete('tag');
      query ? url.searchParams.set('q', input.value.trim()) : url.searchParams.delete('q');
      history.replaceState(null, '', url);
    }
  }
  input?.addEventListener('input', () => render());
  buttons.forEach(button => button.addEventListener('click', () => { selected = button.dataset.filter; render(); }));
  scope.querySelector('[data-reset]')?.addEventListener('click', () => {
    selected = '';
    if (input) { input.value = ''; input.focus(); }
    render();
  });
  render(false);
});

const article = document.querySelector('[data-article]');
if (article) {
  const toc = document.querySelector('[data-toc]');

  const headings = [
    ...article.querySelectorAll('h2, h3, summary')
  ].filter(element => {
    return element.tagName !== 'SUMMARY'
      || !element.querySelector('h2, h3');
  });

  if (toc) {
    toc.replaceChildren();

    headings.forEach((heading, index) => {
      // 기존 ID와 겹치지 않는 주소 생성
      if (!heading.id) {
        let id = `toc-section-${index + 1}`;

        while (document.getElementById(id)) {
          id += '-';
        }

        heading.id = id;
      }

      const level = heading.tagName === 'SUMMARY'
        ? 2
        : Number(heading.tagName.slice(1));

      const link = document.createElement('a');
      link.href = `#${encodeURIComponent(heading.id)}`;
      link.textContent = heading.textContent.trim();

      link.addEventListener('click', () => {
        // 제목을 감싸는 토글을 모두 열기
        let details = heading.closest('details');

        while (details) {
          details.open = true;
          details = details.parentElement?.closest('details');
        }
      });

      const item = document.createElement('li');
      item.style.marginLeft = `${(level - 2) * 12}px`;
      item.append(link);
      toc.append(item);
    });

    toc.parentElement.hidden = headings.length === 0;
  }
  article.querySelectorAll('table').forEach(table => {
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrap';
    wrapper.tabIndex = 0;
    wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-label', '가로 스크롤 가능한 표');
    table.before(wrapper);
    wrapper.append(table);
  });
  if (navigator.clipboard && isSecureContext) {
    article.querySelectorAll('pre > code').forEach(code => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'copy-code';
      button.textContent = '코드 복사';
      button.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(code.textContent); button.textContent = '복사 완료'; }
        catch { button.textContent = '복사 실패'; }
        setTimeout(() => { button.textContent = '코드 복사'; }, 2000);
      });
      code.parentElement.append(button);
    });
    const copy = document.querySelector('[data-copy-link]');
    if (copy) {
      copy.hidden = false;
      copy.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(location.href);
          copy.textContent = '복사 완료';
          document.querySelector('[data-copy-status]').textContent = '글 링크를 복사했습니다.';
        } catch { copy.textContent = '복사 실패'; }
        setTimeout(() => { copy.textContent = '링크 복사'; }, 2000);
      });
    }
  }
}
