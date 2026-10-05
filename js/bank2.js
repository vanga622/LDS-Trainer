/* Static question bank, part 2: Aussagenlogik, Prädikatenlogik */
(function () {
  const R = String.raw;
  const H = window.BankHelpers;
  const L = window.Logic;
  const HB = 'Prüfung Herbst 2026', FJ = 'Prüfung Frühjahr 2026', S1 = 'Scheinklausur 1 (WS 25/26)', S2 = 'Scheinklausur 2 (WS 25/26)', ER = 'Ergänzungsblatt', EX = 'Додаткове завдання', OLD = 'Altklausur';
  const NONE = 'keine der anderen Antworten ist richtig';

  // Simplification task: answer computed by truth tables (never wrong)
  function SIMP(F, opts, expl, src) {
    const options = opts.map((o) => '<span class="formula">' + (F.name || 'F') + ' ≡ ' + L.show(o) + '</span>').concat([NONE]);
    let ans = opts.findIndex((o) => L.equiv(F.f, o));
    if (ans < 0) ans = opts.length;
    return window.BANK.push({
      id: 'al-simp-' + window.BANK.length, topic: 'al', type: 'mc', kind: 'simp',
      q: R`Vereinfachen Sie die Formel und kreuzen Sie die richtige Antwort an: <span class="formula">${F.name || 'F'} = ${L.show(F.f)}</span>`,
      options, answer: ans, expl, src, pts: 2, formula: F.f,
    });
  }
  const hb = [
    [{ name: 'P', f: 'A & C & (B -> (A | C))' }, ['A | !B | C', 'A & !B & C', 'A | C', 'A & C'], R`Оскільки P вимагає A = 1, підформула A ∨ C завжди 1, і B → 1 ≡ 1. Залишається A ∧ C.`],
    [{ name: 'Q', f: '(A -> B) & (!B -> !A)' }, ['A <-> B', '!A | B', 'A | !B', 'A'], R`¬B → ¬A — це контрапозиція A → B, тобто та сама формула. Q ≡ A → B ≡ ¬A ∨ B.`],
    [{ name: 'R', f: 'C -> ((A | B) & A)' }, ['A', 'A | B', 'A | C', 'B | !C'], R`Поглинання: (A ∨ B) ∧ A ≡ A. Тоді R ≡ C → A ≡ ¬C ∨ A. Такого варіанту немає → «keine». Пастка: A ∨ C — це інша формула (C=1, A=0 дає 1).`],
    [{ name: 'S', f: 'A & (A <-> B)' }, ['A', 'B', 'A | B', 'A & B'], R`Якщо A = 1, то A ↔ B ≡ B. Отже S ≡ A ∧ B.`],
    [{ name: 'T', f: '(A & !B) | (!A & B)' }, ['(A | B) & (!A | !B)', '(!A | B) & (A | !B)', 'A <-> B', '(A -> B) & (!B -> !A)'], R`T — це XOR («рівно одна з двох»). KNF XOR: (A ∨ B) ∧ (¬A ∨ ¬B) — «хоча б одна» і «не обидві». Варіант 2 — це A ↔ B (заперечення XOR).`],
  ];
  hb.forEach(([F, o, e], i) => SIMP(F, o, e, HB + ', A8.' + (i + 1)));
  const fj = [
    [{ name: 'P', f: '((A & B) -> C) & (!A | C)' }, ['!A | !B | C', '!A | C', '!B | C', 'C'], R`(A ∧ B) → C ≡ ¬A ∨ ¬B ∨ C. Тоді (¬A ∨ ¬B ∨ C) ∧ (¬A ∨ C) ≡ ¬A ∨ C (поглинання: менша клауза «перемагає»).`],
    [{ name: 'Q', f: '(A -> B) & (B -> C)' }, ['A -> C', '!A & B & C', '!A & !B & C', 'C'], R`Q сильніша за A → C (A=1,B=0,C=1: A→C = 1, а Q = 0). Інші варіанти теж не збігаються → «keine».`],
    [{ name: 'R', f: '!A <-> (A | B)' }, ['A & !B', '!A', '!A & B', 'B'], R`Випадок A = 1: ¬A = 0, A ∨ B = 1 → 0. Випадок A = 0: 1 ↔ B ≡ B. Отже R ≡ ¬A ∧ B.`],
    [{ name: 'S', f: '(A & B) | (!A & !B)' }, ['A | !A', '(A | !B) & (!A | B)', '(A & !B) | (!A & B)', 'B & !B'], R`S ≡ A ↔ B («обидві однакові»). KNF: (A ∨ ¬B) ∧ (¬A ∨ B) = (B → A) ∧ (A → B).`],
    [{ name: 'T', f: '(A | C) & (!A | C)' }, ['A', '!A', 'C', '!C'], R`Дистрибутивність: (A ∨ C) ∧ (¬A ∨ C) ≡ (A ∧ ¬A) ∨ C ≡ C. (Це також резольвента двох клауз!)`],
  ];
  fj.forEach(([F, o, e], i) => SIMP(F, o, e, FJ + ', A7.' + (i + 1)));
  const ex = [
    [{ f: '(A | B) & !A' }, ['B', '!A & B', 'A | B', '!A'], R`Розподіляємо: (A ∧ ¬A) ∨ (B ∧ ¬A) ≡ ¬A ∧ B.`],
    [{ f: '!(A -> B)' }, ['!A -> !B', 'A & !B', '!A | B', '!A & B'], R`A → B ≡ ¬A ∨ B; заперечення за де Морганом: A ∧ ¬B.`],
    [{ f: '(A -> B) & (A -> !B)' }, ['A', '!A', 'B', '!B'], R`(¬A ∨ B) ∧ (¬A ∨ ¬B) ≡ ¬A ∨ (B ∧ ¬B) ≡ ¬A.`],
    [{ f: 'A | (!A & B)' }, ['A', 'B', 'A | B', 'A & B'], R`Дистрибутивність: (A ∨ ¬A) ∧ (A ∨ B) ≡ A ∨ B.`],
    [{ f: '(A -> C) & (B -> C)' }, ['(A & B) -> C', '(A | B) -> C', 'A -> (B -> C)', 'C'], R`(¬A ∨ C) ∧ (¬B ∨ C) ≡ (¬A ∧ ¬B) ∨ C ≡ ¬(A ∨ B) ∨ C ≡ (A ∨ B) → C.`],
    [{ f: '!A -> (A & B & C & D)' }, ['A', 'A & B', 'B & C & D', '!A'], R`¬A → X ≡ A ∨ X, а A ∨ (A ∧ …) ≡ A (поглинання). Отже формула ≡ A.`],
    [{ f: '(A <-> B) | (A <-> !B)' }, ['A', 'A <-> B', 'B', '0'], R`Для кожної пари (A, B) рівно одна з A ↔ B, A ↔ ¬B істинна → формула — тавтологія (≡ 1). Серед варіантів 1 немає → «keine».`],
    [{ f: '(A & B) -> A' }, ['A', 'B', 'A -> B', '!A | !B'], R`(A ∧ B) → A ≡ ¬A ∨ ¬B ∨ A ≡ 1 — тавтологія. Варіанти не тавтології → «keine».`],
    [{ f: 'A -> (B -> A)' }, ['A', 'B -> A', 'A & B', '!A'], R`¬A ∨ ¬B ∨ A ≡ 1 — тавтологія (аксіома K). Жоден варіант не є тавтологією → «keine».`],
    [{ f: '(A | B) & (A | !B)' }, ['A', 'B', 'A | B', 'A & B'], R`(A ∨ B) ∧ (A ∨ ¬B) ≡ A ∨ (B ∧ ¬B) ≡ A. (Резольвента двох клауз.)`],
  ];
  ex.forEach(([F, o, e]) => SIMP(F, o, e, EX));

  // ----- Aussagenlogik TF / MC -----
  H.TF('al', R`Bei jeder erfüllbaren aussagenlogischen Formel $F$ ist $\neg F$ unerfüllbar.`, false, R`Хибно: F = A — виконувана, і ¬A теж виконувана (A = 0). Правильно: F <b>gültig</b> ⇔ ¬F unerfüllbar.`, HB + ', A1.10');
  H.TF('al', R`$F$ ist gültig genau dann, wenn $\neg F$ unerfüllbar ist.`, true, R`Істинно: F завжди 1 ⇔ ¬F завжди 0.`, EX);
  H.TF('al', R`<span class="formula">(A → B) ∧ ¬A</span> ist erfüllbar.`, true, R`A = 0 (B будь-яке): A → B = 1 і ¬A = 1.`, S1 + ', 13a');
  H.TF('al', R`<span class="formula">(A → B) ↔ (¬A → ¬B)</span> ist gültig.`, false, R`A = 1, B = 0: ліва 0, права (0 → 1) = 1, ↔ дає 0. (¬A → ¬B — це B → A, обернена імплікація.)`, S1 + ', 13b');
  H.TF('al', R`Die Formel <span class="formula">A ∨ B</span> ist in KNF.`, true, R`Так: це кон'юнкція з однієї клаузи (A ∨ B). Вона також у DNF (дві кон'юнкції по одному літералу).`, S1 + ', 13c');
  H.TF('al', R`<span class="formula">(A ∨ B) ∧ C ≡ (A ∧ C) ∨ (B ∧ C)</span>`, true, R`Дистрибутивний закон.`, S1 + ', 13d');
  H.TF('al', R`<span class="formula">0 → 0</span> ist gültig.`, true, R`0 → 0 = 1 (з хибного випливає що завгодно), і це значення не залежить від жодної змінної → тавтологія.`, S1 + ', 13e');
  H.TF('al', R`Ist eine Formel $F$ genau dann erfüllbar, wenn $\neg F$ unerfüllbar ist?`, false, R`Ні. F = A: виконувана, ¬A теж виконувана.`, OLD + ' SS 2019, A3.1', { labels: ['Ja', 'Nein'] });
  H.TF('al', R`Gilt <span class="formula">¬(A → B) ≡ ¬A → ¬B</span>?`, false, R`Ні: ¬(A → B) ≡ A ∧ ¬B, а ¬A → ¬B ≡ A ∨ ¬B. При A = 1, B = 1 перша 0, друга 1.`, OLD + ' SS 2019, A3.2', { labels: ['Ja', 'Nein'] });
  H.TF('al', R`Ist die Formel <span class="formula">A ∨ ¬B</span> in disjunktiver Normalform?`, true, R`Так: диз'юнкція двох «кон'юнкцій» з одним літералом кожна.`, OLD + ' SS 2019, A3.4', { labels: ['Ja', 'Nein'] });
  H.TF('al', R`Ist <span class="formula">¬A ∧ B ∧ C</span> eine Hornformel?`, true, R`Так: KNF з клаузами {¬A}, {B}, {C} — у кожній щонайбільше один позитивний літерал.`, OLD + ' SS 2019, A3.5', { labels: ['Ja', 'Nein'] });
  H.TF('al', R`Ist <span class="formula">(A ∨ B) ∧ ¬C</span> eine Hornformel?`, false, R`Ні: клауза (A ∨ B) має ДВА позитивні літерали.`, EX, { labels: ['Ja', 'Nein'] });
  H.TF('al', R`Ist eine Menge $M$ aussagenlogischer Formeln genau dann erfüllbar, wenn jede Teilmenge von $M$ erfüllbar ist?`, true, R`Так. «⇒»: модель M є моделлю кожної підмножини. «⇐»: M — підмножина самої себе.`, OLD + ' SS 2019, A3.6', { labels: ['Ja', 'Nein'] });
  H.TF('al', R`Ist $M$ genau dann nicht erfüllbar, wenn keine Teilmenge von $M$ erfüllbar ist?`, false, R`Ні: ∅ ⊆ M завжди виконувана. M = {A, ¬A} невиконувана, але {A} виконувана.`, OLD + ' SS 2019, A3.7', { labels: ['Ja', 'Nein'] });
  H.TF('al', R`Gilt für beliebige Formelmengen: $M$ erfüllbar und $N$ erfüllbar $\Leftrightarrow$ $M \cap N$ erfüllbar?`, false, R`Ні. Напрям «⇒» правильний (M ∩ N ⊆ M), але «⇐» хибний: M = {A, ¬A}, N = {B} — M ∩ N = ∅ виконувана, а M — ні.`, OLD + ' SS 2019, A3.8', { labels: ['Ja', 'Nein'] });
  H.TF('al', R`Sei $M = \{F_1, F_2, \dots\}$. Ist $\{F_n, \dots, F_{2n}\}$ für alle $n \ge 1$ erfüllbar, dann ist $M$ erfüllbar.`, false, R`Хибно. Вікна {Fₙ…F₂ₙ} не покривають усі скінченні підмножини. Контрприклад: F₁ = A, F₃ = ¬A, решта Fᵢ = 1. F₁ і F₃ ніколи не опиняються в одному вікні ({F₁,F₂}, {F₂,F₃,F₄}, …), але M невиконувана.`, S2 + ', 7a');
  H.TF('al', R`Ist $\{F_2, F_3, F_5, F_7, F_{11}\}$ unerfüllbar, dann ist auch $M = \{F_1, F_2, \dots\}$ unerfüllbar.`, true, R`Істинно: модель M була б моделлю й будь-якої підмножини.`, S2 + ', 7b');
  H.TF('al', R`Ist $M = \{F_1, F_2, \dots\}$ unerfüllbar, dann gibt es ein $i \ge 1$, sodass $F_i$ unerfüllbar ist.`, false, R`Хибно: M = {A, ¬A, …} невиконувана, хоча кожна формула окремо виконувана. Endlichkeitssatz гарантує лише СКІНЧЕННУ невиконувану підмножину, а не одну формулу.`, S2 + ', 7c');
  H.TF('al', R`Ist $S_n = \{F_1, \dots, F_{2n}\}$ für alle $n \in \mathbb{N}$ erfüllbar, dann ist $M = \{F_1, F_2, \dots\}$ erfüllbar.`, true, R`Істинно за Endlichkeitssatz (теорема компактності): кожна скінченна підмножина M міститься в деякому Sₙ і тому виконувана ⇒ M виконувана.`, ER + ' 7');
  H.TF('al', R`Ist $R_n = \{F_n, F_{n+1}\}$ für alle $n \ge 1$ erfüllbar, dann ist $M$ erfüllbar.`, false, R`Хибно: F₁ = A, F₂ = 1, F₃ = ¬A: пари {F₁,F₂}, {F₂,F₃} виконувані, але {F₁, F₃} — ні.`, ER + ' 7');
  H.MULTI('al', R`Welche der folgenden Formeln sind gültig?`, ['<span class="formula">A → A</span>', '<span class="formula">0 → A</span>', '<span class="formula">1 → A</span>', '<span class="formula">A → 0</span>', '<span class="formula">A → 1</span>'], [0, 1, 4],
    R`A → A завжди 1. 0 → A = 1 (з хибного — що завгодно). A → 1 = 1. А 1 → A ≡ A і A → 0 ≡ ¬A — не тавтології.`, S2 + ', 5', { pts: 5 });
  H.MULTI('al', R`Welche der folgenden Formeln sind äquivalent zu <span class="formula">A ↔ B</span>?`,
    ['<span class="formula">(A → B) ∨ (B → A)</span>', '<span class="formula">(¬A ∨ B) ∧ (A ∨ ¬B)</span>', '<span class="formula">B ↔ A</span>', '<span class="formula">A ∧ B</span>', '<span class="formula">(A → A) ∧ (B → B)</span>', '<span class="formula">(A ∧ B) ∨ (¬A ∧ ¬B)</span>'], [1, 2, 5],
    R`A ↔ B ≡ (A → B) ∧ (B → A) ≡ (¬A ∨ B) ∧ (A ∨ ¬B) (KNF) ≡ (A ∧ B) ∨ (¬A ∧ ¬B) (DNF), і ↔ комутативна. Варіант 1 з ∨ — тавтологія; варіант 5 — теж тавтологія; A ∧ B хибна при A = B = 0.`, S2 + ', 6', { pts: 6 });
  H.MC('al', R`Sei $\mathcal{A}(A) = 1$, $\mathcal{A}(B) = 1$, $\mathcal{A}(C) = 0$. Dann ist $\mathcal{A}($<span class="formula">A ∨ (B ∧ ¬A)</span>$) =$`, ['0', '1'], 1, R`A = 1, отже вся диз'юнкція = 1, решту можна не рахувати.`, S1 + ', 9', { inline: true, pts: 3 });
  window.BANK.push({ id: 'al-assign-s1', topic: 'al', type: 'assign', q: R`Sei <span class="formula">F = A ↔ (B → C)</span>. Geben Sie eine Belegung an, die $F$ erfüllt.`, formula: 'A <-> (B -> C)', vars: ['A', 'B', 'C'], solution: 'A=1, B=0, C=0', expl: R`Напр., A = 1, B = 0: B → C = 1 = A ✓. Або A = 0, B = 1, C = 0: B → C = 0 = A ✓.`, src: S1 + ', 10', pts: 4 });
  window.BANK.push({ id: 'al-assign-s2', topic: 'al', type: 'assign', q: R`Sei <span class="formula">F = A ∧ (B ↔ C)</span>. Geben Sie eine Belegung an, die $F$ erfüllt.`, formula: 'A & (B <-> C)', vars: ['A', 'B', 'C'], solution: 'A=1, B=1, C=1', expl: R`Потрібно A = 1 і B = C. Напр., A = B = C = 1 або A = 1, B = C = 0.`, src: S2 + ', 4', pts: 4 });
  window.BANK.push({ id: 'al-knf-s1', topic: 'al', type: 'formula', q: R`Geben Sie eine zu <span class="formula">¬(A ∧ B) ∧ (C ∨ ¬A)</span> äquivalente Formel in <b>KNF</b> an.`, target: '!(A & B) & (C | !A)', form: 'KNF', solution: '(¬A ∨ ¬B) ∧ (¬A ∨ C)', expl: R`Де Морган: ¬(A ∧ B) ≡ ¬A ∨ ¬B. Отже (¬A ∨ ¬B) ∧ (¬A ∨ C) — вже KNF. (Можна ще спростити до ¬A ∨ (¬B ∧ C), але це DNF.)`, src: S1 + ', 11', pts: 4 });
  window.BANK.push({ id: 'al-dnf-s1', topic: 'al', type: 'formula', q: R`Geben Sie eine zu <span class="formula">A ↔ B</span> äquivalente Formel in <b>DNF</b> an.`, target: 'A <-> B', form: 'DNF', solution: '(A ∧ B) ∨ (¬A ∧ ¬B)', expl: R`A ↔ B істинна, коли обидві 1 або обидві 0: (A ∧ B) ∨ (¬A ∧ ¬B).`, src: S1 + ', 12', pts: 4 });
  window.BANK.push({ id: 'al-dnf-2019', topic: 'al', type: 'formula', q: R`Geben Sie eine zu <span class="formula">(A ∨ ¬B) → ¬C</span> äquivalente Formel in <b>DNF</b> an.`, target: '(A | !B) -> !C', form: 'DNF', solution: '(¬A ∧ B) ∨ ¬C', expl: R`X → Y ≡ ¬X ∨ Y; ¬(A ∨ ¬B) ≡ ¬A ∧ B. Отже (¬A ∧ B) ∨ ¬C.`, src: OLD + ' SS 2019, A2a', pts: 2 });
  window.BANK.push({ id: 'al-knf-2020', topic: 'al', type: 'formula', q: R`Geben Sie die kürzeste zu <span class="formula">A ∨ B</span> äquivalente Formel in <b>KNF</b> an.`, target: 'A | B', form: 'KNF', solution: 'A ∨ B', expl: R`A ∨ B — вже KNF з однією клаузою.`, src: OLD + ' WS 2020, A1a', pts: 1 });
  window.BANK.push({ id: 'al-horn-2019', topic: 'al', type: 'formula', q: R`Geben Sie eine zu <span class="formula">¬A ∧ (¬B ∨ C) ∧ (A ∨ ¬C)</span> äquivalente <b>Hornformel</b> an.`, target: '!A & (!B | C) & (A | !C)', form: 'Horn', solution: '¬A ∧ (¬B ∨ C) ∧ (A ∨ ¬C)', expl: R`Формула вже Horn: у кожній клаузі ≤ 1 позитивного літерала ({¬A}, {¬B, C}, {A, ¬C}). Також еквівалентно ¬A ∧ ¬B ∧ ¬C.`, src: EX, pts: 2 });
  H.NUM('al', R`Wie viele Modelle $\mathcal{A}\colon \{A,B,C\} \to \{0,1\}$ besitzt <span class="formula">F = ¬A ∧ (¬B ∨ C) ∧ (A ∨ B ∨ C) ∧ (A ∨ ¬C)</span>?`, [0],
    R`¬A ⇒ A = 0. (A ∨ ¬C) ⇒ C = 0. (¬B ∨ C) ⇒ B = 0. Тоді (A ∨ B ∨ C) = 0. Отже моделей <b>0</b> — і резолюцією виводиться порожня клауза □.`, OLD + ' SS 2019, A1b', { label: 'Anzahl =' });
  H.NUM('al', R`Wie viele Modelle hat <span class="formula">A ↔ (B ↔ C)</span> (über $\{A,B,C\}$)?`, [4], R`A ↔ (B ↔ C) істинна ⇔ кількість нулів серед A, B, C парна (асоціативність ↔). Рядки 111, 100, 010, 001 → <b>4</b>.`, OLD + ' WS 2020, A1b', { label: 'Anzahl =' });
  H.TF('al', R`Ist die Klauselmenge $\{\{A,B,C\}, \{\neg A\}, \{C,\neg B\}, \{A,\neg C\}, \{D\}\}$ erfüllbar?`, false,
    R`Ні. {¬A} ⇒ A = 0; {A, ¬C} ⇒ C = 0; {C, ¬B} ⇒ B = 0; тоді {A, B, C} хибна. Резолюцією: {A,B,C} + {¬A} → {B,C}; + {C,¬B} → {C}; {A,¬C} + {¬A} → {¬C}; {C} + {¬C} → □.`, OLD + ' WS 2020, A2b', { labels: ['Ja', 'Nein'], pts: 3 });
  H.TF('al', R`Ist die Hornformel <span class="formula">A ∧ (A → B) ∧ ((A ∧ B) → C) ∧ ((C ∧ D) → 0)</span> erfüllbar?`, true,
    R`Алгоритм маркування: факт A → маркуємо A; A → B: маркуємо B; A ∧ B → C: маркуємо C. Для (C ∧ D) → 0 потрібна позначка на D — її немає. Отже виконувана: A = B = C = 1, D = 0.`, ER + ' 5', { labels: ['Ja', 'Nein'] });
  H.TF('al', R`Ist die Hornformel <span class="formula">A ∧ (A → B) ∧ (B → 0)</span> erfüllbar?`, false, R`Маркуємо A, потім B; тоді B → 0 має позначену посилку → невиконувана.`, ER + ' 5', { labels: ['Ja', 'Nein'] });
  H.TF('al', R`Aus den Klauseln $\{A, B\}$ und $\{\neg A, \neg B\}$ kann man in einem Schritt die leere Klausel $\square$ resolvieren.`, false,
    R`Хибно: резолюція прибирає лише ОДНУ комплементарну пару. Резольвенти: {B, ¬B} або {A, ¬A} (тавтології). Справді, {A,B},{¬A,¬B} виконувана (A=1, B=0).`, EX);
  H.MC('al', R`Seien $E$ erfüllbar aber nicht gültig, $F$ unerfüllbar und $G$ gültig. Welche Eigenschaft hat <span class="formula">¬G ↔ (E → F)</span>?`, ['gültig', 'unerfüllbar', 'erfüllbar, aber nicht gültig'], 2,
    R`¬G ≡ 0, E → F ≡ E → 0 ≡ ¬E. Тоді 0 ↔ ¬E ≡ E — виконувана, але не загальнозначуща.`, OLD + ' WS 2020, A2a');
  H.MC('al', R`Seien $E$ erfüllbar aber nicht gültig, $F$ unerfüllbar und $G$ gültig. Welche Eigenschaft hat <span class="formula">F → E</span>?`, ['gültig', 'unerfüllbar', 'erfüllbar, aber nicht gültig'], 0, R`F ≡ 0, а 0 → щось ≡ 1. Тавтологія.`, OLD + ' WS 2020, A2a');
  H.MC('al', R`Sei $G$ unerfüllbar. Für welche Formeln $H$ ist <span class="formula">(G → H) → (G ↔ H)</span> gültig?`, ['für alle H', 'genau für unerfüllbare H', 'genau für gültige H', 'für kein H'], 1,
    R`G ≡ 0: G → H ≡ 1, отже формула ≡ G ↔ H ≡ 0 ↔ H ≡ ¬H. ¬H загальнозначуща ⇔ H невиконувана.`, OLD + ' WS 2017, A1b', { pts: 5 });
  H.PROOF('al', R`Zeigen Sie <span class="formula">¬A → (A ∧ B ∧ C ∧ D ∧ E) ≡ A</span>. Geben Sie explizit an, welche Sätze aus der Vorlesung Sie verwenden.`,
    R`$\neg A \to X \equiv \neg\neg A \vee X$ (Implikation als Disjunktion) $\equiv A \vee X$ (Doppelnegation). Mit $X = A \wedge (B \wedge C \wedge D \wedge E)$ (Assoziativität) gilt $A \vee (A \wedge Y) \equiv A$ (Absorption). $\square$`,
    R`Ланцюжок еквівалентностей з назвою кожного закону: імплікація → подвійне заперечення → асоціативність → поглинання.`, S1 + ', 14', 10);

  // ================= PRÄDIKATENLOGIK =================
  H.MC('pl', R`Welche Struktur ist ein Modell für $G = \forall x\big(\neg P(x,x) \wedge P(x,f(x))\big) \wedge \forall x\forall y\exists z\big(Q(x,y,z) \wedge \neg Q(x,y,f(z))\big) \wedge \forall x\forall y\forall z\big(Q(x,y,z) \to Q(f(x),y,f(z)) \wedge Q(x,f(y),f(z))\big)$?`,
    [R`$U = \mathbb{N}$, $f(x) = x+1$, $P = \{(m,n) \mid m < n\}$, $Q = \{(x,y,z) \mid z = x+y\}$`,
      R`$U = \mathbb{N}$, $f(x) = x+1$, $P = \{(m,n) \mid m < n\}$, $Q = \{(x,y,z) \mid z = x\cdot y\}$`,
      R`$U = \mathbb{N}$, $f(x) = x$, $P = \{(m,n) \mid m \neq n\}$, $Q = \{(x,y,z) \mid z = x+y\}$`,
      R`$U = \{0\}$, $f(0) = 0$, $P = \emptyset$, $Q = U^3$`], 0,
    R`Q(x,y,z) читаємо як «z = x + y», f — «+1». Перевірка: ∃z: z = x+y і z+1 ≠ x+y ✓; z = x+y ⇒ z+1 = (x+1)+y і z+1 = x+(y+1) ✓; ¬(x < x) і x < x+1 ✓. Для множення третя умова ламається ((x+1)·y ≠ xy+1). f(x) = x порушує P(x, f(x)) ∧ ¬P(x,x). Одноелементний універсум: f(0) = 0 дає суперечність P(0,0) ∧ ¬P(0,0).`, HB + ', A9', { pts: 5 });
  H.MC('pl', R`Welche Struktur ist ein Modell für $G = \forall x\, P(x,f(x)) \wedge \forall x\, \neg P(f(x),x) \wedge \forall x\forall y\forall z\big(P(x,y) \wedge P(y,z) \to P(x,z)\big)$?`,
    [R`$U = \mathbb{N}$, $f(x) = x+1$, $P = \{(m,n) \mid m < n\}$`, R`$U = \mathbb{N}$, $f(x) = x$, $P = \{(m,n) \mid m \le n\}$`, R`$U = \{0,1\}$, $f(x) = 1-x$, $P = \{(0,1),(1,0)\}$`, R`$U = \mathbb{N}$, $f(x) = x+1$, $P = \{(m,n) \mid m \neq n\}$`], 0,
    R`< на ℕ: x < x+1 ✓, ¬(x+1 < x) ✓, транзитивне ✓. При f(x) = x маємо ¬P(x,x), але ≤ рефлексивне ✗. {0,1}: P(f(0),0) = P(1,0) ∈ P ✗. ≠ не транзитивне і P(f(x),x) виконується ✗.`, FJ + ', A8', { pts: 5 });
  H.TF('pl', R`Besitzt $G = \forall x\, P(x,f(x)) \wedge \forall x\, \neg P(f(x),x) \wedge \forall x\forall y\forall z\big(P(x,y) \wedge P(y,z) \to P(x,z)\big)$ ein <b>endliches</b> Modell?`, false,
    R`Ні. У скінченному U послідовність v, f(v), f²(v), … зациклиться: fᵏ(v) = v. Транзитивність дає P(v, f^{k−1}(v)), але f(f^{k−1}(v)) = v, і аксіома ¬P(f(x), x) з x = f^{k−1}(v) каже ¬P(v, f^{k−1}(v)). Суперечність (для k = 1: P(v,v) і ¬P(v,v)).`, EX, { labels: ['Ja', 'Nein'], pts: 3 });
  H.TF('pl', R`Ist $F = P(a,f(a)) \wedge \forall x\big[\neg P(x,x) \wedge P(x,f(x)) \wedge \forall y\forall z\,((P(x,y)\wedge P(y,z)) \to P(x,z))\big]$ erfüllbar?`, true,
    R`Так: U = ℕ, a = 0, f(n) = n+1, P = <. Усі умови виконуються.`, OLD + ' WS 2017 / Tutorium 4', { labels: ['Ja', 'Nein'] });
  H.TF('pl', R`Ist dieselbe Formel $F = P(a,f(a)) \wedge \forall x[\dots]$ (wie oben) gültig?`, false,
    R`Ні: U = {0}, a = 0, f(0) = 0, P = {(0,0)} — P(0,0) ∧ ¬P(0,0) хибна. Отже є структура, що НЕ задовольняє F.`, OLD + ' WS 2017 / Tutorium 4', { labels: ['Ja', 'Nein'] });
  H.NUM('pl', R`Wie groß ist das kleinste Modell (Anzahl $|U|$) von $F = \forall x\,\big(P(f(x),x) \wedge \neg P(x,x)\big)$?`, [2],
    R`|U| = 1 неможливо: f(u) = u, тоді P(u,u) ∧ ¬P(u,u). |U| = 2: U = {0,1}, f(x) = 1 − x, P = {(0,1),(1,0)} — P(f(0),0) = P(1,0) ✓, P(f(1),1) = P(0,1) ✓, петель немає ✓. Мінімум = <b>2</b>.`, 'Tutorium 4, A2a', { label: '|U| =' });
  H.TF('pl', R`Ist $G = \forall x\,\big(P(f(a),x) \wedge \neg P(x,x)\big)$ erfüllbar?`, false, R`Ні: підставимо x := f(a). Отримуємо P(f(a), f(a)) ∧ ¬P(f(a), f(a)) — суперечність у будь-якій структурі.`, 'Tutorium 4, A2b', { labels: ['Ja', 'Nein'] });
  H.MC('pl', R`Bereinigen Sie $F = \exists y\, P(x,y) \wedge \forall x\, \exists y\, P(y, f(x,z))$.`,
    [R`$\exists y\, P(x,y) \wedge \forall u\, \exists v\, P(v, f(u,z))$`, R`$\exists y\, P(u,y) \wedge \forall x\, \exists v\, P(v, f(x,z))$`, R`$\exists y\, P(x,y) \wedge \forall x\, \exists y\, P(y, f(x,w))$`, R`$\forall u\,\exists y\,\exists v\,(P(x,y) \wedge P(v, f(u,z)))$`], 0,
    R`«Bereinigt» означає: (1) жодна змінна не буває і вільною, і зв'язаною; (2) за кожною змінною стоїть щонайбільше один квантор. x вільна зліва і зв'язана справа → перейменовуємо зв'язану x у u; y зв'язана двічі → друге y стає v. Вільні змінні (x, z) не перейменовуємо! Варіант 4 — вже пренексна форма, а не просто очищення.`, S2 + ', 8', { pts: 5 });
  H.MC('pl', R`Welche Formel ist eine zu $F = \exists x\, P(f(x)) \wedge \forall y\,\big((\exists z\, Q(y,z)) \vee P(y)\big)$ äquivalente Pränexnormalform?`,
    [R`$\exists x\, \forall y\, \exists z\, \big(P(f(x)) \wedge (Q(y,z) \vee P(y))\big)$`, R`$\forall y\, \exists x\, \exists z\, \big(P(f(x)) \vee Q(y,z) \vee P(y)\big)$`, R`$\exists x\, \exists z\, \forall y\, \big(P(f(x)) \wedge (Q(y,z) \vee P(y))\big)$`, R`$\exists x\, \forall y\, \big(P(f(x)) \wedge Q(y,z) \vee P(y)\big)$`], 0,
    R`Виносимо квантори назовні по черзі (змінні вже різні): ∃x A ∧ B ≡ ∃x(A ∧ B), якщо x не вільна в B; потім ∀y, потім ∃z (з (∃z Q) ∨ P(y) ≡ ∃z(Q ∨ P(y))). Порядок ∀y∃z не можна міняти на ∃z∀y — це змінило б зміст. Варіант 2 замінює ∧ на ∨, варіант 4 губить ∃z.`, S2 + ', 9', { pts: 5 });
  H.MC('pl', R`Welche Formel ist eine zu $F = \forall x\,\exists y\,\forall z\,\exists w\,\big(P(x,y) \wedge P(y,a) \wedge P(f(w,w),y) \wedge Q(z)\big)$ erfüllbarkeitsäquivalente Skolemform?`,
    [R`$\forall x\,\forall z\,\big(P(x,g(x)) \wedge P(g(x),a) \wedge P(f(h(x,z),h(x,z)),g(x)) \wedge Q(z)\big)$`, R`$\forall x\,\forall z\,\big(P(x,b) \wedge P(b,a) \wedge P(f(c,c),b) \wedge Q(z)\big)$`, R`$\forall x\,\forall z\,\big(P(x,g(x)) \wedge P(g(x),a) \wedge P(f(h(z),h(z)),g(x)) \wedge Q(z)\big)$`, R`$\exists y\,\exists w\,\forall x\,\forall z\,\big(P(x,y) \wedge P(y,a) \wedge P(f(w,w),y) \wedge Q(z)\big)$`], 0,
    R`Сколемізація: кожну ∃-змінну замінюємо новою функцією від УСІХ ∀-змінних, що стоять ЛІВОРУЧ від неї. y стоїть після ∀x → y := g(x). w стоїть після ∀x, ∀z → w := h(x,z). Нові символи g, h не повинні вже зустрічатися у формулі (f і a зайняті).`, S2 + ', 10', { pts: 5 });
  H.MULTI('pl', R`Sei $F = \forall x\,\big(P(f(x)) \vee \neg P(a)\big)$ und $\mathcal{A}$ eine Herbrand-Struktur für $F$. Mit welchen Interpretationen von $P$ erfüllt $\mathcal{A}$ die Formel $F$?`,
    [R`$P^{\mathcal{A}} = \emptyset$`, R`$P^{\mathcal{A}} = \{a\}$`, R`$P^{\mathcal{A}} = \{f(a)\}$`, R`$P^{\mathcal{A}} = D(F)$`, R`$P^{\mathcal{A}} = D(F) \setminus \{f(a)\}$`], [0, 2, 3],
    R`Herbrand-універсум D(F) = {a, f(a), f(f(a)), …}. F істинна ⇔ ¬P(a) АБО P(f(t)) для всіх t ∈ D(F). ∅ і {f(a)}: a ∉ P → ✓. D(F): усе в P → ✓. {a}: P(a), але P(f(a)) хибне → ✗. D(F)∖{f(a)}: P(a) істинне, P(f(a)) хибне (t = a) → ✗.`, S2 + ', 11', { pts: 5 });
  H.MC('pl', R`Womit zeigt man $\forall x\,\exists y\,F \not\equiv \exists y\,\forall x\,F$?`,
    [R`$F = P(x,y)$, $\mathcal{A} = (\mathbb{N},\ P^{\mathcal{A}} = \{(m,n) \mid m < n\})$`, R`$F = P(x,y)$, $\mathcal{A} = (\mathbb{N},\ P^{\mathcal{A}} = \mathbb{N}^2)$`, R`$F = P(x)$, $\mathcal{A} = (\mathbb{N},\ P^{\mathcal{A}} = \mathbb{N})$`, R`$F = P(x,y)$, $\mathcal{A} = (\{0\},\ P^{\mathcal{A}} = \{(0,0)\})$`], 0,
    R`У (ℕ, <): ∀x∃y x < y — істинне (y = x+1), а ∃y∀x x < y — хибне (немає найбільшого числа; x = y порушує). В інших структурах обидві формули мають однакове значення.`, S2 + ', 12', { pts: 5 });
  H.MULTI('pl', R`Sei $F = \forall x\forall y\big(\neg P(a, g(f(x),y)) \wedge Q(f(y)) \vee P(a,y) \wedge \neg Q(a)\big)$ ($f$ einstellig, $g$ zweistellig). Welche Terme liegen im Herbranduniversum $D(F)$?`,
    [R`$f(a,a)$`, R`$g(f(f(a)),a)$`, R`$g(g(a),a)$`, R`$g(a, f(g(a,a)))$`], [1, 3],
    R`D(F) — всі замкнені терми з константи a та функцій з ПРАВИЛЬНОЮ арністю: f — 1 аргумент, g — 2. f(a,a) — f з двома аргументами ✗; g(g(a),a) — внутрішній g з одним аргументом ✗.`, OLD + ' WS 2020, A3b', { pts: 2 });
  H.TF('pl', R`$\forall x\,(F \wedge G) \equiv \forall x\, F \wedge \forall x\, G$`, true, R`Істинно: ∀ розподіляється по ∧.`, EX);
  H.TF('pl', R`$\forall x\,(F \vee G) \equiv \forall x\, F \vee \forall x\, G$`, false, R`Хибно: «кожне число парне або непарне» істинне, але «всі парні або всі непарні» — ні.`, EX);
  H.TF('pl', R`$\exists x\,(F \wedge G) \equiv \exists x\, F \wedge \exists x\, G$`, false, R`Хибно: існує парне і існує непарне число, але немає числа, що одночасно парне й непарне. (∃ розподіляється по ∨, не по ∧.)`, EX);
  H.TF('pl', R`$\neg \forall x\, F \equiv \exists x\, \neg F$`, true, R`Істинно — де Морган для кванторів.`, EX);
  H.TF('pl', R`Wenn $x$ in $G$ nicht frei vorkommt, gilt $(\forall x\, F \to G) \equiv \exists x\,(F \to G)$.`, true,
    R`Істинно: ∀xF → G ≡ ¬∀xF ∨ G ≡ ∃x¬F ∨ G ≡ ∃x(¬F ∨ G) ≡ ∃x(F → G). Зверніть увагу: ∀ у посилці імплікації перетворюється на ∃!`, ER + ' 7');
  H.TF('pl', R`Eine Formel und ihre Skolemform sind immer äquivalent.`, false, R`Хибно: вони лише erfüllbarkeitsäquivalent (одночасно виконувані чи ні). ∃x P(x) і P(a) не еквівалентні.`, EX);
  H.TF('pl', R`Eine geschlossene Formel in Skolemform ist genau dann erfüllbar, wenn sie ein Herbrand-Modell besitzt.`, true, R`Істинно — основна теорема теорії Ербрана (Satz von Herbrand).`, EX);
  H.TF('pl', R`Die Gültigkeit prädikatenlogischer Formeln ist entscheidbar.`, false, R`Хибно: проблема загальнозначущості в логіці предикатів нерозв'язна (Church/Turing). Вона лише напіврозв'язна.`, EX);
  H.TF('pl', R`Die Menge der unerfüllbaren prädikatenlogischen Formeln ist semi-entscheidbar.`, true, R`Істинно: за Ербраном/Гілморі можна перебирати скінченні підмножини розкладу Ербрана й знайти невиконувану, якщо F невиконувана.`, EX);
  H.MC('pl', R`Welche Variablen kommen in $\forall x\, P(x, y) \wedge Q(x)$ frei vor?`, [R`$x$ und $y$`, R`nur $y$`, R`nur $x$`, R`keine`], 0,
    R`∀x діє лише на P(x, y). У Q(x) змінна x вільна. y ніде не зв'язана. Тому вільні: x і y.`, EX);
  H.PROOF('pl', R`Geben Sie eine prädikatenlogische Formel $G$ und eine passende Struktur $\mathcal{A}$ an, sodass $\mathcal{A}$ genau dann ein Modell für $G$ ist, wenn die Goldbachsche Vermutung wahr ist.`,
    R`$\mathcal{A} = (\mathbb{N}, I)$ mit $I(P) = \{x \mid x \text{ gerade}, x > 2\}$, $I(Q) = \{x \mid x \text{ prim}\}$, $I(f) = (x,y) \mapsto x+y$, $I(R) = \{(x,y) \mid x = y\}$.<br>$G = \forall n\,\big(P(n) \to \exists k\,\exists \ell\,(Q(k) \wedge Q(\ell) \wedge R(f(k,\ell), n))\big)$.`,
    R`Ідея: предикатні символи «перекладаємо» на властивості чисел (парне > 2, просте, рівність), а функцію — на додавання.`, 'Tutorium 4, A3 / ' + ER + ' 7', 5);
  H.PROOF('pl', R`Geben Sie für $G = \forall x\big(\neg P(x,x) \wedge P(x,f(x))\big) \wedge \forall x\forall y\exists z\big(Q(x,y,z) \wedge \neg Q(x,y,f(z))\big) \wedge \forall x\forall y\forall z\big(Q(x,y,z) \to Q(f(x),y,f(z)) \wedge Q(x,f(y),f(z))\big)$ ein Modell mit nichtleerem Universum an.`,
    R`$\mathcal{A} = (U, I)$ mit $U = \mathbb{N}$, $f^{\mathcal{A}}(n) = n+1$, $P^{\mathcal{A}} = \{(m,n) \in \mathbb{N}^2 \mid m < n\}$, $Q^{\mathcal{A}} = \{(x,y,z) \in \mathbb{N}^3 \mid x + y = z\}$.<br>Kontrolle: $\neg(x<x)$, $x < x+1$; zu $x,y$ wähle $z = x+y$, dann $x+y \ne z+1$; aus $x+y = z$ folgt $(x+1)+y = z+1$ und $x+(y+1) = z+1$.`,
    R`Ідея: f — «наступник», Q — «додавання», P — «менше». Структуру завжди записуйте повністю: універсум + інтерпретація КОЖНОГО символу (з областю визначення і цільовою множиною!).`, HB + ', A9', 5);
})();
