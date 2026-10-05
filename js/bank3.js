/* Static question bank, part 3: Induktion, Gruppen, Ringe, Modulare Arithmetik, Graphen */
(function () {
  const R = String.raw;
  const H = window.BankHelpers;
  const U = window.MathUtil;
  const HB = 'Prüfung Herbst 2026', FJ = 'Prüfung Frühjahr 2026', S1 = 'Scheinklausur 1 (WS 25/26)', S2 = 'Scheinklausur 2 (WS 25/26)', ER = 'Ergänzungsblatt', EX = 'Додаткове завдання', OLD = 'Altklausur';
  const push = (o) => { o.id = o.id || o.topic + '-x' + window.BANK.length; window.BANK.push(o); };
  const intv = U.int;
  // two-number input task with arbitrary check
  function NUM2(topic, q, labels, check, solution, expl, src, pts) {
    push({ topic, type: 'num', q, inputs: labels.map((l) => ({ label: l })), check, solution, expl, src, pts: pts || 5 });
  }
  function NUMC(topic, q, label, check, solution, expl, src, pts) {
    push({ topic, type: 'num', q, inputs: [{ label }], check: (v) => check(intv(v[0]), v[0]), solution, expl, src, pts: pts || 3 });
  }
  function svg(pos, edges, w, h) {
    let s = `<svg class="graph" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Graph">`;
    edges.forEach(([a, b]) => { s += `<line x1="${pos[a][0]}" y1="${pos[a][1]}" x2="${pos[b][0]}" y2="${pos[b][1]}"/>`; });
    pos.forEach(([x, y], i) => { s += `<circle cx="${x}" cy="${y}" r="10"/><text x="${x}" y="${y + 4}">${i + 1}</text>`; });
    return '<div class="figure">' + s + '</svg></div>';
  }
  const circ = (n, r, cx, cy, off) => Array.from({ length: n }, (_, i) => [cx + r * Math.sin(off + (2 * Math.PI * i) / n), cy - r * Math.cos(off + (2 * Math.PI * i) / n)]);
  const K = (n) => { const e = []; for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) e.push([a, b]); return e; };

  // ================= INDUKTION =================
  H.PROOF('ind', R`Für $n \in \mathbb{N}$ sei $B_0 = 0$, $B_1 = 2$ und $B_n = 2B_{n-1} + 3B_{n-2} + 4$ für $n \ge 2$. Beweisen Sie mit Induktion, dass $B_n = 3^n - 1$ für alle $n \in \mathbb{N}$.`,
    R`<b>IA:</b> $B_0 = 0 = 3^0 - 1$ und $B_1 = 2 = 3^1 - 1$.<br><b>IV:</b> Für ein $n \ge 2$ gelte $B_k = 3^k - 1$ für alle $k < n$.<br><b>IS:</b> $B_n = 2B_{n-1} + 3B_{n-2} + 4 \overset{IV}{=} 2(3^{n-1}-1) + 3(3^{n-2}-1) + 4 = 2\cdot 3^{n-1} + 3^{n-1} - 2 - 3 + 4 = 3\cdot 3^{n-1} - 1 = 3^n - 1.$ $\square$`,
    R`Ідея: рекурсія спирається на ДВА попередні члени, тож потрібні ДВА базові випадки (n = 0 і n = 1) і сильна індукція. Типова помилка — перевірити лише B₀.`, HB + ', A7', 5);
  H.PROOF('ind', R`Für $m, n \in \mathbb{N}$ sei $B(0,n) = 1$, $B(m,0) = m^m$ für $m > 0$ und $B(m,n) = B(m-1,n+1) + B(m,n-1)$ für $m,n > 0$. Beweisen Sie mit Induktion: $B(m,n) \le (m+n)^m$.`,
    R`Induktion über $m$, darin Induktion über $n$ (bzw. Noethersche Induktion über die lexikographische Ordnung auf $\mathbb{N}^2$).<br><b>IA ($m = 0$):</b> $B(0,n) = 1 = n^0 = (0+n)^0$.<br><b>IS ($m > 0$):</b> Für $n = 0$: $B(m,0) = m^m = (m+0)^m$. Für $n > 0$ gilt nach IV (für $m-1$ beliebiges $n+1$, und für $m$ mit $n-1$):<br>$B(m,n) \le (m+n)^{m-1} + (m+n-1)^m$.<br>Wegen $x^m - y^m = (x-y)\sum_{j=0}^{m-1} x^j y^{m-1-j} \ge x^{m-1}$ für $x = m+n$, $y = m+n-1$ (alle Summanden $\ge 0$, der Summand $j = m-1$ ist $x^{m-1}$) folgt $(m+n-1)^m \le (m+n)^m - (m+n)^{m-1}$. Also $B(m,n) \le (m+n)^m$. $\square$`,
    R`Ідея: подвійна індукція — зовнішня за m, внутрішня за n. Ключова нерівність: (x−1)ᵐ + xᵐ⁻¹ ≤ xᵐ.`, FJ + ', A6', 15);
  H.PROOF('ind', R`Zeigen Sie mit Induktion: $1 + 2 + 4 + \dots + 2^n = 2^{n+1} - 1$.`,
    R`IA $n=0$: $1 = 2^1 - 1$. IS: $\sum_{i=0}^{n+1} 2^i = (2^{n+1} - 1) + 2^{n+1} = 2^{n+2} - 1$. $\square$`, R`Класична геометрична сума.`, ER + ' 8', 3);
  H.PROOF('ind', R`Zeigen Sie mit Induktion: $1^2 + 2^2 + \dots + n^2 = \tfrac16 n(n+1)(2n+1)$.`,
    R`IA $n = 0$: $0 = 0$. IS: $\tfrac16 n(n+1)(2n+1) + (n+1)^2 = \tfrac{n+1}{6}\big(2n^2 + n + 6n + 6\big) = \tfrac{n+1}{6}(n+2)(2n+3)$ — das ist die Formel für $n+1$. $\square$`, R`Виносимо (n+1) за дужки і розкладаємо 2n² + 7n + 6 = (n+2)(2n+3).`, ER + ' 8', 4);
  H.MC('ind', R`Man will $B_n = 3^n - 1$ für $B_n = 2B_{n-1} + 3B_{n-2} + 4$ beweisen. Welcher Induktionsanfang ist nötig?`, ['Nur $n = 0$', '$n = 0$ und $n = 1$', 'Nur $n = 1$', 'Kein Induktionsanfang nötig'], 1,
    R`Крок використовує n−1 і n−2, тож працює лише з n ≥ 2. Значення B₀ і B₁ треба перевірити окремо.`, HB + ', A7');
  H.TF('ind', R`Im Induktionsschritt darf man die Aussage für $n+1$ voraussetzen.`, false, R`Хибно: припускаємо (IV) твердження для n (або для всіх k ≤ n), а для n+1 — ДОВОДИМО.`, EX);
  H.TF('ind', R`Noethersche Induktion funktioniert über jeder fundierten Ordnung (keine unendlich absteigenden Ketten).`, true, R`Істинно: саме фундованість гарантує, що «найменший контрприклад» існує.`, 'Skript 3.6');
  H.TF('ind', R`Die Ackermann-Funktion ist für alle $(m, n) \in \mathbb{N}^2$ definiert (die Rekursion terminiert).`, true, R`Істинно — доводиться ньотеровою індукцією за лексикографічним порядком на ℕ²: кожен рекурсивний виклик зменшує (m, n) лексикографічно.`, 'Skript 3.7');
  H.MC('ind', R`„Alle Pferde haben dieselbe Farbe": IS von $n$ auf $n+1$ — man nimmt Pferde $1..n$ und $2..n+1$, beide Gruppen sind einfarbig, sie überlappen. Wo ist der Fehler?`,
    ['Der Schritt $n = 1 \to 2$ funktioniert nicht, da die Gruppen sich nicht überlappen', 'Der Induktionsanfang ist falsch', 'Man darf keine Teilmengen betrachten', 'Es gibt keinen Fehler'], 0,
    R`Для n = 1 групи {1} і {2} не перетинаються, тож «спільний кінь» не існує. Крок повинен працювати для КОЖНОГО n ≥ n₀.`, EX);

  // ================= GRUPPEN =================
  H.TF('gruppen', R`Immer wenn $H$ eine Untergruppe einer endlichen Gruppe $G$ ist, dann ist $|H|$ ein Teiler von $|G|$.`, true, R`Істинно — теорема Лагранжа: |G| = [G : H]·|H|, бо суміжні класи gH розбивають G на частини розміру |H|.`, HB + ', A1.3');
  H.TF('gruppen', R`In jeder endlichen Gruppe $(G, \cdot, 1)$ gibt es eine Zahl $n > 1$, sodass $a^n = a^{n+1}$ für alle $a \in G$ gilt.`, false,
    R`Хибно: множимо aⁿ = aⁿ⁺¹ на a⁻ⁿ і отримуємо 1 = a. Отже це правда лише для тривіальної групи. Порівняйте з FJ A1.6 (aⁿ = a) — там правда!`, HB + ', A1.6');
  H.TF('gruppen', R`Immer wenn $H$ eine endliche Untergruppe einer Gruppe $G$ ist und der Index $[G:H]$ endlich ist, dann ist $G$ endlich.`, true, R`Істинно: G — об'єднання [G:H] суміжних класів, кожен має |H| елементів, тож |G| = [G:H]·|H| < ∞.`, FJ + ', A1.3');
  H.TF('gruppen', R`In jeder endlichen Gruppe $(G, \cdot, 1)$ gibt es eine Zahl $n > 1$, sodass $a^n = a$ für alle $a \in G$ gilt.`, true, R`Істинно: n = |G| + 1. За наслідком з Лагранжа a^{|G|} = 1, тож a^{|G|+1} = a.`, FJ + ', A1.6');
  H.MULTI('gruppen', R`Welche Aussagen gelten für jede Gruppe $(G, \circ)$?`, ['$\\circ$ ist kommutativ.', '$\\circ$ ist assoziativ.', R`$\exists g \in G\ \forall h \in G: g \circ h = g$`, R`$\exists g \in G\ \forall h \in G: g \circ h = h$`], [1, 3],
    R`Асоціативність — аксіома групи. ∃g ∀h: g∘h = h — існування нейтрального елемента. Комутативність — лише для абелевих груп. «Поглинаючий» елемент (g∘h = g для всіх h) існує лише в тривіальній групі: g∘h = g = g∘1 ⇒ h = 1 після скорочення на g.`, S2 + ', 14', { pts: 4 });
  H.MC('gruppen', R`Wann ist eine Teilmenge $N$ einer Gruppe $G$ ein Normalteiler?`, [R`$N \le G$ und $gN = Ng$ für alle $g \in G$`, R`$N \le G$ und $N$ ist abelsch`, R`$gN = N$ für alle $g \in G$`, R`$N \le G$ und $|N|$ teilt $|G|$`], 0,
    R`Означення: N — підгрупа і ліві суміжні класи збігаються з правими (еквівалентно: gNg⁻¹ ⊆ N для всіх g; або N — ядро гомоморфізму). Умова 4 виконується для ВСІХ підгруп скінченної групи (Лагранж).`, S2 + ', 15', { pts: 4 });
  H.MC('gruppen', R`Welches Kriterium zeigt, dass $\emptyset \ne H \subseteq G$ eine Untergruppe ist?`, [R`Für alle $a, b \in H$ gilt $ab^{-1} \in H$`, R`Für alle $a, b \in H$ gilt $ab \in H$`, R`$1 \in H$`, R`$|H|$ teilt $|G|$`], 0,
    R`Критерій підгрупи: H ≠ ∅ і a, b ∈ H ⇒ ab⁻¹ ∈ H. Замкненість щодо множення сама по собі не достатня (ℕ ⊆ ℤ замкнена щодо +, але не підгрупа). Для скінченних H вистачає замкненості.`, EX);
  H.TF('gruppen', R`Jede Gruppe von Primzahlordnung ist zyklisch.`, true, R`Істинно: для a ≠ 1 порядок ord(a) ділить p і > 1, отже ord(a) = p, і ⟨a⟩ = G.`, EX);
  H.TF('gruppen', R`Jede Untergruppe einer abelschen Gruppe ist ein Normalteiler.`, true, R`Істинно: gH = Hg, бо gh = hg.`, EX);
  H.TF('gruppen', R`Die Vereinigung zweier Untergruppen ist immer eine Untergruppe.`, false, R`Хибно: 2ℤ ∪ 3ℤ містить 2 і 3, але не 5 = 2 + 3. (Перетин підгруп — завжди підгрупа!)`, EX);
  H.TF('gruppen', R`Der Kern eines Gruppenhomomorphismus ist ein Normalteiler.`, true, R`Істинно: для k ∈ ker φ: φ(gkg⁻¹) = φ(g)·1·φ(g)⁻¹ = 1.`, 'Skript 5.1');
  H.TF('gruppen', R`Ein Gruppenhomomorphismus $f$ ist genau dann injektiv, wenn $\ker f = \{1\}$.`, true, R`Істинно: f(a) = f(b) ⇔ f(ab⁻¹) = 1 ⇔ ab⁻¹ ∈ ker f.`, ER + ' 10');
  H.TF('gruppen', R`$(\mathbb{Z}, \cdot)$ ist eine Gruppe.`, false, R`Хибно: 2 не має оберненого в ℤ щодо множення (1/2 ∉ ℤ). (ℤ, +) — група, (ℤ, ·) — лише моноїд.`, EX);
  H.TF('gruppen', R`$(\mathbb{N}, +)$ ist eine Gruppe.`, false, R`Хибно: 1 не має оберненого (−1 ∉ ℕ). Це моноїд.`, EX);
  H.TF('gruppen', R`Die symmetrische Gruppe $S_3$ ist abelsch.`, false, R`Хибно: (1 2)(1 3) ≠ (1 3)(1 2). S₃ — найменша неабелева група (порядок 6).`, EX);
  H.TF('gruppen', R`Ist jedes Element einer Gruppe $G$ zu sich selbst invers ($g^2 = 1$), so ist $G$ abelsch.`, true, R`Істинно: ab = (ab)⁻¹ = b⁻¹a⁻¹ = ba.`, ER + ' 10');
  H.NUM('gruppen', R`Sei $|G| = 12$ und $H \le G$ mit $|H| = 4$. Wie viele Linksnebenklassen von $H$ gibt es?`, [3], R`Індекс [G : H] = |G|/|H| = 12/4 = 3 (Лагранж).`, EX, { label: '[G:H] =' });
  H.NUM('gruppen', R`Wie viele Elemente hat die symmetrische Gruppe $S_4$?`, [24], R`|Sₙ| = n! = 24.`, EX, { label: '|S₄| =' });
  H.PROOF('gruppen', R`Sei $G$ eine Gruppe und $H \le G$. Zeigen Sie für alle $a, b \in G$: $aH = bH$ oder $aH \cap bH = \emptyset$.`,
    R`Angenommen $aH \cap bH \ne \emptyset$, etwa $x = ah_1 = bh_2$ mit $h_1,h_2 \in H$. Dann $a = b h_2 h_1^{-1}$. Für $h \in H$: $ah = b\,(h_2 h_1^{-1} h) \in bH$, da $H$ abgeschlossen ist. Also $aH \subseteq bH$. Symmetrisch ($b = a h_1 h_2^{-1}$) folgt $bH \subseteq aH$. Also $aH = bH$. $\square$`,
    R`Ідея: якщо класи мають спільний елемент, то a «виражається» через b і елемент з H, і тоді кожен елемент aH лежить у bH.`, FJ + ', A9', 5);
  H.PROOF('gruppen', R`Sei $G$ eine Gruppe, $I$ eine Indexmenge und $H_i \le G$ für $i \in I$. Zeigen Sie:<br>(a) $\bigcap_{i \in I} H_i$ ist eine Untergruppe von $G$.<br>(b) Für $H \le G$, $g \in G$ ist $gHg^{-1}$ eine Untergruppe.<br>(c) Für $H \le G$ ist $\bigcap_{g \in G} gHg^{-1}$ ein Normalteiler.`,
    R`(a) $1 \in H_i$ für alle $i$, also $1 \in \bigcap H_i \ne \emptyset$. Seien $a, b \in \bigcap H_i$. Dann $a, b \in H_i$, also $ab^{-1} \in H_i$ für jedes $i$, d.h. $ab^{-1} \in \bigcap H_i$.<br>(b) $1 = g1g^{-1} \in gHg^{-1}$. Für $gh_1g^{-1}, gh_2g^{-1}$: $(gh_1g^{-1})(gh_2g^{-1})^{-1} = gh_1g^{-1}gh_2^{-1}g^{-1} = g(h_1h_2^{-1})g^{-1} \in gHg^{-1}$.<br>(c) Sei $N = \bigcap_{g} gHg^{-1}$. Nach (a),(b) ist $N \le G$. Sei $x \in G$, $n \in N$. Für jedes $g$: $n \in (x^{-1}g)H(x^{-1}g)^{-1}$, also $xnx^{-1} \in x(x^{-1}g)H(g^{-1}x)x^{-1} = gHg^{-1}$. Somit $xnx^{-1} \in N$, d.h. $xNx^{-1} \subseteq N$ — $N$ ist Normalteiler. $\square$`,
    R`Ідея: критерій підгрупи ab⁻¹ ∈ H; для (c) — критерій нормальності xNx⁻¹ ⊆ N, підставляючи замість g елемент x⁻¹g.`, HB + ', A10', 10);
  H.PROOF('gruppen', R`Sei $f\colon G \to H$ ein Gruppenhomomorphismus. Zeigen Sie $f(1_G) = 1_H$.`,
    R`$f(1_G) = f(1_G \cdot 1_G) = f(1_G) f(1_G)$. Multiplikation mit $f(1_G)^{-1}$ liefert $1_H = f(1_G)$. $\square$`, R`Ідея: 1·1 = 1 і скорочення в групі H.`, ER + ' 10', 3);
  H.PROOF('gruppen', R`Seien $f, h\colon G \to H$ Gruppenhomomorphismen. Zeigen Sie, dass $\{g \in G \mid f(g) = h(g)\}$ eine Untergruppe von $G$ ist.`,
    R`Sei $E$ die Menge. $f(1) = 1 = h(1)$, also $1 \in E$. Für $a, b \in E$: $f(ab^{-1}) = f(a)f(b)^{-1} = h(a)h(b)^{-1} = h(ab^{-1})$, also $ab^{-1} \in E$. $\square$`, R`Критерій підгрупи + властивість гомоморфізму f(b⁻¹) = f(b)⁻¹.`, ER + ' 10', 4);

  // ================= RINGE =================
  H.TF('ringe', R`Jedes Ideal in einem Ring ist eine multiplikative Unterhalbgruppe.`, true, R`Істинно: для i, j ∈ I маємо i·j ∈ I·R ⊆ I, і I ≠ ∅ (0 ∈ I). Напівгрупа потребує лише асоціативної замкненої операції — нейтрального елемента та обернених не треба.`, HB + ', A1.5');
  H.TF('ringe', R`Jedes Ideal in einem Ring ist eine multiplikative Untergruppe.`, false, R`Хибно: група потребує 1 та обернених. 2ℤ не містить 1 і не має обернених щодо ·. Порівняйте з HB A1.5 (Unterhalbgruppe) — там правда!`, FJ + ', A1.5');
  H.MULTI('ringe', R`Welche Aussagen gelten für jeden kommutativen Ring $R$ und jedes Ideal $I \subseteq R$?`, [R`$I \cdot R \subseteq I$`, R`$I$ ist eine multiplikative Untergruppe von $R$`, R`$R$ ist ein Körper`, R`$I$ ist Kern eines Ringhomomorphismus`], [0, 3],
    R`I·R ⊆ I — частина означення ідеалу. I = ker(R → R/I, r ↦ r + I) — теорема з лекції. ℤ — не поле, а ідеали не є мультиплікативними групами.`, S2 + ', 16', { pts: 4 });
  H.TF('ringe', R`Bildet $\mathbb{Z}/12\mathbb{Z}$ mit Addition und Multiplikation von Restklassen einen Körper?`, false, R`Ні: 12 не просте, 3·4 ≡ 0 — дільники нуля.`, OLD + ' SS 2019, A3.9', { labels: ['Ja', 'Nein'] });
  H.TF('ringe', R`Bildet $\mathbb{Z}/7\mathbb{Z}$ mit Addition und Multiplikation von Restklassen einen Ring?`, true, R`Так. ℤ/nℤ — завжди кільце (навіть поле, бо 7 просте).`, OLD + ' SS 2019, A3.10', { labels: ['Ja', 'Nein'] });
  H.TF('ringe', R`Gibt es einen surjektiven Ringhomomorphismus $\mathbb{Z}/4\mathbb{Z} \to \mathbb{Z}/2\mathbb{Z}$?`, true, R`Так: k + 4ℤ ↦ k + 2ℤ. Коректно визначене, бо 2 | 4; зберігає +, ·, 1; сюр'єктивне.`, OLD + ' WS 2020, A5a', { labels: ['Ja', 'Nein'], pts: 3 });
  H.TF('ringe', R`$\mathbb{Z}/6\mathbb{Z}$ ist nullteilerfrei.`, false, R`Хибно: 2·3 = 6 ≡ 0, хоча 2, 3 ≢ 0.`, EX);
  H.TF('ringe', R`Jeder Körper ist nullteilerfrei.`, true, R`Істинно: ab = 0, a ≠ 0 ⇒ b = a⁻¹ab = 0.`, EX);
  H.TF('ringe', R`Enthält ein Ideal $I$ das Einselement $1$, so ist $I = R$.`, true, R`Істинно: для r ∈ R: r = 1·r ∈ I·R ⊆ I.`, EX);
  H.TF('ringe', R`Jedes Ideal von $\mathbb{Z}$ hat die Form $n\mathbb{Z}$ für ein $n \in \mathbb{N}$.`, true, R`Істинно: якщо I ≠ {0}, беремо найменше додатне n ∈ I; ділення з остачею показує I = nℤ.`, EX);
  H.TF('ringe', R`$k + n\mathbb{Z}$ ist in $\mathbb{Z}/n\mathbb{Z}$ genau dann invertierbar, wenn $\operatorname{ggT}(k, n) = 1$.`, true, R`Істинно: за Безу sk + tn = 1 ⇔ sk ≡ 1 (mod n).`, EX);

  // ================= MODULARE ARITHMETIK =================
  H.TF('mod', R`Immer wenn $k, \ell \in \mathbb{N}$ teilerfremd sind, existiert $a \in \mathbb{N}$ mit $ak \equiv 2 \bmod \ell$.`, true, R`Істинно: k оборотний mod ℓ (Безу), тож a := 2·k⁻¹ mod ℓ (беремо невід'ємного представника).`, FJ + ', A1.10');
  NUM2('mod', R`Bestimmen Sie mit dem erweiterten euklidischen Algorithmus zwei Zahlen $k, \ell \in \mathbb{N}$, sodass $7k - 75\ell = 1$.`, [R`$k =$`, R`$\ell =$`],
    (v) => { const a = intv(v[0]), b = intv(v[1]); return a >= 0 && b >= 0 && 7 * a - 75 * b === 1; }, 'k = 43, ℓ = 4',
    R`75 = 10·7 + 5; 7 = 1·5 + 2; 5 = 2·2 + 1. Назад: 1 = 5 − 2·2 = 5 − 2(7 − 5) = 3·5 − 2·7 = 3(75 − 10·7) − 2·7 = 3·75 − 32·7. Отже 7·(−32) − 75·(−3) = 1. Потрібні невід'ємні: k = −32 + 75 = <b>43</b>, ℓ = −3 + 7 = <b>4</b>. Перевірка: 7·43 = 301 = 4·75 + 1 ✓.`, HB + ', A11', 5);
  NUM2('mod', R`Bestimmen Sie mit dem erweiterten euklidischen Algorithmus zwei Zahlen $k, \ell \in \mathbb{N}$, sodass $59k - 7\ell = 1$.`, [R`$k =$`, R`$\ell =$`],
    (v) => { const a = intv(v[0]), b = intv(v[1]); return a >= 0 && b >= 0 && 59 * a - 7 * b === 1; }, 'k = 5, ℓ = 42',
    R`59 = 8·7 + 3; 7 = 2·3 + 1. Назад: 1 = 7 − 2·3 = 7 − 2(59 − 8·7) = 17·7 − 2·59. Отже 59·(−2) − 7·(−17) = 1; додаємо 7 до k і 59 до ℓ: k = <b>5</b>, ℓ = <b>42</b>. Перевірка: 59·5 = 295 = 42·7 + 1 ✓.`, FJ + ', A10', 5);
  NUMC('mod', R`Bestimmen Sie das multiplikative Inverse von $5 + 33\mathbb{Z}$ in $\mathbb{Z}/33\mathbb{Z}$ mit dem erweiterten euklidischen Algorithmus.`, R`$x =$`, (x) => U.mod(5 * x, 33) === 1, '20',
    R`33 = 6·5 + 3; 5 = 1·3 + 2; 3 = 1·2 + 1. Назад: 1 = 3 − 2 = 3 − (5 − 3) = 2·3 − 5 = 2(33 − 6·5) − 5 = 2·33 − 13·5. Отже 5⁻¹ ≡ −13 ≡ <b>20</b> (mod 33). Перевірка: 5·20 = 100 = 3·33 + 1 ✓.`, S2 + ', 17', 10);
  NUMC('mod', R`Geben Sie eine Lösung $x \in \mathbb{Z}$ an: $x \equiv 2 \bmod 3$, $x \equiv 3 \bmod 5$.`, R`$x =$`, (x) => U.mod(x, 3) === 2 && U.mod(x, 5) === 3, '8 (alle: 8 + 15ℤ)',
    R`Перебираємо x ≡ 3 mod 5: 3, 8, 13 … 8 mod 3 = 2 ✓. x = <b>8</b>, усі розв'язки 8 + 15ℤ.`, S2 + ', 18', 6);
  NUMC('mod', R`Bestimmen Sie das multiplikative Inverse von $4 + 21\mathbb{Z}$ in $\mathbb{Z}/21\mathbb{Z}$.`, R`$x =$`, (x) => U.mod(4 * x, 21) === 1, '16',
    R`21 = 5·4 + 1 ⇒ 1 = 21 − 5·4 ⇒ 4⁻¹ ≡ −5 ≡ <b>16</b>. Перевірка: 4·16 = 64 = 3·21 + 1 ✓.`, OLD + ' SS 2019, A5a', 4);
  NUMC('mod', R`Bestimmen Sie die kleinste nichtnegative Lösung von $4x \equiv 3 \bmod 21$, $x \equiv 9 \bmod 10$.`, R`$x =$`, (x) => x === 69, '69 (L = 69 + 210ℤ)',
    R`4x ≡ 3 (mod 21) ⇒ x ≡ 3·4⁻¹ = 3·16 = 48 ≡ 6 (mod 21). Далі x = 6 + 21t ≡ 9 (mod 10) ⇒ 6 + t ≡ 9 ⇒ t ≡ 3 ⇒ x = <b>69</b>. ggT(21,10) = 1, тож L = 69 + 210ℤ.`, OLD + ' SS 2019, A5b', 4);
  NUMC('mod', R`Lösen Sie $-9x \equiv 15 \pmod{21}$. Geben Sie die kleinste nichtnegative Lösung an.`, R`$x =$`, (x) => x === 3, '3 (L = 3 + 7ℤ = 10 + 7ℤ)',
    R`ggT(9, 21) = 3 | 15 — розв'язки є. Ділимо все на 3: −3x ≡ 5 (mod 7) ⇔ 4x ≡ 5 (mod 7). 4⁻¹ ≡ 2 (4·2 = 8 ≡ 1), x ≡ 10 ≡ <b>3</b> (mod 7). Перевірка: −27 + 42 = 15 ✓.`, ER + ' 13', 4);
  H.TF('mod', R`Ist $16x \equiv -20 \pmod{24}$ lösbar?`, false, R`Ні: ggT(16, 24) = 8, а 8 ∤ 20 (бо ax ≡ b (mod n) розв'язне ⇔ ggT(a,n) | b). L = ∅.`, ER + ' 13', { labels: ['Ja', 'Nein'], pts: 2 });
  NUMC('mod', R`Vereinfachen Sie $10^{123456789} \bmod 14$.`, 'Rest =', (x) => x === 6, '6',
    R`14 = 2·7. mod 2: 10ⁿ ≡ 0. mod 7: 10 ≡ 3, і за Ферма 3⁶ ≡ 1. 123456789 mod 6: сума цифр 45 → ділиться на 3, число непарне → остача 3. 3³ = 27 ≡ 6 (mod 7). CRT: x ≡ 0 (mod 2), x ≡ 6 (mod 7) ⇒ x = <b>6</b>.`, ER + ' 13', 5);
  NUMC('mod', R`RSA mit öffentlichem Schlüssel $(n, e) = (55, 3)$. Berechnen Sie den geheimen Schlüssel $s$ ($0 < s < \varphi(n)$).`, R`$s =$`, (x) => x === 27, '27',
    R`55 = 5·11, φ = 4·10 = 40. 3s ≡ 1 (mod 40): 3·27 = 81 = 2·40 + 1 ⇒ s = <b>27</b>.`, ER + ' 13', 4);
  NUMC('mod', R`RSA mit $(n, e) = (55, 3)$. Verschlüsseln Sie $x = 53$.`, 'Chiffre =', (x) => x === 47, '47',
    R`53 ≡ −2 (mod 55). (−2)³ = −8 ≡ <b>47</b> (mod 55). Трюк: від'ємні представники скорочують обчислення.`, ER + ' 13', 3);
  NUMC('mod', R`RSA mit öffentlichem Schlüssel $(85, 7)$. Berechnen Sie den geheimen Schlüssel $s$.`, R`$s =$`, (x) => x === 55, '55',
    R`85 = 5·17, φ = 4·16 = 64. 7s ≡ 1 (mod 64): 64 = 9·7 + 1 ⇒ 1 = 64 − 9·7 ⇒ s ≡ −9 ≡ <b>55</b>. Перевірка: 7·55 = 385 = 6·64 + 1 ✓.`, OLD + ' WS 2020, A7', 4);
  NUMC('mod', R`RSA mit öffentlichem Schlüssel $(n, e) = (10, 3)$. Berechnen Sie den geheimen Schlüssel $s$ (mit $0 < s < \varphi(n)$).`, R`$s =$`, (x) => x === 3, '3',
    R`10 = 2·5, φ = 1·4 = 4. 3s ≡ 1 (mod 4) ⇒ s = <b>3</b> (3·3 = 9 ≡ 1).`, OLD + ' WS 2017, A4', 3);
  NUMC('mod', R`Geben Sie die kleinste nichtnegative Lösung an: $x \equiv 6 \bmod 9$, $x \equiv 12 \bmod 15$.`, R`$x =$`, (x) => x === 42, '42 (L = 42 + 45ℤ)',
    R`Модулі НЕ взаємно прості: ggT(9,15) = 3. Сумісність: 6 ≡ 12 (mod 3) ✓. x = 6 + 9t ≡ 12 (mod 15) ⇒ 9t ≡ 6 ⇒ 3t ≡ 2 (mod 5) ⇒ t ≡ 4 ⇒ x = <b>42</b>. Період — kgV(9,15) = 45: L = 42 + 45ℤ.`, OLD + ' WS 2020, A6', 3);
  H.TF('mod', R`Hat das System $z \equiv 1 \bmod 5$, $5z \equiv 26 \bmod 75$ eine Lösung?`, false, R`Ні: 5z ≡ 26 (mod 75) ⇒ 5z ≡ 26 (mod 5) ⇒ 0 ≡ 1 — суперечність. L = ∅.`, OLD + ' WS 2020, A6', { labels: ['Ja', 'Nein'] });
  NUMC('mod', R`Geben Sie die kleinste nichtnegative Lösung an: $x \equiv 4 \bmod 5$, $x \equiv 9 \bmod 10$.`, R`$x =$`, (x) => x === 9, '9 (L = 9 + 10ℤ)',
    R`x ≡ 9 (mod 10) вже означає x ≡ 4 (mod 5). Перша умова зайва, L = 9 + 10ℤ.`, OLD + ' WS 2017, A4d', 2);
  NUMC('mod', R`Berechnen Sie $\operatorname{ggT}(312, 225)$.`, 'ggT =', (x) => x === 3, '3',
    R`312 = 1·225 + 87; 225 = 2·87 + 51; 87 = 1·51 + 36; 51 = 1·36 + 15; 36 = 2·15 + 6; 15 = 2·6 + 3; 6 = 2·3 + 0 ⇒ ggT = <b>3</b>.`, ER + ' 11', 2);
  NUM2('mod', R`Bestimmen Sie $a, b \in \mathbb{Z}$ mit $a \cdot 161 + b \cdot 28 = \operatorname{ggT}(161, 28)$.`, [R`$a =$`, R`$b =$`],
    (v) => { const a = intv(v[0]), b = intv(v[1]); return 161 * a + 28 * b === 7; }, 'a = −1, b = 6 (ggT = 7)',
    R`161 = 5·28 + 21; 28 = 1·21 + 7; 21 = 3·7 ⇒ ggT = 7. Назад: 7 = 28 − 21 = 28 − (161 − 5·28) = 6·28 − 1·161 ⇒ a = <b>−1</b>, b = <b>6</b>.`, ER + ' 11', 5);
  H.MC('mod', R`Wie lautet der Chinesische Restsatz?`,
    [R`Für teilerfremde $k, \ell \ge 1$ ist $\mathbb{Z}/k\ell\mathbb{Z} \to \mathbb{Z}/k\mathbb{Z} \times \mathbb{Z}/\ell\mathbb{Z},\ x + k\ell\mathbb{Z} \mapsto (x + k\mathbb{Z}, x + \ell\mathbb{Z})$ ein Ringisomorphismus.`,
      R`Für alle $k, \ell \ge 1$ ist $\mathbb{Z}/k\ell\mathbb{Z} \cong \mathbb{Z}/k\mathbb{Z} \times \mathbb{Z}/\ell\mathbb{Z}$.`,
      R`Für Primzahlen $p$ gilt $a^{p-1} \equiv 1 \bmod p$.`,
      R`$\operatorname{ggT}(k,\ell) = sk + t\ell$ für geeignete $s,t \in \mathbb{Z}$.`], 0,
    R`CRT: при ggT(k, ℓ) = 1 відображення x ↦ (x mod k, x mod ℓ) — ізоморфізм кілець; тобто система x ≡ a (mod k), x ≡ b (mod ℓ) має рівно один розв'язок mod kℓ. Без взаємної простоти хибно (ℤ/4ℤ ≇ ℤ/2ℤ × ℤ/2ℤ). Варіант 3 — мала теорема Ферма, 4 — лема Безу.`, HB + ', A12a', { pts: 2 });
  H.TF('mod', R`Für jede Primzahl $p$ und jedes $a \in \mathbb{Z}$ gilt $a^p \equiv a \bmod p$.`, true, R`Істинно — мала теорема Ферма (у формі для всіх a; при p | a обидві сторони ≡ 0).`, 'Skript 5.5');
  H.TF('mod', R`Für alle $a, n$ mit $\operatorname{ggT}(a, n) = 1$ gilt $a^{\varphi(n)} \equiv 1 \bmod n$.`, true, R`Істинно — теорема Ейлера (наслідок Лагранжа для групи (ℤ/nℤ)*, порядок якої φ(n)).`, EX);
  H.TF('mod', R`Beim RSA-Verfahren ist weder $e$ noch $s$ gerade.`, true, R`Істинно: φ(n) = (p−1)(q−1) парне (для p, q > 2; і навіть якщо одне з них 2, друге непарне просте). es ≡ 1 (mod φ(n)) ⇒ es непарне ⇒ e, s непарні.`, OLD + ' WS 2017, A4b');
  H.PROOF('mod', R`(a) Wie lautet der Chinesische Restsatz? (b) Beweisen Sie ihn; Sie dürfen das Lemma von Bézout verwenden.`,
    R`(a) Seien $k, \ell \ge 1$ teilerfremd. Dann ist $\varphi\colon \mathbb{Z}/k\ell\mathbb{Z} \to \mathbb{Z}/k\mathbb{Z}\times\mathbb{Z}/\ell\mathbb{Z},\ x + k\ell\mathbb{Z} \mapsto (x + k\mathbb{Z},\, x + \ell\mathbb{Z})$ ein Ringisomorphismus.<br>(b) <b>Wohldefiniert:</b> $x \equiv x' \bmod k\ell \Rightarrow k\ell \mid x - x' \Rightarrow k \mid x-x'$ und $\ell \mid x - x'$.<br><b>Homomorphismus:</b> komponentenweise: $\varphi(x+y) = \varphi(x)+\varphi(y)$, $\varphi(xy) = \varphi(x)\varphi(y)$, $\varphi(1) = (1,1)$.<br><b>Injektiv:</b> $\varphi(x) = (0,0) \Rightarrow k \mid x,\ \ell \mid x$. Nach Bézout $1 = sk + t\ell$, also $x = skx + t\ell x$, und $k\ell \mid skx$ (da $\ell \mid x$) sowie $k\ell \mid t\ell x$ (da $k \mid x$). Also $k\ell \mid x$, Kern trivial.<br><b>Surjektiv:</b> Beide Seiten haben $k\ell$ Elemente; injektiv $\Rightarrow$ bijektiv. (Alternativ explizit: zu $(a,b)$ ist $x = a t\ell + b s k$ ein Urbild.) $\square$`,
    R`Ідея: коректність → гомоморфізм → ін'єктивність через Безу → сюр'єктивність через рівність потужностей скінченних множин.`, HB + ', A12', 10);
  H.PROOF('mod', R`Zeigen Sie für $a, b, n \in \mathbb{N}$, $n \ge 1$: $ax \equiv b \bmod n$ hat genau dann eine ganzzahlige Lösung, wenn $\operatorname{ggT}(a,n) \mid b$.`,
    R`Sei $d = \operatorname{ggT}(a,n)$.<br>„$\Rightarrow$": Gilt $ax \equiv b$, so $b = ax + kn$ für ein $k \in \mathbb{Z}$. Da $d \mid a$ und $d \mid n$, folgt $d \mid b$.<br>„$\Leftarrow$": Nach Bézout gibt es $s, t$ mit $sa + tn = d$. Ist $b = cd$, so $a(sc) + n(tc) = b$, also $a(sc) \equiv b \bmod n$; $x = sc$ ist Lösung. $\square$`,
    R`Ідея: «⇒» — d ділить ліву частину; «⇐» — масштабуємо Безу-рівність на b/d.`, ER + ' 13 / ' + OLD + ' SS 2019, A5c', 7);
  H.PROOF('mod', R`Sei $Q(N)$ die Quersumme von $N$. Zeigen Sie: $N \equiv Q(N) \bmod 9$.`,
    R`Sei $N = \sum_{i=0}^{k-1} n_i 10^i$. Da $10 \equiv 1 \bmod 9$, folgt $10^i \equiv 1^i = 1 \bmod 9$ (Verträglichkeit der Kongruenz mit Multiplikation). Also $N \equiv \sum n_i \cdot 1 = Q(N) \bmod 9$. $\square$`, R`Ідея: 10 ≡ 1 (mod 9), а конгруенції можна перемножувати й додавати.`, OLD + ' WS 2017, A5', 8);
  H.PROOF('mod', R`Zeigen Sie, dass beim RSA-Verfahren weder $e$ noch $s$ gerade ist.`,
    R`Es gilt $es \equiv 1 \bmod \varphi(n)$ mit $\varphi(n) = (p-1)(q-1)$. Da $p \neq q$ Primzahlen sind, ist mindestens eine ungerade, also ist $\varphi(n)$ gerade. Aus $es = 1 + m\varphi(n)$ folgt: $es$ ist ungerade. Ein Produkt ist nur ungerade, wenn beide Faktoren ungerade sind. $\square$`, R`Ідея: φ(n) парне ⇒ es ≡ 1 (mod 2).`, OLD + ' WS 2017, A4b', 6);

  // ================= GRAPHEN =================
  H.TF('graph', R`Jeder Graph mit $n \ge 1$ Knoten hat weniger als $n^2$ Kanten.`, true, R`Істинно: простий неорієнтований граф має щонайбільше C(n, 2) = n(n−1)/2 < n² ребер.`, HB + ', A1.4');
  H.TF('graph', R`Jeder planare Graph mit $n$ Knoten hat höchstens $3n - 6$ Kanten.`, false, R`Хибно для малих n: при n = 2 граф з одним ребром планарний, але 1 > 3·2 − 6 = 0 (n = 1: 0 > −3). Оцінка m ≤ 3n − 6 діє лише для n ≥ 3. Уважно читайте умови теорем!`, FJ + ', A1.4');
  H.TF('graph', R`Gibt es einen zusammenhängenden planaren Graphen mit 6 Knoten, 12 Kanten und 8 Facetten?`, true, R`Так: октаедр. Перевірка: n − m + f = 6 − 12 + 8 = 2 ✓ і m = 12 ≤ 3·6 − 6 = 12 ✓ (максимально планарний граф).`, OLD + ' WS 2017, A6', { labels: ['Ja', 'Nein'], pts: 3 });
  H.TF('graph', R`Ist $K_5$ planar?` + svg(circ(5, 70, 90, 90, 0), K(5), 180, 180), false, R`Ні: n = 5, m = 10 > 3·5 − 6 = 9.`, 'Skript 7.4', { labels: ['Ja', 'Nein'] });
  H.TF('graph', R`Ist $K_4$ planar?` + svg(circ(4, 70, 90, 90, Math.PI / 4), K(4), 180, 180), true, R`Так: малюємо трикутник і четверту вершину всередині. m = 6 ≤ 3·4 − 6 = 6.`, EX, { labels: ['Ja', 'Nein'] });
  H.TF('graph', R`Ist $K_{3,3}$ planar?` + svg([[40, 40], [110, 40], [180, 40], [40, 150], [110, 150], [180, 150]], [[0, 3], [0, 4], [0, 5], [1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5]], 220, 190), false,
    R`Ні: K₃,₃ двочастковий (без трикутників), тому для планарного m ≤ 2n − 4 = 8, а m = 9.`, 'Skript 7.4', { labels: ['Ja', 'Nein'] });
  const pet = circ(5, 80, 100, 100, 0).concat(circ(5, 38, 100, 100, 0));
  H.TF('graph', R`Ist der Petersen-Graph planar?` + svg(pet, [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 5], [1, 6], [2, 7], [3, 8], [4, 9], [5, 7], [7, 9], [9, 6], [6, 8], [8, 5]], 200, 200), false,
    R`Ні. Найкоротший цикл має довжину 5, тож кожна грань обмежена ≥ 5 ребрами: 5f ≤ 2m. З n = 10, m = 15 і Ейлера f = 7, але 5·7 = 35 > 30. (Також містить підрозбиття K₃,₃ — теорема Куратовського.)`, 'Skript 7.47', { labels: ['Ja', 'Nein'] });
  const cube = [[30, 30], [150, 30], [150, 150], [30, 150], [70, 70], [110, 70], [110, 110], [70, 110]];
  H.TF('graph', R`Ist der Würfelgraph $Q_3$ planar?` + svg(cube, [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], 180, 180), true,
    R`Так — малюнок вище (квадрат у квадраті) вже є планарним вкладенням.`, EX, { labels: ['Ja', 'Nein'] });
  H.TF('graph', R`Ein zusammenhängender Graph hat genau dann einen Eulerkreis, wenn jeder Knoten geraden Grad hat.`, true, R`Істинно — теорема Ейлера.`, 'Skript 7.2');
  H.TF('graph', R`Ein zusammenhängender Graph hat genau dann einen (offenen) Eulerweg, wenn genau zwei Knoten ungeraden Grad haben.`, true, R`Істинно: шлях починається й закінчується в двох вершинах непарного степеня.`, EX);
  H.TF('graph', R`In jedem Graphen ist die Anzahl der Knoten mit ungeradem Grad gerade.`, true, R`Істинно: Σd(x) = 2m парне, тож непарних доданків парна кількість.`, EX);
  H.TF('graph', R`In jedem Graphen mit $|V| \ge 2$ gibt es zwei Knoten mit demselben Grad.`, true, R`Істинно (принцип Діріхле): степені в {0, …, n−1}, але 0 і n−1 одночасно неможливі (вершина степеня n−1 сусідить з усіма). Лишається n−1 значень для n вершин.`, ER + ' 14');
  H.TF('graph', R`Ist $|V|$ ungerade, dann existiert ein Knoten mit ungeradem Grad.`, false, R`Хибно: K₃ (трикутник) — 3 вершини, усі степеня 2.`, ER + ' 14');
  H.TF('graph', R`Jeder Baum mit $n$ Knoten hat genau $n-1$ Kanten.`, true, R`Істинно: дерево — зв'язний ациклічний граф; індукція видаленням листка.`, 'Skript 7.3');
  H.TF('graph', R`Jeder Baum mit mindestens 2 Knoten hat mindestens 2 Blätter.`, true, R`Істинно: кінці найдовшого шляху мають степінь 1.`, EX);
  H.TF('graph', R`Ein Graph ist genau dann bipartit, wenn er keinen Kreis ungerader Länge enthält.`, true, R`Істинно (теорема Кеніга).`, EX);
  H.TF('graph', R`Jeder planare Graph hat einen Knoten mit Grad höchstens 5.`, true, R`Істинно: якби всі dₓ ≥ 6, то 6n ≤ Σdₓ = 2m ≤ 6n − 12. Ікосаедр показує, що 5 не можна покращити.`, 'Skript 7.44');
  H.NUM('graph', R`Wie viele Kanten hat der vollständige Graph $K_7$?`, [21], R`C(7, 2) = 21.`, EX, { label: 'm =' });
  H.NUM('graph', R`Wie viele Kanten hat $K_{3,4}$?`, [12], R`Повний двочастковий K_{a,b}: a·b = 12 ребер.`, EX, { label: 'm =' });
  H.PROOF('graph', R`Sei $G = (V,E)$ ein zusammenhängender planarer Graph. Zeigen Sie: $\sum_{x \in V}(6 - d_x) > 0$.`,
    R`Es ist $\sum_x (6 - d_x) = 6n - \sum_x d_x = 6n - 2m$ (Handschlaglemma). Für $n \ge 3$ gilt $m \le 3n - 6$, also $6n - 2m \ge 6n - 6n + 12 = 12 > 0$. Für $n = 1$: $m = 0$, Summe $= 6 > 0$. Für $n = 2$ (zusammenhängend): $m = 1$, Summe $= 12 - 2 = 10 > 0$. $\square$`,
    R`Ідея: лема про рукостискання + оцінка m ≤ 3n − 6. Не забудьте окремо випадки n = 1, 2 — саме там 3n − 6 не діє!`, HB + ', A13', 5);
  H.PROOF('graph', R`Zeigen Sie, dass $K_{3,3}$ nicht planar ist.`,
    R`Angenommen, $K_{3,3}$ wäre planar. Es ist zusammenhängend mit $n = 6$, $m = 9$. Nach Euler: $f = m - n + 2 = 5$. Da $K_{3,3}$ bipartit ist, enthält er keine Dreiecke; jede Facette wird von $\ge 4$ Kantenseiten berandet: $4f \le 2m$, also $20 \le 18$. Widerspruch. $\square$`,
    R`Ідея: Ейлер + підрахунок «сторін ребер» (кожна грань ≥ 4 ребра, бо немає трикутників). Для K₅ аналогічно з 3f ≤ 2m.`, 'Skript 7.43 / ' + FJ + ', A11', 5);
  H.PROOF('graph', R`Sei $G = (V, E)$ ein ungerichteter Graph mit $|V| \ge 2$. Zeigen Sie, dass mindestens zwei Knoten denselben Grad haben.`,
    R`Sei $n = |V|$. Jeder Grad liegt in $\{0, \dots, n-1\}$. Gäbe es einen Knoten mit Grad $0$ und einen mit Grad $n-1$, so wäre der zweite mit allen anderen, also auch mit dem ersten, verbunden — Widerspruch. Also nehmen die $n$ Grade höchstens $n-1$ verschiedene Werte an; nach dem Schubfachprinzip sind zwei gleich. $\square$`,
    R`Ідея: принцип Діріхле, але спершу «викидаємо» одне з двох значень 0 або n−1.`, ER + ' 14', 5);
})();
