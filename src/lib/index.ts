import type { CoursePayload, ChapterPayload, LessonPayload } from './types';

// Generic JSON fetch with credentials + Hydra error surfacing
export async function fetchJson<T = any>(input: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(input, {
    credentials: 'include',
    headers: {
      Accept: 'application/ld+json',
      ...(init.headers ?? {})
    },
    ...init
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      msg = (data as any)?.detail || (data as any)?.['hydra:description'] || msg;
    } catch {
      // ignore parsing error
    }
    throw new Error(msg);
  }
  // Avoid JSON parse on 204
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

// ---- Courses ---------------------------------------------------------------
export function createCourse(payload: CoursePayload) {
  return fetchJson('/api/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/ld+json' },
    body: JSON.stringify(payload)
  }) as Promise<{ id: number; '@id': string }>;
}

export function updateCourse(id: number, patch: Partial<CoursePayload>) {
  return fetchJson(`/api/courses/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/merge-patch+json' },
    body: JSON.stringify(patch)
  });
}

export function deleteCourse(idOrIri: number | string) {
  // Accept either a numeric id (e.g., 42) or a full IRI (e.g., "/api/courses/42")
  const url = typeof idOrIri === 'number' ? `/api/courses/${idOrIri}` : idOrIri;
  // API Platform typically returns 204 No Content on successful delete.
  return fetchJson<void>(url, { method: 'DELETE' });
}

// ---- Chapters --------------------------------------------------------------
export function createChapter(payload: ChapterPayload) {
  return fetchJson('/api/chapters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/ld+json' },
    body: JSON.stringify(payload)
  }) as Promise<{ id: number; '@id': string }>;
}

export function updateChapter(id: number, patch: Partial<Omit<ChapterPayload, 'course'>>) {
  return fetchJson(`/api/chapters/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/merge-patch+json' },
    body: JSON.stringify(patch)
  });
}

export function deleteChapter(id: number) {
  return fetchJson(`/api/chapters/${id}`, { method: 'DELETE' });
}

// ---- Lessons ---------------------------------------------------------------
export function createLesson(payload: LessonPayload) {
  return fetchJson('/api/lessons', {
    method: 'POST',
    headers: { 'Content-Type': 'application/ld+json' },
    body: JSON.stringify(payload)
  }) as Promise<{ id: number; '@id': string }>;
}

export function updateLesson(id: number, patch: Partial<Omit<LessonPayload, 'chapter'>>) {
  return fetchJson(`/api/lessons/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/merge-patch+json' },
    body: JSON.stringify(patch)
  });
}

export function deleteLesson(id: number) {
  return fetchJson(`/api/lessons/${id}`, { method: 'DELETE' });
}
