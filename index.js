/**
 *
 * @returns HtmlElement
 */
const getSvg = () =>
  document.getElementById("mainSvg") ||
  (() => {
    throw Error();
  })();
/**
 *
 * @param {string[]} urls
 * @returns
 */
const getText = async (urls) =>
  await Promise.all(urls.map((v) => fetch(v).then((v) => v.text())));
/**
 *
 * @param {string} text
 * @returns
 */
const split = (text) =>
  text
    .replace(/[!"#\$%&'\(\)=-~\^\|`@{\[\+\*\]}<>,\.\?\/\\]/, " $& ")
    .split(/\s+/);

const hitBox = ({ x, y, width, height }, { x: px, y: py }) =>
  x <= px && px <= x + width && y <= py && py <= y + height;

class text {
  constructor(text, hitElement, calHit) {
    this.text = text;
    this.hitElement = hitElement;
    this.calHit = calHit;
    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    this.element.setAttribute("fill", "black");
    this.element.setAttribute("font-size", 3);
    this.resetXY();
    this.xy = { x: 0, y: 0 };
    this.size = { width: 100, height: 100 };
    this.connection = false;
    this.element.textContent = text;
  }
  resetXY = () => {
    this.xy = { x: Math.random() * 100, y: -10 };
    this.element.setAttribute("x", this.xy.x);
    this.element.setAttribute("y", this.xy.y);
  };

  move = (remove) => {
    this.element.setAttribute("y", this.xy.y);
    this.xy.y += 0.7;
    this.hitTest();
    if (this.underLine()) remove();
  };
  underLine = () => (this.xy.y >= 110 ? this.unlink() || true : false);

  link = () => {
    if (!this.connection) {
      getSvg().appendChild(this.element);
      this.resetXY();
    }
    this.connection = true;
  };
  unlink = () => {
    if (this.connection) this.element.remove();
    this.connection = false;
  };
  hitTest = () => {
    if (!this.hitElement) return;
    if (hitBox(this.element.getBBox(), this.hitElement.getBBox()))
      this.calHit();
  };
}

class Player extends text {
  constructor() {
    super("^");
    this.link();
    this.xy = { x: 50, y: 50 };
    this.element.setAttribute("font-size", 3.5);
    window.onkeydown = this.keydown;
  }
  keydown = (ev) => {
    this.xy.x += ev.code === "KeyD" && (this.xy.x < this.size.width - 1) * 0.8;
    this.xy.x -= ev.code === "KeyA" && (this.xy.x > 1) * 0.8;
    this.xy.y -= ev.code === "KeyW" && (this.xy.y > 1) * 0.8;
    this.xy.y += ev.code === "KeyS" && (this.xy.y < this.size.height - 1) * 0.8;
  };

  resetXY = () => this.move();
  move = () => {
    this.element.setAttribute("x", this.xy.x);
    this.element.setAttribute("y", this.xy.y);
    this.element.textContent = this.element.textContent == "^" ? "~ " : "^";
  };
}

const load = () => {
  const loadELement = document.getElementById("load");
  loadELement.setAttribute("open", true);
  loadELement.onclick = () => {
    loadELement.removeAttribute("open");
    main();
  };
};
const gameOver = (sc, msc) => {
  const loadELement = document.getElementById("gameOver");
  loadELement.setAttribute("open", true);
  document.getElementById("gameOver-sc").textContent = `score:${(
    "00000000" + sc
  ).slice(-8)}`;
  document.getElementById("gameOver-max-sc").textContent = `max score:${(
    "00000000" + msc
  ).slice(-8)}`;
  document.getElementById("hp").innerText = "";
  gameOverRetry();
};
const gameOverRetry = () => {
  const loadELement = document.getElementById("gameOver-retry");
  loadELement.onclick = () => {
    document.getElementById("gameOver").removeAttribute("open");
    main();
  };
};
const main = async () => {
  getSvg().innerHTML = "";
  const player = new Player();
  const words = split(
    await (await getText(["index.html","index.js", "style.css", "LICENSE"])).join("")
  );
  const hpELement = document.getElementById("hp");
  let damage = 0;
  let damageWaitTime = 0;
  let score = 0;
  let time;
  const maxScore = localStorage.getItem("max-score")
    ? localStorage.getItem("max-score")
    : 0;
  const wordClass = words.map(
    (v) =>
      new text(v, player.element, () => {
        damage += !damageWaitTime;
        if (damage >= 10) {
          if (score > maxScore) localStorage.setItem("max-score", score);
          clearInterval(time);
          gameOver(score, maxScore);
        }
        if (!damageWaitTime) damageWaitTime = 10;
      })
  );
  const renderWord = [];

  time = setInterval(() => {
    if (Math.random() <= 0.3) renderWord.push(wordClass.shift());
    renderWord.at(-1).link();
    player.move();
    renderWord.forEach((v, i) => {
      v.move(() => {
        wordClass.push(v);
        delete renderWord[i];
      });
    });
    if (damageWaitTime) damageWaitTime--;
    score++;
    hpELement.textContent = damage<10?`hp:${("00" + (10 - damage)).slice(-2)} score:${(
      "00000000" + score
    ).slice(-8)} max score:${("00000000" + maxScore).slice(-8)}`:"";
  }, 50);
};

window.onload = load;
