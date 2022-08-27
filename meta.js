import { Font, FontTo } from "./font.js";
import { view } from "./view.js";

export const meta = (pip) => (ctx, { w, h }, time, step, ca, hit) => {
  const { hp,sc} = pip()
  view(ctx, { x: 0, y: 10 }, Font.meta.hp, "while", 5)
  String(`${hp} score:${sc}`).split("").forEach((i,index) => {
    view(ctx, { x: 80 + index * 30, y: 10 }, Font.meta[i], "white", 5);
  });
  return [{},{x:0,w:0,w:0,h:0,t:"meta"}]
};
