import type { KeyboardEvent } from "react";

// WAI-ARIA tabs pattern: Left/Right (and Up/Down for vertical lists), Home and End move between tabs.
export const handleTabKeyDown = (
  e: KeyboardEvent<HTMLElement>,
  index: number,
  count: number,
  select: (next: number) => void,
) => {
  const keys: Record<string, number> = {
    ArrowRight: index + 1,
    ArrowDown: index + 1,
    ArrowLeft: index - 1,
    ArrowUp: index - 1,
    Home: 0,
    End: count - 1,
  };
  if (!(e.key in keys)) return;
  e.preventDefault();
  const next = (keys[e.key] + count) % count;
  select(next);
  const tabs = e.currentTarget.parentElement?.querySelectorAll<HTMLElement>('[role="tab"]');
  tabs?.[next]?.focus();
};
