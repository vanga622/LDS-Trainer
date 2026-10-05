/* Parametric task generators — every call creates a fresh, automatically checked task */
(function () {
  const R = String.raw;
  const rnd = Math.random;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const mod = (a, n) => ((a % n) + n) % n;
  const isPrime = (n) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  const phi = (n) => { let r = n, m = n; for (let p = 2; p * p <= m; p++) if (m % p === 0) { while (m % p === 0) m /= p; r -= r / p; } if (m > 1) r -= r / m; return r; };
  const binom = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };
  const powmod = (b, e, n) => { let r = 1 % n; b = mod(b, n); while (e > 0) { if (e & 1) r = (r * b) % n; b = (b * b) % n; e >>= 1; } return r; };
  const int = (s) => { const t = String(s).replace(/\s|\u2212/g, (c) => (c === '\u2212' ? '-' : '')); return /^-?\d+$/.test(t) ? parseInt(t, 10) : NaN; };

  // Extended Euclid with a step table
  function extEuclid(a, b) {
    const rows = [];
    let r0 = a, r1 = b, s0 = 1, s1 = 0, t0 = 0, t1 = 1;
    rows.push({ r: r0, q: '', s: s0, t: t0 });
    while (r1 !== 0) {
      const q = Math.floor(r0 / r1);
      rows[rows.length - 1].q = q;
      rows.push({ r: r1, q: '', s: s1, t: t1 });
      [r0, r1] = [r1, r0 - q * r1];
      [s0, s1] = [s1, s0 - q * s1];
      [t0, t1] = [t1, t0 - q * t1];
    }
    return { g: r0, s: s0, t: t0, rows };
  }
  function euclidTable(a, b) {
    const E = extEuclid(a, b);
    let h = '<table class="mini"><thead><tr><th>r</th><th>q</th><th>s</th><th>t</th><th>перевірка: s·' + a + ' + t·' + b + '</th></tr></thead><tbody>';
    E.rows.forEach((x) => { h += `<tr><td>${x.r}</td><td>${x.q}</td><td>${x.s}</td><td>${x.t}</td><td>${x.s}·${a} + ${x.t}·${b} = ${x.s * a + x.t * b}</td></tr>`; });
    h += '</tbody></table>';
    return { E, html: h };
  }
  function divSteps(a, b) {
    const out = [];
    while (b) { const q = Math.floor(a / b), r = a % b; out.push(`${a} = ${q}·${b} + ${r}`); [a, b] = [b, r]; }
    return out;
  }

  const G = {};

  // ---------- Modulare Arithmetik ----------
  G.inverse = () => {
    let n, a;
    do { n = ri(11, 60); a = ri(2, n - 1); } while (gcd(a, n) !== 1);
    const { E, html } = euclidTable(n, a);
    const inv = mod(E.t, n);
    return {
      topic: 'mod', type: 'num', gen: 'inverse', pts: 5,
      q: R`Bestimmen Sie das multiplikative Inverse von $${a} + ${n}\mathbb{Z}$ in $\mathbb{Z}/${n}\mathbb{Z}$ (Repräsentant aus $\{0,\dots,${n - 1}\}$).`,
      inputs: [{ label: R`$x =$` }],
      check: (v) => { const x = int(v[0]); return !isNaN(x) && mod(a * x, n) === 1; },
      solution: String(inv),
      expl: `Шукаємо x з ${a}·x ≡ 1 (mod ${n}). Розширений алгоритм Евкліда для (${n}, ${a}):` + html +
        `Останній рядок з r = 1 дає ${E.s}·${n} + ${E.t}·${a} = 1. Отже ${a}·(${E.t}) ≡ 1 (mod ${n}), тобто x ≡ ${E.t} ≡ <b>${inv}</b> (mod ${n}). Перевірка: ${a}·${inv} = ${a * inv} = ${Math.floor(a * inv / n)}·${n} + 1.`,
    };
  };

  G.extEuclid = () => {
    let a, b;
    do { a = ri(5, 99); b = ri(5, 99); } while (gcd(a, b) !== 1 || a === b);
    const { E, html } = euclidTable(a, b);
    // a*s + b*t = 1 -> a*k - b*l = 1 with k = s mod b, l = (a*k-1)/b
    const k = mod(E.s, b), l = (a * k - 1) / b;
    return {
      topic: 'mod', type: 'num', gen: 'exteuclid', pts: 5,
      q: R`Bestimmen Sie mit dem erweiterten euklidischen Algorithmus zwei Zahlen $k, \ell \in \mathbb{N}$, sodass $${a}k - ${b}\ell = 1$.`,
      inputs: [{ label: R`$k =$` }, { label: R`$\ell =$` }],
      check: (v) => { const x = int(v[0]), y = int(v[1]); return x >= 0 && y >= 0 && a * x - b * y === 1; },
      solution: `k = ${k}, ℓ = ${l}`,
      expl: `Ділення з остачею: ${divSteps(a, b).join('; ')}. Таблиця розширеного Евкліда:` + html +
        `Отримали ${a}·(${E.s}) + ${b}·(${E.t}) = 1. Потрібно ${a}k − ${b}ℓ = 1 з k, ℓ ≥ 0: беремо k = ${E.s} mod ${b} = <b>${k}</b>, тоді ℓ = (${a}·${k} − 1)/${b} = <b>${l}</b>. (Будь-яка пара k + ${b}t, ℓ + ${a}t теж правильна.)`,
    };
  };

  G.gcd = () => {
    const g = ri(2, 15), a = g * ri(5, 30), b = g * ri(5, 30);
    const steps = divSteps(Math.max(a, b), Math.min(a, b));
    const res = gcd(a, b);
    return {
      topic: 'mod', type: 'num', gen: 'gcd', pts: 2,
      q: R`Berechnen Sie $\operatorname{ggT}(${a}, ${b})$ mit dem euklidischen Algorithmus.`,
      inputs: [{ label: 'ggT =' }],
      check: (v) => int(v[0]) === res, solution: String(res),
      expl: `Ділимо з остачею, поки остача не стане 0: ${steps.join('; ')}. Остання ненульова остача — це ggT = <b>${res}</b>.`,
    };
  };

  G.crt = () => {
    let m1, m2;
    do { m1 = ri(3, 13); m2 = ri(3, 13); } while (gcd(m1, m2) !== 1 || m1 === m2);
    const r1 = ri(0, m1 - 1), r2 = ri(0, m2 - 1), M = m1 * m2;
    const E = extEuclid(m1, m2); // s*m1 + t*m2 = 1
    const e1 = mod(E.t * m2, M), e2 = mod(E.s * m1, M);
    const x = mod(r1 * e1 + r2 * e2, M);
    return {
      topic: 'mod', type: 'num', gen: 'crt', pts: 5,
      q: R`Geben Sie für das folgende System eine Lösung $x \in \mathbb{Z}$ an:<br>$x \equiv ${r1} \bmod ${m1}$<br>$x \equiv ${r2} \bmod ${m2}$`,
      inputs: [{ label: R`$x =$` }],
      check: (v) => { const y = int(v[0]); return !isNaN(y) && mod(y - r1, m1) === 0 && mod(y - r2, m2) === 0; },
      solution: `x = ${x} (усі розв'язки: ${x} + ${M}ℤ)`,
      expl: `ggT(${m1}, ${m2}) = 1, тож за китайською теоремою про остачі (Chinesischer Restsatz) є рівно один розв'язок mod ${M}. Евклід: ${E.s}·${m1} + ${E.t}·${m2} = 1. ` +
        `Тоді e₁ = ${E.t}·${m2} ≡ ${e1} (≡1 mod ${m1}, ≡0 mod ${m2}) і e₂ = ${E.s}·${m1} ≡ ${e2} (≡0 mod ${m1}, ≡1 mod ${m2}). ` +
        `x = ${r1}·${e1} + ${r2}·${e2} ≡ <b>${x}</b> (mod ${M}). Перевірка: ${x} mod ${m1} = ${x % m1}, ${x} mod ${m2} = ${x % m2}. Швидкий спосіб: перебрати ${r2}, ${r2 + m2}, ${r2 + 2 * m2}, … і знайти число з остачею ${r1} mod ${m1}.`,
    };
  };

  G.powmod = () => {
    const p = pick([5, 7, 11, 13, 17]);
    let a; do { a = ri(2, 30); } while (a % p === 0);
    const e = ri(40, 999);
    const red = e % (p - 1), res = powmod(a, e, p);
    return {
      topic: 'mod', type: 'num', gen: 'powmod', pts: 3,
      q: R`Berechnen Sie $${a}^{${e}} \bmod ${p}$ (Ergebnis aus $\{0,\dots,${p - 1}\}$).`,
      inputs: [{ label: 'Rest =' }],
      check: (v) => int(v[0]) === res, solution: String(res),
      expl: `${p} — просте, і ${p} ∤ ${a}, тому за малою теоремою Ферма ${a}^${p - 1} ≡ 1 (mod ${p}). ${e} = ${Math.floor(e / (p - 1))}·${p - 1} + ${red}, отже ${a}^${e} ≡ ${a}^${red} ≡ ${mod(a, p)}^${red} ≡ <b>${res}</b> (mod ${p}).`,
    };
  };

  G.phi = () => {
    const n = pick([12, 15, 18, 20, 21, 24, 28, 30, 33, 35, 36, 40, 42, 45, 49, 50, 55, 60, 63, 77, 81, 91, 100]);
    const f = []; let m = n; for (let p = 2; p * p <= m; p++) if (m % p === 0) { let k = 0; while (m % p === 0) { m /= p; k++; } f.push([p, k]); } if (m > 1) f.push([m, 1]);
    const res = phi(n);
    return {
      topic: 'mod', type: 'num', gen: 'phi', pts: 2,
      q: R`Wie viele Einheiten hat $\mathbb{Z}/${n}\mathbb{Z}$? D.h. berechnen Sie $|(\mathbb{Z}/${n}\mathbb{Z})^*| = \varphi(${n})$.`,
      inputs: [{ label: 'φ =' }],
      check: (v) => int(v[0]) === res, solution: String(res),
      expl: `Оборотні класи — це ті k, для яких ggT(k, ${n}) = 1. ${n} = ${f.map(([p, k]) => p + (k > 1 ? '^' + k : '')).join('·')}. φ мультиплікативна: φ(p^k) = p^k − p^(k−1). Отже φ(${n}) = ${f.map(([p, k]) => `(${p ** k}−${p ** (k - 1)})`).join('·')} = <b>${res}</b>.`,
    };
  };

  G.rsa = () => {
    const [p, q] = pick([[3, 11], [5, 11], [3, 17], [5, 7], [5, 13], [7, 11], [3, 13], [5, 17]]);
    const n = p * q, ph = (p - 1) * (q - 1);
    let e; do { e = pick([3, 5, 7, 11, 13, 17]); } while (gcd(e, ph) !== 1 || e >= ph);
    const s = mod(extEuclid(ph, e).t, ph);
    return {
      topic: 'mod', type: 'num', gen: 'rsa', pts: 5,
      q: R`Für das RSA-Verfahren wurde der öffentliche Schlüssel $(n, e) = (${n}, ${e})$ gewählt. Berechnen Sie den geheimen Schlüssel $s$ mit $0 < s < \varphi(n)$.`,
      inputs: [{ label: R`$s =$` }],
      check: (v) => { const x = int(v[0]); return x > 0 && x < ph && mod(x * e, ph) === 1; },
      solution: String(s),
      expl: `Спершу розкладаємо n = ${n} = ${p}·${q}, тоді φ(n) = (${p}−1)(${q}−1) = ${ph}. Секретний ключ s — обернений до e за модулем φ(n): ${e}·s ≡ 1 (mod ${ph}). Розширений Евклід дає s = <b>${s}</b>. Перевірка: ${e}·${s} = ${e * s} = ${Math.floor(e * s / ph)}·${ph} + 1.`,
    };
  };

  G.rsaEnc = () => {
    const [p, q] = pick([[3, 11], [5, 11], [5, 7], [3, 7], [3, 5]]);
    const n = p * q, ph = (p - 1) * (q - 1);
    let e; do { e = pick([3, 5, 7]); } while (gcd(e, ph) !== 1);
    const x = ri(2, n - 2), y = powmod(x, e, n);
    const steps = []; let acc = 1; for (let i = 1; i <= e; i++) { acc = (acc * x) % n; steps.push(`${x}^${i} ≡ ${acc}`); }
    return {
      topic: 'mod', type: 'num', gen: 'rsaenc', pts: 3,
      q: R`RSA mit öffentlichem Schlüssel $(n, e) = (${n}, ${e})$. Verschlüsseln Sie $x = ${x}$, d.h. berechnen Sie $x^e \bmod n$.`,
      inputs: [{ label: 'Chiffre =' }],
      check: (v) => int(v[0]) === y, solution: String(y),
      expl: `Шифрування: y = x^e mod n. Рахуємо послідовно, щоразу беручи остачу mod ${n}: ${steps.join(', ')}. Отже шифр = <b>${y}</b>.`,
    };
  };

  G.linCong = () => {
    const n = pick([12, 14, 15, 18, 20, 21, 24, 28, 30]);
    const a = ri(2, n - 1), b = ri(1, n - 1), d = gcd(a, n);
    const cnt = b % d === 0 ? d : 0;
    return {
      topic: 'mod', type: 'num', gen: 'lincong', pts: 3,
      q: R`Wie viele Lösungen $x \in \{0, \dots, ${n - 1}\}$ hat die Kongruenz $${a}x \equiv ${b} \bmod ${n}$?`,
      inputs: [{ label: 'Anzahl =' }],
      check: (v) => int(v[0]) === cnt, solution: String(cnt),
      expl: `Правило з лекції: ax ≡ b (mod n) має розв'язок ⇔ ggT(a, n) | b. Тут ggT(${a}, ${n}) = ${d}. ` +
        (cnt ? `${d} ділить ${b}, тому розв'язок є, а в межах {0,…,${n - 1}} їх рівно d = <b>${d}</b> (вони повторюються з кроком ${n / d}).` : `${d} не ділить ${b}, тому розв'язків <b>0</b> (L = ∅).`),
    };
  };

  // ---------- Relationen ----------
  const PROPS = ['reflexiv', 'irreflexiv', 'symmetrisch', 'antisymmetrisch', 'transitiv'];
  function relProps(M, R_) {
    const has = (a, b) => R_.some(([x, y]) => x === a && y === b);
    const why = {};
    const refl = M.every((a) => has(a, a)); why.reflexiv = refl ? 'для кожного a є (a,a)' : `бракує (${M.find((a) => !has(a, a))},${M.find((a) => !has(a, a))})`;
    const irr = M.every((a) => !has(a, a)); why.irreflexiv = irr ? 'жодної пари (a,a)' : `є пара (${M.find((a) => has(a, a))},${M.find((a) => has(a, a))})`;
    const sb = R_.find(([a, b]) => !has(b, a)); const sym = !sb; why.symmetrisch = sym ? 'до кожної (a,b) є (b,a)' : `є (${sb[0]},${sb[1]}), але немає (${sb[1]},${sb[0]})`;
    const ab = R_.find(([a, b]) => a !== b && has(b, a)); const anti = !ab; why.antisymmetrisch = anti ? 'немає пар (a,b),(b,a) з a≠b' : `є і (${ab[0]},${ab[1]}), і (${ab[1]},${ab[0]})`;
    let tb = null; for (const [a, b] of R_) for (const [c, d] of R_) if (b === c && !has(a, d) && !tb) tb = [a, b, d];
    const tr = !tb; why.transitiv = tr ? 'для всіх (a,b),(b,c) є (a,c)' : `є (${tb[0]},${tb[1]}) і (${tb[1]},${tb[2]}), але немає (${tb[0]},${tb[2]})`;
    return { vals: [refl, irr, sym, anti, tr], why };
  }
  G.relation = () => {
    const M = [1, 2, 3];
    const all = []; M.forEach((a) => M.forEach((b) => all.push([a, b])));
    const k = ri(1, 6);
    let Rr = shuffle(all).slice(0, k);
    if (rnd() < 0.3) Rr = Rr.concat(M.map((a) => [a, a]).filter(([a]) => !Rr.some(([x, y]) => x === a && y === a)));
    Rr.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    const { vals, why } = relProps(M, Rr);
    const ans = vals.map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
    return {
      topic: 'rel', type: 'multi', gen: 'relation', pts: 2,
      q: R`Kreuzen Sie alle zutreffenden Eigenschaften der Relation $R$ über $M = \{1,2,3\}$ an:<br>$R = \{${Rr.map(([a, b]) => `(${a},${b})`).join(', ')}\}$`,
      options: PROPS.slice(), answer: ans, allowNone: true,
      expl: '<ul>' + PROPS.map((p, i) => `<li><b>${p}</b>: ${vals[i] ? 'так' : 'ні'} — ${why[p]}.</li>`).join('') + '</ul>' + 'Відповідь зараховується лише тоді, коли всі хрестики в рядку правильні.',
    };
  };

  // ---------- Abbildungen (endlich) ----------
  const FUNC_OPTS = ['weder injektiv noch surjektiv', 'injektiv, aber nicht surjektiv', 'surjektiv, aber nicht injektiv', 'bijektiv'];
  G.finiteFunc = () => {
    const m = ri(2, 4), n = ri(2, 4);
    const A = [1, 2, 3, 4].slice(0, m), B = ['a', 'b', 'c', 'd'].slice(0, n);
    const f = A.map(() => pick(B));
    const inj = new Set(f).size === m, sur = new Set(f).size === n;
    const ans = inj && sur ? 3 : inj ? 1 : sur ? 2 : 0;
    const dup = (() => { for (let i = 0; i < m; i++) for (let j = i + 1; j < m; j++) if (f[i] === f[j]) return [A[i], A[j], f[i]]; return null; })();
    const miss = B.find((b) => !f.includes(b));
    return {
      topic: 'abb', type: 'mc', gen: 'finitefunc', pts: 2,
      q: R`Welche Eigenschaft hat $f\colon \{${A.join(',')}\} \to \{${B.join(',')}\}$ mit ${A.map((a, i) => `$${a} \mapsto ${f[i]}$`).join(', ')}?`,
      options: FUNC_OPTS.slice(), answer: ans,
      expl: `Ін'єктивна = різні аргументи → різні значення. ${inj ? 'Так: усі значення різні.' : `Ні: f(${dup[0]}) = f(${dup[1]}) = ${dup[2]}.`} Сюр'єктивна = кожен елемент цільової множини досягається. ${sur ? 'Так: усі елементи {' + B.join(',') + '} досягнуто.' : `Ні: ${miss} ніколи не досягається.`} Корисно: якщо |A| < |B|, сюр'єкції не буває; якщо |A| > |B| — ін'єкції не буває.`,
    };
  };

  // ---------- Mengen / Kombinatorik ----------
  G.setCount = () => {
    const k = ri(2, 4), l = ri(1, 3);
    const variants = [
      { tex: R`2^{A}`, val: 2 ** k, ex: `|2^A| = 2^|A| = 2^${k}` },
      { tex: R`A \times B`, val: k * l, ex: `|A×B| = |A|·|B| = ${k}·${l}` },
      { tex: R`A^{B}`, val: k ** l, ex: `A^B — це всі функції B → A; |A^B| = |A|^|B| = ${k}^${l}` },
      { tex: R`B^{A}`, val: l ** k, ex: `B^A — всі функції A → B; |B^A| = |B|^|A| = ${l}^${k}` },
      { tex: R`\binom{A}{2}`, val: binom(k, 2), ex: `(A over 2) — 2-елементні підмножини; C(${k},2)` },
      { tex: R`\binom{A \times \{0,1\}}{2}^{B}`, val: binom(2 * k, 2) ** l, ex: `|A×{0,1}| = ${2 * k}, двоелементних підмножин C(${2 * k},2) = ${binom(2 * k, 2)}, а функцій з B у цю множину ${binom(2 * k, 2)}^${l}` },
      { tex: R`\binom{A^{B}}{2}`, val: binom(k ** l, 2), ex: `|A^B| = ${k}^${l} = ${k ** l}, далі C(${k ** l},2)` },
      { tex: R`2^{A \times B}`, val: 2 ** (k * l), ex: `|A×B| = ${k * l}, отже 2^${k * l}` },
    ];
    const v = pick(variants);
    return {
      topic: 'mengen', type: 'num', gen: 'setcount', pts: 2,
      q: R`Seien $A = \{${Array.from({ length: k }, (_, i) => -(k - i)).join(',')}\}$ und $B = \{${Array.from({ length: l }, (_, i) => i + 1).join(',')}\}$. Wie viele Elemente hat $X = ${v.tex}$?`,
      inputs: [{ label: R`$|X| =$` }],
      check: (x) => int(x[0]) === v.val, solution: String(v.val),
      expl: `|A| = ${k}, |B| = ${l}. ${v.ex} = <b>${v.val}</b>. Шпаргалка: |2^A| = 2^|A|, |A×B| = |A|·|B|, |A^B| = |A|^|B|, |(A choose k)| = C(|A|, k).`,
    };
  };

  G.stars = () => {
    const m = ri(2, 9), k = ri(2, 5), val = binom(m + k - 1, k - 1);
    return {
      topic: 'komb', type: 'num', gen: 'stars', pts: 3,
      q: R`Wie viele Möglichkeiten gibt es, $m = ${m}$ als Summe von $k = ${k}$ natürlichen Zahlen (mit $0 \in \mathbb{N}$, Reihenfolge zählt) darzustellen? $|\{(m_1,\dots,m_k) \in \mathbb{N}^k \mid m_1 + \dots + m_k = m\}| = ?$`,
      inputs: [{ label: 'Anzahl =' }],
      check: (x) => int(x[0]) === val, solution: String(val),
      expl: `«Зірочки й палички» (Stars and Bars): записуємо m = ${m} зірочок і k − 1 = ${k - 1} перегородок у ряд. Кожне розташування — один розв'язок. Кількість = C(m + k − 1, k − 1) = C(${m + k - 1}, ${k - 1}) = <b>${val}</b>.`,
    };
  };

  G.binom = () => {
    const n = ri(4, 10), k = ri(1, Math.min(4, n - 1));
    const kind = pick(['sub', 'pow', 'func', 'inj']);
    let q, val, ex;
    if (kind === 'sub') { q = R`Wie viele $${k}$-elementige Teilmengen hat $\{1, \dots, ${n}\}$?`; val = binom(n, k); ex = `C(${n},${k}) = ${n}!/(${k}!·${n - k}!) = ${val}`; }
    if (kind === 'pow') { q = R`Wie viele Teilmengen hat $\{1, \dots, ${n}\}$ insgesamt?`; val = 2 ** n; ex = `кожен з ${n} елементів або входить, або ні: 2^${n} = ${val}`; }
    if (kind === 'func') { q = R`Wie viele Abbildungen $f\colon \{1,\dots,${k}\} \to \{1,\dots,${n}\}$ gibt es?`; val = n ** k; ex = `кожному з ${k} аргументів незалежно обираємо одне з ${n} значень: ${n}^${k} = ${val}`; }
    if (kind === 'inj') { q = R`Wie viele injektive Abbildungen $f\colon \{1,\dots,${k}\} \to \{1,\dots,${n}\}$ gibt es?`; val = Array.from({ length: k }, (_, i) => n - i).reduce((a, b) => a * b, 1); ex = `перше значення — ${n} варіантів, друге — ${n - 1}, … (спадний факторіал): ${Array.from({ length: k }, (_, i) => n - i).join('·')} = ${val}`; }
    return {
      topic: 'komb', type: 'num', gen: 'binom', pts: 2, q,
      inputs: [{ label: 'Anzahl =' }], check: (x) => int(x[0]) === val, solution: String(val),
      expl: `Рахуємо: ${ex}. Відповідь <b>${val}</b>.`,
    };
  };

  // ---------- Landau ----------
  // growth classes: same class => Θ, lower class => o, higher => ω
  const GROWTH = [
    [R`\frac{1}{n^2}`],
    [R`\frac{1}{n}`, R`\frac{3}{n+1}`],
    [R`1`, R`7`, R`42`],
    [R`\log\log n`],
    [R`\log n`, R`\log(n^2)`, R`\log(5n)`, R`\sum_{i=1}^{n} \frac{1}{i}`],
    [R`(\log n)^2`, R`\log(n)\cdot\log(4n)`],
    [R`\sqrt{n}`, R`3\sqrt{n} + \log n`],
    [R`\frac{n}{\log n}`],
    [R`n`, R`2^{\log n}`, R`n + \log n`, R`5n + 7`],
    [R`n \log n`, R`\log(n!)`, R`\sum_{i=1}^{n} \frac{n}{i}`],
    [R`n^2`, R`(n+1)^2`, R`\binom{n}{2}`, R`n^2 + n\log n`],
    [R`n^3`, R`\binom{n}{3}`, R`\binom{2n}{3}`],
    [R`n^{\log n}`, R`2^{(\log n)^2}`],
    [R`2^n`, R`2^{n+1}`, R`2^n + n^5`],
    [R`\binom{2n}{n}`],
    [R`4^n`, R`2^{2n}`],
    [R`n!`],
    [R`n^n`, R`2^{n \log n}`],
    [R`2^{n^2}`],
  ];
  const GROWTH_UA = ['спадає як 1/n²', 'спадає як 1/n', 'константа', 'log log n', 'логарифм (≈ log n)', 'log² n', '√n', 'n / log n', 'лінійна ≈ n', 'n log n', 'квадратична ≈ n²', 'кубічна ≈ n³', 'квазіполіном n^{log n}', 'експонента ≈ 2ⁿ', '≈ 4ⁿ/√(πn) (між 2ⁿ і 4ⁿ)', '≈ 4ⁿ', 'n! (≈ (n/e)ⁿ·√(2πn))', 'nⁿ', '2^{n²}'];
  G.landau = () => {
    let i, j;
    do { i = ri(0, GROWTH.length - 1); j = rnd() < 0.3 ? i : ri(0, GROWTH.length - 1); } while (i === j && GROWTH[i].length < 2);
    const f = pick(GROWTH[i]); let g; do { g = pick(GROWTH[j]); } while (g === f);
    const ans = i < j ? 0 : i === j ? 1 : 2;
    return {
      topic: 'wachs', type: 'mc', gen: 'landau', pts: 1,
      q: R`Welches Landau-Symbol macht die Aussage wahr? $\displaystyle ${f} \in \square\left(${g}\right)$`,
      options: ['o', 'Θ', 'ω'], answer: ans, inline: true,
      expl: `Ліва функція ростe як «${GROWTH_UA[i]}», права — як «${GROWTH_UA[j]}». ` +
        (ans === 0 ? 'Ліва росте строго повільніше → <b>o</b> (f/g → 0).' : ans === 1 ? 'Обидві в одному класі (відрізняються не більше ніж сталим множником) → <b>Θ</b>.' : 'Ліва росте строго швидше → <b>ω</b> (f/g → ∞).') +
        ' Порядок: 1/n ≺ 1 ≺ log log n ≺ log n ≺ log² n ≺ √n ≺ n/log n ≺ n ≺ n log n ≺ n² ≺ n³ ≺ n^{log n} ≺ 2ⁿ ≺ C(2n,n) ≺ 4ⁿ ≺ n! ≺ nⁿ ≺ 2^{n²}.',
    };
  };

  // ---------- Aussagenlogik ----------
  const Lg = () => window.Logic;
  function randF(vs, depth, wantClass) {
    for (let t = 0; t < 200; t++) {
      const f = Lg().randomFormula(rnd, vs, depth);
      const s = Lg().show(f);
      if (s.length < 7 || s.length > 46) continue;
      if (Lg().vars(f).length < Math.min(2, vs.length)) continue;
      if (wantClass && Lg().classify(f) !== wantClass) continue;
      return f;
    }
    return Lg().parse('(A -> B) & (B -> A)');
  }
  function ttHtml(f, vs) {
    const T = Lg().truthTable(f, vs);
    return '<table class="mini tt"><thead><tr>' + T.vars.map((v) => `<th>${v}</th>`).join('') + '<th>F</th></tr></thead><tbody>' +
      T.rows.map((r) => '<tr>' + T.vars.map((v) => `<td>${r.env[v]}</td>`).join('') + `<td class="${r.val ? 'one' : 'zero'}">${r.val}</td></tr>`).join('') + '</tbody></table>';
  }
  G.alEval = () => {
    const vs = ['A', 'B', 'C'];
    const f = randF(vs, 3);
    const env = { A: ri(0, 1), B: ri(0, 1), C: ri(0, 1) };
    const val = Lg().eval(f, env);
    return {
      topic: 'al', type: 'mc', gen: 'aleval', pts: 2,
      q: R`Sei $\mathcal{A}(A) = ${env.A}$, $\mathcal{A}(B) = ${env.B}$, $\mathcal{A}(C) = ${env.C}$. Bestimmen Sie $\mathcal{A}(F)$ für <span class="formula">F = ${Lg().show(f)}</span>.`,
      options: ['0', '1'], answer: val, inline: true,
      expl: `Підставляємо значення і обчислюємо зсередини назовні. Нагадування: X → Y хибне лише при X = 1, Y = 0; X ↔ Y істинне, коли X і Y однакові. Результат: <b>${val}</b>.` + ttHtml(f, vs),
    };
  };
  G.alClass = () => {
    const want = pick(['valid', 'sat', 'unsat']);
    const f = randF(['A', 'B', 'C'].slice(0, ri(2, 3)), 3, want);
    const cls = Lg().classify(f), idx = { valid: 0, sat: 1, unsat: 2 }[cls];
    return {
      topic: 'al', type: 'mc', gen: 'alclass', pts: 2,
      q: R`Welche Eigenschaft hat die Formel <span class="formula">F = ${Lg().show(f)}</span>?`,
      options: ['gültig (Tautologie)', 'erfüllbar, aber nicht gültig', 'unerfüllbar'], answer: idx,
      expl: `Будуємо таблицю істинності. gültig = завжди 1; unerfüllbar = завжди 0; інакше — erfüllbar, aber nicht gültig.` + ttHtml(f) + `Отже: <b>${['gültig', 'erfüllbar, aber nicht gültig', 'unerfüllbar'][idx]}</b>.`,
    };
  };
  G.alAssign = () => {
    const f = randF(['A', 'B', 'C'], 3, 'sat');
    const ms = Lg().models(f);
    return {
      topic: 'al', type: 'assign', gen: 'alassign', pts: 4,
      q: R`Geben Sie eine Belegung $\mathcal{A}$ an, die <span class="formula">F = ${Lg().show(f)}</span> erfüllt.`,
      formula: Lg().show(f), vars: Lg().vars(f),
      solution: Object.entries(ms[0]).map(([k, v]) => `${k}=${v}`).join(', '),
      expl: `Підходить будь-яка з ${ms.length} моделей: ` + ms.map((m) => '(' + Object.entries(m).map(([k, v]) => `${k}=${v}`).join(', ') + ')').join(', ') + '.' + ttHtml(f),
    };
  };
  G.alNF = () => {
    const form = pick(['KNF', 'DNF']);
    const f = randF(['A', 'B', 'C'].slice(0, ri(2, 3)), 2, 'sat');
    const canon = form === 'KNF' ? Lg().canonicalKNF(f) : Lg().canonicalDNF(f);
    return {
      topic: 'al', type: 'formula', gen: 'alnf', pts: 4,
      q: R`Geben Sie eine zu <span class="formula">F = ${Lg().show(f)}</span> äquivalente Formel in <b>${form}</b> an.`,
      target: Lg().show(f), form,
      solution: canon,
      expl: (form === 'KNF'
        ? 'KNF (конʼюнктивна нормальна форма) = ∧ з диз\'юнкцій літералів. Канонічна KNF: для кожного рядка таблиці з F = 0 беремо клаузу, у якій кожна змінна стоїть із запереченням, якщо в рядку вона 1.'
        : 'DNF (диз\'юнктивна нормальна форма) = ∨ з кон\'юнкцій літералів. Канонічна DNF: для кожного рядка з F = 1 беремо кон\'юнкцію, де змінна без заперечення, якщо вона 1.') +
        ttHtml(f) + `Канонічна ${form}: <span class="formula">${canon}</span>. Будь-яка еквівалентна коротша ${form} теж правильна — додаток перевіряє еквівалентність таблицею істинності.`,
    };
  };
  const LAWS = [
    ['!(A & B)', '!A | !B', 'Закон де Моргана'],
    ['!(A | B)', '!A & !B', 'Закон де Моргана'],
    ['A -> B', '!A | B', 'Імплікація через ∨'],
    ['A -> B', '!B -> !A', 'Контрапозиція'],
    ['A <-> B', '(A -> B) & (B -> A)', 'Еквіваленція = дві імплікації'],
    ['A & (B | C)', '(A & B) | (A & C)', 'Дистрибутивність'],
    ['A | (B & C)', '(A | B) & (A | C)', 'Дистрибутивність'],
    ['A | (A & B)', 'A', 'Поглинання (Absorption)'],
    ['A & (A | B)', 'A', 'Поглинання (Absorption)'],
    ['(A & B) -> C', 'A -> (B -> C)', 'Експортування'],
  ];
  const FAKE = [
    ['!(A & B)', '!A & !B', 'де Морган міняє ∧ на ∨: ¬(A∧B) ≡ ¬A ∨ ¬B'],
    ['A -> B', 'B -> A', 'обернена імплікація не еквівалентна (A=1, B=0)'],
    ['A -> B', '!A -> !B', 'це заперечення обох частин без перестановки — не контрапозиція'],
    ['!(A -> B)', '!A -> !B', '¬(A→B) ≡ A ∧ ¬B'],
    ['(A -> B) -> C', 'A -> (B -> C)', 'імплікація не асоціативна (A=0, C=0)'],
    ['A | (B & C)', '(A | B) & C', 'неправильна дистрибутивність'],
    ['A <-> B', 'A & B', 'A ↔ B істинне й при A = B = 0'],
    ['(A | B) -> C', '(A -> C) | (B -> C)', 'правильно: (A→C) ∧ (B→C)'],
  ];
  G.alEquiv = () => {
    const real = rnd() < 0.5;
    const [l, r, why] = pick(real ? LAWS : FAKE);
    const ok = Lg().equiv(l, r);
    const ce = Lg().counterexample(l, r);
    return {
      topic: 'al', type: 'tf', gen: 'alequiv', pts: 1,
      q: R`Gilt <span class="formula">${Lg().show(l)} ≡ ${Lg().show(r)}</span>?`,
      answer: ok,
      expl: ok ? `Так, це <b>${why}</b>: обидві формули мають однакову таблицю істинності.` : `Ні: ${why}. Контрприклад: ${Object.entries(ce).map(([k, v]) => `${k}=${v}`).join(', ')} — ліва дає ${Lg().eval(l, ce)}, права ${Lg().eval(r, ce)}.`,
    };
  };

  // ---------- Graphen ----------
  function graphSVG(n, edges) {
    const W = 220, c = W / 2, rad = 80;
    const pos = Array.from({ length: n }, (_, i) => [c + rad * Math.sin((2 * Math.PI * i) / n), c - rad * Math.cos((2 * Math.PI * i) / n)]);
    let s = `<svg class="graph" viewBox="0 0 ${W} ${W}" width="${W}" height="${W}" role="img" aria-label="Graph">`;
    edges.forEach(([a, b]) => { s += `<line x1="${pos[a][0]}" y1="${pos[a][1]}" x2="${pos[b][0]}" y2="${pos[b][1]}"/>`; });
    pos.forEach(([x, y], i) => { s += `<circle cx="${x}" cy="${y}" r="12"/><text x="${x}" y="${y + 4}">${i + 1}</text>`; });
    return s + '</svg>';
  }
  G.graphSVG = graphSVG;
  G.euler = () => {
    let n, E, deg, conn;
    for (;;) {
      n = ri(4, 7);
      const all = []; for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) all.push([a, b]);
      E = shuffle(all).slice(0, ri(n, Math.min(all.length, n + 4)));
      deg = Array(n).fill(0); E.forEach(([a, b]) => { deg[a]++; deg[b]++; });
      // connectivity
      const seen = new Set([0]), st = [0];
      while (st.length) { const v = st.pop(); E.forEach(([a, b]) => { const w = a === v ? b : b === v ? a : -1; if (w >= 0 && !seen.has(w)) { seen.add(w); st.push(w); } }); }
      conn = seen.size === n;
      if (!conn) continue;
      const even = deg.every((d) => d % 2 === 0);
      if (rnd() < 0.45 && !even) continue; // bias toward Eulerian examples
      break;
    }
    const even = deg.every((d) => d % 2 === 0);
    const odd = deg.map((d, i) => [i + 1, d]).filter(([, d]) => d % 2);
    return {
      topic: 'graph', type: 'tf', gen: 'euler', pts: 2,
      q: R`Besitzt der folgende (zusammenhängende) Graph einen Eulerkreis?` + `<div class="figure">${graphSVG(n, E)}</div>`,
      answer: even, labels: ['Ja', 'Nein'],
      expl: `Теорема Ейлера: зв'язний граф має ейлерів цикл ⇔ кожна вершина має парний степінь. Степені: ${deg.map((d, i) => `d(${i + 1})=${d}`).join(', ')}. ` +
        (even ? '<b>Усі парні → так.</b>' : `<b>Ні</b>: непарний степінь мають ${odd.map(([v, d]) => `${v} (${d})`).join(', ')}.`),
    };
  };
  G.degreeSum = () => {
    const n = ri(5, 9);
    let d; do { d = Array.from({ length: n }, () => ri(1, 5)); } while (d.reduce((a, b) => a + b, 0) % 2);
    const m = d.reduce((a, b) => a + b, 0) / 2;
    return {
      topic: 'graph', type: 'num', gen: 'degsum', pts: 2,
      q: R`Ein Graph hat $${n}$ Knoten mit den Graden $${d.join(', ')}$. Wie viele Kanten hat er?`,
      inputs: [{ label: R`$m =$` }], check: (x) => int(x[0]) === m, solution: String(m),
      expl: `Лема про рукостискання (Handshake): Σ d(x) = 2m, бо кожне ребро рахується двічі. Σ = ${d.join(' + ')} = ${2 * m}, тож m = <b>${m}</b>.`,
    };
  };
  G.eulerFormula = () => {
    const n = ri(5, 14), m = ri(n, 3 * n - 6), f = m - n + 2;
    return {
      topic: 'graph', type: 'num', gen: 'eulerformula', pts: 2,
      q: R`Ein zusammenhängender planarer Graph hat $n = ${n}$ Knoten und $m = ${m}$ Kanten. Wie viele Facetten (inkl. der äußeren) hat jede planare Einbettung?`,
      inputs: [{ label: R`$f =$` }], check: (x) => int(x[0]) === f, solution: String(f),
      expl: `Формула Ейлера для зв'язних планарних графів: n − m + f = 2, тож f = m − n + 2 = ${m} − ${n} + 2 = <b>${f}</b>.`,
    };
  };
  G.planarBound = () => {
    const n = ri(4, 12);
    const m = rnd() < 0.5 ? ri(3 * n - 5, 3 * n + 2) : ri(n, 3 * n - 6);
    const ok = m <= 3 * n - 6 && m <= (n * (n - 1)) / 2;
    return {
      topic: 'graph', type: 'tf', gen: 'planarbound', pts: 2,
      q: R`Gibt es einen (einfachen) planaren Graphen mit $n = ${n}$ Knoten und $m = ${m}$ Kanten?`,
      answer: ok, labels: ['Ja', 'Nein'],
      expl: `Для планарного простого графа з n ≥ 3: m ≤ 3n − 6 = ${3 * n - 6}. ` + (m > 3 * n - 6 ? `${m} > ${3 * n - 6} → <b>ні</b>.` : m > (n * (n - 1)) / 2 ? `Але простий граф має щонайбільше C(n,2) = ${(n * (n - 1)) / 2} ребер → <b>ні</b>.` : `${m} ≤ ${3 * n - 6}, і такий граф існує (беремо максимальний планарний граф — тріангуляцію з ${3 * n - 6} ребрами — і видаляємо зайві ребра) → <b>так</b>.`),
    };
  };

  // ---------- Gruppen / Ringe ----------
  G.order = () => {
    if (rnd() < 0.5) {
      const p = pick([5, 7, 11, 13]); const a = ri(2, p - 1);
      let k = 1, x = a; const pw = [`${a}¹ ≡ ${a}`]; while (x !== 1) { x = (x * a) % p; k++; pw.push(`${a}^${k} ≡ ${x}`); }
      return {
        topic: 'gruppen', type: 'num', gen: 'order', pts: 2,
        q: R`Bestimmen Sie die Ordnung von $${a}$ in der Gruppe $((\mathbb{Z}/${p}\mathbb{Z})^*, \cdot)$.`,
        inputs: [{ label: 'ord =' }], check: (v) => int(v[0]) === k, solution: String(k),
        expl: `ord(a) = найменше n ≥ 1 з aⁿ = 1. Степені mod ${p}: ${pw.join(', ')}. Отже ord = <b>${k}</b>. За Лагранжем ord(a) ділить |G| = ${p - 1} ✓.`,
      };
    }
    const n = pick([8, 9, 10, 12, 14, 15, 18, 20, 24]); const a = ri(1, n - 1); const k = n / gcd(a, n);
    return {
      topic: 'gruppen', type: 'num', gen: 'order', pts: 2,
      q: R`Bestimmen Sie die Ordnung von $${a}$ in der Gruppe $(\mathbb{Z}/${n}\mathbb{Z}, +)$.`,
      inputs: [{ label: 'ord =' }], check: (v) => int(v[0]) === k, solution: String(k),
      expl: `В адитивній групі шукаємо найменше k ≥ 1 з k·${a} ≡ 0 (mod ${n}). Формула: ord(a) = n / ggT(a, n) = ${n}/${gcd(a, n)} = <b>${k}</b>.`,
    };
  };
  G.subgroupOrder = () => {
    const n = pick([12, 15, 18, 20, 24, 30, 36]); const k = ri(2, n - 1); const ok = n % k === 0;
    return {
      topic: 'gruppen', type: 'tf', gen: 'subord', pts: 1,
      q: R`Besitzt die zyklische Gruppe $\mathbb{Z}/${n}\mathbb{Z}$ eine Untergruppe der Ordnung $${k}$?`,
      answer: ok, labels: ['Ja', 'Nein'],
      expl: ok ? `Так. ${k} | ${n}, а в циклічній групі для кожного дільника d порядку існує (рівно одна) підгрупа порядку d: тут ⟨${n / k}⟩ = {0, ${n / k}, ${2 * n / k}, …}.` : `Ні. За теоремою Лагранжа порядок підгрупи ділить порядок групи, а ${k} ∤ ${n}.`,
    };
  };
  G.field = () => {
    const n = ri(2, 40); const ok = isPrime(n);
    let w = ''; if (!ok) { for (let a = 2; a < n; a++) if (n % a === 0) { w = `${a}·${n / a} ≡ 0, але ${a} ≢ 0, ${n / a} ≢ 0 — дільники нуля, тож ${a} не має оберненого`; break; } }
    return {
      topic: 'ringe', type: 'tf', gen: 'field', pts: 1,
      q: R`Ist $\mathbb{Z}/${n}\mathbb{Z}$ mit Addition und Multiplikation von Restklassen ein Körper?`,
      answer: ok, labels: ['Ja', 'Nein'],
      expl: `ℤ/nℤ — завжди (комутативне) кільце, а поле ⇔ n просте. ` + (ok ? `${n} — просте, тож кожен клас ≠ 0 оборотний (Безу) → <b>так</b>.` : `${n} не просте: ${w} → <b>ні</b>.`),
    };
  };

  window.GEN = G;
  window.GEN_BY_TOPIC = {
    mengen: ['setCount'],
    abb: ['finiteFunc'],
    rel: ['relation'],
    komb: ['stars', 'binom', 'setCount'],
    al: ['alEval', 'alClass', 'alAssign', 'alNF', 'alEquiv'],
    pl: [],
    ind: [],
    wachs: ['landau'],
    gruppen: ['order', 'subgroupOrder'],
    ringe: ['field'],
    mod: ['inverse', 'extEuclid', 'gcd', 'crt', 'powmod', 'phi', 'rsa', 'rsaEnc', 'linCong'],
    graph: ['euler', 'degreeSum', 'eulerFormula', 'planarBound'],
  };
  window.MathUtil = { gcd, mod, binom, phi, isPrime, powmod, int, shuffle, pick, ri };
})();
