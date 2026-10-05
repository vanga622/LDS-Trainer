/* Topics, cheat sheets and exam analysis */
window.TOPICS = [
  {
    id: 'mengen', de: 'Mengen & Mächtigkeit', ua: 'Множини та потужність',
    cheat: String.raw`<ul>
<li><b>Potenzmenge</b> $2^M$ — множина всіх підмножин, $|2^M| = 2^{|M|}$. <b>Kartesisches Produkt</b> $|A\times B| = |A|\cdot|B|$.</li>
<li>$B^A$ (або $A \to B$) — множина всіх функцій $A \to B$, $|B^A| = |B|^{|A|}$. $\binom{M}{k}$ — усі $k$-елементні підмножини, $|\binom{M}{k}| = \binom{|M|}{k}$.</li>
<li><b>abzählbar</b> (у курсі): існує ін'єкція $X \to \mathbb{N}$, тобто $|X| \le |\mathbb{N}|$ — сюди входять і скінченні множини! <b>überabzählbar</b>: $\mathbb{R}$, $2^{\mathbb{N}}$.</li>
<li>Зліченні: $\mathbb{N}, \mathbb{Z}, \mathbb{Q}, \mathbb{N}\times\mathbb{N}$, підмножини зліченних, скінченні об'єднання.</li>
<li><b>Cantor</b>: $|M| < |2^M|$. <b>Schröder–Bernstein</b>: ін'єкції в обидва боки ⇒ існує біекція (але не обов'язково та сама функція!).</li>
<li>Рівність множин $X = Y$ доводимо двома включеннями: беремо довільний $x \in X$ і показуємо $x \in Y$, і навпаки.</li>
<li>Пастки: $\emptyset \in \{\emptyset\}$ ✓, $\emptyset \in \emptyset$ ✗, $\{2,2\} = \{2\}$, $0 \in \mathbb{N}$.</li></ul>`,
  },
  {
    id: 'abb', de: 'Abbildungen', ua: 'Відображення',
    cheat: String.raw`<ul>
<li><b>injektiv</b>: $f(a) = f(a') \Rightarrow a = a'$ (різні аргументи → різні значення). Спростування: знайти $a \ne a'$ з однаковим образом.</li>
<li><b>surjektiv</b>: $\forall b \in B\ \exists a: f(a) = b$. Спростування: знайти $b$ без прообразу.</li>
<li><b>bijektiv</b> = обидва; еквівалентно — існує обернена функція.</li>
<li>Властивості залежать від <b>Definitions- і Zielmenge</b>: $x \mapsto x^2$ на $\mathbb{R}\to\mathbb{R}$ — ні те, ні те; на $\mathbb{R}\to\mathbb{R}_{\ge0}$ — сюр'єктивна.</li>
<li><b>wohldefiniert</b> (для $\mathbb{Q}$ або $\mathbb{Z}/n\mathbb{Z}$): значення не повинно залежати від запису. Тест: підставити $\tfrac12$ і $\tfrac24$ (або $k$ і $k+n$).</li>
<li>$f \circ g$ ін'єктивна ⇒ $g$ ін'єктивна; $f \circ g$ сюр'єктивна ⇒ $f$ сюр'єктивна.</li>
<li>Для скінченних $|A| = |B|$: ін'єкція ⇔ сюр'єкція ⇔ біекція.</li></ul>`,
  },
  {
    id: 'rel', de: 'Relationen', ua: 'Відношення',
    cheat: String.raw`<ul>
<li><b>reflexiv</b>: $(a,a) \in R$ для ВСІХ $a \in M$ (на $\mathbb{N}$ потрібна і $(0,0)$!). <b>irreflexiv</b>: жодної $(a,a)$. Можна бути ні тим, ні іншим.</li>
<li><b>symmetrisch</b>: $(a,b)\in R \Rightarrow (b,a)\in R$. <b>antisymmetrisch</b>: $(a,b),(b,a)\in R \Rightarrow a = b$. Підмножина діагоналі — і те, і те.</li>
<li><b>transitiv</b>: $(a,b),(b,c) \in R \Rightarrow (a,c) \in R$. Перевіряйте ланцюжки $(a,b),(b,a)$ — вони вимагають $(a,a)$!</li>
<li><b>Äquivalenzrelation</b> = reflexiv + symmetrisch + transitiv ↔ розбиття множини на класи $[a] = \{b \mid aRb\}$.</li>
<li><b>Ordnung</b> (частковий порядок) = reflexiv + antisymmetrisch + transitiv ($\le$, $\mid$ на $\mathbb{N}$, $\subseteq$).</li>
<li>$R^+$ — транзитивне замикання, $R^*$ — рефлексивно-транзитивне; $R^T = \{(b,a) \mid (a,b) \in R\}$.</li></ul>`,
  },
  {
    id: 'komb', de: 'Kombinatorik', ua: 'Комбінаторика',
    cheat: String.raw`<ul>
<li>$\binom{n}{k} = \frac{n!}{k!(n-k)!}$ — кількість $k$-підмножин $n$-множини. Паскаль: $\binom{n}{k} = \binom{n-1}{k} + \binom{n-1}{k-1}$.</li>
<li>Функцій $k \to n$: $n^k$; ін'єкцій: $n(n-1)\cdots(n-k+1)$; перестановок: $n!$.</li>
<li><b>Stars and Bars</b>: $|\{(m_1..m_k) \in \mathbb{N}^k \mid \sum m_i = m\}| = \binom{m+k-1}{k-1}$ (доданки ≥ 0).</li>
<li>Біном: $(x+y)^n = \sum_k \binom{n}{k}x^k y^{n-k}$; $\sum_k \binom{n}{k} = 2^n$. Вандермонд: $\sum_i \binom{n}{i}\binom{m}{k-i} = \binom{n+m}{k}$.</li>
<li><b>Bijektiver Beweis</b>: показати, що обидві сторони рахують одну множину (або побудувати біекцію).</li>
<li>Мультиноміальний: слова з повторами $\frac{n!}{k_1!\cdots k_r!}$. Принцип Діріхле (Schubfachprinzip).</li></ul>`,
  },
  {
    id: 'al', de: 'Aussagenlogik', ua: 'Логіка висловлювань',
    cheat: String.raw`<ul>
<li>$A \to B \equiv \neg A \vee B$; $A \leftrightarrow B \equiv (A\to B)\wedge(B \to A) \equiv (A\wedge B)\vee(\neg A\wedge\neg B)$.</li>
<li>Де Морган: $\neg(A\wedge B) \equiv \neg A \vee \neg B$; контрапозиція: $A \to B \equiv \neg B \to \neg A$.</li>
<li>Поглинання: $A \vee (A \wedge B) \equiv A$, $A \wedge (A \vee B) \equiv A$. «Резолюція»: $(A\vee C)\wedge(\neg A\vee C) \equiv C$.</li>
<li><b>gültig</b> = завжди 1; <b>erfüllbar</b> = хоча б одна модель; F gültig ⇔ ¬F unerfüllbar.</li>
<li><b>KNF</b> = ∧ з клауз (∨ літералів); <b>DNF</b> = ∨ з ∧-мономів. Канонічна KNF — з рядків F = 0, DNF — з рядків F = 1.</li>
<li><b>Hornformel</b>: KNF, у кожній клаузі ≤ 1 позитивного літерала. Тест виконуваності: маркування фактів.</li>
<li><b>Resolution</b>: з $\{A\}\cup K_1$ і $\{\neg A\}\cup K_2$ отримуємо $K_1\cup K_2$. F невиконувана ⇔ $\square \in \mathrm{Res}^*(F)$.</li>
<li><b>Endlichkeitssatz</b>: нескінченна M виконувана ⇔ кожна СКІНЧЕННА підмножина виконувана.</li></ul>`,
  },
  {
    id: 'pl', de: 'Prädikatenlogik', ua: 'Логіка предикатів',
    cheat: String.raw`<ul>
<li><b>Struktur</b> $\mathcal{A} = (U_\mathcal{A}, I_\mathcal{A})$: непорожній універсум + інтерпретація КОЖНОГО символу (константи, функції $U^k \to U$, предикати $\subseteq U^k$, вільні змінні).</li>
<li>Модель шукаємо на $\mathbb{N}$: $f(x) = x+1$, $P = {<}$, $Q(x,y,z) :\Leftrightarrow z = x+y$ — працює в більшості задач.</li>
<li>$\neg\forall x F \equiv \exists x \neg F$; ∀ розподіляється по ∧, ∃ — по ∨. $\forall x\exists y \not\equiv \exists y\forall x$.</li>
<li><b>Bereinigt</b>: жодна змінна не і вільна, і зв'язана; кожна змінна зв'язана ≤ 1 разу.</li>
<li><b>Pränexform</b>: усі квантори спереду. <b>Skolemform</b>: кожну ∃y замінити на $g(x_1..x_k)$ від ∀-змінних ліворуч — лише erfüllbarkeitsäquivalent!</li>
<li><b>Herbrand-Universum</b> $D(F)$: усі замкнені терми з констант і функцій формули (якщо констант немає — додаємо $a$). Herbrand-Struktur інтерпретує терм сам собою.</li>
<li>Satz von Herbrand: Skolemform виконувана ⇔ має Herbrand-модель. Gültigkeit нерозв'язна, але Unerfüllbarkeit напіврозв'язна.</li></ul>`,
  },
  {
    id: 'ind', de: 'Induktion & Beweise', ua: 'Індукція та доведення',
    cheat: String.raw`<ul>
<li>Схема: <b>IA</b> (Induktionsanfang) → <b>IV</b> (Induktionsvoraussetzung) → <b>IS</b> (Induktionsschritt), у кроці позначайте, де використано IV.</li>
<li>Рекурсія з $B_{n-1}$ і $B_{n-2}$ ⇒ <b>два</b> базові випадки, сильна індукція («для всіх $k < n$»).</li>
<li>Дві змінні $B(m,n)$: подвійна індукція (зовнішня за $m$, внутрішня за $n$) або <b>Noethersche Induktion</b> за лексикографічним порядком.</li>
<li>Noethersche Induktion потребує фундованого порядку (без нескінченних спадних ланцюгів). Приклад: функція Аккермана.</li>
<li>Корисні нерівності: $x^m - (x-1)^m \ge x^{m-1}$; $\sum 2^i = 2^{n+1}-1$; $\sum i = \frac{n(n+1)}2$; $\sum i^2 = \frac{n(n+1)(2n+1)}6$.</li></ul>`,
  },
  {
    id: 'wachs', de: 'Wachstum (Landau)', ua: 'Ріст функцій (Ландау)',
    cheat: String.raw`<ul>
<li>$f \in o(g)$: $f/g \to 0$ (строго повільніше). $f \in \Theta(g)$: однаковий порядок. $f \in \omega(g)$: $f/g \to \infty$.</li>
<li>Ієрархія: $\frac1n \prec 1 \prec \log\log n \prec \log n \prec \log^2 n \prec \sqrt n \prec \frac{n}{\log n} \prec n \prec n\log n \prec n^2 \prec n^3 \prec n^{\log n} \prec 2^n \prec \binom{2n}{n} \prec 4^n \prec n! \prec n^n \prec 2^{n^2}$.</li>
<li>$2^{\log n} = n$, $n^n = 2^{n\log n}$, $\log(n!) \in \Theta(n\log n)$, $H_n = \sum \frac1i \in \Theta(\log n)$.</li>
<li>$\binom{n}{k} \in \Theta(n^k)$ для сталого $k$; $\binom{2n}{n} \approx \frac{4^n}{\sqrt{\pi n}}$. Стірлінг: $n! \approx \sqrt{2\pi n}(n/e)^n$.</li>
<li>Пастки: $2^{2n} = 4^n \in \omega(2^n)$, але $2^{n+1} \in \Theta(2^n)$; основа логарифма — сталий множник.</li>
<li>Порівнюючи експоненти, порівнюйте показники: $2^{a(n)}$ vs $2^{b(n)}$ — якщо $a - b \to \pm\infty$, то $\omega$/$o$.</li></ul>`,
  },
  {
    id: 'gruppen', de: 'Gruppen', ua: 'Групи',
    cheat: String.raw`<ul>
<li><b>Gruppe</b>: асоціативність, нейтральний елемент, обернені. Abelsch = ще й комутативна.</li>
<li><b>Untergruppenkriterium</b>: $H \ne \emptyset$ і $a,b \in H \Rightarrow ab^{-1} \in H$. Перетин підгруп — підгрупа; об'єднання — загалом ні.</li>
<li><b>Lagrange</b>: $|G| = [G:H]\cdot|H|$; $\mathrm{ord}(a) \mid |G|$; $a^{|G|} = 1$. Суміжні класи $aH$ або рівні, або не перетинаються.</li>
<li><b>Normalteiler</b>: $gN = Ng$ ∀g ⇔ $gNg^{-1} \subseteq N$ ⇔ $N$ — ядро гомоморфізму ⇔ $G/N$ — група.</li>
<li>Homomorphismus: $\varphi(ab) = \varphi(a)\varphi(b)$ ⇒ $\varphi(1) = 1$, $\varphi(a^{-1}) = \varphi(a)^{-1}$; ін'єктивний ⇔ $\ker\varphi = \{1\}$.</li>
<li>У $(\mathbb{Z}/n\mathbb{Z},+)$: $\mathrm{ord}(a) = n/\mathrm{ggT}(a,n)$. Групи простого порядку — циклічні.</li></ul>`,
  },
  {
    id: 'ringe', de: 'Ringe & Körper', ua: 'Кільця та поля',
    cheat: String.raw`<ul>
<li>Ring: $(R,+)$ абелева група, $\cdot$ асоціативна з 1, дистрибутивність. У курсі кільця комутативні.</li>
<li><b>Ideal</b> $I$: адитивна підгрупа + $I\cdot R \subseteq I$. Це мультиплікативна <b>Unterhalbgruppe</b>, але НЕ Untergruppe. $1 \in I \Rightarrow I = R$.</li>
<li>$I$ — ідеал ⇔ $R/I$ — кільце ⇔ $I$ — ядро гомоморфізму кілець.</li>
<li>$\mathbb{Z}/n\mathbb{Z}$ завжди кільце; поле ⇔ $n$ просте. $k$ оборотний ⇔ $\mathrm{ggT}(k,n) = 1$; одиниць $\varphi(n)$.</li>
<li>Поле не має дільників нуля. В $\mathbb{Z}$ кожен ідеал має вигляд $n\mathbb{Z}$.</li></ul>`,
  },
  {
    id: 'mod', de: 'Modulare Arithmetik', ua: 'Модульна арифметика',
    cheat: String.raw`<ul>
<li><b>Euklid</b>: $\mathrm{ggT}(a,b) = \mathrm{ggT}(b, a \bmod b)$. <b>Erweitert</b>: таблиця $r, q, s, t$ з інваріантом $r = s\cdot a + t\cdot b$.</li>
<li><b>Bézout</b>: $\mathrm{ggT}(a,b) = sa + tb$. Для $ak - b\ell = 1$ з $k,\ell \in \mathbb{N}$: беремо $k = s \bmod b$, $\ell = (ak-1)/b$.</li>
<li>Обернений $a^{-1} \bmod n$ = коефіцієнт при $a$ в Безу-рівності (зведений mod n).</li>
<li>$ax \equiv b \pmod n$ розв'язне ⇔ $\mathrm{ggT}(a,n) \mid b$; тоді ділимо все на ggT.</li>
<li><b>CRT</b>: при $\mathrm{ggT}(k,\ell) = 1$: $\mathbb{Z}/k\ell \cong \mathbb{Z}/k \times \mathbb{Z}/\ell$. Розв'язок: $x = a\cdot t\ell + b\cdot sk$, де $sk + t\ell = 1$. Швидко: перебір.</li>
<li><b>Fermat</b>: $a^{p-1} \equiv 1 \pmod p$ ($p \nmid a$); <b>Euler</b>: $a^{\varphi(n)} \equiv 1$. Показник зводимо mod $p-1$.</li>
<li><b>RSA</b>: $n = pq$, $\varphi = (p-1)(q-1)$, $es \equiv 1 \pmod\varphi$; шифр $x^e \bmod n$, розшифрування $y^s \bmod n$.</li></ul>`,
  },
  {
    id: 'graph', de: 'Graphentheorie', ua: 'Теорія графів',
    cheat: String.raw`<ul>
<li><b>Handschlaglemma</b>: $\sum_x d_x = 2m$ ⇒ вершин непарного степеня парна кількість.</li>
<li><b>Eulerkreis</b> (зв'язний граф) ⇔ всі степені парні. Eulerweg ⇔ 0 або 2 вершини непарного степеня.</li>
<li><b>Baum</b>: зв'язний ациклічний, $m = n - 1$, ≥ 2 листки. Bipartit ⇔ немає непарних циклів.</li>
<li><b>Euler-Formel</b> (зв'язний планарний): $n - m + f = 2$ (з зовнішньою гранню).</li>
<li>Планарний, $n \ge 3$: $m \le 3n - 6$; ще й двочастковий ($n \ge 4$): $m \le 2n - 4$. Є вершина з $d_x \le 5$.</li>
<li>$K_5$ і $K_{3,3}$ не планарні; <b>Kuratowski</b>: граф планарний ⇔ не містить їх підрозбиттів. Для доведення непланарності: знайти $K_{3,3}$/$K_5$-підрозбиття або оцінку ребер.</li>
<li>$|E(K_n)| = \binom n2$, $|E(K_{a,b})| = ab$.</li></ul>`,
  },
];

