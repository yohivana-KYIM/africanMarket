import { type FC, useEffect } from "react";

const SITE_URL = "https://africamarket.store";
const SITE_NAME = "Africa Market";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&q=80";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function setMeta(attr: string, key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

const SEO: FC<SEOProps> = ({ title, description, canonical, image, noindex, jsonLd }) => {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : undefined;
  const ogImage = image || DEFAULT_IMAGE;

  useEffect(() => {
    document.title = fullTitle;

    setMeta("name", "description", description);
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

    // Open Graph
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:locale", "fr_CM");
    if (canonicalUrl) {
      setMeta("property", "og:url", canonicalUrl);
    }

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage);

    // Canonical
    if (canonicalUrl) {
      setLink("canonical", canonicalUrl);
    }

    // JSON-LD
    // Remove previous dynamic JSON-LD scripts
    document.querySelectorAll('script[data-seo-jsonld]').forEach((el) => el.remove());

    if (jsonLd) {
      const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      items.forEach((ld) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo-jsonld", "");
        script.textContent = JSON.stringify(ld);
        document.head.appendChild(script);
      });
    }

    return () => {
      document.querySelectorAll('script[data-seo-jsonld]').forEach((el) => el.remove());
    };
  }, [fullTitle, description, canonicalUrl, ogImage, noindex, jsonLd]);

  return null;
};

export default SEO;
