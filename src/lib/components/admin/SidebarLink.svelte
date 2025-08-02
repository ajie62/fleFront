<script lang="ts">
  import { currentPath } from '$lib/stores/pagePath';
  import { derived } from 'svelte/store';

  export let href: string;
  export let label: string;

  // store dérivé pour déterminer si actif
  const isActive = derived(currentPath, ($currentPath) => {
    return href === '/admin'
      ? $currentPath === '/admin'
      : ($currentPath === href || $currentPath.startsWith(href + '/'));
  });
</script>

<a
  href={href}
  aria-current={$isActive ? 'page' : undefined}
  class="block px-4 py-2 rounded transition-colors duration-150
    {$isActive 
      ? 'bg-blue-100 text-blue-700 font-semibold' 
      : 'text-gray-400 hover:text-blue-500 hover:bg-gray-100'}"
>
  {label}
</a>