// Gera os SVGs estáticos da pasta assets/ (terminal, editor, cabeçalhos, stack, trajetória e rodapé).
// Para mudar algum texto do perfil, edite os DADOS abaixo e rode:  node scripts/gerar-assets.mjs
import { mkdirSync, writeFileSync } from "node:fs";

// ============================== DADOS ==============================
const PERFIL = {
  usuario: "antonio",
  nome: "Antonio Pereira",
  monograma: "AP",
  legendaMonograma: "// back-end · front-end · ia",
  foco: ["Back-end", "Front-end", "Inteligência Artificial"],
  formacao: ["Análise e Desenvolvimento de Sistemas", "Faculdade Senac"],
  localizacao: "Recife, Pernambuco — Brasil",
  pronto: "✔ pronto para novos desafios",
  despedida: "obrigado pela visita!",
};

const STACK = [
  ["backend", ["Node.js", "Express", "Python"]],
  ["frontend", ["HTML", "CSS", "JavaScript"]],
  ["dados", ["SQL", "Prisma ORM"]],
  ["infra_deploy", ["Render", "Vercel", "Aiven", "Cloudinary", "TiDB"]],
  ["ferramentas", ["Git", "GitHub", "Figma", "Trello"]],
  ["metodologias", ["Scrum", "Kanban"]],
  ["ia", ["LLMs (IA aplicada)", "Lógica de Programação"]],
  ["soft_skills", ["Comunicação", "Trabalho em equipe", "Oratória", "Pensamento analítico"]],
];

// tipo: residencia | evento | premio | projeto | init  (mais recente primeiro)
const TRAJETORIA = [
  ["residencia", "2026.2", "Residência Tecnológica", "Banco do Brasil"],
  ["evento", "2026.2", "REC'n'Play", "Capítulo IA"],
  ["residencia", "2026.1", "Residência Tecnológica", "Banco do Brasil"],
  ["projeto", "2026.1", "GENAT · Gerenciamento de Atividades Complementares", "Faculdade Senac"],
  ["premio", "2026.1", "Aluno destaque", "Porto Digital"],
  ["evento", "2026.1", "Hackathon Porto de Suape", ""],
  ["evento", "2026.1", "Hackathon Manus Day 2026", "Recife"],
  ["residencia", "2025.2", "Residência Tecnológica", "Liferay DXP"],
  ["premio", "2025.2", "Aluno destaque", "Porto Digital"],
  ["evento", "2025.2", "REC'n'Play", ""],
  ["init", "origem", "Atendimento ao cliente @ Ferreira Costa", "→ foco no usuário"],
];

const CERTIFICADOS = [
  ["rocketseat/", "formacao-nodejs-rotas-http-e-apis"],
  ["rocketseat/", "projeto-com-tooling-fundamentos"],
  ["eldorado/", "psicologia-aplicada-a-ux"],
];

const SECOES = ["sobre_mim", "tecnologias", "trajetoria", "projetos", "estatisticas", "contribuicoes"];
const ARQ_SECAO = ["h-sobre", "h-tecnologias", "h-trajetoria", "h-projetos", "h-estatisticas", "h-contribuicoes"];

// ============================== TEMA ==============================
const C = {
  bg: "#0d1117", panel: "#161b22", border: "#30363d", text: "#c9d1d9", muted: "#8b949e",
  green: "#39d353", blue: "#58a6ff", purple: "#d2a8ff", orange: "#ffa657", cyan: "#79c0ff",
  str: "#a5d6ff", red: "#ff7b72", gold: "#e3b341", white: "#ffffff",
};
const FONT = "'JetBrains Mono','Fira Code',Consolas,'Courier New',monospace";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const span = (fill, s, extra = "") => `<tspan fill="${fill}"${extra}>${esc(s)}</tspan>`;
const r1 = (n) => Math.round(n * 10) / 10;

function janela(W, H, titulo, r = 14, barra = 46) {
  return `<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="${r}" fill="${C.bg}" stroke="${C.border}" stroke-width="2"/>
<path d="M1 ${r + 1} a${r} ${r} 0 0 1 ${r} -${r} H${W - r - 1} a${r} ${r} 0 0 1 ${r} ${r} V${barra} H1Z" fill="${C.panel}"/>
<rect x="1" y="${barra}" width="${W - 2}" height="1" fill="${C.border}"/>
<circle cx="28" cy="${barra / 2 + 1}" r="7" fill="#ff5f57"/><circle cx="50" cy="${barra / 2 + 1}" r="7" fill="#febc2e"/><circle cx="72" cy="${barra / 2 + 1}" r="7" fill="#28c840"/>
<text x="${W / 2}" y="${barra / 2 + 6}" text-anchor="middle" fill="${C.muted}" font-size="14">${esc(titulo)}</text>`;
}

