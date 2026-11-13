import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
  noindex?: boolean;
}

const DEFAULT_TITLE = 'DUKAAN — Objects of Everyday Expression';
const DEFAULT_DESCRIPTION = 'Contemporary unisex clothing engineered with pure European linen, soft cotton gauze, and timeless comfortable silhouettes.';
const DEFAULT_IMAGE = 'https://cdn.shopify.com/s/files/1/0683/8947/0389/files/AWGauze1.jpg?v=1780592855';
const DEFAULT_KEYWORDS = 'European linen shirts India, Normandy flax clothing, pure linen shirts, breathable double gauze cotton, unstructured relaxed tailoring India, minimalist capsule wardrobe, slow fashion India, organic cotton clothing';
const BASE_URL = 'https://dukaan-j5l5.vercel.app';

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonicalPath,
  ogImage,
  ogType = 'website',
  jsonLd,
  noindex = false,
}) => {
  const location = useLocation();

  useEffect(() => {
    const finalTitle = title || DEFAULT_TITLE;
    const finalDescription = description || DEFAULT_DESCRIPTION;
    const finalKeywords = keywords || DEFAULT_KEYWORDS;
    const finalPath = canonicalPath || location.pathname;
    const finalUrl = `${BASE_URL}${finalPath.startsWith('/') ? finalPath : `/${finalPath}`}`;
    const finalImage = ogImage || DEFAULT_IMAGE;

    document.title = finalTitle;

    const setMetaTag = (attributeName: string, attributeValue: string, contentValue: string) => {
      let element = document.head.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    setMetaTag('name', 'description', finalDescription);
    setMetaTag('name', 'keywords', finalKeywords);
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('name', 'author', 'DUKAAN');

    setMetaTag('property', 'og:site_name', 'DUKAAN');
    setMetaTag('property', 'og:title', finalTitle);
    setMetaTag('property', 'og:description', finalDescription);
    setMetaTag('property', 'og:url', finalUrl);
    setMetaTag('property', 'og:image', finalImage);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:locale', 'en_IN');

    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:site', '@dukaan');
    setMetaTag('name', 'twitter:creator', '@dukaan');
    setMetaTag('name', 'twitter:title', finalTitle);
    setMetaTag('name', 'twitter:description', finalDescription);
    setMetaTag('name', 'twitter:image', finalImage);

    let canonicalLink = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', finalUrl);

    const existingScripts = document.head.querySelectorAll('script[data-dynamic-seo="true"]');
    existingScripts.forEach((s) => s.remove());

    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-dynamic-seo', 'true');
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const dynamicScripts = document.head.querySelectorAll('script[data-dynamic-seo="true"]');
      dynamicScripts.forEach((s) => s.remove());
    };
  }, [title, description, keywords, canonicalPath, ogImage, ogType, jsonLd, location.pathname, noindex]);

  return null;
};