window.EXAM_ANALYSIS = {
  structure: [
    // [Aufgabe-Typ, Herbst 2026, Frühjahr 2026, Schein 1, Schein 2, Altklausuren 2015–2020 (von 12)]
    ['10 тверджень «wahr / falsch» з усіх тем', '10 P', '10 P', '6 P', '6 P', '≈ 8/12 (Ja/Nein)'],
    ['Abbildungen: injektiv / surjektiv / bijektiv (5 рядків)', '10 P', '10 P', '16 P (Beweis)', '3 P', '—'],
    ['Wohldefiniertheit (5 рядків)', '5 P', '—', '—', '—', '—'],
    ['Relationen: 5 властивостей × 5 рядків', '10 P', '10 P', '4 P', '6 P (Klassen)', '—'],
    ['Landau-Symbole o / Θ / ω (10 рядків)', '10 P', '10 P', '—', '12 P', '—'],
    ['Mengen: Element aus X angeben / |X|', '5 P', '15 P', '3+4 P', '—', '—'],
    ['Vollständige Induktion (rekursive Folge)', '5 P', '15 P', '—', '—', '—'],
    ['Aussagenlogik: 5 формул спростити (MC)', '10 P', '10 P', '≈ 35 P (KNF/DNF, …)', '15 P', '12/12 (KNF/DNF, Horn, Resolution)'],
    ['Prädikatenlogik: Modell angeben', '5 P', '5 P', '—', '25 P (Skolem, Pränex, Herbrand)', '12/12'],
    ['Gruppen / Ringe (Beweis oder MC)', '10 P', '5 P', '—', '12 P', '≈ 3/12'],
    ['Erweiterter Euklid: k, ℓ ∈ ℕ', '5 P', '5 P', '—', '10 P (Inverses)', '12/12 (Kongruenzen)'],
    ['Chinesischer Restsatz (Satz + Beweis / System)', '10 P', '—', '—', '6 P', '≈ 10/12'],
    ['Planare Graphen (Euler-Formel, Nicht-Planarität)', '5 P', '5 P', '—', '—', '7/12'],
    ['RSA', '—', '—', '—', '—', '9/12'],
    ['Wahrscheinlichkeit (Markov, Varianz)', '—', '—', '—', '—', '4/12 (немає в новому курсі)'],
  ],
  predictions: [
    ['Майже напевно (обидві 2026)', 'Wahr/Falsch-Block · injektiv/surjektiv · Relationen-Tabelle · Landau-Tabelle · Mengen (Element/Anzahl) · Induktion · Formeln vereinfachen · PL-Modell · Gruppen-Beweis · erweiterter Euklid · planare Graphen'],
    ['Дуже ймовірно', 'Chinesischer Restsatz (Formulierung + Beweis або Rechnung) · Nebenklassen / Lagrange / Normalteiler · Wohldefiniertheit auf ℚ bzw. ℤ/nℤ'],
    ['Можливо', 'Skolem-/Pränexform, Herbrand-Universum (Scheinklausur 2) · Eulerkreis · RSA (є в скрипті, розділ 6.4) · Endlichkeitssatz · Äquivalenzklassen · Stars & Bars'],
    ['Малоймовірно', 'Wahrscheinlichkeitsrechnung (лише у старих іспитах 2015–2020, у новому скрипті Kufleitner відсутня) · Resolution in der Prädikatenlogik'],
  ],
  tips: [
    'Таблиці з хрестиками (A1–A5, A8 у 2026) дають ≈ 55 балів — цього достатньо для «bestanden» (≥ 50). Тренуйте їх до автоматизму.',
    'Неправильний або подвійний хрестик = 0 балів, але штрафу немає — у таблицях завжди ставте відповідь.',
    'У Relationen-рядку бал дається лише якщо ВСІ хрестики правильні: перевіряйте кожну з 5 властивостей окремо, особливо reflexiv на всьому ℕ.',
    'ℕ містить 0, log — за основою 2, допоміжних засобів немає (навіть калькулятора) — числа в Euklid/CRT маленькі.',
    'Доведення пишіть німецькою, коротко: Annahme → Umformung → Folgerung → □. Можна використовувати все, що доведено в лекції (якщо не просять довести саме це).',
    'Модель у предикатній логіці: завжди вказуйте універсум і інтерпретацію КОЖНОГО символу з областями (f: ℕ → ℕ, n ↦ n+1).',
  ],
};
