<script lang="ts">
  export let href: string;
  export let label: string;
  export let currentPath: string;
</script>

<a
  href={href}
  class="px-3 py-2 rounded transition-colors duration-200
    {href === '/admin'
      ? currentPath === '/admin'
        ? 'bg-gray-900 text-white font-semibold'
        : 'hover:bg-gray-700 text-gray-300'
      : currentPath.startsWith(href)
        ? 'bg-gray-900 text-white font-semibold'
        : 'hover:bg-gray-700 text-gray-300'}"
>
  {label}
</a>