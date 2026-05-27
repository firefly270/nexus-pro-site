import { useState } from 'react';

type Theme = 'dark' | 'light';

function applyTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', t);
  document.documentElement.style.colorScheme = t;
  localStorage.setItem('theme', t);
}

function getInitialTheme(): Theme {
  const stored = localStorage.getItem('theme') as Theme | null;
  if (stored) {
    applyTheme(stored);
    return stored;
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: light)').matches;
  const t: Theme = prefersDark ? 'light' : 'dark';
  applyTheme(t);
  return t;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-2 py-1.5 rounded-lg hover:bg-zinc-900/50"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
      )}
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}
