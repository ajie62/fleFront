export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type Status = 'all' | 'published' | 'unpublished';
export type Level = 'all' | CourseLevel;

// Optional: typed IRI (nice with API Platform)
export type IriString = `/api/${string}`;

export interface Course {
  id: number;
  '@id'?: IriString;          // optional API Platform IRI
  title: string;
  description: string;        // <-- keep in sync with CoursePayload
  level: CourseLevel;         // <-- reuse alias
  isPublished: boolean;
}

export type JwtPayload = {
  email: string;
  roles: string[];
  exp?: number;
  iat?: number;
};

export interface CoursePayload {
  title: string;
  description: string;
  level: CourseLevel;
  isPublished?: boolean;
}

export interface ChapterPayload {
  title: string;
  description: string;
  duration: string;
  mediaUrl?: string | null;
  isPublished?: boolean;
  course: string; // IRI: /api/courses/{id}
}

export interface LessonPayload {
  title: string;
  content: string;
  mediaUrl?: string | null;
  isPublished?: boolean;
  position?: number;
  chapter: string; // IRI: /api/chapters/{id}
}

export interface Chapter {
  id: number;
  '@id'?: IriString;
  title: string;
  position: number;
  course: IriString;
}

export interface Lesson {
  id: number;
  '@id'?: IriString;
  title: string;
  content: string;
  mediaUrl?: string | null;
  isPublished: boolean;
  position: number;
  chapter: IriString;
}
