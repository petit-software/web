/**
 * Inline script that runs synchronously in <head> before paint, so we never
 * flash the wrong theme. Reads localStorage["theme"] (set by ThemeToggle) and
 * falls back to the OS preference.
 *
 * IMPORTANT: keep this script self-contained and side-effect-free. It runs
 * before React hydration.
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem('theme');var t=s==='light'||s==='dark'?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var d=document.documentElement;d.setAttribute('data-theme',t);d.style.colorScheme=t;}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;
