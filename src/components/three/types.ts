import type { MotionValue } from "framer-motion";

export type SceneName = "hero" | "work" | "core" | "path" | "towers" | "finale" | "device";

export interface HeroSceneProps {
  /** 0 at the top of the page, 1 once the hero has scrolled away. */
  progress?: MotionValue<number>;
}

export interface WorkSceneProps {
  index: number;
  /** Live drag offset in item units, written by the DOM layer. */
  drag: { current: number };
  onPick?: (index: number) => void;
}

export interface CoreSceneProps {
  /** 0..3 across the four chapters. */
  chapter: MotionValue<number>;
}

export interface PathSceneProps {
  /** 0..1 across the five steps. */
  progress: MotionValue<number>;
}

export interface TowersSceneProps {
  selected: number;
  onSelect?: (index: number) => void;
}

export interface FinaleSceneProps {
  progress?: MotionValue<number>;
}

export interface DeviceSceneProps {
  slug: string;
}

export interface SceneProps {
  hero: HeroSceneProps;
  work: WorkSceneProps;
  core: CoreSceneProps;
  path: PathSceneProps;
  towers: TowersSceneProps;
  finale: FinaleSceneProps;
  device: DeviceSceneProps;
}

/** Context handed to every scene by CanvasHost. */
export interface SceneEnv {
  quality: "high" | "low";
  reduced: boolean;
  /** True when the stage is portrait-ish and content must be recomposed for a phone. */
  compact: boolean;
  /** Smoothed pointer / drag tilt in -1..1, written each frame by the host. */
  pointer: { x: number; y: number };
}
