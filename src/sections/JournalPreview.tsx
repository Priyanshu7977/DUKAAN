import React from 'react';
import { Link } from 'react-router-dom';
import { JOURNAL_ARTICLES } from '../data/journal';
import { ArrowRight, Clock } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const JournalPreview: React.FC = () => {
  return (
    <section className="py-8 sm:py-12 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-7 gap-3">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block mb-0.5">
              Style Journal
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#141414] font-normal">
              Stories & Fabric Guides
            </h2>
          </div>
          <Link
            to="/journal"
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-[#141414] hover:text-[#A7654A] transition-colors"
          >
            <span>View All Stories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {JOURNAL_ARTICLES.slice(0, 3).map((article) => (
            <article key={article.id} className="group flex flex-col justify-between">
              <div>
                <Link
                  to={`/journal/${article.slug}`}
                  className="block overflow-hidden bg-[#ECE7DD] aspect-[16/10] mb-3 relative"
                >
                  <ImageWithFallback
                    src={article.coverImage}
                    alt={article.title}
                    aspectRatioClass="w-full h-full"
                    className="group-hover:scale-105 transition-transform duration-500 ease-out object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-[#141414] text-white text-[9px] uppercase tracking-widest px-2 py-0.5 font-medium">
                    {article.category}
                  </span>
                </Link>

                <div className="flex items-center gap-2 text-[10px] text-[#73706B] mb-1 font-light">
                  <span>{article.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>

                <Link to={`/journal/${article.slug}`}>
                  <h3 className="font-serif text-base text-[#141414] group-hover:text-[#A7654A] transition-colors leading-snug">
                    {article.title}
                  </h3>
                </Link>

                <p className="text-xs text-[#73706B] font-light mt-1 line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#141414]/8 flex items-center justify-between text-xs text-[#73706B]">
                <span className="text-[10px]">By {article.author.name}</span>
                <Link
                  to={`/journal/${article.slug}`}
                  className="font-medium text-[#141414] group-hover:text-[#A7654A] flex items-center gap-1 uppercase tracking-wider text-[10px]"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
