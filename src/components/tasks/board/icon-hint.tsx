"use client";

import type { ReactElement, ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Instant hover/focus tooltip for the task board's icon-only controls.
 *
 * The board historically leaned on native `title=` attributes, which only
 * surface after a ~1.5s delay and never on keyboard focus — so the meaning
 * of the status glyphs, lane icons, and row-action buttons was effectively
 * undiscoverable. This wraps a single trigger element with the app's
 * Base UI tooltip at `delay={0}` so the explanation appears immediately.
 *
 * Self-contained (carries its own `TooltipProvider`) so callers can drop it
 * around any one icon without threading a provider through the board tree —
 * same pattern as `agent-picker`.
 *
 * `children` must be a single element that forwards props/ref (a native
 * `button`/`span`, or a Base UI trigger) — it's handed to `TooltipTrigger`
 * via `render`, which merges the hover/focus behavior onto it.
 */
export function IconHint({
  label,
  children,
  side = "top",
}: {
  label: ReactNode;
  children: ReactElement;
  side?: "top" | "bottom" | "left" | "right";
}) {
  if (label == null || label === "") return children;
  return (
    <TooltipProvider delay={0}>
      <Tooltip>
        <TooltipTrigger render={children} />
        <TooltipContent side={side}>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
