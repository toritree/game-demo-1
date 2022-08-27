import { Font, FontTo } from "./font.js";
export const view = (ctx, { x, y }, art, fillStyle, size) => {
  art = FontTo(art);
  ctx.fillStyle = fillStyle;
  let [px, py] = [0, 0];
  for (const i of art) {
    for (const item of i) {
      if (item === "#") ctx.fillRect(x + px, y + py, size, size);
      px += size;
    }
    px = 0;
    py += size;
  }
};
