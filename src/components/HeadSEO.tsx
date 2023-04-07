import Head from "next/head";
import { METADATA } from "../utils/globals";

type HeadSEOProps = {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  og?: {
    title: string;
    image: string;
    type: "article" | "website" | string;
  };
};

const HeadSEO = ({
  title = METADATA.title,
  description = METADATA.description,
  og,
  canonicalUrl = METADATA.siteUrl,
}: HeadSEOProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      <link rel="canonical" href={canonicalUrl} />
      <link rel="icon" href="/favicon.ico" />

      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={METADATA.siteUrl} />
      <meta property="og:type" content={og?.type} />
      <meta property="og:title" content={og?.title} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:description" content={description} />
    </Head>
  );
};

export default HeadSEO;
