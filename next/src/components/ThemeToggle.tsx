'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'hanja-theme';
const LIGHT = 'fantasy';
const DARK = 'dracula';

type Theme = typeof LIGHT | typeof DARK;

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(LIGHT);

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? null;
    const initial: Theme = saved === DARK ? DARK : LIGHT;
    setTheme(initial);
    applyTheme(initial);
  }, []);

  function toggle() {
    const next: Theme = theme === LIGHT ? DARK : LIGHT;
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  const isDark = theme === DARK;

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn btn-sm"
      aria-label="Toggle theme"
      title={isDark ? 'Switch to fantasy' : 'Switch to dracula'}
    >
      {isDark ? 'Dracula' : 'Fantasy'}
    </button>
  );
}
