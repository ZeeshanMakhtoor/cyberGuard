import { useEffect, useState } from "react";

export type Theme = "dark" | "light";
const STORAGE_KEY = "cg-theme";

function readInitialTheme(): Theme {
  if (typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "light") {
    return "light";
  }
  return "dark";
}

/**
 * Manual light/dark toggle, persisted to localStorage. Dark is the default
 * so existing behavior is unchanged unless a user opts into light mode.
 * The initial DOM attribute is already set by an inline script in
 * index.html (before React mounts) to avoid a flash of the wrong theme.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore (private browsing / storage disabled)
    }
  }, [theme]);

  return {
    theme,
    toggleTheme: () => setTheme(t => (t === "dark" ? "light" : "dark")),
  };
}
