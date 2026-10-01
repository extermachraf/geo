import type Lenis from "lenis";

// The current scroll owner, if Lenis is running (null under reduced motion).
// Menus call `getLenis()?.stop()` on open and `.start()` on close.
let current: Lenis | null = null;

export const getLenis = () => current;
export const setLenis = (lenis: Lenis | null) => {
  current = lenis;
};
