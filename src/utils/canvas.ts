export function initCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  dpr = Math.min(devicePixelRatio || 1, 2),
) {
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.scale(dpr, dpr);
  return ctx;
}

export function clearCanvas(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);
}
