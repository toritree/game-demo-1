import { Font, FontTo } from "./font.js";
import { view } from "./view.js";

export const player = (ctx, { w, h }, time, step, ca, hit) => {
  if (!ca)
    ca = {
      x: Math.floor(w / 2),
      y: Math.floor(h / 2),
      w: 25,
      h: 30,
      hp: 10,
      damWait: null,
    };
  const dam = hit
    .filter((v) => v.t == "obj")
    .find(
      (v) =>
        v.x < ca.x + ca.w &&
        v.x + v.w > ca.x &&
        v.y < ca.y + ca.h &&
        v.h + v.y > ca.y
    );
  if (dam && ca.damWait === null) {
    ca.damWait = time;
    ca.hp -= 1;
  }
  if (ca.damWait + 1< time) ca.damWait = null;

  view(ctx, { x: ca.x, y: ca.y }, Font.player, "white", 5);
  return [ca, { x: ca.x, y: ca.y, w: ca.w, h: ca.h, t: "pl" }];
};
