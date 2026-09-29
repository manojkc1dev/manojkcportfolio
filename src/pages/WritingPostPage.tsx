import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { Seo } from '../components/Seo';
import { posts, type Post } from '../data/writing';

export const WritingPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post: Post | undefined = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-3">
          Article Not Found
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md">
          The requested article may have been moved or is still being drafted.
        </p>
        <Link
          to="/writing"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>
      </main>
    );
  }

  return (
    <>
      <Seo
        title={`${post.title} | Manoj K.C.`}
        description={post.excerpt}
        canonical={`https://manojkc1.com.np/writing/${post.slug}`}
        ogImage={post.coverImage || 'https://manojkc1.com.np/og-image.png'}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          author: {
            '@type': 'Person',
            name: 'Manoj K.C.',
            url: 'https://manojkc1.com.np/',
          },
          publisher: {
            '@type': 'Person',
            name: 'Manoj K.C.',
          },
          mainEntityOfPage: `https://manojkc1.com.np/writing/${post.slug}`,
        }}
      />

      <article className="min-h-screen py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/writing"
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Articles</span>
          </Link>
        </div>

        {/* Post Meta */}
        <header className="mb-10 pb-8 border-b border-neutral-200/80 dark:border-neutral-800">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-4">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{post.date}</span>
            </span>
            <span>&bull;</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readingTime} min read</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-4">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/70 dark:border-neutral-700/60"
              >
                <Tag className="w-3 h-3" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        </header>

        {/* Markdown Content */}
        <div className="prose dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800">
          <Markdown remarkPlugins={[remarkGfm]}>{post.content}</Markdown>
        </div>

        {/* Post Footer */}
        <footer className="mt-16 pt-8 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
          <Link
            to="/writing"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all articles</span>
          </Link>

          <a
            href="mailto:manojkc1dev@gmail.com"
            className="text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            Send feedback &rarr;
          </a>
        </footer>
      </article>
    </>
  );
};
