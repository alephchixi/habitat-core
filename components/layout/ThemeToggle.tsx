"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const storedLocal = localStorage.getItem("habitat-theme");
    const storedAttr = document.documentElement.getAttribute("data-theme");
    const stored =
      storedLocal === "light" || storedLocal === "dark"
        ? storedLocal
        : storedAttr === "light" || storedAttr === "dark"
          ? storedAttr
          : "dark";

    document.documentElement.setAttribute("data-theme", stored);
    localStorage.setItem("habitat-theme", stored);
    document.cookie = `habitat-theme=${stored}; path=/; max-age=31536000; samesite=lax`;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(stored);
  }, []);

  const toggle = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("habitat-theme", next);
    document.cookie = `habitat-theme=${next}; path=/; max-age=31536000; samesite=lax`;
  }, [theme]);

  return (
    <button
      onClick={toggle}
      className={styles.toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      ◐
    </button>
  );
}
