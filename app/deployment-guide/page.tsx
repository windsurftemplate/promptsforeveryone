import Card from '@/components/ui/Card';
import Link from 'next/link';

export default function DeploymentGuidePage() {
  const deploymentOptions = [
    {
      title: 'Deploy to Vercel',
      description: 'Deploy your application with Vercel for the best Next.js deployment experience.',
      href: '/deployment-guide/vercel',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 22.525H0l12-21.05 12 21.05z" />
        </svg>
      ),
    },
    {
      title: 'Deploy to Netlify',
      description: 'Use Netlify for a simple and powerful deployment solution with great CI/CD features.',
      href: '/deployment-guide/netlify',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.3877 8.3286L17.2312 8.17065L12.0001 3.00023L6.76901 8.17065L6.61247 8.3286L6.64005 8.55624L7.15178 12.8277L7.17832 13.0525L7.39113 13.1619L11.8561 14.9571L12.0001 15.0125L12.1442 14.9571L16.6091 13.1619L16.8219 13.0525L16.8485 12.8277L17.3602 8.55624L17.3877 8.3286Z" />
          <path d="M12.0001 0L0 12L4.8 16.8L19.2001 2.4L12.0001 0Z" />
          <path d="M19.2001 2.4L4.8 16.8L7.2 19.2L21.6001 4.8L19.2001 2.4Z" />
          <path d="M7.2 19.2L12 24L24 12L19.2001 7.2L7.2 19.2Z" />
        </svg>
      ),
    },
    {
      title: 'Deploy to DigitalOcean',
      description: 'Deploy on DigitalOcean App Platform for scalable and managed hosting.',
      href: '/deployment-guide/digitalocean',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 24v-5.7c5 0 9-4 9-9s-4-9-9-9-9 4-9 9H0c0-6.6 5.4-12 12-12s12 5.4 12 12-5.4 12-12 12z" />
          <path d="M12 24v-5.7H6.3V13h5.4v5.3H17v5.4H12z" />
          <path d="M6.3 18.3H3V15h3.3z" />
          <path d="M3 15H0v-3.3h3z" />
        </svg>
      ),
    },
  ];

  const pricingTiers = [
    {
      platform: 'Vercel',
      tiers: [
        {
          name: 'Hobby',
          price: 'Free',
          features: [
            'Personal projects',
            'Unlimited static sites',
            'HTTPS enabled',
            'Continuous deployment',
            'Basic analytics',
            '100GB bandwidth/month'
          ]
        },
        {
          name: 'Pro',
          price: '$20/month',
          features: [
            'Everything in Hobby',
            'Unlimited builds',
            'Advanced analytics',
            'Password protection',
            '1TB bandwidth/month',
            'Custom domains'
          ]
        }
      ]
    },
    {
      platform: 'Netlify',
      tiers: [
        {
          name: 'Starter',
          price: 'Free',
          features: [
            'Personal projects',
            'Automated builds',
            'HTTPS enabled',
            'Forms handling',
            'Community support',
            '100GB bandwidth/month'
          ]
        },
        {
          name: 'Pro',
          price: '$19/month',
          features: [
            'Everything in Starter',
            'Background functions',
            'Password protection',
            'Analytics',
            '1TB bandwidth/month',
            'Priority support'
          ]
        }
      ]
    },
    {
      platform: 'DigitalOcean',
      tiers: [
        {
          name: 'Basic',
          price: '$5/month',
          features: [
            'Starter projects',
            '1GB RAM',
            'Shared CPU',
            'Basic monitoring',
            'Community support',
            '1TB bandwidth/month'
          ]
        },
        {
          name: 'Professional',
          price: '$12/month',
          features: [
            'Production apps',
            '2GB RAM',
            'Dedicated CPU',
            'Advanced monitoring',
            'Priority support',
            '2TB bandwidth/month'
          ]
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Deployment Guide</h1>
          <p className="text-gray-400 mb-8">Choose your preferred deployment platform and follow the step-by-step guide to deploy your application.</p>

          <div className="mb-12 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">Choosing the Best Option</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-blue-400 mb-2">Free Tier</h3>
                  <p className="text-gray-400">If your project is small or personal, Vercel or Netlify's free tier is a great starting point.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-green-400 mb-2">Ease of Use</h3>
                  <p className="text-gray-400">If you prioritize simplicity and fast deployment, Vercel or Netlify are excellent choices.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-purple-400 mb-2">Flexibility</h3>
                  <p className="text-gray-400">DigitalOcean and Hostinger provide more flexibility and control over your server configuration.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-yellow-400 mb-2">Scalability</h3>
                  <p className="text-gray-400">If you expect significant traffic growth, consider Vercel, Netlify, or AWS Amplify.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Pricing Guide</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {pricingTiers.map((platform) => (
                <div key={platform.platform} className="space-y-6">
                  <h3 className="text-xl font-semibold text-primary">{platform.platform}</h3>
                  {platform.tiers.map((tier) => (
                    <Card key={tier.name} className="p-6 bg-gray-800/50 border border-gray-700">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-medium">{tier.name}</h4>
                        <span className="text-lg font-bold text-primary">{tier.price}</span>
                      </div>
                      <ul className="space-y-2">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-gray-400">
                            <svg className="w-4 h-4 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <h3 className="text-lg font-medium mb-2 text-yellow-400">Note on Pricing</h3>
              <p className="text-gray-400">
                Prices shown are starting points and may vary based on usage, region, and additional features. 
                All platforms offer custom enterprise plans for larger deployments. 
                Visit each provider's website for the most current pricing information.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deploymentOptions.map((option) => (
              <Link
                key={option.title}
                href={option.href}
                className="block group"
              >
                <Card className="h-full p-6 transition-all duration-200 hover:scale-[1.02] hover:bg-white/5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-primary">{option.icon}</div>
                    <h2 className="text-xl font-semibold">{option.title}</h2>
                  </div>
                  <p className="text-gray-400">{option.description}</p>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <h3 className="text-lg font-medium mb-2 text-blue-400">Need Help?</h3>
            <p className="text-gray-400">
              Each guide includes detailed instructions for setting up Firebase authentication and environment variables.
              If you encounter any issues, check the troubleshooting section in each guide.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
} 