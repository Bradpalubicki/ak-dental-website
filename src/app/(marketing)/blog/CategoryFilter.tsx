'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Tag, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BlogPost } from '@/lib/blog';

interface CategoryFilterProps {
  posts: BlogPost[];
  categories: string[];
}

export function CategoryFilter({ posts, categories }: CategoryFilterProps) {
  const [active, setActive] = useState<string>('All');

  const filtered =
    active === 'All' ? posts : posts.filter((p) => p.category === active);

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActive('All')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            active === 'All'
              ? 'bg-cyan-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Articles
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              active === cat
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Article Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((post) => (
          <Card
            key={post.slug}
            className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden"
          >
            <CardContent className="p-0">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.heroImage}
                  alt={post.heroAlt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-cyan-50 text-cyan-700 border-0 hover:bg-cyan-100 text-xs font-semibold">
                    <Tag className="h-3 w-3 mr-1" />
                    {post.category}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-cyan-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-600 hover:text-cyan-700 transition-colors"
                >
                  Read Article
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-slate-500 py-16">
          No articles in this category yet.
        </p>
      )}
    </div>
  );
}
