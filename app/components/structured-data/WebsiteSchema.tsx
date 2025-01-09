import Script from 'next/script'

export default function WebsiteSchema() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Prompts For Everyone',
    alternateName: 'PromptsForEveryone',
    url: 'https://promptsforeveryone.com',
    description: 'Discover and share AI prompts across various categories. Access a curated collection of prompts for ChatGPT, writing, coding, and more.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://promptsforeveryone.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    sameAs: [
      'https://twitter.com/promptsforall',
      'https://github.com/promptsforeveryone',
      'https://linkedin.com/company/promptsforeveryone'
    ]
  }

  return (
    <Script id="website-structured-data" type="application/ld+json">
      {JSON.stringify(structuredData)}
    </Script>
  )
} 