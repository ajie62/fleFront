<script lang="ts">
  import { goto, beforeNavigate } from '$app/navigation';
  import {
    createCourse,
    updateCourse,
    deleteCourse,
    createChapter,
    updateChapter,
    deleteChapter,
    createLesson,
    updateLesson,
    deleteLesson
  } from '$lib';

  // --- Local draft types (UI state only) -----------------------------------
  type ChapterDraft = {
    id?: number;           // set after first save
    title: string;
    description: string;
    duration: string;
    mediaUrl?: string | null;
    isPublished: boolean;
    position: number;      // UI-only ordering (not sent to API)
    lessons: LessonDraft[];
  };

  type LessonDraft = {
    id?: number;           // set after first save
    title: string;
    content: string;
    mediaUrl?: string;
    isPublished: boolean;
    position: number;
  };

  // --- Course state ---------------------------------------------------------
  let courseId: number | null = null;
  let courseTitle = '';
  let courseDescription = '';
  let courseLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';

  // Chapters + lessons managed inline
  let chapters: ChapterDraft[] = [];

  // --- UX state -------------------------------------------------------------
  let error: string | null = null;
  let saving = false;
  let dirty = false; // warn on navigation if unsaved changes

  // Simple field-level errors for course a11y display
  let courseErrors: { title?: string; description?: string } = {};

  // Derived validity
  $: courseValid =
    courseTitle.trim().length > 0 &&
    courseDescription.trim().length > 0;

  // Warn before leaving the page if there are unsaved changes
  beforeNavigate((nav) => {
    if (dirty && !confirm('You have unsaved changes. Leave anyway?')) {
      nav.cancel();
    }
  });

  function markDirty() {
    dirty = true;
  }

  function validateCourseBasics(): boolean {
    courseErrors = {};
    if (!courseTitle.trim()) courseErrors.title = 'Title is required';
    if (!courseDescription.trim()) courseErrors.description = 'Description is required';
    return Object.keys(courseErrors).length === 0;
  }

  function focusCourseField(field: 'title' | 'description') {
    // Called by user actions on client only
    const id = field === 'title' ? 'course-title' : 'course-description';
    const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
    if (el) el.focus();
  }

  // Useful IRI helpers (UI only)
  const courseIri = (id: number) => `/api/courses/${id}`;
  const chapterIri = (id: number) => `/api/chapters/${id}`;

  // --- Reordering helpers ---------------------------------------------------
  function move<T>(arr: T[], from: number, to: number) {
    if (to < 0 || to >= arr.length) return;
    const [item] = (arr as T[]).splice(from, 1);
    (arr as T[]).splice(to, 0, item);
    // Re-compute positions (1-based)
    (arr as any[]).forEach((it, idx) => (it.position = idx + 1));
    markDirty();
  }

  // --- Chapter draft helpers ------------------------------------------------
  function addChapter() {
    chapters.push({
      title: '',
      description: '',
      duration: '',
      mediaUrl: '',
      isPublished: false,
      position: chapters.length + 1,
      lessons: []
    });
    chapters = [...chapters]; // Trigger reactivity after mutation
    markDirty();
  }

  async function removeChapter(idx: number) {
    const ch = chapters[idx];
    if (ch.id) {
      try {
        saving = true; error = null;
        await deleteChapter(ch.id);
      } catch (e: any) {
        error = e?.message ?? 'Failed to delete chapter.';
        saving = false;
        return;
      }
    }
    chapters.splice(idx, 1);
    chapters.forEach((c, i) => (c.position = i + 1));
    chapters = [...chapters];
    saving = false;
    markDirty();
  }

  // --- Lesson draft helpers -------------------------------------------------
  function addLesson(chIndex: number) {
    chapters[chIndex].lessons.push({
      title: '',
      content: '',
      isPublished: false,
      position: chapters[chIndex].lessons.length + 1
    });
    chapters = [...chapters];
    markDirty();
  }

  async function removeLesson(chIndex: number, lIndex: number) {
    const l = chapters[chIndex].lessons[lIndex];
    if (l.id) {
      try {
        saving = true; error = null;
        await deleteLesson(l.id);
      } catch (e: any) {
        error = e?.message ?? 'Failed to delete lesson.';
        saving = false;
        return;
      }
    }
    chapters[chIndex].lessons.splice(lIndex, 1);
    chapters[chIndex].lessons.forEach((x, i) => (x.position = i + 1));
    chapters = [...chapters];
    saving = false;
    markDirty();
  }

  // --- API integration: Course ---------------------------------------------
  async function createOrUpdateCourse() {
    // Validate before talking to the API
    if (!validateCourseBasics()) {
      error = 'Please fill the required course fields.';
      // Focus the first missing field
      if (courseErrors.title) focusCourseField('title');
      else if (courseErrors.description) focusCourseField('description');
      return;
    }

    saving = true; error = null;
    try {
      if (!courseId) {
        const created = await createCourse({
          title: courseTitle,
          description: courseDescription,
          level: courseLevel,
          isPublished: false
        });
        courseId = created.id;
      } else {
        await updateCourse(courseId, {
          title: courseTitle,
          description: courseDescription,
          level: courseLevel
        });
      }
      dirty = true;
    } catch (e: any) {
      error = e?.message ?? 'Failed to save course.';
    } finally {
      saving = false;
    }
  }

  async function handleDeleteCourse() {
    if (!courseId) return;
    const sure = confirm('Delete this course and all its content? This action cannot be undone.');
    if (!sure) return;

    try {
      saving = true; error = null;
      await deleteCourse(courseId);
      dirty = false;
      await goto('/admin/courses');
    } catch (e: any) {
      error = e?.message ?? 'Failed to delete course.';
    } finally {
      saving = false;
    }
  }

  // --- API integration: Chapter --------------------------------------------
  async function saveChapter(idx: number) {
    // Ensure the course exists first and is valid
    if (!courseId) {
      if (!validateCourseBasics()) {
        error = 'Please fill the required course fields before creating chapters.';
        if (courseErrors.title) focusCourseField('title');
        else if (courseErrors.description) focusCourseField('description');
        return;
      }
      await createOrUpdateCourse();
      if (!courseId) return; // safety guard
    }

    const ch = chapters[idx];
    try {
      saving = true; error = null;
      if (!ch.id) {
        const created = await createChapter({
          title: ch.title,
          description: ch.description,
          duration: ch.duration,
          mediaUrl: ch.mediaUrl ?? null,
          isPublished: ch.isPublished ?? false,
          course: courseIri(courseId)
        });
        ch.id = created.id;
      } else {
        await updateChapter(ch.id, {
          title: ch.title,
          description: ch.description,
          duration: ch.duration,
          mediaUrl: ch.mediaUrl ?? null,
          isPublished: ch.isPublished ?? false
        });
      }
      chapters = [...chapters]; // reflect field/id changes
      dirty = true;
    } catch (e: any) {
      error = e?.message ?? 'Failed to save chapter.';
    } finally {
      saving = false;
    }
  }

  // --- API integration: Lesson ---------------------------------------------
  async function saveLesson(chIndex: number, lIndex: number) {
    const ch = chapters[chIndex];

    // Chapter must be persisted first
    if (!ch.id) {
      await saveChapter(chIndex);
      if (!ch.id) return;
    }

    const l = ch.lessons[lIndex];
    try {
      saving = true; error = null;
      if (!l.id) {
        const created = await createLesson({
          title: l.title,
          content: l.content,
          mediaUrl: l.mediaUrl ?? null,
          isPublished: l.isPublished ?? false,
          // If your Lesson entity doesn't support 'position', you can remove it
          position: l.position ?? lIndex + 1,
          chapter: chapterIri(ch.id)
        });
        l.id = created.id;
      } else {
        await updateLesson(l.id, {
          title: l.title,
          content: l.content,
          mediaUrl: l.mediaUrl ?? null,
          isPublished: l.isPublished ?? false,
          position: l.position ?? lIndex + 1
        });
      }
      chapters = [...chapters];
      dirty = true;
    } catch (e: any) {
      error = e?.message ?? 'Failed to save lesson.';
    } finally {
      saving = false;
    }
  }

  // --- Publish --------------------------------------------------------------
  async function publishCourse() {
    // Ensure course is valid & exists
    if (!courseId) {
      if (!validateCourseBasics()) {
        error = 'Please fill the required course fields before publishing.';
        if (courseErrors.title) focusCourseField('title');
        else if (courseErrors.description) focusCourseField('description');
        return;
      }
      await createOrUpdateCourse();
      if (!courseId) return;
    }

    // Ensure all drafts are persisted before publishing
    for (let i = 0; i < chapters.length; i++) {
      if (!chapters[i].id) await saveChapter(i);
      for (let j = 0; j < chapters[i].lessons.length; j++) {
        if (!chapters[i].lessons[j].id) await saveLesson(i, j);
      }
    }

    try {
      saving = true; error = null;
      await updateCourse(courseId, { isPublished: true });
      dirty = false;
      await goto('/admin/courses');
    } catch (e: any) {
      error = e?.message ?? 'Failed to publish course.';
    } finally {
      saving = false;
    }
  }
