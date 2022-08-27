import { Font, FontTo } from "./font.js";
import { backGround } from "./backGround.js";
import { player } from "./player.js";
import { view } from "./view.js";
import { meta } from "./meta.js";
import { target } from "./target.js";
import { bullet } from "./bullet.js";
import { retry } from "./retry.js";
import { startFn } from "./start.js";

const getText = async (urls) =>
  await Promise.all(urls.map((v) => fetch(v).then((v) => v.text())));
const split = (text) =>
  text
    .replace(/[!"#\$%&'\(\)=-~\^\|`@{\[\+\*\]}<>,\.\?\/\\]/, " $& ")
    .split(/\s+/);

const call = () => {
  const ca = {};
  let hit = [];
  return {
    view: (ctx, wh, time, step) => {
      const newHitList = [];
      for (const i in ca) {
        const [c, newHit, remove] = ca[i].fn(
          ctx,
          wh,
          time,
          step,
          ca[i].ca,
          hit,
          ca
        );
        ca[i].ca = c;
        newHitList.push(newHit);
        if (remove) delete ca[i];
      }
      hit = newHitList;
    },
    add: (key, fn) => {
      ca[key] = { ca: undefined, fn };
    },
    get: (key) => ca[key].ca,
    set: (key, c) => (ca[key].ca = c),
    list: (m) => Object.keys(ca).filter(m),
    rm: (keys) => {
      for (const i of keys) delete ca[i];
    },
    keys: () => Object.keys(ca),
    has: (key) => key in ca,
  };
};

const main = (_texts) => {
  let texts = []
  let start = undefined;
  let minStep = 0;
  let stepTime = 0;
  let step = 0;
  const canvas = document.getElementById("main");
  const ctx = canvas.getContext("2d");
  const ca = call();
  const key = {
    up: false,
    down: false,
    left: false,
    right: false,
    space: false,
  };
  const reset = () => {
    ca.rm(ca.keys());
    ca.add("bg", backGround);
    ca.set("bg",bg)
    ca.add("player", player);
    ca.add(
      "meta",
      meta(() => {
        return { hp: ca.get("player").hp,sc:stepTime };
      })
    );
    texts = [..._texts]
  };
  const render = (time) => {
    if (!start) start = time;
    const Step = time - start;
    start = time;

    minStep += Step;
    if (minStep >= 500) {
      stepTime++;
      minStep = 0;
    }

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ca.view(ctx, { w: canvas.width, h: canvas.height }, stepTime, Step);
    if (!ca.has("retry") && ca.has("player") && ca.get("player").hp <= 0) {
      ca.rm(ca.keys());
      ca.add("bg", backGround);
      ca.add(
        "retry",
        retry(
          reset,
          (ev) => {
            canvas.onclick = ev;
          },
          () => {
            canvas.onclick = undefined;
          },()=>stepTime
        )
      );
    } else if (ca.has("player")) {
      mouse();
      createTarget();
    }
    window.requestAnimationFrame(render);
  };
  const createTarget = (st) => {
    if (Math.random() < 1 && (minStep==0||(minStep/250>0.95&&minStep/250<1.05)))
      ca.add("tar-" + start, target(Math.random()*canvas.width, 0, texts.shift()));
  };
  const mouse = () => {
    if (
      key.space &&
      (ca.list((v) => v.indexOf("pt-") != -1).length == 0 || minStep == 0)
    )
      ca.add(
        "pt-" + start,
        bullet(ca.get("player").x + ca.get("player").w / 2, ca.get("player").y)
      );
    const pl = ca.get("player");
    pl.x += (key.right ? 1 : key.left ? -1 : 0) * 10;
    pl.y += (key.down ? 1 : key.up ? -1 : 0) * 10;
    if (pl.x < 0) pl.x = 0;
    if (pl.y < 0) pl.y = 0;
    if (pl.x + ca.get("player").w > canvas.width)
      pl.x = canvas.width - ca.get("player").w;
    if (pl.y + ca.get("player").h > canvas.height)
      pl.y = canvas.height - ca.get("player").h - 1;
    ca.set("player", pl);
  };
  window.onkeydown = (ev) => {
    switch (ev.code) {
      case "KeyD":
        key.right = true;
        break;
      case "KeyA":
        key.left = true;
        break;
      case "KeyS":
        key.down = true;
        break;
      case "KeyW":
        key.up = true;
        break;
      case "Space":
        key.space = true;
        break;
      case "ArrowRight":
        key.right = true;
        break;
      case "ArrowLeft":
        key.left = true;
        break;
      case "ArrowDown":
        key.down = true;
        break;
      case "ArrowUp":
        key.up = true;
        break;
    }
  };
  window.onkeyup = (ev) => {
    switch (ev.code) {
      case "KeyD":
        key.right = false;
        break;
      case "KeyA":
        key.left = false;
        break;
      case "KeyS":
        key.down = false;
        break;
      case "KeyW":
        key.up = false;
        break;
      case "Space":
        key.space = false;
        break;
      case "ArrowRight":
        key.right = false;
        break;
      case "ArrowLeft":
        key.left = false;
        break;
      case "ArrowDown":
        key.down = false;
        break;
      case "ArrowUp":
        key.up = false;
        break;
    }
  };
  ca.add("bg", backGround);
  const bg = ca.get("bg");
  ca.add(
    "start",
    startFn(
      reset,
      (ev) => {
        canvas.onclick = ev;
      },
      () => {
        canvas.onclick = undefined;
      }
    )
  );
  window.requestAnimationFrame(render);
};

const resize = () => {
  const canvas = document.getElementById("main");
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;
};

window.onload = async () => {
  main(
    split(
      await (
        await getText([
          "LICENSE",
          "./font.js",
          "./backGround.js",
          "./player.js",
          "./view.js",
          "./meta.js",
          "./target.js",
          "./bullet.js",
          "./retry.js",
          "./index.js",
        ])
      )
        .join("")
        .toLowerCase()
    )
  );
  resize();
};
window.onresize = resize;
