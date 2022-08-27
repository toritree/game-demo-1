import { Font, FontTo } from "./font.js";
import { view } from "./view.js";

export const retry = (main, clc, rm, sc) => {
  let wh = { w: 0, h: 0 };
  clc((ev) => {
    const rect = ev.target.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    if (
      wh.w / 2 - 189 < x &&
      wh.w / 2 - 189 + wh.w > x &&
      wh.h / 2 - 17 < y &&
      wh.h + wh.h / 2 - 17 > y
    ) {
      rm();
      main();
    }
  });
  let gsc
  return (ctx, { w, h }, time, step, ca, hit) => {
    wh = { w, h };
    if(!gsc)gsc= sc()
    String("game over")
      .split("")
      .forEach((i, index) => {
        view(
          ctx,
          { x: w / 2 - 189 + index * 42, y: h / 2 - 17 },
          Font.meta[i],
          "white",
          7
        );
      });
    String("score:"+gsc)
      .split("")
      .forEach((i, index) => {
        view(
          ctx,
          { x: w / 2 - 90 - String(gsc).length*18 + index * 42, y: h / 2 + 30 },
          Font.meta[i],
          "white",
          5
        );
      });
    view(ctx, { x: w / 2 - 24, y: h / 2 + 80 }, Font.retry, "white", 7);
    return [{}, {}];
  };
};