</script>

<!-- More vertical breathing room between major blocks -->
<section class="px-4 sm:px-6 py-10">
  <div class="max-w-5xl mx-auto space-y-10">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold text-gray-800">Course Builder</h1>
      <p class="text-gray-600">Create a course, add chapters, then add lessons per chapter.</p>
    </header>

    {#if error}
      <div class="rounded-lg bg-red-50 text-red-700 px-4 py-3">{error}</div>
    {/if}

    <!-- Step 1: Course details -->
    <section class="bg-white rounded-xl shadow p-8 space-y-6">
      <h2 class="text-xl font-semibold">Course details</h2>

      <div class="grid gap-6 md:grid-cols-2">
        <div class="md:col-span-2 space-y-2">
          <label for="course-title" class="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="course-title"
            class="w-full border rounded px-3 py-2"
            bind:value={courseTitle}
            on:input={() => { markDirty(); courseErrors.title = undefined; }}
            aria-invalid={!!courseErrors.title}
            aria-describedby="course-title-err"
            required>
          {#if courseErrors.title}
            <p id="course-title-err" class="text-sm text-red-600">{courseErrors.title}</p>
          {/if}
        </div>

        <div class="md:col-span-2 space-y-2">
          <label for="course-description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="course-description"
            class="w-full border rounded px-3 py-2 h-32"
            bind:value={courseDescription}
            on:input={() => { markDirty(); courseErrors.description = undefined; }}
            aria-invalid={!!courseErrors.description}
            aria-describedby="course-description-err"
            required></textarea>
          {#if courseErrors.description}
            <p id="course-description-err" class="text-sm text-red-600">{courseErrors.description}</p>
          {/if}
        </div>

        <div class="space-y-2">
          <label for="course-level" class="block text-sm font-medium text-gray-700">Level</label>
          <select
            id="course-level"
            class="w-full border rounded px-3 py-2"
            bind:value={courseLevel}
            on:change={markDirty}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <button
          type="button"
          class="cursor-pointer bg-indigo-600 text-white px-5 py-2.5 rounded hover:bg-indigo-700 disabled:opacity-50"
          on:click|preventDefault={createOrUpdateCourse}
          disabled={saving}>
          {courseId ? 'Save course' : 'Create draft'}
        </button>

        {#if courseId}
          <span class="text-sm text-gray-500">Draft ID: {courseId}</span>
        {/if}
      </div>
    </section>

    <!-- Step 2: Chapters -->
    <section class="bg-white rounded-xl shadow p-8 space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">Chapters</h2>
        <button
          type="button"
          class="cursor-pointer px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
          on:click|preventDefault={addChapter}>
          + Add chapter
        </button>
      </div>

      {#if chapters.length === 0}
        <p class="text-gray-500">No chapters yet.</p>
      {/if}

      <div class="space-y-6">
        {#each chapters as ch, i}
          <article class="rounded-lg border border-gray-200 p-5 space-y-4">
            <div class="flex flex-col gap-3 md:flex-row md:items-center md:gap-3">
              <!-- Chapter title -->
              <label class="flex-1">
                <span class="block text-sm font-medium text-gray-700 mb-1">Chapter title</span>
                <input
                  class="w-full border rounded px-3 py-2"
                  placeholder="Title"
                  bind:value={ch.title}
                  on:input={() => { markDirty(); chapters = [...chapters]; }}>
              </label>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="cursor-pointer px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                  on:click|preventDefault={() => { move(chapters, i, i - 1); chapters = [...chapters]; }}>
                  ↑
                </button>
                <button
                  type="button"
                  class="cursor-pointer px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                  on:click|preventDefault={() => { move(chapters, i, i + 1); chapters = [...chapters]; }}>
                  ↓
                </button>
                <button
                  type="button"
                  class="cursor-pointer px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                  title={!courseId && !courseValid ? 'Fill course title & description first' : ''}
                  on:click|preventDefault={() => saveChapter(i)}
                  disabled={saving || (!courseId && !courseValid)}>
                  {ch.id ? 'Save' : 'Create'}
                </button>
                <button
                  type="button"
                  class="cursor-pointer px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                  on:click|preventDefault={() => removeChapter(i)}>
                  Delete
                </button>
              </div>
            </div>

            <!-- Chapter extra fields -->
            <div class="grid gap-3 md:grid-cols-2">
              <label class="md:col-span-2">
                <span class="block text-sm font-medium text-gray-700 mb-1">Description</span>
                <textarea
                  class="w-full border rounded px-3 py-2 h-24"
                  placeholder="Short description"
                  bind:value={ch.description}
                  on:input={() => { markDirty(); chapters = [...chapters]; }}>
                </textarea>
              </label>

              <label>
                <span class="block text-sm font-medium text-gray-700 mb-1">Duration</span>
                <input
                  class="w-full border rounded px-3 py-2"
                  placeholder="e.g. 45 min"
                  bind:value={ch.duration}
                  on:input={() => { markDirty(); chapters = [...chapters]; }}>
              </label>

              <label>
                <span class="block text-sm font-medium text-gray-700 mb-1">Media URL (optional)</span>
                <input
                  class="w-full border rounded px-3 py-2"
                  placeholder="https://..."
                  bind:value={ch.mediaUrl}
                  on:input={() => { markDirty(); chapters = [...chapters]; }}>
              </label>

              <label class="inline-flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  bind:checked={ch.isPublished}
                  on:change={() => { markDirty(); chapters = [...chapters]; }}>
                <span>Published</span>
              </label>
            </div>

            <!-- Lessons for this chapter -->
            <div class="pt-1">
              <div class="flex items-center justify-between">
                <h3 class="font-medium">Lessons</h3>
                <button
                  type="button"
                  class="cursor-pointer px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                  on:click|preventDefault={() => addLesson(i)}>
                  + Add lesson
                </button>
              </div>

              {#if ch.lessons.length === 0}
                <p class="text-gray-500 mt-3">No lessons yet.</p>
              {/if}

              <div class="mt-3 space-y-4">
                {#each ch.lessons as l, j}
                  <div class="rounded border border-gray-200 p-4 space-y-3">
                    <div class="flex flex-col gap-3 md:flex-row md:items-center md:gap-2">
                      <label class="flex-1">
                        <span class="block text-sm font-medium text-gray-700 mb-1">Lesson title</span>
                        <input
                          class="w-full border rounded px-3 py-2"
                          placeholder="Lesson title"
                          bind:value={l.title}
                          on:input={() => { markDirty(); chapters = [...chapters]; }}>
                      </label>

                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          class="cursor-pointer px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                          on:click|preventDefault={() => { move(ch.lessons, j, j - 1); chapters = [...chapters]; }}>
                          ↑
                        </button>
                        <button
                          type="button"
                          class="cursor-pointer px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                          on:click|preventDefault={() => { move(ch.lessons, j, j + 1); chapters = [...chapters]; }}>
                          ↓
                        </button>
                        <button
                          type="button"
                          class="cursor-pointer px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                          on:click|preventDefault={() => saveLesson(i, j)}
                          disabled={saving}>
                          {l.id ? 'Save' : 'Create'}
                        </button>
                        <button
                          type="button"
                          class="cursor-pointer px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                          on:click|preventDefault={() => removeLesson(i, j)}>
                          Delete
                        </button>
                      </div>
                    </div>

                    <div class="grid gap-3 md:grid-cols-2">
                      <label class="md:col-span-2">
                        <span class="block text-sm font-medium text-gray-700 mb-1">Lesson content</span>
                        <textarea
                          class="w-full border rounded px-3 py-2 h-28"
                          placeholder="Lesson content"
                          bind:value={l.content}
                          on:input={() => { markDirty(); chapters = [...chapters]; }}>
                        </textarea>
                      </label>

                      <label>
                        <span class="block text-sm font-medium text-gray-700 mb-1">Media URL (optional)</span>
                        <input
                          class="border rounded px-3 py-2 w-full"
                          placeholder="https://..."
                          bind:value={l.mediaUrl}
                          on:input={() => { markDirty(); chapters = [...chapters]; }}>
                      </label>

                      <label class="inline-flex items-center gap-2 mt-1">
                        <input
                          type="checkbox"
                          bind:checked={l.isPublished}
                          on:change={() => { markDirty(); chapters = [...chapters]; }}>
                        <span>Published</span>
                      </label>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          </article>
        {/each}
      </div>
    </section>

    <!-- Actions -->
    <section class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <!-- Danger zone (only when a draft exists) -->
      {#if courseId}
        <button
          type="button"
          class="cursor-pointer order-2 sm:order-1 px-4 py-2 rounded bg-red-50 text-red-700 hover:bg-red-100"
          on:click|preventDefault={handleDeleteCourse}
          disabled={saving}>
          Delete course
        </button>
      {/if}

      <div class="order-1 sm:order-2 flex items-center justify-end gap-4">
        <button
          type="button"
          class="cursor-pointer px-5 py-2.5 rounded bg-gray-100 hover:bg-gray-200"
          on:click|preventDefault={createOrUpdateCourse}
          disabled={saving}>
          Save draft
        </button>
        <button
          type="button"
          class="cursor-pointer px-5 py-2.5 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          on:click|preventDefault={publishCourse}
          disabled={saving}>
          Publish
        </button>
      </div>
    </section>
  </div>
</section>