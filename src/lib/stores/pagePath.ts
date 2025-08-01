import { readable } from 'svelte/store';
import { browser } from '$app/environment';

export const pagePath = readable('/', (set) => {
  if (!browser) return;

  const update = () => set(window.location.pathname);
  update();

  window.addEventListener('popstate', update);
  window.addEventListener('pushstate', update);
  window.addEventListener('replacestate', update);

  return () => {
    window.removeEventListener('popstate', update);
    window.removeEventListener('pushstate', update);
    window.removeEventListener('replacestate', update);
  };
});
