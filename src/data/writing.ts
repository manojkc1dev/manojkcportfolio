export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: number;
  tags: string[];
  coverImage?: string;
  content: string; // markdown
}

export const posts: Post[] = [];
