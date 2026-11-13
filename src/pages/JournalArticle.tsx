import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { JOURNAL_ARTICLES } from '../data/journal';
import { PRODUCTS } from '../data/products';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Clock, Share2, ArrowRight, Check, Sparkles, HelpCircle, Layers } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { ProductCard } from '../components/product/ProductCard';
import { SEOHead } from '../components/seo/SEOHead';
import { useUIStore } from '../store/useUIStore';

export const JournalArticle: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/blog') ? '/blog' : '/journal';
  const showToast = useUIStore((state) => state.showToast);

  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const article = JOURNAL_ARTICLES.find((a) => a.slug === slug) || JOURNAL_ARTICLES[0];
  const otherArticles = JOURNAL_ARTICLES.filter((a) => a.slug !== article.slug);

  const relatedProducts = (article.relatedProductSlugs || [])
    .map((s) => PRODUCTS.find((p) => p.slug === s))
    .filter((p): p is (typeof PRODUCTS)[0] => Boolean(p));

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (totalScroll / windowHeight) * 100)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://dukaan-j5l5.vercel.app${basePath}/${article.slug}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      showToast('Article link copied to clipboard', 'info');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`${article.title} | Read on DUKAAN: ${currentUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`${article.title} via @dukaan`);
    const url = encodeURIComponent(currentUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(currentUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const shareOnPinterest = () => {
    const url = encodeURIComponent(currentUrl);
    const media = encodeURIComponent(article.coverImage);
    const description = encodeURIComponent(article.title);
    window.open(`https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${description}`, '_blank', 'noopener,noreferrer');
  };

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.title,
      alternativeHeadline: article.subtitle,
      description: article.excerpt,
      image: article.coverImage,
      datePublished: article.date,
      dateModified: article.date,
      mainEntityOfPage: `https://dukaan-j5l5.vercel.app${basePath}/${article.slug}`,
      author: {
        '@type': 'Person',
        name: article.author.name,
        jobTitle: article.author.role,
      },
      publisher: {
        '@type': 'Organization',
        name: 'DUKAAN',
        url: 'https://dukaan-j5l5.vercel.app',
        logo: {
          '@type': 'ImageObject',
          url: 'https://dukaan-j5l5.vercel.app/favicon.svg',
        },
      },
      articleSection: article.category,
      keywords: article.tags ? article.tags.join(', ') : 'European linen, luxury fashion, slow living',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://dukaan-j5l5.vercel.app',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Editorial Journal',
          item: `https://dukaan-j5l5.vercel.app${basePath}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: article.title,
          item: `https://dukaan-j5l5.vercel.app${basePath}/${article.slug}`,
        },
      ],
    },
    ...(article.faqs && article.faqs.length > 0
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: article.faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          },
        ]
      : []),
  ];

  return (
    <article className="w-full pb-20 bg-[#FAF9F6]">
      <SEOHead
        title={`${article.title} | DUKAAN`}
        description={article.excerpt}
        keywords={article.tags ? article.tags.join(', ') : 'European linen, slow fashion, DUKAAN'}
        canonicalPath={`${basePath}/${article.slug}`}
        ogImage={article.coverImage}
        ogType="article"
        jsonLd={jsonLd}
      />

      <div
        className="fixed top-0 left-0 right-0 h-1 bg-[#A7654A] z-50 origin-left transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <header className="pt-6 sm:pt-10 pb-6 sm:pb-8 bg-[#FAF8F5] border-b border-[#141414]/8 mb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4 gap-3">
            <Breadcrumbs
              items={[
                { label: 'Journal', href: basePath },
                { label: article.category, href: basePath },
                { label: article.title },
              ]}
              className="min-w-0"
            />
            <Link
              to={basePath}
              className="hidden sm:inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#73706B] hover:text-[#141414] transition-colors shrink-0 font-medium"
            >
              <span>← All Articles</span>
            </Link>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold">
                {article.category}
              </span>
              <span className="text-[#141414]/20">•</span>
              <span className="text-[10px] uppercase tracking-wider text-[#73706B]">Monograph</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#141414] leading-[1.15] font-normal tracking-tight">
              {article.title}
            </h1>

            <p className="font-serif text-base sm:text-xl text-[#73706B] italic leading-relaxed max-w-3xl">
              {article.subtitle}
            </p>

            <div className="flex flex-wrap items-center justify-between pt-5 border-t border-[#141414]/8 text-xs text-[#73706B] gap-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#141414]">{article.author.name}</span>
                <span>•</span>
                <span className="text-[11px] text-[#73706B]">{article.author.role}</span>
              </div>

              <div className="flex items-center gap-3">
                <time dateTime={article.date}>{article.date}</time>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTime}
                </span>

                <div className="flex items-center gap-1.5 ml-2 pl-3 border-l border-[#141414]/12">
                  <button
                    onClick={shareOnWhatsApp}
                    className="p-1.5 rounded-full hover:bg-emerald-50 text-[#141414] hover:text-emerald-700 transition-colors"
                    title="Share on WhatsApp"
                    aria-label="Share on WhatsApp"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 2.012.825 3.095.826h.005c3.181 0 5.767-2.586 5.768-5.766 0-1.54-.599-2.989-1.688-4.079-1.089-1.09-2.54-1.691-4.08-1.691zm0 10.364h-.004c-.927 0-1.837-.249-2.631-.72l-.189-.112-1.956.513.522-1.907-.123-.196c-.519-.824-.793-1.782-.792-2.766.002-2.84 2.316-5.153 5.158-5.153 1.376 0 2.669.537 3.642 1.51 1 1 1.511 2.267 1.51 3.642-.002 2.84-2.316 5.153-5.158 5.153zm2.831-3.868c-.155-.078-.918-.453-1.06-.505-.143-.052-.247-.078-.351.078-.104.155-.403.505-.494.609-.091.104-.182.117-.337.039-.155-.078-.654-.241-1.246-.768-.46-.41-.771-.917-.862-1.072-.091-.155-.01-.239.068-.316.07-.07.155-.182.233-.272.078-.091.104-.155.155-.259.052-.104.026-.195-.013-.272-.039-.078-.351-.845-.481-1.157-.126-.303-.255-.262-.351-.267h-.3c-.104 0-.272.039-.415.195-.143.155-.545.532-.545 1.298s.558 1.505.636 1.609c.078.104 1.099 1.678 2.662 2.353.372.161.663.257.889.329.373.119.712.102.98.062.299-.045.918-.375 1.047-.738.13-.364.13-.675.091-.738-.039-.065-.143-.104-.298-.182z"/>
                    </svg>
                  </button>
                  <button
                    onClick={shareOnTwitter}
                    className="p-1.5 rounded-full hover:bg-neutral-100 text-[#141414] hover:text-black transition-colors"
                    title="Share on X"
                    aria-label="Share on X"
                  >
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </button>
                  <button
                    onClick={shareOnLinkedIn}
                    className="p-1.5 rounded-full hover:bg-blue-50 text-[#141414] hover:text-blue-700 transition-colors"
                    title="Share on LinkedIn"
                    aria-label="Share on LinkedIn"
                  >
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </button>
                  <button
                    onClick={shareOnPinterest}
                    className="p-1.5 rounded-full hover:bg-rose-50 text-[#141414] hover:text-rose-700 transition-colors"
                    title="Pin on Pinterest"
                    aria-label="Pin on Pinterest"
                  >
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.056.208-.18.252-.415.153-1.549-.721-2.518-2.985-2.518-4.805 0-3.913 2.843-7.507 8.2-7.507 4.305 0 7.65 3.068 7.65 7.168 0 4.279-2.697 7.722-6.44 7.722-1.258 0-2.441-.654-2.845-1.427 0 0-.623 2.372-.774 2.955-.297 1.144-1.1 2.578-1.639 3.448 1.177.363 2.43.561 3.73.561 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                    </svg>
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="p-1.5 rounded-full hover:bg-neutral-100 text-[#141414] transition-colors"
                    title="Copy Link"
                    aria-label="Copy Link"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-10">
        <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-[#ECE7DD] border border-[#141414]/8 shadow-xs">
          <ImageWithFallback
            src={article.coverImage}
            alt={article.title}
            aspectRatioClass="w-full h-full"
            loading="eager"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {article.keyFacts && article.keyFacts.length > 0 && (
        <aside className="max-w-3xl mx-auto px-4 sm:px-6 mb-10">
          <div className="bg-[#FAF8F5] border border-[#A7654A]/30 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-3 text-[#A7654A]">
              <Sparkles className="w-4 h-4 shrink-0" />
              <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#141414]">
                Materiality & Technical Architecture
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {article.keyFacts.map((fact, idx) => (
                <div key={idx} className="flex flex-col bg-[#FAF9F6] p-2.5 rounded-xl border border-[#141414]/6">
                  <span className="text-[10px] uppercase tracking-wider text-[#73706B] font-medium">
                    {fact.label}
                  </span>
                  <span className="font-serif text-[#141414] font-medium mt-0.5">
                    {fact.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}

      <main className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 text-sm sm:text-base text-[#141414] font-light leading-relaxed">
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
                className="font-serif text-xl sm:text-2xl text-[#141414] pt-5 font-normal tracking-tight"
              >
                {block.text}
              </h2>
            );
          }
          if (block.type === 'image' && block.image) {
            return (
              <figure key={idx} className="my-8 space-y-2">
                <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-[#ECE7DD] border border-[#141414]/8 shadow-xs">
                  <ImageWithFallback
                    src={block.image}
                    alt={block.caption || 'Editorial monograph photography'}
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

        {article.faqs && article.faqs.length > 0 && (
          <section className="pt-8 border-t border-[#141414]/8 mt-10">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-4 h-4 text-[#A7654A]" />
              <h2 className="font-serif text-xl sm:text-2xl text-[#141414] font-normal">
                Direct Inquiries & Technical Answers
              </h2>
            </div>
            <div className="space-y-4">
              {article.faqs.map((faq, i) => (
                <div key={i} className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#141414]/8">
                  <h3 className="font-serif text-base text-[#141414] font-medium mb-1.5">
                    {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#73706B] font-light leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {article.tags && article.tags.length > 0 && (
          <div className="pt-6 border-t border-[#141414]/8 mt-8 flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#73706B] font-medium mr-1">
              Indexed Topics:
            </span>
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 bg-[#FAF8F5] border border-[#141414]/10 rounded-full text-[#141414]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </main>

      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-10 border-t border-[#141414]/8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#A7654A] font-semibold block mb-0.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Curated Physical Objects
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#141414]">
                Garments Discussed in this Dispatch
              </h3>
            </div>
            <Link
              to="/shop"
              className="text-[11px] uppercase tracking-wider text-[#73706B] hover:text-[#141414] transition-colors font-medium"
            >
              Browse Complete Wardrobe →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-10 border-t border-[#141414]/8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#A7654A] font-semibold block mb-0.5">
              Read Further
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#141414]">
              Related Dispatches & Monographs
            </h3>
          </div>
          <Link
            to={basePath}
            className="text-[11px] uppercase tracking-wider text-[#73706B] hover:text-[#141414] transition-colors font-medium"
          >
            All Articles →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherArticles.slice(0, 2).map((a) => (
            <Link
              key={a.id}
              to={`${basePath}/${a.slug}`}
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
