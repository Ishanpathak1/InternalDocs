/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user: {
      id: string;
      email: string;
      role: string;
      startDate?: string;
      avatarPath?: string;
      githubUrl?: string;
    } | null;
  }
}
