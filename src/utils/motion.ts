// Site-wide motion preference (WCAG 2.2.2 Pause, Stop, Hide / 2.3.3 Animation from Interactions).
// The source of truth is `data-motion` on <html>: "reduced" or "full".
// It is set before hydration by MOTION_INIT_SCRIPT (stored choice, else the OS setting)
// and changed at runtime by <MotionToggle />.

export const MOTION_STORAGE_KEY = "ks-motion";
export const MOTION_CHANGE_EVENT = "ks:motionchange";

export const MOTION_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("${MOTION_STORAGE_KEY}");
    var reduced = stored ? stored === "reduced" : window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.setAttribute("data-motion", reduced ? "reduced" : "full");
  } catch (e) {
    document.documentElement.setAttribute("data-motion", "full");
  }
})();
`;

export const isMotionReduced = () =>
  typeof document !== "undefined" && document.documentElement.getAttribute("data-motion") === "reduced";

export const setMotionReduced = (reduced: boolean, persist = true) => {
  document.documentElement.setAttribute("data-motion", reduced ? "reduced" : "full");
  if (persist) {
    try {
      localStorage.setItem(MOTION_STORAGE_KEY, reduced ? "reduced" : "full");
    } catch {
      // storage can be blocked; the choice still applies for this page view
    }
  }
  window.dispatchEvent(new CustomEvent(MOTION_CHANGE_EVENT, { detail: { reduced } }));
};

export const onMotionChange = (callback: (reduced: boolean) => void) => {
  const handler = () => callback(isMotionReduced());
  window.addEventListener(MOTION_CHANGE_EVENT, handler);
  return () => window.removeEventListener(MOTION_CHANGE_EVENT, handler);
};
