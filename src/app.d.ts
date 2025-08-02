import type { JwtPayload } from '$lib/types';

declare global {
  namespace App {
    interface Locals {
      user: JwtPayload | null;
    }

    interface PageData {
      user?: JwtPayload | null;
      currentPath?: string;
    }
  }
}

export {};
