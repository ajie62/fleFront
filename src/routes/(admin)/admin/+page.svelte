<script lang="ts">
  export let data;
  const { totalCourses, publishedCount, unpublishedCount } = data;
</script>

<section class="px-6 py-8 bg-gray-100 min-h-screen">
  <div class="max-w-7xl mx-auto">
    <h1 class="text-4xl font-bold text-gray-800 mb-6">Admin Panel</h1>
    <h2 class="text-2xl font-semibold text-gray-600 mb-10">Tableau de bord</h2>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Total Courses -->
      <div class="flex items-center p-6 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl shadow hover:scale-105 transition-transform">
        <div class="flex-shrink-0">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m4 2v-4m4 4v-6M5 17h14"/>
          </svg>
        </div>
        <div class="ml-4">
          <p class="text-sm uppercase">Total de cours</p>
          <p class="text-3xl font-bold">{totalCourses}</p>
        </div>
      </div>

      <!-- Published Courses -->
      <div class="flex items-center p-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow hover:scale-105 transition-transform">
        <div class="flex-shrink-0">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <div class="ml-4">
          <p class="text-sm uppercase">Cours publiés</p>
          <p class="text-3xl font-bold">{publishedCount}</p>
        </div>
      </div>

      <!-- Unpublished Courses -->
      <div class="flex items-center p-6 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-xl shadow hover:scale-105 transition-transform">
        <div class="flex-shrink-0">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18"/>
          </svg>
        </div>
        <div class="ml-4">
          <p class="text-sm uppercase">Cours non publiés</p>
          <p class="text-3xl font-bold">{unpublishedCount}</p>
        </div>
      </div>
    </div>
  </div>
</section>
