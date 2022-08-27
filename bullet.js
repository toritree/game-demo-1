import { Font, FontTo } from "./font.js";
import { view } from "./view.js";

export const bullet =
  (mx, my) =>
  (ctx, { w, h }, time, step, ca, hit) => {
    if (!ca)
      ca = {
        x: mx,
        y: my,
        w: 20,
        h: 15,
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
    view(ctx, { x: ca.x - 5, y: ca.y }, Font.bullet.one, "white", 5);

    ca.y += step * -1;
    return [ca, { x: ca.x, y: ca.y, w: ca.w, h: ca.h, t: "bullet" }, ca.y < 0||dam];
  };
