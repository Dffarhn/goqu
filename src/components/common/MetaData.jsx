import React from 'react';
import { Helmet } from 'react-helmet';

const MetaData = () => {
  return (
    <Helmet>
      <title>GoQu - Donasi Masjid</title>
      <meta name="description" content="Platform donasi digital untuk pembangunan dan renovasi masjid yang akuntabel dan transparan di seluruh Indonesia." />
      <meta name="keywords" content="donasi masjid, wakaf, sedekah, pembangunan masjid, renovasi masjid, GoQu" />
      <meta name="author" content="GoQu" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://goqu.id/" />
      <meta property="og:title" content="GoQu - Donasi Masjid" />
      <meta property="og:description" content="Platform donasi digital untuk pembangunan dan renovasi masjid yang akuntabel dan transparan." />
      <meta property="og:image" content="/og-image.jpg" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://goqu.id/" />
      <meta property="twitter:title" content="GoQu - Donasi Masjid" />
      <meta property="twitter:description" content="Platform donasi digital untuk pembangunan dan renovasi masjid yang akuntabel dan transparan." />
      <meta property="twitter:image" content="/og-image.jpg" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Theme color */}
      <meta name="theme-color" content="#003876" />
    </Helmet>
  );
};

export default MetaData;