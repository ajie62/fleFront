<script lang="ts">
  import SidebarLink from '$lib/components/admin/SidebarLink.svelte';
  export let isMobile = false;
  export let onClose: () => void = () => {};
</script>

<!-- Overlay mobile accessible -->
{#if isMobile}
  <button
    type="button"
    class="fixed inset-0 z-40 bg-transparent"
    aria-label="Close sidebar"
    on:click={onClose}
  ></button>
{/if}

<!-- Sidebar -->
<aside
  class="fixed md:static top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
    {isMobile ? 'translate-x-0' : 'md:translate-x-0'}"
>
  <nav class="space-y-1 p-4 pt-6">
    <SidebarLink href="/admin" label="Dashboard" />
    <SidebarLink href="/admin/courses" label="Courses" />
    <SidebarLink href="/admin/categories" label="Categories" />
    <SidebarLink href="/admin/users" label="Users" />
  </nav>
</aside>
