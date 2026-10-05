/* Static question bank, part 1: Mengen, Abbildungen, Relationen, Kombinatorik, Wachstum */
window.BANK = [];
(function () {
  const R = String.raw;
  const B = window.BANK;
  let n = 0;
  const push = (o) => { o.id = o.id || o.topic + '-' + (++n); B.push(o); return o; };
  const H = {};
  H.TF = (topic, q, answer, expl, src, extra) => push(Object.assign({ topic, type: 'tf', q, answer, expl, src, pts: 1 }, extra || {}));
  H.MC = (topic, q, options, answer, expl, src, extra) => push(Object.assign({ topic, type: 'mc', q, options, answer, expl, src, pts: 2 }, extra || {}));
  H.MULTI = (topic, q, options, answer, expl, src, extra) => push(Object.assign({ topic, type: 'multi', q, options, answer, expl, src, pts: 2 }, extra || {}));
  H.NUM = (topic, q, answers, expl, src, extra) => push(Object.assign({ topic, type: 'num', q, inputs: [{ label: (extra && extra.label) || 'Antwort =' }], answers, solution: String(answers[0]), expl, src, pts: 2 }, extra || {}));
  H.PROOF = (topic, q, solution, expl, src, pts) => push({ topic, type: 'proof', q, solution, expl, src, pts: pts || 5 });
  const FUNC_OPTS = ['weder injektiv noch surjektiv', 'injektiv, aber nicht surjektiv', 'surjektiv, aber nicht injektiv', 'bijektiv'];
  H.FUNC = (f, ans, expl, src) => push({ topic: 'abb', type: 'mc', kind: 'func', q: R`Kreuzen Sie die zutreffende Eigenschaft an: $${f}$`, options: FUNC_OPTS.slice(), answer: ans, expl, src, pts: 2 });
  H.WD = (f, ok, expl, src) => push({ topic: 'abb', type: 'tf', kind: 'wd', q: R`Ist die folgende Abbildung wohldefiniert? $${f}$`, answer: ok, labels: ['wohldefiniert', 'nicht wohldefiniert'], expl, src, pts: 1 });
  const PROPS = ['reflexiv', 'irreflexiv', 'symmetrisch', 'antisymmetrisch', 'transitiv'];
  H.REL = (r, ans, expl, src, over) => push({ topic: 'rel', type: 'multi', kind: 'rel', q: R`Kreuzen Sie alle zutreffenden Eigenschaften der Relation $R$ als Teilmenge von $${over || R`\mathbb{N} \times \mathbb{N}`}$ an: $${r}$`, options: PROPS.slice(), answer: ans, expl, src, pts: 2, allowNone: true });
  H.LAN = (f, g, ans, expl, src) => push({ topic: 'wachs', type: 'mc', kind: 'landau', q: R`Welches Landau-Symbol macht die Aussage wahr? $\displaystyle ${f} \in \square\left(${g}\right)$`, options: ['o', 'Θ', 'ω'], answer: { o: 0, 'Θ': 1, 'ω': 2 }[ans], expl, src, pts: 1, inline: true });
  window.BankHelpers = H;

  const HB = 'Prüfung Herbst 2026', FJ = 'Prüfung Frühjahr 2026', S1 = 'Scheinklausur 1 (WS 25/26)', S2 = 'Scheinklausur 2 (WS 25/26)', ER = 'Ergänzungsblatt', EX = 'Додаткове завдання';

  // ================= MENGEN =================
  H.TF('mengen', R`Immer wenn $X$ eine abzählbare Menge ist, dann existiert eine Surjektion $f\colon X \to \mathbb{N}$.`, false,
    R`Хибно. «Abzählbar» у курсі означає: існує ін'єкція X → ℕ (|X| ≤ |ℕ|). Скінченна множина, напр. X = ∅ або X = {1}, зліченна, але сюр'єкції на нескінченну ℕ не має.`, HB + ', A1.1');
  H.TF('mengen', R`Immer wenn $X \subseteq Y$ gilt, dann existiert eine Injektion $f\colon X \to Y$.`, true,
    R`Істинно. Беремо вкладення (Inklusion) f(x) = x — воно очевидно ін'єктивне.`, HB + ', A1.2');
  H.TF('mengen', R`Jede endliche Menge ist abzählbar.`, true,
    R`Істинно. Для скінченної X = {x₁,…,xₙ} відображення xᵢ ↦ i — ін'єкція в ℕ.`, FJ + ', A1.1');
  H.TF('mengen', R`Immer wenn $|X| \le |Y|$ gilt, existiert eine Surjektion $f\colon X \to Y$.`, false,
    R`Хибно. |X| ≤ |Y| дає ін'єкцію X → Y, а не сюр'єкцію. Приклад: X = {1}, Y = {1,2} — одна точка не може «покрити» дві.`, FJ + ', A1.2');
  H.TF('mengen', R`Seien $A, B$ Mengen mit $|A| \ge |B|$. Dann gibt es eine surjektive Abbildung $f\colon A \to B$.`, false,
    R`Хибно через крайній випадок: A = {1}, B = ∅. Тоді |A| ≥ |B|, але відображень A → ∅ взагалі немає (елемент 1 нікуди відправити). Для B ≠ ∅ твердження було б правильним.`, S1 + ', 6a');
  H.TF('mengen', R`Seien $A, B$ Mengen und $f\colon A \to B$ und $g\colon B \to A$ beide injektiv. Dann ist $f$ bijektiv.`, false,
    R`Хибно. За Шредером–Бернштейном існує ЯКАСЬ біекція A → B, але не обов'язково f. Приклад: A = B = ℕ, f = g = n ↦ n+1 — ін'єктивні, але f не сюр'єктивне.`, S1 + ', 6b');
  H.TF('mengen', R`Seien $f\colon A \to B$ und $g\colon B \to A$ Abbildungen mit $f \circ g = \mathrm{id}_B$. Dann ist $f$ surjektiv.`, true,
    R`Істинно. Для будь-якого b ∈ B: b = f(g(b)), тобто b має прообраз g(b).`, S1 + ', 6c');
  H.TF('mengen', R`$\emptyset \in \{\emptyset\}$`, true, R`Істинно: множина {∅} має рівно один елемент — порожню множину.`, EX);
  H.TF('mengen', R`$\emptyset \in \emptyset$`, false, R`Хибно: порожня множина не містить жодного елемента. (Але ∅ ⊆ ∅ — істинно!)`, EX);
  H.TF('mengen', R`Für jede Menge $M$ gilt $\emptyset \subseteq M$.`, true, R`Істинно: «кожен елемент ∅ лежить в M» — порожньо істинне твердження.`, EX);
  H.TF('mengen', R`$|2^{\emptyset}| = 0$`, false, R`Хибно: 2^∅ = {∅}, тобто |2^∅| = 1 = 2⁰.`, EX);
  H.TF('mengen', R`$A \times \emptyset = \emptyset$ für jede Menge $A$.`, true, R`Істинно: пару (a, b) з b ∈ ∅ утворити неможливо.`, EX);
  H.TF('mengen', R`$\mathbb{N} \times \mathbb{N}$ ist abzählbar.`, true, R`Істинно. Наприклад, (m, n) ↦ 2^m·3^n — ін'єкція в ℕ (однозначність розкладу на прості). Або діагональна нумерація Кантора.`, EX);
  H.TF('mengen', R`$\mathbb{Q}$ ist überabzählbar.`, false, R`Хибно. ℚ зліченна: a/b (нескоротний, b > 0) ↦ (a, b) дає ін'єкцію в ℤ × ℕ, а ця множина зліченна.`, EX);
  H.TF('mengen', R`Für jede Menge $M$ gilt $|M| < |2^M|$.`, true, R`Істинно — теорема Кантора. Ін'єкція x ↦ {x} існує, а сюр'єкції M → 2^M немає (діагональний аргумент: множина {x | x ∉ f(x)} не має прообразу).`, EX);
  H.TF('mengen', R`Jede Teilmenge einer abzählbaren Menge ist abzählbar.`, true, R`Істинно: композиція вкладення Y ⊆ X та ін'єкції X → ℕ — ін'єкція Y → ℕ.`, EX);
  H.TF('mengen', R`Es gibt eine Bijektion $\mathbb{N} \to \mathbb{Z}$.`, true, R`Істинно: 0 ↦ 0, 1 ↦ −1, 2 ↦ 1, 3 ↦ −2, 4 ↦ 2, … (парні → невід'ємні, непарні → від'ємні).`, EX);
  H.TF('mengen', R`$\mathbb{N} \cong \mathbb{N} \cup \{\mathbb{N}\}$ (d.h. es gibt eine Bijektion).`, true, R`Істинно (Ergänzung 2): ℕ ↦ 0 і n ↦ n+1 — біекція ℕ ∪ {ℕ} → ℕ. Нескінченна множина «поглинає» один додатковий елемент.`, ER + ' 2');
  H.NUM('mengen', R`Wie viele verschiedene Mengen enthält die Auflistung $\{1,2\},\ \{2,2\},\ \{7,1,1\},\ \{2,1,2\},\ \{1,7,1\} \setminus \{1\},\ \{1,7\}$?`, [4],
    R`У множинах порядок і повтори не важать: {1,2}; {2,2} = {2}; {7,1,1} = {1,7}; {2,1,2} = {1,2}; {1,7,1}∖{1} = {7}; {1,7}. Різні: {1,2}, {2}, {1,7}, {7} → <b>4</b>.`, S1 + ', 1.1', { label: 'Anzahl =', pts: 3 });
  H.MULTI('mengen', R`Seien $A, B, C$ Teilmengen von $M$ mit $A \cap B = A \cap C = \emptyset$. Welche Aussagen sind (immer) wahr?`,
    [R`$A\cap B\cap C = \emptyset$`, R`$A\cap B\cap C = B\cap C$`, R`$B\cap C = \emptyset$`, R`$B \cap C = A$`, R`$(A\setminus B)\cup(A\setminus C) = \emptyset$`, R`$(A\setminus B)\cup(A\setminus C) = A$`, R`$(A\setminus B)\cup(A\setminus C) = B \cup C$`], [0, 5],
    R`A∩B = ∅ ⇒ A∩B∩C = ∅ ✓. Про B∩C нічого не відомо (B і C можуть перетинатися), тому 2–4 хибні. Оскільки A не перетинається з B і C: A∖B = A і A∖C = A, отже (A∖B)∪(A∖C) = A ✓.`, S1 + ', 1.2', { pts: 4 });
  H.MC('mengen', R`Seien $A = \{-k,\dots,-1\}$, $B = \{1,\dots,\ell\}$ und $X = \binom{A \times \{0,1\}}{2}^{B}$. Welches Objekt ist ein Element von $X$?`,
    [R`$f\colon B \to \binom{A\times\{0,1\}}{2},\ b \mapsto \{(-1,0),(-1,1)\}$`, R`$\{(-1,0),(-1,1)\}$`, R`$((-1,0),(-1,1))$`, R`$f\colon \binom{A\times\{0,1\}}{2} \to B,\ M \mapsto 1$`], 0,
    R`Y^B — це множина ВСІХ ФУНКЦІЙ B → Y. Тут Y = 2-елементні підмножини A×{0,1}. Отже елемент X — функція, що кожному b ∈ B дає двоелементну множину пар. Варіант 2 — лише елемент Y (не функція), варіант 3 — впорядкована пара, а не множина, варіант 4 — функція у зворотний бік. На іспиті достатньо записати константну функцію b ↦ {(−1,0),(−1,1)}.`, HB + ', A6', { pts: 5 });
  H.MC('mengen', R`Seien $A = \{-k,\dots,-1\}$ ($k \ge 2$), $B = \{1,\dots,\ell\}$ und $X = \binom{A^{B}}{2}$. Welches Objekt ist ein Element von $X$?`,
    [R`$\{f, g\}$ mit $f\colon B\to A,\ b\mapsto -1$ und $g\colon B \to A,\ b \mapsto -2$`, R`$\{-1, -2\}$`, R`$(f, g)$ mit $f, g\colon B \to A$`, R`$\{f\}$ mit $f\colon B \to A,\ b \mapsto -1$`], 0,
    R`A^B — множина функцій B → A; (Y choose 2) — двоелементні підмножини Y. Отже потрібна множина з ДВОХ РІЗНИХ функцій B → A. Тому k ≥ 2: константні функції −1 і −2 різні. {−1,−2} — це підмножина A, (f,g) — пара, {f} має один елемент.`, FJ + ', A5a', { pts: 5 });
  H.MC('mengen', R`Für $X = \binom{A^{B}}{2}$ mit $|A| = k$, $|B| = \ell$: Wie viele Elemente hat $X$?`,
    [R`$\binom{k^{\ell}}{2}$`, R`$\binom{\ell^{k}}{2}$`, R`$\binom{k}{2}^{\ell}$`, R`$2^{k\ell}$`], 0,
    R`|A^B| = |A|^|B| = k^ℓ (кожному з ℓ аргументів — одне з k значень). Двоелементних підмножин множини з N елементів: C(N, 2). Отже |X| = C(k^ℓ, 2) = k^ℓ(k^ℓ − 1)/2.`, FJ + ', A5b');
  H.MC('mengen', R`Für endliche Mengen $A, B$ gilt immer:`,
    [R`$|A \cup B| = |A| + |B| - |A \cap B|$`, R`$|A \cup B| = |A| + |B|$`, R`$|A \setminus B| = |A| - |B|$`, R`$|A \cap B| = \min(|A|, |B|)$`], 0,
    R`Принцип включення–виключення: елементи перетину пораховано двічі, тому віднімаємо їх раз. |A∖B| = |A| − |A∩B| (а не |A| − |B|).`, ER + ' 1');
  H.PROOF('mengen', R`Seien $A, B, C$ Mengen mit $A \subseteq B \subseteq C$. Zeigen Sie $C \setminus B \subseteq C \setminus A$.`,
    R`Sei $x \in C \setminus B$ beliebig. Dann gilt $x \in C$ und $x \notin B$. Wäre $x \in A$, so wegen $A \subseteq B$ auch $x \in B$ — Widerspruch. Also $x \notin A$. Mit $x \in C$ folgt $x \in C \setminus A$. Da $x$ beliebig war, gilt $C \setminus B \subseteq C \setminus A$. $\square$`,
    R`Ідея: стандартне «елементне» доведення включення X ⊆ Y: беремо довільний x ∈ X і показуємо x ∈ Y. Тут — через від супротивного.`, S1 + ', 1.3', 10);
  H.PROOF('mengen', R`Seien $A, B$ beliebige Mengen. Zeigen Sie $(A \setminus B) \cup (A \cap B) = A$.`,
    R`„$\subseteq$": Sei $x \in (A\setminus B)\cup(A\cap B)$. In beiden Fällen ist $x \in A$.<br>„$\supseteq$": Sei $x \in A$. Fall $x \in B$: dann $x \in A \cap B$. Fall $x \notin B$: dann $x \in A \setminus B$. In beiden Fällen $x \in (A\setminus B)\cup(A\cap B)$. $\square$`,
    R`Рівність множин = два включення. Розбір випадків x ∈ B / x ∉ B.`, ER + ' 1', 5);

  // ================= ABBILDUNGEN =================
  H.FUNC(R`f\colon \mathbb{N}\times\mathbb{N} \to \mathbb{N},\ (m,n) \mapsto n\cdot 2^m`, 2,
    R`Сюр'єктивна: будь-яке n ∈ ℕ — це f(0, n). Не ін'єктивна: f(1, 1) = 2 = f(0, 2).`, HB + ', A2.1');
  H.FUNC(R`f\colon \mathbb{Z}\times\mathbb{Z} \to \mathbb{Z},\ (x,y) \mapsto 2x+3y`, 2,
    R`Сюр'єктивна: f(−1, 1) = 1, тому f(−z, z) = z для будь-якого z (бо ggT(2,3) = 1). Не ін'єктивна: f(3, 0) = 6 = f(0, 2).`, HB + ', A2.2');
  H.FUNC(R`f\colon \mathbb{Q}\times\mathbb{Q} \to \mathbb{Q}\times\mathbb{Q},\ (p,q) \mapsto (p+q,\ p-q)`, 3,
    R`Біективна: є обернена (u, v) ↦ ((u+v)/2, (u−v)/2). Перевірка: p+q = u, p−q = v ⇒ p = (u+v)/2, q = (u−v)/2 ∈ ℚ. (Над ℤ це вже не працювало б через ділення на 2!)`, HB + ', A2.3');
  H.FUNC(R`f\colon \mathbb{R} \to \mathbb{R},\ r \mapsto \begin{cases} 1 & r \neq 0 \\ r & \text{sonst}\end{cases}`, 0,
    R`Насправді f(r) = 1 для r ≠ 0 і f(0) = 0. Образ — лише {0, 1}: не сюр'єктивна (2 не досягається) і не ін'єктивна (f(1) = f(2) = 1).`, HB + ', A2.4');
  H.FUNC(R`f\colon \{a,b\} \to \{1,2\}\times\{1,2\},\ a \mapsto (1,1),\ b \mapsto (2,2)`, 1,
    R`Ін'єктивна: різні аргументи → різні пари. Не сюр'єктивна: ціль має 4 елементи, а аргументів лише 2 (напр., (1,2) не досягається).`, HB + ', A2.5');
  H.FUNC(R`f\colon \mathbb{N} \to \mathbb{N}\times\mathbb{N},\ n \mapsto (2n,\ 2n+1)`, 1,
    R`Ін'єктивна: з (2n, 2n+1) однозначно відновлюємо n. Не сюр'єктивна: (0, 0) не досягається (друга компонента завжди непарна).`, FJ + ', A2.1');
  H.FUNC(R`f\colon \mathbb{Z} \to \mathbb{Z},\ z \mapsto z^2`, 0,
    R`Не ін'єктивна: f(−1) = f(1) = 1. Не сюр'єктивна: 2 (або −1) не є квадратом цілого.`, FJ + ', A2.2');
  H.FUNC(R`f\colon \mathbb{Q} \to \mathbb{Q},\ q \mapsto 3q+1`, 3,
    R`Біективна: обернена q ↦ (q − 1)/3 теж відображає ℚ → ℚ.`, FJ + ', A2.3');
  H.FUNC(R`f\colon \mathbb{N} \to \mathbb{N},\ n \mapsto \begin{cases} n/2 & n \text{ gerade} \\ 3n+1 & n \text{ ungerade}\end{cases}`, 2,
    R`Сюр'єктивна: будь-яке m = f(2m) (2m парне). Не ін'єктивна: f(8) = 4 = f(1). (Це функція Коллатца.)`, FJ + ', A2.4');
  H.FUNC(R`f\colon \{1,2\} \to \{3,4\},\ 1 \mapsto 4,\ 2 \mapsto 3`, 3,
    R`Біективна: кожен елемент {3,4} має рівно один прообраз.`, FJ + ', A2.5');
  H.FUNC(R`f\colon \mathbb{N} \to \mathbb{N},\ n \mapsto 2n`, 1,
    R`Ін'єктивна (2m = 2n ⇒ m = n), але непарні числа не досягаються.`, S2 + ', 1.1');
  H.FUNC(R`f\colon \mathbb{N} \to \mathbb{N},\ n \mapsto n+1`, 1, R`Ін'єктивна, але 0 не має прообразу (0 ∈ ℕ!).`, EX);
  H.FUNC(R`f\colon \mathbb{Z} \to \mathbb{Z},\ z \mapsto z+5`, 3, R`Біективна: обернена z ↦ z − 5. В ℤ (на відміну від ℕ) віднімання не виводить за межі множини.`, EX);
  H.FUNC(R`f\colon \mathbb{N} \to \mathbb{N},\ n \mapsto \lfloor n/2 \rfloor`, 2, R`Сюр'єктивна: m = f(2m). Не ін'єктивна: f(0) = f(1) = 0.`, EX);
  H.FUNC(R`f\colon \mathbb{R} \to \mathbb{R},\ x \mapsto x^3`, 3, R`Біективна: строго монотонна і неперервна, обернена x ↦ ∛x.`, EX);
  H.FUNC(R`f\colon \mathbb{R} \to \mathbb{R}_{\ge 0},\ x \mapsto x^2`, 2, R`Сюр'єктивна на [0, ∞): y = (√y)². Не ін'єктивна: f(−1) = f(1). Зверніть увагу: властивості залежать від цільової множини!`, EX);
  H.FUNC(R`f\colon \mathbb{Z} \to \mathbb{N},\ z \mapsto |z|`, 2, R`Сюр'єктивна: n = |n|. Не ін'єктивна: |−1| = |1|.`, EX);
  H.FUNC(R`f\colon \mathbb{N}\times\mathbb{N} \to \mathbb{N},\ (m,n) \mapsto 2^m 3^n`, 1, R`Ін'єктивна через однозначність розкладу на прості множники. Не сюр'єктивна: 0 і 5 не досягаються.`, EX);
  H.FUNC(R`f\colon \mathbb{Z}\times\mathbb{Z} \to \mathbb{Z},\ (x,y) \mapsto 2x+4y`, 0, R`Значення завжди парні → не сюр'єктивна. f(2,0) = 4 = f(0,1) → не ін'єктивна.`, EX);
  H.FUNC(R`f\colon \mathbb{R} \to \mathbb{R},\ x \mapsto e^x`, 1, R`Ін'єктивна (строго зростає), але від'ємні числа та 0 не досягаються.`, EX);
  H.FUNC(R`f\colon 2^{\{1,2\}} \to \{0,1,2\},\ M \mapsto |M|`, 2, R`Сюр'єктивна: ∅ ↦ 0, {1} ↦ 1, {1,2} ↦ 2. Не ін'єктивна: {1} і {2} обидві ↦ 1.`, EX);
  H.FUNC(R`f\colon \mathbb{N} \to \mathbb{Z},\ n \mapsto \begin{cases} n/2 & n \text{ gerade}\\ -(n+1)/2 & n \text{ ungerade}\end{cases}`, 3, R`Біективна: парні n дають 0, 1, 2, …, непарні дають −1, −2, −3, … — кожне ціле рівно один раз.`, EX);
  H.TF('abb', R`Seien $f\colon B\to C$, $g\colon A \to B$. Wenn $f \circ g$ injektiv ist, dann ist $g$ injektiv.`, true,
    R`Істинно. Якщо g(a) = g(a'), то f(g(a)) = f(g(a')), і з ін'єктивності f∘g маємо a = a'.`, EX);
  H.TF('abb', R`Seien $f\colon B\to C$, $g\colon A \to B$. Wenn $f \circ g$ injektiv ist, dann ist $f$ injektiv.`, false,
    R`Хибно. A = {1}, B = {1,2}, C = {1}: g(1) = 1, f ≡ 1. f∘g ін'єктивна (A має один елемент), а f — ні.`, EX);
  H.TF('abb', R`Seien $f\colon B\to C$, $g\colon A \to B$. Wenn $f \circ g$ surjektiv ist, dann ist $f$ surjektiv.`, true,
    R`Істинно. Для c ∈ C існує a з f(g(a)) = c, отже g(a) — прообраз c під f.`, EX);
  H.TF('abb', R`Eine Abbildung $f\colon A \to B$ zwischen endlichen Mengen mit $|A| = |B|$ ist genau dann injektiv, wenn sie surjektiv ist.`, true,
    R`Істинно (принцип Діріхле): для скінченних множин однакової потужності ін'єкція ⇔ сюр'єкція ⇔ біекція. Для нескінченних — ні (n ↦ n+1 на ℕ).`, EX);
  H.WD(R`f\colon \mathbb{Q} \to \mathbb{Z},\ \tfrac{a}{b} \mapsto a+b`, false, R`Не коректно визначена: 1/2 = 2/4, але 1+2 = 3 ≠ 6 = 2+4. Значення залежить від запису дробу, а не від числа.`, HB + ', A3.1');
  H.WD(R`f\colon \mathbb{Q} \to \mathbb{Q},\ \tfrac{a}{b} \mapsto \tfrac{a+b}{\operatorname{ggT}(a,b)}`, true, R`Коректна. Якщо a = d·a', b = d·b' з нескоротним a'/b', то (a+b)/ggT(a,b) = d(a'+b')/d = a' + b' — залежить лише від нескоротного запису, тобто від самого числа.`, HB + ', A3.2');
  H.WD(R`f\colon \mathbb{Q} \to \mathbb{Q},\ \tfrac{a}{b} \mapsto \tfrac{2a}{3b}`, true, R`Коректна: 2a/(3b) = (2/3)·(a/b) — функція від самого числа a/b.`, HB + ', A3.3');
  H.WD(R`f\colon \mathbb{Q} \to \mathbb{Q},\ \tfrac{a}{b} \mapsto \tfrac{2^a}{3^b}`, false, R`Не коректна: 1/1 ↦ 2/3, але 2/2 ↦ 4/9.`, HB + ', A3.4');
  H.WD(R`f\colon \mathbb{Q} \to \mathbb{Q},\ \tfrac{a}{b} \mapsto \begin{cases}\tfrac{b}{a} & a \neq 0\\ 0 & \text{sonst}\end{cases}`, true, R`Коректна: це обернене число 1/q (і 0 ↦ 0). Умова a ≠ 0 не залежить від запису (a = 0 ⇔ q = 0).`, HB + ', A3.5');
  H.WD(R`f\colon \mathbb{Q} \to \mathbb{Q},\ \tfrac{a}{b} \mapsto \tfrac{a^2}{b^2}`, true, R`Коректна: a²/b² = (a/b)².`, EX);
  H.WD(R`f\colon \mathbb{Q} \to \mathbb{Z},\ \tfrac{a}{b} \mapsto b`, false, R`Не коректна: 1/2 ↦ 2, але 2/4 ↦ 4.`, EX);
  H.WD(R`f\colon \mathbb{Q} \to \mathbb{Q},\ \tfrac{a}{b} \mapsto \tfrac{a+1}{b+1}`, false, R`Не коректна: 1/2 ↦ 2/3, але 2/4 ↦ 3/5.`, EX);
  H.WD(R`f\colon \mathbb{Q} \to \mathbb{Q},\ \tfrac{a}{b} \mapsto \tfrac{a+b}{b}`, true, R`Коректна: (a+b)/b = a/b + 1.`, EX);
  H.WD(R`f\colon \mathbb{Z}/6\mathbb{Z} \to \mathbb{Z}/3\mathbb{Z},\ k + 6\mathbb{Z} \mapsto k + 3\mathbb{Z}`, true, R`Коректна, бо 3 | 6: якщо k ≡ k' (mod 6), то 6 | k − k', отже 3 | k − k'.`, EX);
  H.WD(R`f\colon \mathbb{Z}/3\mathbb{Z} \to \mathbb{Z}/6\mathbb{Z},\ k + 3\mathbb{Z} \mapsto k + 6\mathbb{Z}`, false, R`Не коректна: 0 + 3ℤ = 3 + 3ℤ, але 0 + 6ℤ ≠ 3 + 6ℤ.`, EX);
  H.WD(R`f\colon \mathbb{Z}/5\mathbb{Z} \to \mathbb{Z}/5\mathbb{Z},\ k + 5\mathbb{Z} \mapsto k^2 + 5\mathbb{Z}`, true, R`Коректна: k ≡ k' ⇒ k² ≡ k'² (mod 5) (множення сумісне з конгруенцією).`, EX);
  H.WD(R`f\colon \mathbb{Z}/4\mathbb{Z} \to \mathbb{Z},\ k + 4\mathbb{Z} \mapsto k`, false, R`Не коректна: 1 + 4ℤ = 5 + 4ℤ, але 1 ≠ 5. Без вибору канонічного представника так визначати не можна.`, EX);
  H.PROOF('abb', R`Seien $f, g\colon A \to B$ und $h\colon A \to B \times B$, $h(a) = (f(a), g(a))$.<br>(a) Zeigen Sie: Sind $f$ und $g$ injektiv, dann ist $h$ injektiv.<br>(b) Widerlegen Sie: Sind $f$ und $g$ surjektiv, dann ist $h$ surjektiv.`,
    R`(a) Seien $a, a' \in A$ mit $h(a) = h(a')$. Dann $(f(a), g(a)) = (f(a'), g(a'))$, also insbesondere $f(a) = f(a')$. Da $f$ injektiv ist, folgt $a = a'$. (Es reicht sogar, dass $f$ injektiv ist.)<br>(b) Gegenbeispiel: $A = B = \{1, 2\}$, $f = g = \mathrm{id}$. Beide sind surjektiv, aber $h(a) = (a, a)$ trifft $(1, 2)$ nicht. $\square$`,
    R`Ідея: ін'єктивність — «з рівності образів випливає рівність аргументів». Для спростування — найменший контрприклад.`, S1 + ', 1.4', 16);
  H.PROOF('abb', R`Zeigen Sie: $f\colon A \to B$ ist surjektiv genau dann, wenn für alle $g, h\colon B \to C$ gilt: $g \circ f = h \circ f \Rightarrow g = h$.`,
    R`„$\Rightarrow$": Sei $f$ surjektiv, $g\circ f = h \circ f$ und $b \in B$. Wähle $a$ mit $f(a) = b$. Dann $g(b) = g(f(a)) = h(f(a)) = h(b)$. Also $g = h$.<br>„$\Leftarrow$": Angenommen $f$ nicht surjektiv, $b_0 \notin f(A)$. Setze $C = \{0,1\}$, $g \equiv 0$, $h(b) = 1$ für $b = b_0$, sonst $0$. Dann $g \circ f = h \circ f$ (beide $\equiv 0$), aber $g \neq h$. Widerspruch. $\square$`,
    R`Ідея: сюр'єкція «скорочується справа». Для зворотного напрямку будуємо дві функції, що відрізняються лише в точці, яку f не досягає.`, ER + ' 2', 8);

  // ================= RELATIONEN =================
  H.REL(R`R = \mathbb{N}^2`, [0, 2, 4], R`Усі пари в R. Рефлексивна, симетрична, транзитивна (це відношення еквівалентності з одним класом). Не іррефлексивна ((0,0) ∈ R) і не антисиметрична ((0,1), (1,0) ∈ R).`, HB + ', A4.1');
  H.REL(R`R = \{(m,n) \in \mathbb{N}^2 \mid m \neq n\}`, [1, 2], R`Іррефлексивна (m ≠ m ніколи), симетрична. Не транзитивна: (0,1), (1,0) ∈ R, але (0,0) ∉ R. Не антисиметрична: (0,1) і (1,0).`, HB + ', A4.2');
  H.REL(R`R = \{(m,n) \in \mathbb{N}^2 \mid m+5 < n\}`, [1, 3, 4], R`Іррефлексивна (m+5 < m — ніколи). Антисиметрична: m+5 < n і n+5 < m одночасно неможливо. Транзитивна: m+5 < n і n+5 < k ⇒ m+5 < n < k. Не симетрична: (0, 6) ∈ R, (6, 0) ∉ R.`, HB + ', A4.3');
  H.REL(R`R = \{(m,n) \in \mathbb{N}^2 \mid m < n+5\}`, [0], R`Рефлексивна: m < m+5. Не симетрична: (0,10) ∈ R, але 10 < 5 хибне. Не антисиметрична: (1,2) і (2,1) обидві в R. Не транзитивна: (10,6) і (6,2) ∈ R, але (10,2) ∉ R (10 < 7 хибно).`, HB + ', A4.4');
  H.REL(R`R = \{(2^k, 2^k) \mid k \in \mathbb{N}\}`, [2, 3, 4], R`R містить лише «петлі» (1,1), (2,2), (4,4), … Не рефлексивна на ℕ ((3,3) ∉ R), не іррефлексивна ((1,1) ∈ R). Будь-яка підмножина діагоналі симетрична, антисиметрична і транзитивна.`, HB + ', A4.5');
  H.REL(R`R = \{(2,2), (2,9)\}`, [3, 4], R`Не рефлексивна (на ℕ бракує (0,0)), не іррефлексивна ((2,2)). Не симетрична ((9,2) бракує). Антисиметрична ✓. Транзитивна ✓: єдині ланцюжки (2,2)(2,2) і (2,2)(2,9) дають пари з R.`, FJ + ', A3.1');
  H.REL(R`R = \{(2,9), (9,2)\}`, [1, 2], R`Іррефлексивна ✓, симетрична ✓. Не транзитивна: (2,9),(9,2) ⇒ потрібна (2,2). Не антисиметрична.`, FJ + ', A3.2');
  H.REL(R`R = \{(2,2), (2,9), (9,2)\}`, [2], R`Лише симетрична. Не транзитивна: (9,2),(2,9) ⇒ потрібна (9,9) ∉ R. Не іррефлексивна ((2,2)), не рефлексивна.`, FJ + ', A3.3');
  H.REL(R`R = \{(2,2), (2,9), (9,2), (9,9)\}`, [2, 4], R`Симетрична і транзитивна (це повне відношення на {2,9}). Але НЕ рефлексивна як відношення на ℕ: (0,0) ∉ R. Типова пастка іспиту!`, FJ + ', A3.4');
  H.REL(R`R = \{(m,n) \in \mathbb{N}^2 \mid m = n \vee m = n+1\}`, [0, 3], R`Рефлексивна (m = m). Антисиметрична: m = n+1 і n = m+1 одночасно неможливо. Не симетрична: (1,0) ∈ R, (0,1) ∉ R. Не транзитивна: (2,1),(1,0) ∈ R, (2,0) ∉ R.`, FJ + ', A3.5');
  H.REL(R`R = \{(a,b) \in \mathbb{N}^2 \mid a = b \text{ oder } 2a = b\}`, [0, 3], R`Рефлексивна ✓. Не симетрична: (1,2) ∈ R, (2,1) ∉ R. Антисиметрична: 2a = b і 2b = a ⇒ a = b = 0. Не транзитивна: (1,2), (2,4) ∈ R, але (1,4) ∉ R.`, S1 + ', 1.5');
  H.REL(R`R = \{(m,n) \in \mathbb{N}^2 \mid m \le n\}`, [0, 3, 4], R`≤ — класичне відношення часткового порядку: рефлексивне, антисиметричне, транзитивне.`, EX);
  H.REL(R`R = \{(m,n) \in \mathbb{N}^2 \mid m < n\}`, [1, 3, 4], R`< — строгий порядок: іррефлексивне, антисиметричне (порожньо: m<n і n<m не бувають), транзитивне.`, EX);
  H.REL(R`R = \{(m,n) \in \mathbb{N}^2 \mid m \text{ teilt } n\}`, [0, 3, 4], R`m | n ⇔ ∃k: n = km. Рефлексивне (навіть 0 | 0), антисиметричне на ℕ (m | n і n | m ⇒ m = n), транзитивне. На ℤ не було б антисиметричним (2 | −2, −2 | 2).`, EX);
  H.REL(R`R = \emptyset`, [1, 2, 3, 4], R`Порожнє відношення: іррефлексивне, симетричне, антисиметричне, транзитивне — бо немає пар, що могли б порушити умови. Рефлексивне лише на ∅.`, EX);
  H.REL(R`R = \{(m,n) \in \mathbb{N}^2 \mid m + n \text{ gerade}\}`, [0, 2, 4], R`Відношення еквівалентності: m+m парне; симетричне; m+n і n+k парні ⇒ m+k = (m+n)+(n+k)−2n парне. Два класи: парні й непарні.`, EX);
  H.REL(R`R = \{(m,n) \in \mathbb{N}^2 \mid m + n \text{ ungerade}\}`, [1, 2], R`Іррефлексивне (2m парне), симетричне. Не транзитивне: (0,1),(1,0) ∈ R, але (0,0) ∉ R.`, EX);
  H.REL(R`R = \{(m,n) \in \mathbb{N}^2 \mid |m-n| \le 1\}`, [0, 2], R`Рефлексивне і симетричне. Не транзитивне: (0,1),(1,2) ∈ R, (0,2) ∉ R.`, EX);
  H.TF('rel', R`Jede binäre Relation ist entweder reflexiv oder irreflexiv.`, false, R`Хибно. R = {(1,1)} на {1,2}: (2,2) ∉ R — не рефлексивна; (1,1) ∈ R — не іррефлексивна.`, HB + ', A1.8');
  H.TF('rel', R`Es gibt eine nichtleere binäre Relation über $\mathbb{N}$, die gleichzeitig symmetrisch und antisymmetrisch ist.`, true, R`Істинно: R = {(0,0)}. Будь-яка підмножина діагоналі одночасно симетрична й антисиметрична.`, HB + ', A1.9');
  H.TF('rel', R`Jede Äquivalenzrelation ist symmetrisch und transitiv.`, true, R`Істинно за означенням: Äquivalenzrelation = рефлексивна + симетрична + транзитивна.`, FJ + ', A1.8');
  H.TF('rel', R`Jede symmetrische und transitive Relation ist eine Äquivalenzrelation.`, false, R`Хибно: бракує рефлексивності. Приклад: ∅ на ℕ — симетрична й транзитивна, але (0,0) ∉ ∅. (Відомий «хибний доказ»: з aRb і bRa отримуємо aRa — але лише для тих a, що мають партнера b!)`, FJ + ', A1.9');
  H.TF('rel', R`Die leere Relation über $M = \emptyset$ ist eine Äquivalenzrelation.`, true, R`Істинно: на порожній множині рефлексивність виконується порожньо. На M ≠ ∅ — ні.`, ER + ' 3');
  H.MC('rel', R`Sei $R = \{(a,b) \in A^2 \mid a+b \text{ gerade}\}$ über $A = \{1, 2, 4\}$. Was ist $[2]_R$?`, [R`$\{2, 4\}$`, R`$\{2\}$`, R`$\{1, 2, 4\}$`, R`$\{1\}$`], 0,
    R`[2] = {b ∈ A | 2 + b парне} = {2, 4}. Аналогічно [1] = {1}, [4] = {2, 4}. Класи еквівалентності утворюють розбиття A: {1} і {2, 4}.`, S2 + ', 1.2', { pts: 6 });
  H.MC('rel', R`Auf $\mathbb{N}^2$ sei $(a,b) \sim (x,y) :\Leftrightarrow a+b = x+y$. Was ist $[(1,1)]_\sim$?`, [R`$\{(0,2), (1,1), (2,0)\}$`, R`$\{(1,1)\}$`, R`$\{(1,1), (2,2)\}$`, R`$\{(0,2), (2,0)\}$`], 0,
    R`Клас — усі пари з сумою 1+1 = 2: (0,2), (1,1), (2,0) (пам'ятаємо, 0 ∈ ℕ).`, ER + ' 3');
  H.NUM('rel', R`Sei $R = \{(a,b),(b,c),(c,d),(d,d)\}$ über $M = \{a,b,c,d\}$. Wie viele Paare enthält die transitive Hülle $R^+$?`, [7],
    R`R⁺ — найменше транзитивне розширення: додаємо всі «шляхи». З a досяжні b, c, d; з b — c, d; з c — d; з d — d. R⁺ = {(a,b),(a,c),(a,d),(b,c),(b,d),(c,d),(d,d)} → <b>7</b>. Для R* додаємо ще (a,a),(b,b),(c,c) → 10.`, ER + ' 3', { label: '|R⁺| =' });
  H.NUM('rel', R`Wie viele Äquivalenzrelationen gibt es auf der Menge $\{1,2,3\}$?`, [5],
    R`Відношення еквівалентності ↔ розбиття множини. Розбиття {1,2,3}: {123}, {1|23}, {2|13}, {3|12}, {1|2|3} → <b>5</b> (число Белла B₃).`, EX, { label: 'Anzahl =' });
  H.PROOF('rel', R`Sei $R$ eine reflexive, transitive Relation. Zeigen Sie: $R \cap R^{T}$ ist eine Äquivalenzrelation.`,
    R`Sei $S = R \cap R^T$, also $(a,b) \in S \Leftrightarrow (a,b) \in R \wedge (b,a) \in R$.<br>Reflexiv: $(a,a) \in R$, also auch $(a,a) \in R^T$, d.h. $(a,a) \in S$.<br>Symmetrisch: $(a,b) \in S \Rightarrow (a,b),(b,a) \in R \Rightarrow (b,a) \in S$.<br>Transitiv: $(a,b),(b,c) \in S \Rightarrow (a,b),(b,c) \in R \Rightarrow (a,c) \in R$, und $(c,b),(b,a) \in R \Rightarrow (c,a) \in R$. Also $(a,c) \in S$. $\square$`,
    R`Ідея: перевіряємо три властивості по черзі, щоразу розписуючи означення перетину і транспонування.`, ER + ' 3', 6);

  // ================= KOMBINATORIK =================
  H.TF('komb', R`Für alle $n \in \mathbb{N}$ gilt: Die Anzahl der 3-elementigen Teilmengen von $\{0, \dots, n\}$ ist genau $\binom{n+1}{3}$.`, true,
    R`Істинно: множина {0,…,n} має n+1 елементів (не забудьте нуль!), а k-елементних підмножин у (n+1)-елементній множині C(n+1, k).`, HB + ', A1.7');
  H.TF('komb', R`Für alle $n \in \mathbb{N}$ gilt: Es gibt genau $\binom{n}{2}$ Teilmengen von $\{1, \dots, n\}$.`, false,
    R`Хибно: усіх підмножин 2ⁿ. C(n, 2) — це лише кількість ДВОЕЛЕМЕНТНИХ підмножин.`, FJ + ', A1.7');
  H.MC('komb', R`Wie viele Möglichkeiten gibt es, $m \in \mathbb{N}$ als Summe von $k \ge 1$ natürlichen Zahlen darzustellen, d.h. $|\{(m_1,\dots,m_k) \in \mathbb{N}^k \mid m_1+\dots+m_k = m\}|$?`,
    [R`$\binom{m+k-1}{k-1}$`, R`$\binom{m+k}{k}$`, R`$\binom{m-1}{k-1}$`, R`$k^m$`], 0,
    R`Stars and Bars: m зірочок і k−1 перегородок у ряд — всього m+k−1 позицій, з них обираємо місця для k−1 перегородок: C(m+k−1, k−1). Варіант C(m−1, k−1) — для доданків ≥ 1 (без нуля).`, S1 + ' / ' + S2, { pts: 5 });
  H.TF('komb', R`$\binom{n}{k} = \binom{n-1}{k} + \binom{n-1}{k-1}$ für $n \ge 1$.`, true, R`Істинно — тотожність Паскаля (Additionstheorem). Ідея: фіксуємо елемент n: або він не в підмножині (C(n−1, k)), або в ній (C(n−1, k−1)).`, ER + ' 4');
  H.TF('komb', R`$\sum_{k=0}^{n} \binom{n}{k} = 2^n$`, true, R`Істинно: зліва — кількість підмножин, розбитих за розміром; справа — кількість усіх підмножин. (Або біном Ньютона з x = y = 1.)`, ER + ' 4');
  H.TF('komb', R`$\binom{n}{k} = \binom{n}{n-k}$ für $0 \le k \le n$.`, true, R`Істинно (симетрія): вибрати k елементів = вибрати n−k, які НЕ беремо.`, ER + ' 4');
  H.NUM('komb', R`Wie viele surjektive Abbildungen $\{1,2,3\} \to \{a, b\}$ gibt es?`, [6], R`Усіх функцій 2³ = 8; не сюр'єктивні лише 2 константні. 8 − 2 = <b>6</b>.`, EX, { label: 'Anzahl =' });
  H.NUM('komb', R`Wie viele Bijektionen $\{1,\dots,5\} \to \{1,\dots,5\}$ gibt es?`, [120], R`Перестановки: 5! = 120.`, EX, { label: 'Anzahl =' });
  H.NUM('komb', R`Wie viele verschiedene Wörter entstehen durch Umordnen der Buchstaben von ANANAS?`, [60], R`6 букв: A ×3, N ×2, S ×1. Мультиноміальний коефіцієнт: 6!/(3!·2!·1!) = 720/12 = <b>60</b>.`, EX, { label: 'Anzahl =' });
  H.NUM('komb', R`Wie viele Teilmengen von $\{1,\dots,10\}$ haben eine gerade Anzahl von Elementen?`, [512], R`Рівно половина з 2¹⁰ підмножин: 2⁹ = <b>512</b> (з Σ(−1)^k C(n,k) = 0 при n ≥ 1).`, EX, { label: 'Anzahl =' });
  H.NUM('komb', R`Welchen Koeffizienten hat $x^2$ in $(1+x)^5$?`, [10], R`Біном Ньютона: коефіцієнт при x^k — C(5, k). C(5,2) = 10.`, EX, { label: 'Koeffizient =' });
  H.TF('komb', R`Unter 13 Personen haben mindestens zwei im selben Monat Geburtstag.`, true, R`Істинно — принцип Діріхле (Schubfachprinzip): 13 «голубів» у 12 «скриньок».`, EX);
  H.PROOF('komb', R`Beweisen Sie mittels bijektivem Beweis: $\displaystyle\sum_{i \in \mathbb{Z}} \binom{n}{i}\binom{m}{k-i} = \binom{n+m}{k}$ für $n, m, k \in \mathbb{N}$ (Vandermonde).`,
    R`Sei $X = \{1,\dots,n\}$, $Y = \{n+1,\dots,n+m\}$, disjunkt, $|X \cup Y| = n+m$. Rechts: $\binom{n+m}{k} = |\{T \subseteq X\cup Y \mid |T| = k\}|$.<br>Für jedes solche $T$ sei $i = |T \cap X|$, dann $|T \cap Y| = k - i$. Die Abbildung $T \mapsto (T\cap X, T \cap Y)$ ist eine Bijektion von $\binom{X\cup Y}{k}$ auf $\bigcup_{i} \binom{X}{i}\times\binom{Y}{k-i}$ (disjunkte Vereinigung) mit Umkehrabbildung $(U, V) \mapsto U \cup V$.<br>Also $\binom{n+m}{k} = \sum_i \left|\binom{X}{i}\right|\cdot\left|\binom{Y}{k-i}\right| = \sum_i \binom{n}{i}\binom{m}{k-i}$. (Für $i<0$ oder $i>n$ ist der Summand $0$.) $\square$`,
    R`Ідея «бієктивного доведення»: обидві сторони рахують ту саму множину — k-підмножини з n «червоних» і m «синіх» елементів, згруповані за кількістю червоних i.`, S1 + ', 2.7', 16);
  H.PROOF('komb', R`Zeigen Sie mit Induktion: Summiert man über alle nichtleeren Teilmengen $T \subseteq \{1,\dots,n\}$ den Kehrwert des Produkts ihrer Elemente, so erhält man $n$.`,
    R`Sei $S_n = \sum_{\emptyset \neq T \subseteq [n]} \prod_{t \in T} \frac1t$. IA: $S_1 = 1$.<br>IS $n \to n+1$: Nichtleere Teilmengen von $[n+1]$ sind (i) nichtleere $T \subseteq [n]$, (ii) $\{n+1\}$, (iii) $T \cup \{n+1\}$ mit $\emptyset \ne T \subseteq [n]$. Also $S_{n+1} = S_n + \frac{1}{n+1} + \frac{1}{n+1} S_n \overset{IV}{=} n + \frac{1 + n}{n+1} = n+1$. $\square$`,
    R`Ідея: розбиваємо підмножини за тим, чи містять вони новий елемент n+1.`, ER + ' 8', 8);

  // ================= WACHSTUM =================
  const lanH = [
    [R`\binom{n^2}{2}`, R`n^4`, 'Θ', R`C(n², 2) = n²(n²−1)/2 ≈ n⁴/2 — той самий порядок.`],
    [R`\binom{2n}{3}`, R`\binom{3n}{2}`, 'ω', R`C(2n,3) ≈ (2n)³/6 = 4n³/3 (кубічна), C(3n,2) ≈ 9n²/2 (квадратична).`],
    [R`(n+1)^5`, R`n^{5+1}`, 'o', R`(n+1)⁵ ∈ Θ(n⁵), а n⁵/n⁶ = 1/n → 0.`],
    [R`n`, R`2^{\log n}`, 'Θ', R`2^{log₂ n} = n — це одна й та сама функція.`],
    [R`n^2`, R`2^{(\log n)^2}`, 'o', R`n² = 2^{2 log n}, а 2 log n ≪ (log n)². Порівнюємо показники: 2 log n − (log n)² → −∞.`],
    [R`\left(\tfrac{n}{3}\right)^n`, R`n!`, 'o', R`Стірлінг: n! ≈ √(2πn)(n/e)ⁿ. Відношення (n/3)ⁿ/n! ≈ (e/3)ⁿ/√(2πn) → 0, бо e < 3.`],
    [R`\binom{2n}{n}`, R`5^n`, 'o', R`C(2n, n) ≤ 4ⁿ, а 4ⁿ/5ⁿ = (4/5)ⁿ → 0.`],
    [R`\frac{n}{\log n}`, R`\sqrt{n}\log n`, 'ω', R`Відношення = √n/(log n)² → ∞ (будь-який корінь росте швидше за будь-який степінь логарифма).`],
    [R`\frac{1}{n}`, R`7`, 'o', R`1/n → 0, а 7 — стала. (1/n)/7 → 0.`],
    [R`\sqrt{n}`, R`\sum_{i=1}^{n} \frac{1}{i}`, 'ω', R`Гармонічне число Hₙ ≈ ln n ∈ Θ(log n), а √n ≫ log n.`],
  ];
  lanH.forEach(([f, g, a, e], i) => H.LAN(f, g, a, e, HB + ', A5.' + (i + 1)));
  const lanF = [
    [R`3\binom{n}{2}`, R`2n^3`, 'o', R`3·C(n,2) ≈ 1.5n² — квадратична проти кубічної.`],
    [R`n^1`, R`1^n`, 'ω', R`1ⁿ = 1 — стала, а n → ∞.`],
    [R`n^2`, R`2^n`, 'o', R`Будь-який многочлен росте повільніше за експоненту.`],
    [R`2^{n^2}`, R`n^n`, 'ω', R`nⁿ = 2^{n log n}; порівнюємо показники n² і n log n: n² ≫ n log n.`],
    [R`n^n`, R`2^{n \log n}`, 'Θ', R`2^{n log₂ n} = (2^{log₂ n})ⁿ = nⁿ — це одна функція.`],
    [R`\binom{2n}{n}`, R`2^n`, 'ω', R`C(2n,n) ≥ 4ⁿ/(2n+1) (найбільший з 2n+1 коефіцієнтів, сума яких 4ⁿ), а 4ⁿ/((2n+1)·2ⁿ) = 2ⁿ/(2n+1) → ∞.`],
    [R`n \log n`, R`\log(n!)`, 'Θ', R`log(n!) = Σ log i ≤ n log n, і log(n!) ≥ (n/2)·log(n/2) ∈ Ω(n log n). Тому Θ.`],
    [R`n^n`, R`n!`, 'ω', R`nⁿ/n! ≈ eⁿ/√(2πn) → ∞.`],
    [R`\log(n)`, R`\sqrt{n}`, 'o', R`Логарифм росте повільніше за будь-який корінь.`],
    [R`n\log(n)`, R`\sum_{i=1}^{n} \frac{n}{i}`, 'Θ', R`Σ n/i = n·Hₙ ≈ n ln n ∈ Θ(n log n).`],
  ];
  lanF.forEach(([f, g, a, e], i) => H.LAN(f, g, a, e, FJ + ', A4.' + (i + 1)));
  const lanS = [
    [R`2^n`, R`n^2`, 'ω', R`Експонента ≫ многочлен.`, S2],
    [R`\log n`, R`n \log n`, 'o', R`Відношення = 1/n → 0.`, S2],
    [R`n`, R`n + \log n`, 'Θ', R`n ≤ n + log n ≤ 2n.`, S2],
    [R`n^2`, R`n^{1{,}5}`, 'ω', R`n²/n^{1.5} = √n → ∞.`, S2],
    [R`n`, R`n!`, 'o', R`n/n! = 1/(n−1)! → 0.`, S2],
    [R`\log(n \log n)`, R`\log n`, 'Θ', R`log(n log n) = log n + log log n, а log log n ≪ log n.`, ER + ' 9'],
    [R`\log n^{42}`, R`\log n`, 'Θ', R`log n⁴² = 42·log n — стала множник.`, ER + ' 9'],
    [R`\log\log n^3`, R`\log n`, 'o', R`log log n³ = log(3 log n) = log 3 + log log n ≪ log n.`, ER + ' 9'],
    [R`\sqrt{n}`, R`\sqrt{n \log n}`, 'o', R`Відношення = 1/√(log n) → 0.`, ER + ' 9'],
    [R`\log^* n`, R`\log n`, 'o', R`Ітерований логарифм log* n (скільки разів брати log до ≤ 1) росте неймовірно повільно.`, ER + ' 9'],
    [R`2^{2n}`, R`2^n`, 'ω', R`2^{2n} = 4ⁿ, а 4ⁿ/2ⁿ = 2ⁿ → ∞. Пастка: множник у ПОКАЗНИКУ — не сталий множник!`, EX],
    [R`2^{n+1}`, R`2^n`, 'Θ', R`2^{n+1} = 2·2ⁿ — сталий множник 2.`, EX],
    [R`\log_2 n`, R`\log_{10} n`, 'Θ', R`log₂ n = log₁₀ n / log₁₀ 2 — основи логарифмів відрізняються сталим множником.`, EX],
    [R`n^{100}`, R`1{,}01^n`, 'o', R`Будь-яка експонента aⁿ з a > 1 зрештою обганяє будь-який многочлен.`, EX],
    [R`(\log n)^{100}`, R`n^{0{,}01}`, 'o', R`Будь-який степінь логарифма ≪ будь-який додатний степінь n.`, EX],
    [R`n!`, R`2^{n^2}`, 'o', R`n! ≤ nⁿ = 2^{n log n} ≪ 2^{n²}.`, EX],
  ];
  lanS.forEach(([f, g, a, e, s]) => H.LAN(f, g, a, e, s));
  H.TF('wachs', R`Für alle $f, g\colon \mathbb{N} \to \mathbb{R}^+$ gilt: $f \in o(g) \Rightarrow f \in O(g)$.`, true, R`Істинно: o вимагає f ≤ c·g для ВСІХ c > 0, а O — лише для ОДНОГО c.`, ER + ' 9');
  H.TF('wachs', R`$f \in \Theta(g) \Leftrightarrow g \in \Theta(f)$.`, true, R`Істинно: Θ симетричне (c₁g ≤ f ≤ c₂g ⇔ f/c₂ ≤ g ≤ f/c₁).`, EX);
  H.TF('wachs', R`$f \in o(g) \Leftrightarrow g \in \omega(f)$.`, true, R`Істинно: f/g → 0 ⇔ g/f → ∞.`, EX);
  H.TF('wachs', R`Für alle $f, g$ gilt $f \in O(g)$ oder $g \in O(f)$.`, false, R`Хибно. f(n) = n для парних, 1 для непарних; g навпаки. Жодна не обмежена сталою кратністю іншої.`, EX);
  H.PROOF('wachs', R`Zeigen Sie: Gilt $f \in o(g)$ und $g \in O(h)$, dann gilt $f \in o(h)$.`,
    R`Wegen $g \in O(h)$ gibt es $C > 0$, $n_1$ mit $g(n) \le C h(n)$ für $n \ge n_1$. Sei $c > 0$ beliebig. Wegen $f \in o(g)$ gibt es $n_2$ mit $f(n) \le \frac{c}{C}g(n)$ für $n \ge n_2$. Für $n \ge \max(n_1, n_2)$: $f(n) \le \frac{c}{C} g(n) \le \frac{c}{C} C h(n) = c\,h(n)$. Da $c$ beliebig war: $f \in o(h)$. $\square$`,
    R`Ідея: o — «для кожного c», тож беремо c/C, щоб компенсувати сталу з O.`, ER + ' 9', 5);
  H.MC('wachs', R`Laufzeit von <code>for i=1..n: for j=i..n: sum++</code>?`, [R`$\Theta(n^2)$`, R`$\Theta(n)$`, R`$\Theta(n \log n)$`, R`$\Theta(n^3)$`], 0, R`Кількість ітерацій: Σᵢ (n − i + 1) = n(n+1)/2 ∈ Θ(n²).`, ER + ' 9');
  H.MC('wachs', R`Laufzeit von <code>for i=1..1000·n: for j=1..1000: sum++</code>?`, [R`$\Theta(n)$`, R`$\Theta(n^2)$`, R`$\Theta(1)$`, R`$\Theta(n \log n)$`], 0, R`10⁶·n ітерацій — сталий множник 10⁶, тож Θ(n).`, ER + ' 9');
})();
