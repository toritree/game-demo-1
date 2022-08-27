import { Font, FontTo } from "./font.js";
import { view } from "./view.js";

const backGroundStar = (ctx, { x, y }, time, step) => {
  view(
    ctx,
    { x, y },
    time % 2 == 0 ? Font.backGround.star : Font.backGround.star2,
    "yellow",
    2
  );
};

export const backGround = (ctx, { w, h }, time, step, ca,hit) => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, w, h);
  if (!ca)
    ca = [...Array(50)].map(() => [
      Math.floor(Math.random() * w),
      Math.floor(Math.random() * h),
    ]);
  for (const [sx, sy] of ca) {
    backGroundStar(ctx, { x: sx, y: sy }, time, step);
  }
  return [ca,{x:0,w:0,y:0,t:"bg"}];
};