// ------------------------- cabeçalhos de seção -------------------------
function cabecalho(num, nome) {
  const label = `${num}. // ${nome}()`;
  const cur = Math.floor(18 + label.length * 13.2 + 7);
  const lx = cur + 24;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="56" viewBox="0 0 900 56"><style>.cur{animation:bl 1s steps(1) infinite} @keyframes bl{50%{opacity:0}}</style><defs><linearGradient id="l" x1="0" x2="1"><stop offset="0" stop-color="${C.green}"/><stop offset="1" stop-color="${C.green}" stop-opacity="0"/></linearGradient></defs><rect x="1" y="1" width="898" height="54" rx="10" fill="${C.bg}" stroke="${C.border}"/><text x="18" y="36" font-family="${FONT.replace(/'/g, "&apos;")}" font-size="22" font-weight="700" xml:space="preserve">${span(C.green, num + ".")}${span(C.muted, " // ")}${span(C.text, nome)}${span(C.purple, "()")}</text><rect class="cur" x="${cur}" y="18" width="11" height="22" fill="${C.green}"/><rect x="${lx}" y="28" width="${890 - lx}" height="2" fill="url(#l)"/></svg>\n`;
}

// ------------------------- terminal (topo) -------------------------
const PIXEL = {
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  V: ["#...#", "#...#", "#...#", "#...#", "#...#", ".#.#.", "..#.."],
  M: ["#...#", "##.##", "#.#.#", "#.#.#", "#...#", "#...#", "#...#"],
  B: ["####.", "#...#", "#...#", "####.", "#...#", "#...#", "####."],
  P: ["####.", "#...#", "#...#", "####.", "#....", "#....", "#...."],
};

function terminal() {
  const W = 1000, H = 426, CW = 10.2;
  const prompt = `${PERFIL.usuario}@github:~$ `;
  const px = r1(30 + prompt.length * CW);
  const linhaPrompt = (y, d) =>
    `<text x="30" y="${y}" class="o" style="animation-delay:${d.toFixed(2)}s">${span(C.green, PERFIL.usuario + "@github")}${span(C.muted, ":")}${span(C.blue, "~")}${span(C.muted, "$ ")}`;

  const [f1, f2, f3] = PERFIL.foco;
  const passos = [
    { cmd: "whoami", out: `<tspan fill="${C.text}" font-size="26" font-weight="700">${esc(PERFIL.nome)}</tspan>`, grande: true },
    { cmd: "cat foco.txt", out: span(C.purple, f1) + span(C.muted, "  &&  ") + span(C.orange, f2) + span(C.muted, "  &&  ") + span(C.cyan, f3) },
    { cmd: "cat formacao.txt", out: span(C.str, PERFIL.formacao[0]) + span(C.muted, " @ ") + span(C.text, PERFIL.formacao[1]) },
    { cmd: "echo $LOCALIZACAO", out: span(C.str, PERFIL.localizacao) },
    { cmd: "./carregar_carreira.sh", barra: true },
  ];

  let t = 0.5, y = 96, corpo = "";
  for (const p of passos) {
    const n = p.cmd.length, dur = n * 0.06, inicio = t + 0.3, w = Math.round(n * CW + 4);
    corpo += `${linhaPrompt(y, t)}${span(C.text, p.cmd)}</text>\n`;
    corpo += `<rect x="${px}" y="${y - 16}" width="${w}" height="22" fill="${C.bg}" class="tp" style="--w:${w}px;animation:tp ${dur.toFixed(2)}s steps(${n}) ${inicio.toFixed(2)}s forwards,hd .01s linear ${(inicio + dur).toFixed(2)}s forwards"/>\n`;
    const saida = inicio + dur + 0.35;
    y += 28;
    if (p.barra) {
      const d = saida.toFixed(2);
      corpo += `<text x="30" y="${y}" class="o" style="animation-delay:${d}s">${span(C.muted, "[")}</text>
<rect x="44" y="${y - 13}" width="300" height="14" rx="2" fill="${C.panel}" class="o" style="animation-delay:${d}s"/>
<rect x="44" y="${y - 13}" width="300" height="14" rx="2" fill="${C.green}" class="bar" style="animation:bar 2.4s steps(20) ${d}s forwards"/>
<text x="350" y="${y}" class="o" style="animation-delay:${d}s">${span(C.muted, "]")}</text>
<text x="370" y="${y}" class="o" style="animation-delay:${(saida + 2.5).toFixed(2)}s">${span(C.green, PERFIL.pronto)}</text>\n`;
      t = saida + 2.7;
      y += 30;
    } else {
      corpo += `<text x="30" y="${y}" class="o" style="animation-delay:${saida.toFixed(2)}s">${p.out}</text>\n`;
      t = saida + 0.25;
      y += p.grande ? 34 : 28;
    }
  }
  corpo += `${linhaPrompt(y, t)}</text>\n<rect x="${Math.round(px)}" y="${y - 15}" width="10" height="19" fill="${C.text}" class="cur" style="animation-delay:${t.toFixed(2)}s"/>`;

  // monograma em pixels
  const letras = [...PERFIL.monograma].map((ch) => PIXEL[ch.toUpperCase()]).filter(Boolean);
  const S = 13, larg = letras.length * 5 * S + (letras.length - 1) * S, x0 = 850 - larg / 2, y0 = 132;
  let px2 = "";
  letras.forEach((L, li) => L.forEach((row, ry) => [...row].forEach((c, cx) => {
    if (c === "#") px2 += `<rect x="${x0 + li * 6 * S + cx * S}" y="${y0 + ry * S}" width="11" height="11" rx="2" fill="url(#mg)"/>`;
  })));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<style>
text{font-family:${FONT};font-size:17px;white-space:pre}
.o{opacity:0;animation:o .01s linear forwards}
@keyframes o{to{opacity:1}}
@keyframes tp{to{transform:translateX(var(--w));width:0}}
@keyframes hd{to{opacity:0}}
.bar{transform-box:fill-box;transform-origin:left;transform:scaleX(0)}
@keyframes bar{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.cur{opacity:0;animation:o .01s linear forwards,bl 1s steps(1) infinite}
@keyframes bl{50%{fill:transparent}}
.glow2{animation:gl 3s ease-in-out infinite} @keyframes gl{50%{opacity:.6}}
</style>
${janela(W, H, `${PERFIL.usuario}@github: ~ — bash`)}
<defs><linearGradient id="mg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.green}"/><stop offset="1" stop-color="${C.blue}"/></linearGradient><filter id="gw" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<g class="glow2" filter="url(#gw)">${px2}</g>
<text x="850" y="${y0 + 7 * S + 38}" text-anchor="middle" fill="${C.muted}" style="font-size:13px">${esc(PERFIL.legendaMonograma)}</text>
${corpo}
</svg>\n`;
}

