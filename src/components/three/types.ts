export type SceneName = "work";

export interface WorkSceneProps {
  index: number;
  /** Live drag offset in item units, written by the DOM layer. */
  drag: { current: number };
  onPick?: (index: number) => void;
}

export interface SceneProps {
  work: WorkSceneProps;
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
