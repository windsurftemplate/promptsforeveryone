import Script from 'next/script'

export default function OrganizationSchema() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Prompts For Everyone',
    legalName: 'Prompts For Everyone Inc.',
    url: 'https://promptsforeveryone.com',
    logo: 'https://promptsforeveryone.com/logo.png',
    foundingDate: '2023',
    founders: [
      {
        '@type': 'Person',
        name: 'Prompts For Everyone Team'
      }
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US'
    },
    sameAs: [
      'https://twitter.com/promptsforall',
      'https://github.com/promptsforeveryone',
      'https://linkedin.com/company/promptsforeveryone'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@promptsforeveryone.com'
    }
  }

  return (
    <Script id="organization-structured-data" type="application/ld+json">
      {JSON.stringify(structuredData)}
    </Script>
  )
} 