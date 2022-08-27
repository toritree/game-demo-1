import { Font, FontTo } from "./font.js";
import { view } from "./view.js";

export const target =
  (mx, my, txt) =>
  (ctx, { w, h }, time, step, ca, hit) => {
    if (!ca)
      ca = {
        x: mx,
        y: my,
        w: txt.length * 30,
        h: 25,
        txt: txt,
      };
    const dam = hit
      .filter((v) => v.t == "bullet")
      .find(
        (v) =>
          v.x < ca.x + ca.w &&
          v.x + v.w > ca.x &&
          v.y < ca.y + ca.h &&
          v.h + v.y > ca.y
    );
    if (dam) {
      ca.txt = ca.txt.slice(1)
      ca.x += 15
      ca.w -=30
    }
    String(ca.txt)
      .split("")
      .forEach((i, index) => {
        view(ctx, { x: ca.x + index * 30, y: ca.y }, Font.meta[i], "white", 5);
      });
    ca.y += step * 0.3;
    return [ca, { x: ca.x, y: ca.y, w: ca.w, h: ca.h, t: "obj" }, ca.y > h||ca.txt.length==0];
  };
