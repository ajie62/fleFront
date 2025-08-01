<script lang="ts">
  import SidebarLink from '$lib/components/admin/SidebarLink.svelte';
  export let currentPath: string;

  const links = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/courses', label: 'Courses' },
    { href: '/admin/categories', label: 'Categories' },
    { href: '/admin/users', label: 'Users' }
  ];
</script>

<aside class="w-64 bg-gray-800 text-white min-h-screen">
  <div class="p-4 text-xl font-bold border-b border-gray-700">Admin Panel</div>
  <nav class="p-4 flex flex-col space-y-2">
    {#each links as { href, label }}
      <SidebarLink {href} {label} {currentPath} />
    {/each}
  </nav>
</aside>
