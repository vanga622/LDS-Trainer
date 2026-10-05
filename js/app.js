/* LDS Trainer — UI and modes */
(function () {
  const { shuffle, int } = window.MathUtil;
  const Lg = window.Logic;
  const TOP = Object.fromEntries(window.TOPICS.map((t) => [t.id, t]));
  const $ = (sel, root = document) => root.querySelector(sel);
  const h = (tag, attrs = {}, html = '') => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') e.className = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v);
    }
    if (html) e.innerHTML = html;
    return e;
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const typeset = (el) => {
    if (window.renderMathInElement) {
      try { window.renderMathInElement(el, { delimiters: [{ left: '$', right: '$', display: false }], throwOnError: false }); } catch (e) { /* ignore */ }
    }
  };

  // ---------------- state ----------------
  const S = {
    view: 'home',
    stats: Object.fromEntries(window.TOPICS.map((t) => [t.id, { n: 0, ok: 0 }])),
    theme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    timer: null,
  };
  let genCounter = 0;
  const fromGen = (name) => { const q = window.GEN[name](); q.id = 'gen-' + name + '-' + (++genCounter); q.src = q.src || 'Генератор · нове завдання щоразу'; return q; };
  const withPts = (q, pts) => Object.assign({}, q, { pts, _resp: undefined });
  const record = (q, ok) => { const s = S.stats[q.topic]; if (s) { s.n++; if (ok) s.ok++; } };
  const BANK = window.BANK;
  const isAuto = (q) => q.type !== 'proof';

  // ---------------- grading ----------------
  function grade(q, r) {
    if (r === undefined || r === null) return { ok: false, empty: true };
    switch (q.type) {
      case 'tf': return { ok: r === q.answer };
      case 'mc': return { ok: r === q.answer };
      case 'multi': {
        const a = [...q.answer].sort().join(','), b = [...r].sort().join(',');
        return { ok: a === b };
      }
      case 'num': {
        const vals = r;
        if (!vals || vals.every((v) => String(v).trim() === '')) return { ok: false, empty: true };
        if (q.check) return { ok: !!q.check(vals) };
        const x = int(vals[0]);
        return { ok: q.answers.some((a) => a === x || String(a) === String(vals[0]).trim()) };
      }
      case 'formula': {
        if (!r || !String(r).trim()) return { ok: false, empty: true };
        let ast;
        try { ast = Lg.parse(r); } catch (e) { return { ok: false, msg: 'Синтаксична помилка: ' + e.message }; }
        if (!Lg.equiv(ast, q.target)) {
          const ce = Lg.counterexample(ast, q.target);
          return { ok: false, msg: 'Ваша формула не еквівалентна F. Контрприклад: ' + Object.entries(ce).map(([k, v]) => k + '=' + v).join(', ') + ` (ваша дає ${Lg.eval(ast, ce)}, F дає ${Lg.eval(q.target, ce)}).` };
        }
        const formOk = q.form === 'KNF' ? Lg.isKNF(ast) : q.form === 'DNF' ? Lg.isDNF(ast) : q.form === 'Horn' ? Lg.isHorn(ast) : true;
        if (!formOk) return { ok: false, msg: `Формула еквівалентна, але не в ${q.form === 'Horn' ? 'Horn-формі' : q.form}.` };
        return { ok: true, msg: 'Еквівалентна і в потрібній формі: ' + Lg.show(ast) };
      }
      case 'assign': {
        const env = r;
        if (!env) return { ok: false, empty: true };
        return { ok: Lg.eval(q.formula, env) === 1 };
      }
      case 'proof': return { ok: r >= 1, score: r };
    }
    return { ok: false };
  }
  function correctText(q) {
    switch (q.type) {
      case 'tf': return (q.labels || ['wahr', 'falsch'])[q.answer ? 0 : 1];
      case 'mc': return q.options[q.answer];
      case 'multi': return q.answer.length ? q.answer.map((i) => q.options[i]).join(', ') : '(жодна)';
      case 'num': case 'formula': case 'assign': return esc(q.solution).replace(/&lt;(\/?b)&gt;/g, '<$1>');
      default: return '';
    }
  }

  // ---------------- question component ----------------
  const TYPE_LABEL = { tf: 'Wahr / Falsch', mc: 'Одна відповідь', multi: 'Кілька відповідей', num: 'Число', formula: 'Формула', assign: 'Belegung', proof: 'Доведення · самоперевірка' };
  function QuestionCard(q, opts) {
    const o = Object.assign({ mode: 'instant', onAnswer: null, number: null }, opts || {});
    const card = h('article', { class: 'qcard', 'data-type': q.type });
    const meta = h('div', { class: 'qmeta' });
    if (o.number) meta.append(h('span', { class: 'qnum' }, esc(o.number)));
    meta.append(h('span', { class: 'chip' }, esc(TOP[q.topic] ? TOP[q.topic].de : q.topic)));
    meta.append(h('span', { class: 'chip chip-ghost' }, TYPE_LABEL[q.type]));
    if (q.pts) meta.append(h('span', { class: 'chip chip-ghost' }, q.pts + ' P'));
    if (q.src) meta.append(h('span', { class: 'qsrc' }, esc(q.src)));
    card.append(meta);
    card.append(h('div', { class: 'qtext' }, q.q));
    const area = h('div', { class: 'qarea' });
    const fb = h('div', { class: 'feedback', hidden: true });
    card.append(area, fb);
    let locked = false;

    const finish = () => {
      if (o.mode !== 'instant' || locked) return;
      const res = grade(q, q._resp);
      if (res.empty) { flash(area, 'Спочатку дайте відповідь'); return; }
      locked = true;
      card.classList.add('locked');
      showFeedback(card, q, res);
      if (o.onAnswer) o.onAnswer(res);
    };
    const changed = () => { if (o.mode === 'deferred' && o.onChange) o.onChange(q); };

    if (q.type === 'tf' || q.type === 'mc') {
      const labels = q.type === 'tf' ? (q.labels || ['wahr', 'falsch']) : q.options;
      const wrap = h('div', { class: 'opts' + (q.inline || q.type === 'tf' ? ' opts-inline' : '') });
      labels.forEach((lab, i) => {
        const val = q.type === 'tf' ? i === 0 : i;
        const b = h('button', { class: 'opt', type: 'button', 'data-i': i }, `<span class="opt-key">${q.type === 'tf' ? (i === 0 ? '✓' : '✗') : String.fromCharCode(65 + i)}</span><span class="opt-label">${lab}</span>`);
        b.addEventListener('click', () => {
          if (locked) return;
          q._resp = val;
          wrap.querySelectorAll('.opt').forEach((x) => x.classList.toggle('sel', x === b));
          changed();
          if (o.mode === 'instant') finish();
        });
        wrap.append(b);
      });
      area.append(wrap);
    }
    if (q.type === 'multi') {
      q._resp = q._resp || [];
      const wrap = h('div', { class: 'opts opts-multi' });
      q.options.forEach((lab, i) => {
        const b = h('button', { class: 'opt', type: 'button', 'aria-pressed': 'false' }, `<span class="opt-box" aria-hidden="true"></span><span class="opt-label">${lab}</span>`);
        b.addEventListener('click', () => {
          if (locked) return;
          const s = new Set(q._resp); s.has(i) ? s.delete(i) : s.add(i); q._resp = [...s];
          b.classList.toggle('sel'); b.setAttribute('aria-pressed', b.classList.contains('sel'));
          changed();
        });
        wrap.append(b);
      });
      area.append(wrap);
      if (q.allowNone) area.append(h('p', { class: 'hint' }, 'Можна позначити кілька властивостей або жодної.'));
      if (o.mode === 'instant') area.append(h('button', { class: 'btn btn-primary', type: 'button', onclick: () => { locked = false; finish(); } }, 'Перевірити'));
    }
    if (q.type === 'num') {
      const row = h('div', { class: 'inputs' });
      const ins = q.inputs.map((inp) => {
        const lab = h('label', { class: 'inp' });
        lab.append(h('span', { class: 'inp-label' }, inp.label));
        const field = h('input', { type: 'text', inputmode: 'numeric', autocomplete: 'off', class: 'field' });
        field.addEventListener('input', () => { q._resp = ins.map((f) => f.value); changed(); });
        field.addEventListener('keydown', (e) => { if (e.key === 'Enter') finish(); });
        lab.append(field); row.append(lab); return field;
      });
      area.append(row);
      if (o.mode === 'instant') area.append(h('button', { class: 'btn btn-primary', type: 'button', onclick: finish }, 'Перевірити'));
    }
    if (q.type === 'formula') {
      const field = h('input', { type: 'text', class: 'field field-formula', autocomplete: 'off', spellcheck: 'false', placeholder: 'напр. (A ∨ ¬B) ∧ C   або   (A | !B) & C' });
      const prev = h('div', { class: 'preview' }, '&nbsp;');
      const pad = h('div', { class: 'pad' });
      ['¬', '∧', '∨', '→', '↔', '(', ')', 'A', 'B', 'C'].forEach((s) => {
        pad.append(h('button', { type: 'button', class: 'key', onclick: () => {
          if (locked) return;
          const p = field.selectionStart ?? field.value.length;
          field.value = field.value.slice(0, p) + s + field.value.slice(field.selectionEnd ?? p);
          field.focus(); field.selectionStart = field.selectionEnd = p + s.length; field.dispatchEvent(new Event('input'));
        } }, s));
      });
      field.addEventListener('input', () => {
        q._resp = field.value; changed();
        if (!field.value.trim()) { prev.innerHTML = '&nbsp;'; prev.className = 'preview'; return; }
        try { prev.textContent = 'Розпізнано: ' + Lg.show(Lg.parse(field.value)); prev.className = 'preview ok'; } catch (e) { prev.textContent = e.message; prev.className = 'preview err'; }
      });
      field.addEventListener('keydown', (e) => { if (e.key === 'Enter') finish(); });
      area.append(pad, field, prev, h('p', { class: 'hint' }, 'Можна вводити ASCII: ! (¬), & (∧), | (∨), -> (→), <-> (↔), константи 0 і 1.'));
      if (o.mode === 'instant') area.append(h('button', { class: 'btn btn-primary', type: 'button', onclick: finish }, 'Перевірити'));
    }
    if (q.type === 'assign') {
      const env = Object.fromEntries(q.vars.map((v) => [v, 0]));
      q._resp = undefined;
      const wrap = h('div', { class: 'assign' });
      q.vars.forEach((v) => {
        const b = h('button', { type: 'button', class: 'bit' }, `<span>𝒜(${v}) =</span><b>0</b>`);
        b.addEventListener('click', () => {
          if (locked) return;
          env[v] = 1 - env[v]; b.querySelector('b').textContent = env[v]; b.classList.toggle('on', !!env[v]);
          q._resp = Object.assign({}, env); changed();
        });
        wrap.append(b);
      });
      area.append(wrap, h('p', { class: 'hint' }, 'Натискайте, щоб перемикати 0 ↔ 1.'));
      const commit = () => { q._resp = Object.assign({}, env); };
      if (o.mode === 'instant') area.append(h('button', { class: 'btn btn-primary', type: 'button', onclick: () => { commit(); finish(); } }, 'Перевірити'));
      else commit();
    }
    if (q.type === 'proof') {
      const ta = h('textarea', { class: 'field field-proof', rows: 5, placeholder: 'Чернетка (необов\'язково): запишіть ідею доведення німецькою, як на іспиті…' });
      area.append(ta);
      if (o.mode === 'instant') {
        const btn = h('button', { class: 'btn btn-primary', type: 'button' }, 'Показати зразок розв\'язку');
        btn.addEventListener('click', () => {
          btn.remove();
          const sol = proofBlock(q, (score) => { q._resp = score; locked = true; card.classList.add('locked'); if (o.onAnswer) o.onAnswer({ ok: score >= 1, score }); });
          fb.hidden = false; fb.className = 'feedback neutral'; fb.innerHTML = ''; fb.append(sol); typeset(fb);
        });
        area.append(btn);
      } else {
        area.append(h('p', { class: 'hint' }, 'Зразок розв\'язку та самооцінка з\'являться після здачі.'));
      }
    }
    typeset(card);
    card._q = q;
    return card;
  }
  function proofBlock(q, onScore) {
    const box = h('div', { class: 'proof-sol' });
    box.append(h('div', { class: 'fb-title' }, 'Зразок розв\'язку (Musterlösung)'));
    box.append(h('div', { class: 'sol' }, q.solution));
    box.append(h('div', { class: 'expl' }, '<b>Ідея простими словами:</b> ' + q.expl));
    const row = h('div', { class: 'selfgrade' }, '<span>Як ви впоралися?</span>');
    [['Повністю', 1], ['Частково', 0.5], ['Не впорався', 0]].forEach(([lab, sc]) => {
      const b = h('button', { type: 'button', class: 'btn btn-sm' }, lab);
      b.addEventListener('click', () => { row.querySelectorAll('button').forEach((x) => x.classList.toggle('sel', x === b)); onScore(sc); });
      row.append(b);
    });
    box.append(row);
    return box;
  }
  function showFeedback(card, q, res, opts) {
    const fb = $('.feedback', card);
    fb.hidden = false;
    fb.className = 'feedback ' + (res.ok ? 'good' : 'bad');
    const area = $('.qarea', card);
    // mark options
    if (q.type === 'tf' || q.type === 'mc') {
      const corr = q.type === 'tf' ? (q.answer ? 0 : 1) : q.answer;
      area.querySelectorAll('.opt').forEach((b) => { const i = +b.dataset.i; if (i === corr) b.classList.add('right'); else if (b.classList.contains('sel')) b.classList.add('wrong'); });
    }
    if (q.type === 'multi') {
      area.querySelectorAll('.opt').forEach((b, i) => { const want = q.answer.includes(i), sel = b.classList.contains('sel'); if (want) b.classList.add('right'); if (sel && !want) b.classList.add('wrong'); if (want && !sel) b.classList.add('missed'); });
    }
    const collapsed = res.ok && !(opts && opts.expand);
    let html = `<div class="fb-title">${res.ok ? '✓ Правильно' : res.empty ? '— Немає відповіді' : '✗ Неправильно'}</div>`;
    if (res.msg) html += `<p class="fb-msg">${esc(res.msg)}</p>`;
    if (!res.ok || q.type === 'num' || q.type === 'formula' || q.type === 'assign') html += `<p class="fb-correct"><span>Правильна відповідь:</span> ${correctText(q)}</p>`;
    fb.innerHTML = html;
    const ex = h('div', { class: 'expl' }, '<b>Пояснення:</b> ' + q.expl);
    if (collapsed) {
      const t = h('button', { class: 'linkbtn', type: 'button' }, 'Показати пояснення');
      t.addEventListener('click', () => { t.replaceWith(ex); typeset(ex); });
      fb.append(t);
    } else fb.append(ex);
    typeset(fb);
  }
  function flash(el, msg) {
    let n = el.querySelector('.flash');
    if (!n) { n = h('p', { class: 'flash' }); el.append(n); }
    n.textContent = msg;
    setTimeout(() => n && n.remove(), 1800);
  }

  // ---------------- layout / nav ----------------
  const main = () => $('#main');
  const NAV = [['home', 'Головна'], ['exam', 'Режим іспиту'], ['train', 'Тренування'], ['blitz', 'Бліц'], ['theory', 'Теорія'], ['analysis', 'Аналіз іспиту']];
  function setView(v, arg) {
    if (S.timer && v !== 'exam-run') { clearInterval(S.timer); S.timer = null; }
    S.view = v;
    document.querySelectorAll('.nav a').forEach((a) => a.classList.toggle('active', a.dataset.v === v.split('-')[0]));
    const m = main(); m.innerHTML = ''; window.scrollTo(0, 0);
    ({ home: viewHome, exam: viewExamSetup, 'exam-run': viewExamRun, train: viewTrainPick, 'train-run': viewTrainRun, blitz: viewBlitz, theory: viewTheory, analysis: viewAnalysis })[v](m, arg);
    typeset(m);
  }
  function buildNav() {
    const nav = $('.nav');
    NAV.forEach(([v, lab]) => {
      const a = h('a', { href: '#', 'data-v': v }, lab);
      a.addEventListener('click', (e) => {
        e.preventDefault();
        if (S.view === 'exam-run' && !confirm('Перервати іспит? Відповіді буде втрачено.')) return;
        setView(v);
      });
      nav.append(a);
    });
    $('#themeToggle').addEventListener('click', () => { S.theme = S.theme === 'dark' ? 'light' : 'dark'; applyTheme(); });
    applyTheme();
  }
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', S.theme);
    $('#themeToggle').setAttribute('aria-label', S.theme === 'dark' ? 'Світла тема' : 'Темна тема');
    $('#themeToggle').innerHTML = S.theme === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  // ---------------- HOME ----------------
  function viewHome(m) {
    const nStatic = BANK.length, nGen = Object.keys(window.GEN).filter((k) => k !== 'graphSVG').length;
    const nExam = BANK.filter((q) => /Prüfung|Schein|Altklausur|Ergänzung|Tutorium/.test(q.src || '')).length;
    m.append(h('section', { class: 'hero' }, `
      <p class="eyebrow">Universität Stuttgart · Modulprüfung</p>
      <h1>Logik und Diskrete Strukturen — тренажер до іспиту</h1>
      <p class="lead">Завдання німецькою — як на справжньому іспиті, пояснення українською. База побудована на Skript LDS, конспекті Kufleitner (text), іспитах 2015–2026, Scheinklausuren і Ergänzungsblättern.</p>
      <div class="kpis">
        <div><b>${nStatic}</b><span>завдань у базі</span></div>
        <div><b>${nExam}</b><span>з іспитів і листків</span></div>
        <div><b>${nGen}</b><span>генераторів (безліч варіантів)</span></div>
        <div><b>${window.TOPICS.length}</b><span>тем</span></div>
      </div>`));
    const modes = h('section', { class: 'modes' });
    [
      ['exam', 'Режим іспиту', '13 задач · 100 балів · 120 хв', 'Повний варіант за структурою іспитів 2026: таблиці з хрестиками, Euklid, CRT, доведення. Таймер, автоматична оцінка, «bestanden» від 50 балів.', 'Почати іспит'],
      ['train', 'Тренування за темами', 'одне за одним · миттєвий результат', 'Обираєте тему — питання йдуть по черзі. Після кожної відповіді одразу бачите результат, а при помилці — пояснення простими словами.', 'Обрати тему'],
      ['blitz', 'Бліц-опитування', '10 випадкових питань', '10 питань з усіх тем підряд без підказок. В кінці — результат і пояснення до кожної помилки.', 'Старт бліцу'],
    ].forEach(([v, t, sub, d, b]) => {
      const c = h('article', { class: 'mode' }, `<h2>${t}</h2><p class="mode-sub">${sub}</p><p>${d}</p>`);
      c.append(h('button', { class: 'btn btn-primary', type: 'button', onclick: () => setView(v) }, b));
      modes.append(c);
    });
    m.append(modes);
    const st = h('section', { class: 'panel' }, '<h2 class="h2">Прогрес у цій сесії</h2><p class="muted small">Статистика зберігається, доки відкрита сторінка.</p>');
    const grid = h('div', { class: 'progress-grid' });
    window.TOPICS.forEach((t) => {
      const s = S.stats[t.id]; const p = s.n ? Math.round((100 * s.ok) / s.n) : 0;
      const row = h('button', { class: 'prow', type: 'button', onclick: () => setView('train-run', { topic: t.id }) },
        `<span class="prow-name">${t.de}<small>${t.ua}</small></span><span class="bar"><i style="width:${p}%"></i></span><span class="prow-num">${s.n ? s.ok + '/' + s.n : '—'}</span>`);
      grid.append(row);
    });
    st.append(grid);
    m.append(st);
  }

  // ---------------- TRAINING ----------------
  function viewTrainPick(m) {
    m.append(h('div', { class: 'page-head' }, '<h1>Тренування за темами</h1><p class="muted">Оберіть тему. Питання йдуть одне за одним; після кожного — миттєвий результат і пояснення.</p>'));
    const opts = h('div', { class: 'toggles' });
    const proofT = h('label', { class: 'toggle' }, '<input type="checkbox" checked> Включати доведення (самоперевірка)');
    opts.append(proofT);
    m.append(opts);
    const grid = h('div', { class: 'topic-grid' });
    const all = h('button', { class: 'topic topic-all', type: 'button' }, `<b>Усі теми впереміш</b><span>${BANK.length} завдань + генератори</span>`);
    all.addEventListener('click', () => setView('train-run', { topic: 'all', proofs: $('input', proofT).checked }));
    grid.append(all);
    window.TOPICS.forEach((t) => {
      const n = BANK.filter((q) => q.topic === t.id).length, g = (window.GEN_BY_TOPIC[t.id] || []).length;
      const b = h('button', { class: 'topic', type: 'button' }, `<b>${t.de}</b><small>${t.ua}</small><span>${n} завдань${g ? ' · ' + g + ' генератор' + (g === 1 ? '' : g < 5 ? 'и' : 'ів') : ''}</span>`);
      b.addEventListener('click', () => setView('train-run', { topic: t.id, proofs: $('input', proofT).checked }));
      grid.append(b);
    });
    m.append(grid);
  }
  function viewTrainRun(m, arg) {
    const topic = arg.topic, proofs = arg.proofs !== false;
    const statics = shuffle(BANK.filter((q) => (topic === 'all' || q.topic === topic) && (proofs || q.type !== 'proof')));
    const gens = topic === 'all' ? Object.values(window.GEN_BY_TOPIC).flat() : (window.GEN_BY_TOPIC[topic] || []);
    const st = { i: 0, k: 0, n: 0, ok: 0, streak: 0, round: 1 };
    const title = topic === 'all' ? 'Усі теми' : TOP[topic].de;
    const head = h('div', { class: 'run-head' });
    const score = h('div', { class: 'run-score' });
    head.append(h('div', {}, `<p class="eyebrow">Тренування</p><h1>${title}</h1>`), score);
    const back = h('button', { class: 'btn btn-ghost btn-sm', type: 'button', onclick: () => setView('train') }, '← Теми');
    const theory = topic !== 'all' ? h('button', { class: 'btn btn-ghost btn-sm', type: 'button', onclick: () => setView('theory', topic) }, 'Шпаргалка') : null;
    const tools = h('div', { class: 'run-tools' }); tools.append(back); if (theory) tools.append(theory);
    m.append(tools, head);
    const slot = h('div', { class: 'slot' });
    m.append(slot);
    const upd = () => { score.innerHTML = `<span><b>${st.ok}</b> / ${st.n} правильно</span><span>серія: <b>${st.streak}</b></span>`; };
    upd();
    const next = () => {
      let q;
      const useGen = gens.length && (st.i >= statics.length || st.k % 3 === 2);
      if (useGen) q = fromGen(gens[Math.floor(Math.random() * gens.length)]);
      else {
        if (st.i >= statics.length) { st.i = 0; st.round++; shuffle(statics); }
        q = Object.assign({}, statics[st.i++], { _resp: undefined });
      }
      st.k++;
      slot.innerHTML = '';
      const nextBtn = h('button', { class: 'btn btn-primary', type: 'button', onclick: next }, 'Наступне питання →');
      const card = QuestionCard(q, {
        mode: 'instant', number: '№ ' + st.k,
        onAnswer: (res) => {
          st.n++; if (res.ok) { st.ok++; st.streak++; } else st.streak = 0;
          if (q.type !== 'proof' || res.score !== undefined) record(q, res.ok);
          upd();
          const nb = slot.querySelector('.next-row'); nb.hidden = false; nextBtn.focus({ preventScroll: true });
        },
      });
      slot.append(card);
      const row = h('div', { class: 'next-row', hidden: true }); row.append(nextBtn);
      const skip = h('button', { class: 'linkbtn', type: 'button', onclick: next }, 'Пропустити');
      slot.append(row, h('div', { class: 'skip-row' })); slot.lastChild.append(skip);
      typeset(slot);
    };
    next();
  }

  // ---------------- BLITZ ----------------
  function pickBlitz() {
    const autos = shuffle(BANK.filter(isAuto));
    const gens = shuffle(Object.values(window.GEN_BY_TOPIC).flat());
    const out = [];
    const usedTopics = {};
    for (const q of autos) { if (out.length >= 6) break; if ((usedTopics[q.topic] || 0) >= 1) continue; usedTopics[q.topic] = 1; out.push(Object.assign({}, q, { _resp: undefined })); }
    for (const g of gens) { if (out.length >= 10) break; const q = fromGen(g); if ((usedTopics[q.topic] || 0) >= 2) continue; usedTopics[q.topic] = (usedTopics[q.topic] || 0) + 1; out.push(q); }
    while (out.length < 10) out.push(fromGen(gens[out.length % gens.length]));
    return shuffle(out);
  }
  function viewBlitz(m) {
    const qs = pickBlitz();
    const t0 = Date.now();
    let i = 0;
    const head = h('div', { class: 'run-head' });
    const prog = h('div', { class: 'run-score' });
    head.append(h('div', {}, '<p class="eyebrow">Бліц-опитування</p><h1>10 питань підряд</h1><p class="muted small">Без підказок. Результати й пояснення — в кінці.</p>'), prog);
    const dots = h('div', { class: 'dots' }, qs.map(() => '<i></i>').join(''));
    const slot = h('div', { class: 'slot' });
    m.append(head, dots, slot);
    const clock = () => { const s = Math.floor((Date.now() - t0) / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
    S.timer = setInterval(() => { const c = $('.clock', prog); if (c) c.textContent = clock(); }, 1000);
    const show = () => {
      prog.innerHTML = `<span>Питання <b>${i + 1}</b> / 10</span><span class="clock">${clock()}</span>`;
      dots.querySelectorAll('i').forEach((d, k) => d.className = k < i ? 'done' : k === i ? 'cur' : '');
      slot.innerHTML = '';
      const q = qs[i];
      const nextBtn = h('button', { class: 'btn btn-primary', type: 'button', disabled: true }, i < 9 ? 'Далі →' : 'Завершити');
      const card = QuestionCard(q, {
        mode: 'deferred', number: (i + 1) + '/10',
        onChange: () => { const r = grade(q, q._resp); nextBtn.disabled = !!r.empty && q.type !== 'assign'; },
      });
      if (q.type === 'assign') nextBtn.disabled = false;
      nextBtn.addEventListener('click', () => { i++; if (i < 10) show(); else results(); });
      slot.append(card);
      const row = h('div', { class: 'next-row' }); row.append(nextBtn); slot.append(row);
      typeset(slot);
    };
    const results = () => {
      clearInterval(S.timer); S.timer = null;
      const res = qs.map((q) => grade(q, q._resp));
      res.forEach((r, k) => record(qs[k], r.ok));
      const ok = res.filter((r) => r.ok).length;
      m.innerHTML = '';
      m.append(h('section', { class: 'result-hero ' + (ok >= 7 ? 'good' : ok >= 5 ? 'mid' : 'bad') }, `
        <p class="eyebrow">Результат бліцу</p><div class="big">${ok}<small>/10</small></div>
        <p>${ok === 10 ? 'Ідеально.' : ok >= 7 ? 'Добре — розберіть помилки нижче.' : ok >= 5 ? 'Непогано, але є прогалини. Пояснення нижче.' : 'Варто повторити теми з помилок у режимі тренування.'} Час: ${clock()}.</p>`));
      const acts = h('div', { class: 'actions' });
      acts.append(h('button', { class: 'btn btn-primary', type: 'button', onclick: () => setView('blitz') }, 'Ще один бліц'));
      const wrongTopics = [...new Set(qs.filter((q, k) => !res[k].ok).map((q) => q.topic))];
      wrongTopics.slice(0, 3).forEach((t) => acts.append(h('button', { class: 'btn btn-ghost', type: 'button', onclick: () => setView('train-run', { topic: t }) }, 'Тренувати: ' + TOP[t].de)));
      m.append(acts);
      const list = h('div', { class: 'review' });
      qs.forEach((q, k) => {
        const card = QuestionCard(q, { mode: 'review', number: (k + 1) + '/10' });
        restoreSelection(card, q);
        card.classList.add('locked');
        showFeedback(card, q, res[k], { expand: false });
        list.append(card);
      });
      m.append(h('h2', { class: 'h2' }, 'Розбір відповідей'), list);
      typeset(m);
    };
    show();
  }
  function restoreSelection(card, q) {
    const r = q._resp;
    if (r === undefined) return;
    if (q.type === 'tf') card.querySelectorAll('.opt').forEach((b) => b.classList.toggle('sel', (+b.dataset.i === 0) === r));
    if (q.type === 'mc') card.querySelectorAll('.opt').forEach((b) => b.classList.toggle('sel', +b.dataset.i === r));
    if (q.type === 'multi') card.querySelectorAll('.opt').forEach((b, i) => b.classList.toggle('sel', r.includes(i)));
    if (q.type === 'num') card.querySelectorAll('input').forEach((f, i) => { f.value = r[i] || ''; f.disabled = true; });
    if (q.type === 'formula') { const f = card.querySelector('.field-formula'); f.value = r; f.disabled = true; }
    if (q.type === 'assign') card.querySelectorAll('.bit').forEach((b, i) => { const v = q.vars[i]; b.querySelector('b').textContent = r[v]; b.classList.toggle('on', !!r[v]); });
  }

  // ---------------- EXAM ----------------
  const pick = (arr, k) => shuffle(arr).slice(0, k).map((q) => Object.assign({}, q, { _resp: undefined }));
  const genN = (name, k, pts) => Array.from({ length: k }, () => withPts(fromGen(name), pts));
  function buildExam() {
    const A = [];
    const tfPool = BANK.filter((q) => q.type === 'tf' && q.kind !== 'wd' && !/svg/.test(q.q));
    const t10 = []; const seen = {};
    for (const q of shuffle(tfPool)) { if (t10.length >= 10) break; if ((seen[q.topic] || 0) >= 2) continue; seen[q.topic] = (seen[q.topic] || 0) + 1; t10.push(withPts(q, 1)); }
    A.push({ t: 'Wahr oder falsch?', d: 'Welche der folgenden Aussagen sind wahr, welche sind falsch? Fehlende oder falsche Antworten geben 0 Punkte.', items: t10 });
    A.push({ t: 'Injektiv / surjektiv', d: 'Kreuzen Sie in jeder Zeile die zutreffende Eigenschaft der Funktion f an.', items: pick(BANK.filter((q) => q.kind === 'func'), 4).map((q) => withPts(q, 2)).concat(genN('finiteFunc', 1, 2)) });
    A.push({ t: 'Wohldefiniertheit', d: 'Kreuzen Sie an, ob die Abbildung wohldefiniert ist (a ∈ ℤ, b ∈ ℕ∖{0}).', items: pick(BANK.filter((q) => q.kind === 'wd'), 5).map((q) => withPts(q, 1)) });
    A.push({ t: 'Relationen', d: 'Kreuzen Sie in jeder Zeile alle zutreffenden Eigenschaften der Relation R an. Eine Zeile zählt nur, wenn alle Kreuze korrekt sind.', items: pick(BANK.filter((q) => q.kind === 'rel'), 4).map((q) => withPts(q, 2)).concat(genN('relation', 1, 2)) });
    A.push({ t: 'Landau-Symbole', d: 'Tragen Sie o, ω oder Θ so ein, dass wahre Aussagen entstehen.', items: pick(BANK.filter((q) => q.kind === 'landau'), 7).map((q) => withPts(q, 1)).concat(genN('landau', 3, 1)) });
    A.push({ t: 'Mengen und Kombinatorik', d: 'Bestimmen Sie die gesuchten Anzahlen.', items: genN('setCount', 1, 2).concat(genN(Math.random() < 0.5 ? 'stars' : 'binom', 1, 3)) });
    A.push({ t: 'Induktion', d: 'Beweisen Sie die Aussage (Selbstbewertung nach Abgabe).', items: pick(BANK.filter((q) => q.topic === 'ind' && q.type === 'proof' && q.pts <= 5), 1).map((q) => withPts(q, 5)) });
    A.push({ t: 'Aussagenlogik', d: 'Vereinfachen Sie die folgenden aussagenlogischen Formeln und kreuzen Sie die richtige Antwort an.', items: pick(BANK.filter((q) => q.kind === 'simp'), 5).map((q) => withPts(q, 2)) });
    A.push({ t: 'Prädikatenlogik', d: 'Beantworten Sie die Frage zur Prädikatenlogik.', items: pick(BANK.filter((q) => q.topic === 'pl' && (q.type === 'mc' || q.type === 'multi') && (q.pts || 0) >= 2), 1).map((q) => withPts(q, 5)) });
    const algProof = pick(BANK.filter((q) => q.topic === 'gruppen' && q.type === 'proof'), 1).map((q) => withPts(q, 6));
    const algTF = pick(BANK.filter((q) => (q.topic === 'gruppen' || q.topic === 'ringe') && (q.type === 'tf' || q.type === 'mc' || q.type === 'multi')), 2).map((q) => withPts(q, 2));
    A.push({ t: 'Gruppen und Ringe', d: 'Beweisen bzw. beantworten Sie.', items: algTF.concat(algProof) });
    A.push({ t: 'Erweiterter euklidischer Algorithmus', d: 'Bestimmen Sie die gesuchten Zahlen.', items: genN('extEuclid', 1, 5) });
    A.push({ t: 'Modulare Arithmetik', d: 'Lösen Sie die folgenden Aufgaben (ohne Taschenrechner).', items: genN('crt', 1, 5).concat(genN('inverse', 1, 5)) });
    const gStatic = pick(BANK.filter((q) => q.topic === 'graph' && q.type === 'tf'), 1).map((q) => withPts(q, 2));
    A.push({ t: 'Graphentheorie', d: 'Beantworten Sie die Fragen zu Graphen.', items: gStatic.concat(genN('eulerFormula', 1, 3)) });
    return A;
  }
  function viewExamSetup(m) {
    m.append(h('div', { class: 'page-head' }, `<p class="eyebrow">Режим іспиту</p><h1>Modulprüfung — пробний варіант</h1>
      <p class="muted">Структура повторює іспити Frühjahr і Herbst 2026: 13 Aufgaben, 100 Punkte, ≥ 50 — bestanden. Кожен запуск — новий варіант (частина задач генерується).</p>`));
    const box = h('section', { class: 'panel exam-setup' });
    box.append(h('div', { class: 'rules' }, `<ul>
      <li><b>Zugelassene Hilfsmittel: keine</b> — як на справжньому іспиті, без калькулятора.</li>
      <li>Таблиці з хрестиками (Wahr/Falsch, Abbildungen, Relationen, Landau, Formeln) оцінюються автоматично.</li>
      <li>Доведення (Induktion, Gruppen) після здачі порівнюєте зі зразком і оцінюєте себе самі.</li>
      <li>Після завершення часу іспит здається автоматично.</li></ul>`));
    const sel = h('label', { class: 'inp' }, '<span class="inp-label">Тривалість</span>');
    const s = h('select', { class: 'field' }, '<option value="120" selected>120 хв (як на іспиті)</option><option value="90">90 хв</option><option value="60">60 хв</option><option value="30">30 хв (швидкий прогін)</option>');
    sel.append(s); box.append(sel);
    box.append(h('button', { class: 'btn btn-primary btn-lg', type: 'button', onclick: () => setView('exam-run', { minutes: +s.value }) }, 'Почати іспит'));
    m.append(box);
    const t = h('section', { class: 'panel' }, '<h2 class="h2">Структура варіанту</h2>');
    const tbl = [['1', 'Wahr oder falsch (10 тверджень)', 10], ['2', 'Injektiv / surjektiv / bijektiv', 10], ['3', 'Wohldefiniertheit', 5], ['4', 'Relationen', 10], ['5', 'Landau-Symbole', 10], ['6', 'Mengen & Kombinatorik', 5], ['7', 'Induktion (Beweis)', 5], ['8', 'Aussagenlogik vereinfachen', 10], ['9', 'Prädikatenlogik', 5], ['10', 'Gruppen & Ringe', 10], ['11', 'Erweiterter Euklid', 5], ['12', 'CRT & Inverses', 10], ['13', 'Graphentheorie', 5]];
    t.append(h('table', { class: 'tbl' }, '<thead><tr><th>Aufgabe</th><th>Thema</th><th>Punkte</th></tr></thead><tbody>' + tbl.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('') + '<tr class="sum"><td></td><td>Summe</td><td>100</td></tr></tbody>'));
    m.append(t);
  }
  function viewExamRun(m, arg) {
    const A = buildExam();
    const end = Date.now() + arg.minutes * 60000;
    const items = A.flatMap((a) => a.items);
    const bar = h('div', { class: 'exam-bar' });
    const tm = h('span', { class: 'timer' });
    const cnt = h('span', { class: 'cnt' });
    const submit = h('button', { class: 'btn btn-primary btn-sm', type: 'button' }, 'Здати іспит');
    bar.append(h('span', { class: 'exam-title' }, 'Modulprüfung LDS'), cnt, tm, submit);
    m.append(bar);
    const jump = h('nav', { class: 'jump', 'aria-label': 'Aufgaben' });
    A.forEach((a, k) => jump.append(h('a', { href: '#', onclick: (e) => { e.preventDefault(); document.getElementById('aufg-' + k).scrollIntoView({ behavior: 'smooth', block: 'start' }); } }, String(k + 1))));
    m.append(jump);
    const answered = () => items.filter((q) => q.type === 'proof' || q.type === 'assign' ? false : !grade(q, q._resp).empty).length;
    const autoCount = items.filter((q) => q.type !== 'proof').length;
    const upd = () => { cnt.textContent = `відповіді: ${answered()} / ${autoCount}`; };
    A.forEach((a, k) => {
      const sec = h('section', { class: 'aufgabe', id: 'aufg-' + k });
      const pts = a.items.reduce((s, q) => s + q.pts, 0);
      sec.append(h('header', { class: 'aufg-head' }, `<h2>Aufgabe ${k + 1}<span>${a.t}</span></h2><span class="aufg-pts">${pts} Punkte</span>`));
      sec.append(h('p', { class: 'aufg-desc' }, a.d));
      a.items.forEach((q, j) => sec.append(QuestionCard(q, { mode: 'deferred', number: `${k + 1}.${j + 1}`, onChange: upd })));
      m.append(sec);
    });
    const tick = () => {
      const left = Math.max(0, end - Date.now());
      const mm = Math.floor(left / 60000), ss = Math.floor((left % 60000) / 1000);
      tm.textContent = `${mm}:${String(ss).padStart(2, '0')}`;
      tm.classList.toggle('warn', left < 10 * 60000);
      if (left <= 0) { finishExam(true); }
    };
    S.timer = setInterval(tick, 1000); tick(); upd();
    const t0 = Date.now();
    let done = false;
    function finishExam(auto) {
      if (done) return;
      if (!auto) {
        const missing = autoCount - answered();
        if (!confirm(missing ? `Без відповіді залишилось ${missing} пункт(ів). Здати іспит?` : 'Здати іспит?')) return;
      }
      done = true; clearInterval(S.timer); S.timer = null;
      examResults(m, A, Math.round((Date.now() - t0) / 60000), auto);
    }
    submit.addEventListener('click', () => finishExam(false));
    S.view = 'exam-run';
  }
  const NOTE = (p) => (p >= 95 ? '1,0' : p >= 90 ? '1,3' : p >= 85 ? '1,7' : p >= 80 ? '2,0' : p >= 75 ? '2,3' : p >= 70 ? '2,7' : p >= 65 ? '3,0' : p >= 60 ? '3,3' : p >= 55 ? '3,7' : p >= 50 ? '4,0' : '5,0');
  function examResults(m, A, minutes, auto) {
    m.innerHTML = ''; window.scrollTo(0, 0);
    S.view = 'exam-done';
    const all = A.flatMap((a, k) => a.items.map((q) => ({ q, k })));
    const res = new Map(all.map(({ q }) => [q, q.type === 'proof' ? { ok: false, score: 0, proof: true } : grade(q, q._resp)]));
    all.forEach(({ q }) => { if (q.type !== 'proof') record(q, res.get(q).ok); });
    const hero = h('section', { class: 'result-hero' });
    const table = h('table', { class: 'tbl' });
    const render = () => {
      let total = 0;
      const rows = A.map((a, k) => {
        const max = a.items.reduce((s, q) => s + q.pts, 0);
        const got = a.items.reduce((s, q) => { const r = res.get(q); return s + (r.proof ? q.pts * (r.score || 0) : r.ok ? q.pts : 0); }, 0);
        total += got;
        return `<tr><td>${k + 1}</td><td>${a.t}</td><td>${fmt(got)} / ${max}</td></tr>`;
      });
      const pass = total >= 50;
      hero.className = 'result-hero ' + (pass ? 'good' : 'bad');
      hero.innerHTML = `<p class="eyebrow">${auto ? 'Час вичерпано — іспит здано автоматично' : 'Іспит здано'} · ${minutes} хв</p>
        <div class="big">${fmt(total)}<small>/100</small></div>
        <p class="verdict">${pass ? 'Bestanden' : 'Nicht bestanden'} · орієнтовна оцінка <b>${NOTE(total)}</b></p>
        <p class="muted small">Шкала орієнтовна (≥ 50 балів — bestanden, як на іспитах 2026). Оцініть доведення нижче — бали оновляться.</p>`;
      table.innerHTML = '<thead><tr><th>Aufgabe</th><th>Thema</th><th>Punkte</th></tr></thead><tbody>' + rows.join('') + `<tr class="sum"><td></td><td>Summe</td><td>${fmt(total)} / 100</td></tr></tbody>`;
    };
    const fmt = (x) => (Math.round(x * 2) / 2).toString().replace('.', ',');
    render();
    m.append(hero);
    const acts = h('div', { class: 'actions' });
    acts.append(h('button', { class: 'btn btn-primary', type: 'button', onclick: () => setView('exam') }, 'Новий варіант'));
    acts.append(h('button', { class: 'btn btn-ghost', type: 'button', onclick: () => setView('train') }, 'До тренування'));
    m.append(acts);
    const tp = h('section', { class: 'panel' }, '<h2 class="h2">Бали за задачами</h2>'); tp.append(table); m.append(tp);
    m.append(h('h2', { class: 'h2' }, 'Розбір усіх задач'));
    A.forEach((a, k) => {
      const sec = h('section', { class: 'aufgabe' });
      sec.append(h('header', { class: 'aufg-head' }, `<h2>Aufgabe ${k + 1}<span>${a.t}</span></h2>`));
      a.items.forEach((q, j) => {
        const card = QuestionCard(q, { mode: 'review', number: `${k + 1}.${j + 1}` });
        card.classList.add('locked');
        if (q.type === 'proof') {
          const fb = $('.feedback', card); fb.hidden = false; fb.className = 'feedback neutral';
          $('.qarea', card).querySelector('.hint')?.remove();
          fb.append(proofBlock(q, (sc) => { res.get(q).score = sc; render(); }));
        } else {
          restoreSelection(card, q);
          showFeedback(card, q, res.get(q));
        }
        sec.append(card);
      });
      m.append(sec);
    });
    typeset(m);
  }

  // ---------------- THEORY ----------------
  function viewTheory(m, topicId) {
    m.append(h('div', { class: 'page-head' }, '<h1>Теорія — шпаргалки</h1><p class="muted">Ключові означення й теореми (німецькі терміни — як на іспиті). Повний матеріал — у Skript LDS і конспекті Kufleitner.</p>'));
    const wrap = h('div', { class: 'theory' });
    const list = h('nav', { class: 'theory-list' });
    const body = h('article', { class: 'theory-body panel' });
    const show = (id) => {
      const t = TOP[id];
      list.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.id === id));
      body.innerHTML = `<p class="eyebrow">${t.ua}</p><h2 class="h2">${t.de}</h2>` + t.cheat;
      body.append(h('button', { class: 'btn btn-primary', type: 'button', onclick: () => setView('train-run', { topic: id }) }, 'Тренувати цю тему →'));
      typeset(body);
    };
    window.TOPICS.forEach((t) => list.append(h('button', { type: 'button', 'data-id': t.id, onclick: () => show(t.id) }, `${t.de}<small>${t.ua}</small>`)));
    wrap.append(list, body);
    m.append(wrap);
    show(topicId || window.TOPICS[0].id);
  }

  // ---------------- ANALYSIS ----------------
  function viewAnalysis(m) {
    const E = window.EXAM_ANALYSIS;
    m.append(h('div', { class: 'page-head' }, `<p class="eyebrow">Аналіз іспитів 2015–2026</p><h1>Що буде на іспиті?</h1>
      <p class="muted">Проаналізовано 16 варіантів з архіву: 12 старих іспитів (2015–2020, по 60 балів), 2 Scheinklausuren WS 25/26 та обидві Modulprüfungen 2026 (Frühjahr, Herbst — по 100 балів, 120 хв). Формат 2026 майже ідентичний між собою — найкращий орієнтир для наступного іспиту.</p>`));
    const p1 = h('section', { class: 'panel' }, '<h2 class="h2">Типи задач і бали</h2>');
    p1.append(h('div', { class: 'tbl-wrap' }, '<table class="tbl tbl-analysis"><thead><tr><th>Тип задачі</th><th>Herbst 2026</th><th>Frühjahr 2026</th><th>Schein 1</th><th>Schein 2</th><th>2015–2020</th></tr></thead><tbody>' +
      E.structure.map((r) => '<tr>' + r.map((c, i) => `<td${i && c === '—' ? ' class="dim"' : ''}>${c}</td>`).join('') + '</tr>').join('') + '</tbody></table>'));
    m.append(p1);
    const p2 = h('section', { class: 'panel' }, '<h2 class="h2">Прогноз на наступний іспит</h2>');
    const pl = h('div', { class: 'pred' });
    E.predictions.forEach(([k, v], i) => pl.append(h('div', { class: 'pred-row lvl' + i }, `<span class="pred-k">${k}</span><span>${v}</span>`)));
    p2.append(pl); m.append(p2);
    const p3 = h('section', { class: 'panel' }, '<h2 class="h2">Стратегія</h2><ul class="tips">' + E.tips.map((t) => `<li>${t}</li>`).join('') + '</ul>');
    m.append(p3);
    m.append(h('section', { class: 'panel small muted' }, `<h2 class="h2">Джерела</h2><p>Іспити та листки з архіву (Materiali.zip): LDS-2015-SS … LDS-2020-WS, LDS-2025-26-WS-Scheinklausur-1/2, LDS-2026-fruehjahr-prf, LDS-2026-herbst-prf, Ergänzung 01–14, Tutoriumsblatt 4, Skript_LDS (Schweiner), text (Kufleitner, Stand 6.02.2026). LDS входить до Orientierungsprüfung (6 LP) — <a href="https://www.uni-stuttgart.de/universitaet/aktuelles/bekanntmachungen/Amtliche-Bekanntmachung-Nummer-26-2025/" target="_blank" rel="noopener">Amtliche Bekanntmachung 26/2025, Uni Stuttgart</a>.</p>`));
  }

  // ---------------- boot ----------------
  function boot() {
    buildNav();
    setView('home');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.__LDS = { grade, BANK, buildExam };
})();
