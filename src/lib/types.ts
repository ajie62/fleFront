export interface Course {
  id: number;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isPublished: boolean;
}

export type Status = 'all' | 'published' | 'unpublished';
export type Level = 'all' | 'beginner' | 'intermediate' | 'advanced';

export type JwtPayload = {
  email: string;
  roles: string[];
  exp?: number;
  iat?: number;
};
