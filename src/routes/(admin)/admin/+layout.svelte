<script lang="ts">
  export let data;
  import "../../../app.css"
</script>

<div class="flex min-h-screen bg-gray-100">
  <!-- Sidebar -->
  <aside class="w-64 bg-white border-r border-gray-200 shadow-lg">
    <div class="p-6 font-bold text-lg text-gray-700 border-b border-gray-200">
      Admin Panel
    </div>
    <nav class="flex flex-col p-4 space-y-2 text-gray-600">
      <a href="/admin" class="hover:text-blue-500 font-medium">Dashboard</a>
      <a href="/admin/courses" class="hover:text-blue-500">Manage Courses</a>
      <a href="/admin/users" class="hover:text-blue-500">Manage Users</a>
      <!-- Ajoute plus de liens ici -->
    </nav>
  </aside>

  <!-- Main content -->
  <main class="flex-1 p-8">
    <slot />
  </main>
</div>
