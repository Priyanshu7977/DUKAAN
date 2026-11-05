import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { JOURNAL_ARTICLES } from '../data/journal';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Clock, Share2, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { useUIStore } from '../store/useUIStore';

export const JournalArticle: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const showToast = useUIStore((state) => state.showToast);

  const article = JOURNAL_ARTICLES.find((a) => a.slug === slug) || JOURNAL_ARTICLES[0];
  const otherArticles = JOURNAL_ARTICLES.filter((a) => a.slug !== article.slug);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Article link copied to clipboard', 'info');
    }
  };

  return (
    <article className="w-full pb-16 bg-[#FAF9F6]">
      <section className="pt-6 sm:pt-8 pb-6 sm:pb-8 bg-[#FAF8F5] border-b border-[#141414]/8 mb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-3 gap-3">
            <Breadcrumbs
              items={[
                { label: 'Journal', href: '/journal' },
                { label: article.category, href: '/journal' },
                { label: article.title },
              ]}
              className="min-w-0"
            />
            <Link
              to="/journal"
              className="hidden sm:inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#73706B] hover:text-[#141414] transition-colors shrink-0 font-medium"
            >
              <span>← All Articles</span>
            </Link>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block">
              {article.category}
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#141414] leading-[1.15] font-normal tracking-tight">
              {article.title}
            </h1>
            <p className="font-serif text-sm sm:text-lg text-[#73706B] italic leading-relaxed max-w-3xl">
              {article.subtitle}
            </p>

            <div className="flex flex-wrap items-center justify-between pt-4 border-t border-[#141414]/8 text-xs text-[#73706B] gap-3">
              <div className="flex items-center gap-2">
                <p className="font-medium text-[#141414]">{article.author.name}</p>
                <span>•</span>
                <p className="text-[11px] text-[#73706B]">{article.author.role}</p>
              </div>

              <div className="flex items-center gap-3">
                <span>{article.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTime}
                </span>
                <button
                  onClick={handleShare}
                  className="p-1 text-[#141414] hover:text-[#A7654A] transition-colors ml-1"
                  aria-label="Share article"
                  title="Copy article link"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-10">
        <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-[#ECE7DD] border border-[#141414]/8 shadow-sm">
          <ImageWithFallback
            src={article.coverImage}
            alt={article.title}
            aspectRatioClass="w-full h-full"
            loading="eager"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 text-sm sm:text-base text-[#141414] font-light leading-relaxed">
        {article.content.map((block, idx) => {
          if (block.type === 'paragraph') {
            return (
              <p key={idx} className="leading-relaxed text-[#141414]/90 text-sm sm:text-base">
                {block.text}
              </p>
            );
          }
          if (block.type === 'quote') {
            return (
              <blockquote
                key={idx}
                className="my-8 bg-[#FAF8F5] border-l-4 border-[#A7654A] p-5 sm:p-7 rounded-r-2xl font-serif text-lg sm:text-2xl text-[#141414] italic leading-relaxed shadow-xs"
              >
                "{block.text}"
              </blockquote>
            );
          }
          if (block.type === 'heading') {
            return (
              <h2
                key={idx}
                className="font-serif text-xl sm:text-2xl text-[#141414] pt-4 font-normal tracking-tight"
              >
                {block.text}
              </h2>
            );
          }
          if (block.type === 'image' && block.image) {
            return (
              <figure key={idx} className="my-8 space-y-2">
                <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-[#ECE7DD] border border-[#141414]/8 shadow-sm">
                  <ImageWithFallback
                    src={block.image}
                    alt={block.caption || 'Journal photography'}
                    aspectRatioClass="w-full h-full"
                    className="w-full h-full object-cover"
                  />
                </div>
                {block.caption && (
                  <figcaption className="text-xs text-[#73706B] font-light italic text-center">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          }
          return null;
        })}
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-10 border-t border-[#141414]/8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#A7654A] font-semibold block mb-0.5">
              Read Further
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#141414]">
              Related Atelier Dispatches
            </h3>
          </div>
          <Link
            to="/journal"
            className="text-[11px] uppercase tracking-wider text-[#73706B] hover:text-[#141414] transition-colors font-medium"
          >
            All Articles →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherArticles.slice(0, 2).map((a) => (
            <Link
              key={a.id}
              to={`/journal/${a.slug}`}
              className="group flex flex-col sm:flex-row gap-4 bg-[#FAF8F5] p-4 sm:p-5 rounded-2xl border border-[#141414]/8 hover:border-[#141414]/20 transition-all shadow-xs"
            >
              <div className="w-full sm:w-44 aspect-[4/3] shrink-0 overflow-hidden rounded-xl bg-[#ECE7DD]">
                <ImageWithFallback
                  src={a.coverImage}
                  alt={a.title}
                  aspectRatioClass="w-full h-full"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#A7654A] font-semibold">
                    {a.category}
                  </span>
                  <h4 className="font-serif text-base text-[#141414] group-hover:text-[#A7654A] transition-colors mt-0.5 leading-snug">
                    {a.title}
                  </h4>
                  <p className="text-xs text-[#73706B] line-clamp-2 mt-1 font-light leading-relaxed">
                    {a.excerpt}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#73706B] group-hover:text-[#141414] font-semibold">
                  <span>Read Dispatch</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
};
