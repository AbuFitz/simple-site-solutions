import { lazy, type ComponentType } from "react";
import type { CategoryId } from "@/lib/preview/types";
import type { TProps } from "./kit";

/** One template per trade. Each is its own chunk, so only the chosen design's code and fonts are loaded. */
export const templates: Record<CategoryId, ComponentType<TProps>> = {
  plumbing: lazy(() => import("./Plumbing")),
  electrical: lazy(() => import("./Electrical")),
  mechanic: lazy(() => import("./Mechanic")),
  cleaning: lazy(() => import("./Cleaning")),
  barber: lazy(() => import("./Barber")),
  tutoring: lazy(() => import("./Tutoring")),
  shop: lazy(() => import("./Shop")),
  builder: lazy(() => import("./Builder")),
  other: lazy(() => import("./Other")),
};
