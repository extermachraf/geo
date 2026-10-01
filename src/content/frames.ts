import type { FrameSet } from "@/lib/frame-sequence";

/**
 * The hero film as two frame sets (see README « Remplacer la séquence »).
 * `count` must match the number of frame_XXXX.webp files in each folder.
 */
export const FRAME_SETS: { desktop: FrameSet; mobile: FrameSet } = {
  desktop: { dir: "/frames/desktop", count: 183, width: 1920, height: 1080 },
  mobile: { dir: "/frames/mobile", count: 183, width: 720, height: 1280 },
};
