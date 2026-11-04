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
    <article className="w-full pb-12 bg-[#FAF9F6]">
      {/* Article Header */}
      <header className="pt-4 pb-5 max-w-4xl mx-auto px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: 'Journal', href: '/journal' },
            { label: article.category, href: '/journal' },
            { label: article.title },
          ]}
          className="mb-2"
        />

        <div className="space-y-3">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block">
            {article.category}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#141414] leading-tight font-normal">
            {article.title}
          </h1>
          <p className="font-serif text-base sm:text-lg text-[#73706B] italic leading-relaxed">
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
      </header>

      {/* Main Cover Image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-10">
        <div className="aspect-[16/9] overflow-hidden bg-[#ECE7DD]">
          <ImageWithFallback
            src={article.coverImage}
            alt={article.title}
            aspectRatioClass="w-full h-full"
            loading="eager"
          />
        </div>
      </div>

      {/* Article Content Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 text-sm sm:text-base text-[#141414] font-light leading-relaxed">
        {article.content.map((block, idx) => {
          if (block.type === 'paragraph') {
            return (
              <p key={idx} className="leading-relaxed text-[#141414]/90">
                {block.text}
              </p>
            );
          }
          if (block.type === 'quote') {
            return (
              <blockquote
                key={idx}
                className="my-8 border-l-2 border-[#A7654A] pl-5 py-1.5 font-serif text-xl sm:text-2xl text-[#141414] italic leading-snug"
              >
                "{block.text}"
              </blockquote>
            );
          }
          if (block.type === 'heading') {
            return (
              <h2
                key={idx}
                className="font-serif text-xl sm:text-2xl text-[#141414] pt-4 font-normal"
              >
                {block.text}
              </h2>
            );
          }
          if (block.type === 'image' && block.image) {
            return (
              <figure key={idx} className="my-8">
                <div className="aspect-[16/10] overflow-hidden bg-[#ECE7DD]">
                  <ImageWithFallback
                    src={block.image}
                    alt={block.caption || 'Journal photography'}
                    aspectRatioClass="w-full h-full"
                  />
                </div>
                {block.caption && (
                  <figcaption className="text-xs text-[#73706B] font-mono mt-2 text-center">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          }
          return null;
        })}
      </div>

      {/* Related Articles Footer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-10 border-t border-[#141414]/8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#73706B] font-semibold block">
              Read Further
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#141414]">
              Related Atelier Dispatches
            </h3>
          </div>
          <Link
            to="/journal"
            className="text-[11px] uppercase tracking-wider text-[#73706B] hover:text-[#141414] transition-colors"
          >
            All Articles
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherArticles.slice(0, 2).map((a) => (
            <Link
              key={a.id}
              to={`/journal/${a.slug}`}
              className="group flex flex-col sm:flex-row gap-4 bg-white p-4 border border-[#141414]/8"
            >
              <div className="w-full sm:w-40 aspect-[4/3] shrink-0 overflow-hidden bg-[#ECE7DD]">
                <img
                  src={a.coverImage}
                  alt={a.title}
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
                  <p className="text-xs text-[#73706B] line-clamp-2 mt-1 font-light">
                    {a.excerpt}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] uppercase tracking-widest text-[#73706B] group-hover:text-[#141414]">
                  <span>Read Piece</span>
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
