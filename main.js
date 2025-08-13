// おみくじの内容（タイトル・説明・タイプで管理）
const fortunes = [
  {
    title: "大吉",
    desc: "今日は素晴らしい幸運が訪れます！新しいことに挑戦してみましょう。",
    type: "positive"
  },
  {
    title: "中吉",
    desc: "思わぬチャンスが巡ってきます。積極的に行動して吉。",
    type: "positive"
  },
  {
    title: "小吉",
    desc: "小さな幸せを見逃さずに。感謝の気持ちを大切に。",
    type: "positive"
  },
  {
    title: "吉",
    desc: "新しい出会いがありそうです。笑顔を忘れずに。",
    type: "positive"
  },
  {
    title: "末吉",
    desc: "焦らずゆっくり進めば、良い結果が得られます。",
    type: "advice"
  },
  {
    title: "凶",
    desc: "トラブルに注意。無理せず慎重に行動しましょう。",
    type: "warning"
  },
  {
    title: "大凶",
    desc: "今日は控えめに過ごすのが吉。周囲に感謝を忘れずに。",
    type: "warning"
  },
  {
    title: "半吉",
    desc: "良いことも悪いことも半分ずつ。バランスを大切に。",
    type: "advice"
  }
];

// 花火アニメーション
const canvas = document.getElementById('fireworks-canvas');
const ctx = canvas.getContext('2d');
let fireworks = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function randomColor() {
  const colors = ['#ffe066', '#ff7675', '#74b9ff', '#fd79a8', '#55efc4', '#fdcb6e'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function launchFirework() {
  const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
  const y = Math.random() * canvas.height * 0.3 + canvas.height * 0.2;
  const color = randomColor();
  const particles = [];
  for (let i = 0; i < 36; i++) {
    const angle = (i / 36) * 2 * Math.PI;
    const speed = Math.random() * 3 + 2;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      color
    });
  }
  fireworks.push({ particles });
}

function animateFireworks() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fireworks.forEach((fw, i) => {
    fw.particles.forEach(p => {
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.97;
      p.vy *= 0.97;
      p.vy += 0.03; // gravity
      p.alpha *= 0.96;
    });
  });
  fireworks = fireworks.filter(fw => fw.particles.some(p => p.alpha > 0.05));
  ctx.globalAlpha = 1;
  requestAnimationFrame(animateFireworks);
}
animateFireworks();

// おみくじ表示アニメーション
function showFortune(fortune) {
  const section = document.getElementById('result-section');
  const title = document.getElementById('fortune-title');
  const desc = document.getElementById('fortune-desc');

  // 一度非表示にしてから内容更新
  section.classList.remove('visible');
  setTimeout(() => {
    title.textContent = fortune.title;
    desc.textContent = fortune.desc;
    section.className = fortune.type;
    // フェードイン
    section.classList.add('visible');
  }, 400);
}

// ボタンイベント
document.getElementById('fortune-btn').addEventListener('click', () => {
  const idx = Math.floor(Math.random() * fortunes.length);
  const fortune = fortunes[idx];
  showFortune(fortune);
  // 花火を複数回打ち上げ
  for (let i = 0; i < 3; i++) {
    setTimeout(launchFirework, i * 300);
  }
});

// ...既存のコード...

// 運勢ごとのアイコン
const fortuneIcons = {
  "大吉": "🎉",
  "中吉": "😊",
  "小吉": "🙂",
  "吉": "😌",
  "末吉": "🍀",
  "凶": "⚡",
  "大凶": "💀",
  "半吉": "🤔"
};

// 効果音
const soundFirework = new Audio('firework.mp3'); // ファイルを用意
const soundCongrats = new Audio('congrats.mp3'); // ファイルを用意

// 履歴管理
let history = [];
let counts = {};

// 履歴表示
function updateHistory(fortune) {
  history.unshift(fortune);
  counts[fortune.title] = (counts[fortune.title] || 0) + 1;

  // 履歴リスト更新
  const list = document.getElementById('history-list');
  list.innerHTML = '';
  history.slice(0, 10).forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${fortuneIcons[item.title] || ''} ${item.title} - ${item.desc}`;
    list.appendChild(li);
  });

  // カウント表示
  const countDiv = document.getElementById('fortune-counts');
  countDiv.innerHTML = Object.entries(counts)
    .map(([title, num]) => `${fortuneIcons[title] || ''} ${title}: ${num}回`)
    .join(' / ');
}

// SNSシェア
function shareSNS(fortune) {
  const text = `【${fortune.title}】${fortune.desc} #おみくじ`;
  const url = encodeURIComponent(location.href);
  const shareText = encodeURIComponent(text);

  document.getElementById('share-x').href =
    `https://twitter.com/intent/tweet?text=${shareText}&url=${url}`;
  document.getElementById('share-line').href =
    `https://social-plugins.line.me/lineit/share?url=${url}&text=${shareText}`;
}

// おみくじ表示アニメーション＋アイコン＋効果音＋履歴＋シェア
function showFortune(fortune) {
  const section = document.getElementById('result-section');
  const title = document.getElementById('fortune-title');
  const desc = document.getElementById('fortune-desc');
  const icon = document.getElementById('fortune-icon');

  section.classList.remove('visible');
  setTimeout(() => {
    title.textContent = fortune.title;
    desc.textContent = fortune.desc;
    icon.textContent = fortuneIcons[fortune.title] || '';
    section.className = fortune.type;
    section.classList.add('visible');
    updateHistory(fortune);
    shareSNS(fortune);
    if (fortune.type === 'positive') soundCongrats.play();
    soundFirework.play();
  }, 400);
}

// ボタンイベント
document.getElementById('fortune-btn').addEventListener('click', () => {
  const idx = Math.floor(Math.random() * fortunes.length);
  const fortune = fortunes[idx];
  showFortune(fortune);
  for (let i = 0; i < 3; i++) setTimeout(launchFirework, i * 300);
});