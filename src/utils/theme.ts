export interface ColorThemeColors {
  primary: string;       // e.g. "bg-indigo-600"
  primaryHover: string;  // e.g. "hover:bg-indigo-700"
  primaryText: string;   // e.g. "text-indigo-600"
  primaryTextDark: string; // e.g. "dark:text-indigo-400"
  bgLight: string;       // e.g. "bg-indigo-50/60"
  bgLightDark: string;   // e.g. "dark:bg-indigo-950/25"
  borderLight: string;   // e.g. "border-indigo-100/20"
  focusRing: string;     // e.g. "focus:ring-indigo-500"
  bulletText: string;    // e.g. "text-indigo-700 dark:text-indigo-400"
  badge: string;         // e.g. "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400"
  gradientFrom: string;  // e.g. "from-indigo-600"
  gradientTo: string;    // e.g. "to-indigo-800"
  shadow: string;        // e.g. "shadow-indigo-600/10"
  chartBar: string;      // e.g. "bg-indigo-600/80 dark:bg-indigo-500/85 hover:bg-indigo-600 dark:hover:bg-indigo-400"
  radialGlow: string;    // e.g. "bg-indigo-300/30 dark:bg-indigo-900/15"
}

export type ColorThemeName = 'indigo' | 'emerald' | 'violet' | 'rose' | 'amber' | 'blue';

export const THEMES: Record<ColorThemeName, ColorThemeColors> = {
  indigo: {
    primary: "bg-indigo-600",
    primaryHover: "hover:bg-indigo-700",
    primaryText: "text-indigo-600",
    primaryTextDark: "dark:text-indigo-400",
    bgLight: "bg-indigo-50/60",
    bgLightDark: "dark:bg-indigo-950/25",
    borderLight: "border-indigo-100/20",
    focusRing: "focus:ring-indigo-500",
    bulletText: "text-indigo-700 dark:text-indigo-400",
    badge: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400",
    gradientFrom: "from-indigo-600",
    gradientTo: "to-indigo-800",
    shadow: "shadow-indigo-600/10",
    chartBar: "bg-indigo-600/80 dark:bg-indigo-500/85 hover:bg-indigo-600 dark:hover:bg-indigo-400",
    radialGlow: "bg-indigo-300/25 dark:bg-indigo-900/15",
  },
  emerald: {
    primary: "bg-emerald-600",
    primaryHover: "hover:bg-emerald-700",
    primaryText: "text-emerald-600",
    primaryTextDark: "dark:text-emerald-400",
    bgLight: "bg-emerald-50/60",
    bgLightDark: "dark:bg-emerald-950/25",
    borderLight: "border-emerald-100/20",
    focusRing: "focus:ring-emerald-500",
    bulletText: "text-emerald-700 dark:text-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    gradientFrom: "from-emerald-600",
    gradientTo: "to-emerald-800",
    shadow: "shadow-emerald-600/10",
    chartBar: "bg-emerald-600/80 dark:bg-emerald-500/85 hover:bg-emerald-600 dark:hover:bg-emerald-400",
    radialGlow: "bg-emerald-300/25 dark:bg-emerald-900/15",
  },
  violet: {
    primary: "bg-violet-600",
    primaryHover: "hover:bg-violet-700",
    primaryText: "text-violet-600",
    primaryTextDark: "dark:text-violet-400",
    bgLight: "bg-violet-50/60",
    bgLightDark: "dark:bg-violet-950/25",
    borderLight: "border-violet-100/20",
    focusRing: "focus:ring-violet-500",
    bulletText: "text-violet-700 dark:text-violet-400",
    badge: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
    gradientFrom: "from-violet-600",
    gradientTo: "to-violet-800",
    shadow: "shadow-violet-600/10",
    chartBar: "bg-violet-600/80 dark:bg-violet-500/85 hover:bg-violet-600 dark:hover:bg-violet-400",
    radialGlow: "bg-violet-300/25 dark:bg-violet-900/15",
  },
  rose: {
    primary: "bg-rose-600",
    primaryHover: "hover:bg-rose-700",
    primaryText: "text-rose-600",
    primaryTextDark: "dark:text-rose-400",
    bgLight: "bg-rose-50/60",
    bgLightDark: "dark:bg-rose-950/25",
    borderLight: "border-rose-100/20",
    focusRing: "focus:ring-rose-500",
    bulletText: "text-rose-700 dark:text-rose-400",
    badge: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
    gradientFrom: "from-rose-600",
    gradientTo: "to-rose-800",
    shadow: "shadow-rose-600/10",
    chartBar: "bg-rose-600/80 dark:bg-rose-500/85 hover:bg-rose-600 dark:hover:bg-rose-400",
    radialGlow: "bg-rose-300/25 dark:bg-rose-900/15",
  },
  amber: {
    primary: "bg-amber-600",
    primaryHover: "hover:bg-amber-700",
    primaryText: "text-amber-600",
    primaryTextDark: "dark:text-amber-400",
    bgLight: "bg-amber-50/60",
    bgLightDark: "dark:bg-amber-950/25",
    borderLight: "border-amber-100/20",
    focusRing: "focus:ring-amber-500",
    bulletText: "text-amber-700 dark:text-amber-400",
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    gradientFrom: "from-amber-600",
    gradientTo: "to-amber-800",
    shadow: "shadow-amber-600/10",
    chartBar: "bg-amber-600/80 dark:bg-amber-500/85 hover:bg-amber-600 dark:hover:bg-amber-400",
    radialGlow: "bg-amber-300/25 dark:bg-amber-900/15",
  },
  blue: {
    primary: "bg-blue-600",
    primaryHover: "hover:bg-blue-700",
    primaryText: "text-blue-600",
    primaryTextDark: "dark:text-blue-400",
    bgLight: "bg-blue-50/60",
    bgLightDark: "dark:bg-blue-950/25",
    borderLight: "border-blue-100/20",
    focusRing: "focus:ring-blue-500",
    bulletText: "text-blue-700 dark:text-blue-400",
    badge: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    gradientFrom: "from-blue-600",
    gradientTo: "to-blue-800",
    shadow: "shadow-blue-600/10",
    chartBar: "bg-blue-600/80 dark:bg-blue-500/85 hover:bg-blue-600 dark:hover:bg-blue-400",
    radialGlow: "bg-blue-300/25 dark:bg-blue-900/15",
  }
};

export function getThemeColors(name?: ColorThemeName): ColorThemeColors {
  return THEMES[name || 'indigo'] || THEMES.indigo;
}
