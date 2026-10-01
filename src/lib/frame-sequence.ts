/**
 * A canvas image sequence scrubbed by an index (the Apple "product turn" pattern).
 *
 * - Progressive preload: the `prefix` frames first (awaited), then the last frame (where a fast
 *   scroll rests), then the rest in order, a few at a time.
 * - Never blank: while the exact frame is loading, the nearest loaded frame is drawn and the
 *   exact one replaces it when it lands.
 * - Cover-fit drawing; the backing store is capped at min(dpr, 2) and never finer than the frames
 *   (scroll-animation sequences.md §5).
 */
export type FrameSet = {
  /** Public folder holding frame_0001.webp … */
  dir: string;
  count: number;
  width: number;
  height: number;
};

export const framePath = (dir: string, index: number) =>
  `${dir}/frame_${String(index + 1).padStart(4, "0")}.webp`;

type Options = {
  /** Fill behind the frame (letterbox colour; only visible if a frame ever fails). */
  bg: string;
  /** Frames loaded before anything else. */
  prefix?: number;
  onFirstDraw?: () => void;
};

export class FrameSequence {
  private ctx: CanvasRenderingContext2D;
  private images: HTMLImageElement[] = [];
  private loaded: boolean[];
  private current = 0;
  private drawnIndex = -1;
  private destroyed = false;
  private cssW = 0;
  private cssH = 0;
  firstDrawn = false;

  constructor(
    private canvas: HTMLCanvasElement,
    private set: FrameSet,
    private opts: Options,
  ) {
    this.ctx = canvas.getContext("2d", { alpha: false })!;
    this.loaded = new Array(set.count).fill(false);
  }

  async load(): Promise<void> {
    const { count } = this.set;
    const prefix = Math.min(this.opts.prefix ?? 20, count);
    await Promise.all(Array.from({ length: prefix }, (_, i) => this.loadOne(i)));
    if (this.destroyed) return;
    void this.loadOne(count - 1);
    const BATCH = 6;
    for (let i = prefix; i < count && !this.destroyed; i += BATCH) {
      await Promise.all(
        Array.from({ length: Math.min(BATCH, count - i) }, (_, k) => this.loadOne(i + k)),
      );
    }
  }

  private loadOne(i: number): Promise<void> {
    if (this.images[i]) return Promise.resolve();
    const img = new Image();
    img.decoding = "async";
    this.images[i] = img;
    return new Promise((resolve) => {
      img.onload = () => {
        img
          .decode()
          .catch(() => undefined)
          .finally(() => {
            if (this.destroyed) return resolve();
            this.loaded[i] = true;
            if (i === this.current || !this.firstDrawn) this.draw();
            resolve();
          });
      };
      // A failed frame is skipped: its neighbour is drawn instead.
      img.onerror = () => resolve();
      img.src = framePath(this.set.dir, i);
    });
  }

  /** Call on mount and whenever the canvas's CSS box changes. */
  resize(): void {
    const cssW = this.canvas.clientWidth;
    const cssH = this.canvas.clientHeight;
    if (!cssW || !cssH) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Cover-fit scale is max(cssW/w, cssH/h); one CSS px holds min(w/cssW, h/cssH) frame px.
    const frameDensity = Math.min(this.set.width / cssW, this.set.height / cssH);
    const density = Math.min(dpr, Math.max(0.5, frameDensity));
    this.cssW = cssW;
    this.cssH = cssH;
    this.canvas.width = Math.round(cssW * density);
    this.canvas.height = Math.round(cssH * density);
    this.ctx.setTransform(density, 0, 0, density, 0, 0);
    this.drawnIndex = -1;
    this.draw();
  }

  setFrame(index: number): void {
    const idx = Math.max(0, Math.min(this.set.count - 1, index));
    if (idx === this.current) return;
    this.current = idx;
    this.draw();
  }

  private nearestLoaded(i: number): number {
    if (this.loaded[i]) return i;
    for (let d = 1; d < this.set.count; d++) {
      if (this.loaded[i - d]) return i - d; // prefer the frame behind: already on screen
      if (this.loaded[i + d]) return i + d;
    }
    return -1;
  }

  private draw(): void {
    const idx = this.nearestLoaded(this.current);
    if (idx < 0 || idx === this.drawnIndex) return;
    const img = this.images[idx];
    const { cssW: cw, cssH: ch } = this;
    if (!cw || !ch || !img.naturalWidth) return;
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = cw / ch;
    let dw: number;
    let dh: number;
    if (ir > cr) {
      dh = ch;
      dw = ch * ir;
    } else {
      dw = cw;
      dh = cw / ir;
    }
    this.ctx.fillStyle = this.opts.bg;
    this.ctx.fillRect(0, 0, cw, ch);
    this.ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    this.drawnIndex = idx;
    if (!this.firstDrawn) {
      this.firstDrawn = true;
      this.opts.onFirstDraw?.();
    }
  }

  destroy(): void {
    this.destroyed = true;
    for (const img of this.images) {
      if (!img) continue;
      img.onload = null;
      img.onerror = null;
    }
    this.images = [];
  }
}
