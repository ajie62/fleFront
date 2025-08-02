import { writable } from 'svelte/store';

// Ce store contient le chemin de l'URL courante (pathname)
export const currentPath = writable('');