// ------------------------- editor (sobre mim) -------------------------
function editor() {
  const k = (s) => span(C.cyan, s), s = (x) => span(C.str, `"${x}"`), p = (x) => span(C.text, x);
  const lista = (arr) => p("[") + arr.map((x) => s(x)).join(p(", ")) + p("]");
  const linhas = [
    span(C.red, "const ") + span(C.blue, "antonio") + p(" = {"),
    p("  ") + k("cargo") + p(": ") + s("Dev Web | Backend & Frontend") + p(","),
    p("  ") + k("formacao") + p(": ") + s("ADS @ Faculdade Senac") + p(","),
    p("  ") + k("ecossistema") + p(": ") + s("Porto Digital") + p(","),
    p("  ") + k("residencias") + p(": ") + lista(["Banco do Brasil", "Liferay DXP"]) + p(","),
    p("  ") + k("projetos") + p(": ") + lista(["BioAlert", "Barbearia Digital"]) + p(","),
    p("  ") + k("diferencial") + p(": ") + s("comunicação + foco no usuário") + p(","),
    p("  ") + k("disponivel") + p(": ") + span(C.cyan, "true") + p(","),
    p("};"),
    "",
    span(C.muted, "// ") + span(C.orange, "TODO: ") + span(C.muted, "transformar café em APIs"),
  ];
  const W = 570, y0 = 104, step = 23, yBar = y0 + (linhas.length - 1) * step + 18, H = yBar + 30;
  let corpo = "";
  linhas.forEach((l, i) => {
    const y = y0 + i * step;
    corpo += `<text x="22" y="${y}" fill="${C.muted}" font-size="13" text-anchor="end" opacity=".6" transform="translate(16,0)">${i + 1}</text>
<text x="52" y="${y}" class="ln" style="animation-delay:${(0.3 + i * 0.25).toFixed(2)}s" xml:space="preserve">${l}</text>\n`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<style>
text{font-family:${FONT};font-size:14px}
.ln{opacity:0;animation:ln .35s ease-out forwards}
@keyframes ln{from{opacity:0;transform:translateX(-5px)}to{opacity:1;transform:none}}
</style>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="12" fill="${C.bg}" stroke="${C.border}" stroke-width="2"/>
<path d="M1 13 a12 12 0 0 1 12 -12 H${W - 13} a12 12 0 0 1 12 12 V40 H1Z" fill="${C.panel}"/>
<circle cx="22" cy="20" r="6" fill="#ff5f57"/><circle cx="40" cy="20" r="6" fill="#febc2e"/><circle cx="58" cy="20" r="6" fill="#28c840"/>
<rect x="1" y="40" width="${W - 2}" height="34" fill="${C.panel}"/>
<rect x="1" y="40" width="170" height="34" fill="${C.bg}"/><rect x="1" y="40" width="170" height="2" fill="#f1e05a"/>
<text x="16" y="62" fill="#f1e05a" font-size="12" font-weight="700">JS</text><text x="38" y="62" fill="${C.text}" font-size="13">sobre_mim.js</text>
<text x="190" y="62" fill="${C.muted}" font-size="13">server.js</text>
<rect x="1" y="74" width="${W - 2}" height="1" fill="${C.border}"/>
${corpo}<path d="M1 ${yBar} H${W - 1} V${H - 13} a12 12 0 0 1 -12 12 H13 a12 12 0 0 1 -12 -12Z" fill="#1f6feb"/>
<text x="14" y="${yBar + 19}" fill="#fff" font-size="12">⎇ main</text>
<text x="86" y="${yBar + 19}" fill="#fff" font-size="12">✓ 0 bugs</text>
<text x="${W - 14}" y="${yBar + 19}" fill="#fff" font-size="12" text-anchor="end" xml:space="preserve">UTF-8   JavaScript</text>
</svg>\n`;
}

// ------------------------- stack.yml (tecnologias) -------------------------
function stack() {
  const W = 1000, y0 = 120, step = 30, H = y0 + (STACK.length - 1) * step + 40;
  const pad = Math.max(...STACK.map(([k]) => k.length)) + 2;
  let corpo = `<text x="30" y="82" class="l" xml:space="preserve">${span(C.green, "$")}${span(C.text, " cat ")}${span(C.str, "stack.yml")}</text>\n`;
  STACK.forEach(([k, vals], i) => {
    const y = y0 + i * step;
    const v = vals.map((x) => span(C.str, x)).join(span(C.muted, ", "));
    corpo += `<text x="30" y="${y}" class="l" style="animation-delay:${(0.2 + i * 0.12).toFixed(2)}s" xml:space="preserve">${span("#7ee787", k)}${span(C.muted, ":" + " ".repeat(pad - k.length - 1))}${span(C.text, "[")}${v}${span(C.text, "]")}</text>\n`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<style>text{font-family:${FONT};font-size:15px;white-space:pre}
.l{opacity:0;animation:l .4s ease-out forwards}@keyframes l{to{opacity:1}}</style>
${janela(W, H, "stack.yml — competencias", 14, 46)}
${corpo}</svg>\n`;
}

// ------------------------- trajetória (git log) -------------------------
function trajetoria() {
  const COR = { residencia: C.blue, evento: C.purple, premio: C.gold, projeto: C.green, init: C.muted };
  const TAG = { residencia: "residência", evento: "evento", premio: "prêmio", projeto: "projeto", init: "init" };
  const CW = 8.4, W = 1000, y0 = 130, step = 30;
  const yUlt = y0 + (TRAJETORIA.length - 1) * step;
  const yCert = yUlt + 50, H = yCert + CERTIFICADOS.length * 26 + 30;
  let seed = 0x5eed;
  const hash = () => Array.from({ length: 7 }, () => {
    seed = (Math.imul(seed, 1103515245) + 12345) >>> 0;
    return ((seed >>> 16) & 15).toString(16);
  }).join("");

  let corpo = `<text x="30" y="86" class="l" xml:space="preserve" style="font-size:15px">${span(C.green, "$")}${span(C.text, " git log ")}${span(C.orange, "--graph --oneline ")}${span(C.purple, "carreira")}</text>\n`;
  // legenda
  let lx = 970;
  const leg = ["projeto", "premio", "evento", "residencia"];
  let legenda = "";
  for (const tipo of leg) {
    const label = TAG[tipo], w = label.length * 7.8;
    legenda = `<circle cx="${r1(lx - w - 10)}" cy="81" r="4.5" fill="${COR[tipo]}"/><text x="${r1(lx - w)}" y="86" fill="${C.muted}" style="font-size:13px">${esc(label)}</text>` + legenda;
    lx -= w + 34;
  }
  corpo += `<g class="l">${legenda}</g>\n`;
  corpo += `<rect x="43" y="${y0 - 5}" width="2" height="${yUlt - y0}" fill="${C.border}" class="l"/>\n`;

  TRAJETORIA.forEach(([tipo, data, msg, sub], i) => {
    const y = y0 + i * step, d = (0.2 + i * 0.12).toFixed(2), cor = COR[tipo];
    let linha = span(C.orange, hash(), ` x="66"`) + span(C.muted, data, ` x="142"`);
    linha += `<tspan x="210" fill="${C.muted}">(</tspan>${span(cor, TAG[tipo])}${span(C.muted, ")")}`;
    linha += `<tspan x="326" fill="${tipo === "init" ? C.muted : C.text}">${esc(msg)}</tspan>`;
    if (sub) linha += tipo === "init" ? span(C.muted, " " + sub) : span(C.muted, " — ") + span(C.white, sub, ` font-weight="700"`);
    let head = "";
    if (i === 0) {
      const len = msg.length + (sub ? sub.length + 3 : 0);
      head = `<text x="${r1(326 + len * CW + 14)}" y="${y}">${span(C.muted, "(")}${span(C.cyan, "HEAD -> ")}${span(C.green, "main", ` font-weight="700"`)}${span(C.muted, ")")}</text>`;
    }
    corpo += `<g class="l" style="animation-delay:${d}s"><circle cx="44" cy="${y - 5}" r="6" fill="${cor}" stroke="${C.bg}" stroke-width="2"/><text y="${y}" xml:space="preserve">${linha}</text>${head}</g>\n`;
  });

  const dc = (0.3 + TRAJETORIA.length * 0.12).toFixed(2);
  corpo += `<text x="30" y="${yCert}" class="l" style="animation-delay:${dc}s;font-size:15px" xml:space="preserve">${span(C.green, "$")}${span(C.text, " ls ")}${span(C.orange, "-1 ")}${span(C.str, "certificados/")}</text>\n`;
  CERTIFICADOS.forEach(([dir, arq], i) => {
    const d = (Number(dc) + 0.15 + i * 0.12).toFixed(2);
    corpo += `<text x="30" y="${yCert + 28 + i * 26}" class="l" style="animation-delay:${d}s" xml:space="preserve">${span(C.blue, dir.padEnd(13), ` font-weight="700"`)}${span(C.text, arq)}</text>\n`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<style>text{font-family:${FONT};font-size:14px;white-space:pre}
.l{opacity:0;animation:l .4s ease-out forwards}@keyframes l{to{opacity:1}}</style>
${janela(W, H, "trajetoria.log — git log", 14, 46)}
${corpo}</svg>\n`;
}

// ------------------------- rodapé -------------------------
function rodape() {
  const msg = `> ${PERFIL.despedida}  volte sempre :)`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="120" viewBox="0 0 1000 120">
<style>text{font-family:${FONT};font-size:17px;white-space:pre}
.cur{animation:bl 1s steps(1) infinite} @keyframes bl{50%{opacity:0}}</style>
<rect x="1" y="1" width="998" height="118" rx="14" fill="${C.bg}" stroke="${C.border}" stroke-width="2"/>
<text x="30" y="48">${span(C.green, PERFIL.usuario + "@github")}${span(C.muted, ":")}${span(C.blue, "~")}${span(C.muted, "$ ")}${span(C.text, "exit")}</text>
<text x="30" y="82">${span(C.muted, "> ")}${span(C.green, PERFIL.despedida)}${span(C.muted, "  volte sempre :)")}</text>
<rect x="${Math.round(30 + msg.length * 10.2) + 2}" y="67" width="10" height="19" fill="${C.text}" class="cur"/>
<text x="970" y="82" text-anchor="end" fill="${C.muted}" font-size="13">[processo finalizado com código 0]</text>
</svg>\n`;
}

// ============================== SAÍDA ==============================
const out = new URL("../assets/", import.meta.url);
mkdirSync(out, { recursive: true });
const salvar = (nome, svg) => writeFileSync(new URL(nome, out), svg);
SECOES.forEach((s, i) => salvar(`${ARQ_SECAO[i]}.svg`, cabecalho(String(i + 1).padStart(2, "0"), s)));
salvar("terminal.svg", terminal());
salvar("editor.svg", editor());
salvar("stack.svg", stack());
salvar("trajetoria.svg", trajetoria());
salvar("rodape.svg", rodape());
console.log("assets/ atualizados");
