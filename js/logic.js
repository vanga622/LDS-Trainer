/* Propositional logic engine: parse, evaluate, compare, normal-form checks */
(function () {
  const L = {};

  function tokenize(src) {
    const s = src.replace(/\s+/g, ' ').trim();
    const t = [];
    let i = 0;
    const rules = [
      [/^(<->|<=>|↔|⇔)/, 'IFF'],
      [/^(->|=>|→|⇒)/, 'IMP'],
      [/^(¬|!|~|-|not\b|NOT\b|nicht\b)/, 'NOT'],
      [/^(∧|&&|&|\*|and\b|AND\b|und\b)/, 'AND'],
      [/^(∨|\|\||\||\+|or\b|OR\b|oder\b)/, 'OR'],
      [/^\(/, 'LP'],
      [/^\)/, 'RP'],
      [/^[01⊤⊥]/, 'CONST'],
      [/^[A-Za-z][0-9]*/, 'VAR'],
    ];
    while (i < s.length) {
      if (s[i] === ' ') { i++; continue; }
      const rest = s.slice(i);
      let m = null, type = null;
      for (const [re, ty] of rules) {
        m = rest.match(re);
        if (m) { type = ty; break; }
      }
      if (!m) throw new Error('Невідомий символ: «' + rest[0] + '»');
      let v = m[0];
      if (type === 'VAR') v = v.toUpperCase();
      if (type === 'CONST') v = (v === '1' || v === '⊤') ? 1 : 0;
      t.push({ type, v });
      i += m[0].length;
    }
    return t;
  }

  // precedence: NOT > AND > OR > IMP (right) > IFF (left)
  function parse(src) {
    const toks = tokenize(src);
    let p = 0;
    const peek = () => toks[p];
    const eat = (ty) => {
      const tk = toks[p];
      if (!tk || tk.type !== ty) throw new Error('Очікувалось ' + ({ RP: '«)»' }[ty] || ty));
      p++; return tk;
    };
    function iff() {
      let l = imp();
      while (peek() && peek().type === 'IFF') { p++; l = { op: 'iff', a: l, b: imp() }; }
      return l;
    }
    function imp() {
      const l = or();
      if (peek() && peek().type === 'IMP') { p++; return { op: 'imp', a: l, b: imp() }; }
      return l;
    }
    function or() {
      let l = and();
      while (peek() && peek().type === 'OR') { p++; l = { op: 'or', a: l, b: and() }; }
      return l;
    }
    function and() {
      let l = un();
      while (peek() && peek().type === 'AND') { p++; l = { op: 'and', a: l, b: un() }; }
      return l;
    }
    function un() {
      const tk = peek();
      if (!tk) throw new Error('Формула обривається');
      if (tk.type === 'NOT') { p++; return { op: 'not', a: un() }; }
      if (tk.type === 'LP') { p++; const e = iff(); eat('RP'); return e; }
      if (tk.type === 'VAR') { p++; return { op: 'var', v: tk.v }; }
      if (tk.type === 'CONST') { p++; return { op: 'const', v: tk.v }; }
      throw new Error('Неочікуваний символ');
    }
    if (!toks.length) throw new Error('Порожня формула');
    const e = iff();
    if (p < toks.length) throw new Error('Зайві символи наприкінці');
    return e;
  }

  function ev(n, env) {
    switch (n.op) {
      case 'var': return env[n.v] ? 1 : 0;
      case 'const': return n.v;
      case 'not': return 1 - ev(n.a, env);
      case 'and': return ev(n.a, env) & ev(n.b, env);
      case 'or': return ev(n.a, env) | ev(n.b, env);
      case 'imp': return (1 - ev(n.a, env)) | ev(n.b, env);
      case 'iff': return ev(n.a, env) === ev(n.b, env) ? 1 : 0;
    }
  }

  function vars(n, set = new Set()) {
    if (n.op === 'var') set.add(n.v);
    if (n.a) vars(n.a, set);
    if (n.b) vars(n.b, set);
    return set;
  }

  function allEnvs(vs) {
    const out = [];
    const k = vs.length;
    for (let m = 0; m < (1 << k); m++) {
      const env = {};
      vs.forEach((v, i) => { env[v] = (m >> (k - 1 - i)) & 1; });
      out.push(env);
    }
    return out;
  }

  const P = (f) => (typeof f === 'string' ? parse(f) : f);

  L.parse = parse;
  L.eval = (f, env) => ev(P(f), env);
  L.vars = (f) => [...vars(P(f))].sort();
  L.allEnvs = allEnvs;

  L.equiv = function (f, g) {
    f = P(f); g = P(g);
    const vs = [...new Set([...vars(f), ...vars(g)])].sort();
    return allEnvs(vs).every((e) => ev(f, e) === ev(g, e));
  };
  L.counterexample = function (f, g) {
    f = P(f); g = P(g);
    const vs = [...new Set([...vars(f), ...vars(g)])].sort();
    return allEnvs(vs).find((e) => ev(f, e) !== ev(g, e)) || null;
  };
  L.classify = function (f) {
    f = P(f);
    const vs = [...vars(f)].sort();
    const vals = allEnvs(vs).map((e) => ev(f, e));
    if (vals.every((x) => x)) return 'valid';
    if (vals.every((x) => !x)) return 'unsat';
    return 'sat';
  };
  L.models = function (f) {
    f = P(f);
    const vs = [...vars(f)].sort();
    return allEnvs(vs).filter((e) => ev(f, e));
  };
  L.truthTable = function (f, extraVars) {
    f = P(f);
    const vs = [...new Set([...vars(f), ...(extraVars || [])])].sort();
    return { vars: vs, rows: allEnvs(vs).map((e) => ({ env: e, val: ev(f, e) })) };
  };

  // ---- normal form checks ----
  const isLit = (n) => n.op === 'var' || n.op === 'const' || (n.op === 'not' && (n.a.op === 'var' || n.a.op === 'const'));
  function flat(n, op) { return n.op === op ? [...flat(n.a, op), ...flat(n.b, op)] : [n]; }
  L.isKNF = function (f) {
    f = P(f);
    return flat(f, 'and').every((c) => flat(c, 'or').every(isLit));
  };
  L.isDNF = function (f) {
    f = P(f);
    return flat(f, 'or').every((c) => flat(c, 'and').every(isLit));
  };
  L.isHorn = function (f) {
    f = P(f);
    if (!L.isKNF(f)) return false;
    return flat(f, 'and').every((c) => flat(c, 'or').filter((l) => l.op === 'var').length <= 1);
  };

  // ---- printing ----
  const BIN = { and: ' ∧ ', or: ' ∨ ', imp: ' → ', iff: ' ↔ ' };
  function show(n) {
    if (n.op === 'var') return n.v;
    if (n.op === 'const') return String(n.v);
    if (n.op === 'not') return '¬' + (BIN[n.a.op] ? '(' + show(n.a) + ')' : show(n.a));
    const sub = (c) => {
      const s = show(c);
      if (!BIN[c.op]) return s;
      if (c.op === n.op && (n.op === 'and' || n.op === 'or')) return s;
      return '(' + s + ')';
    };
    return sub(n.a) + BIN[n.op] + sub(n.b);
  }
  L.show = (f) => show(P(f));
  L.pretty = function (src) {
    // pretty-print source without re-structuring: just swap ascii symbols
    return src
      .replace(/<->/g, '↔').replace(/->/g, '→')
      .replace(/!/g, '¬').replace(/&/g, '∧').replace(/\|/g, '∨');
  };

  // ---- random formula generation ----
  L.randomFormula = function (rng, vs, depth) {
    function gen(d) {
      if (d <= 0 || rng() < 0.18) {
        const v = { op: 'var', v: vs[Math.floor(rng() * vs.length)] };
        return rng() < 0.35 ? { op: 'not', a: v } : v;
      }
      const r = rng();
      if (r < 0.12) return { op: 'not', a: gen(d - 1) };
      const op = r < 0.4 ? 'and' : r < 0.68 ? 'or' : r < 0.88 ? 'imp' : 'iff';
      return { op, a: gen(d - 1), b: gen(d - 1) };
    }
    return gen(depth);
  };

  // canonical DNF / KNF strings from truth table
  L.canonicalDNF = function (f, vsOverride) {
    f = P(f);
    const vs = vsOverride || [...vars(f)].sort();
    const ms = allEnvs(vs).filter((e) => ev(f, e));
    if (!ms.length) return '0';
    return ms.map((e) => '(' + vs.map((v) => (e[v] ? v : '¬' + v)).join(' ∧ ') + ')').join(' ∨ ');
  };
  L.canonicalKNF = function (f, vsOverride) {
    f = P(f);
    const vs = vsOverride || [...vars(f)].sort();
    const ms = allEnvs(vs).filter((e) => !ev(f, e));
    if (!ms.length) return '1';
    return ms.map((e) => '(' + vs.map((v) => (e[v] ? '¬' + v : v)).join(' ∨ ') + ')').join(' ∧ ');
  };

  window.Logic = L;
})();
