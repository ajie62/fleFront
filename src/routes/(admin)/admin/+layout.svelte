<script lang="ts">
  import "../../../app.css"
  import Sidebar from '$lib/components/admin/Sidebar.svelte';
  export let data: { currentPath: string };
</script>

<div class="flex h-screen overflow-hidden">
  <Sidebar currentPath={data.currentPath} />
  <main class="flex-1 overflow-y-auto bg-gray-50">
    <div class="max-w-7xl mx-auto">
      <slot />
    </div>
  </main>
</div>
