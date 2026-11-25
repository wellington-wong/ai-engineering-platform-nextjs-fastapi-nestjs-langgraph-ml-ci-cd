import Link from 'next/link';
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'SaaS & Mobile',
};

const platforms = [
  {
    href: 'https://www.wellington.codes/dashboard',
    title: 'Next.js SaaS with Clerk Auth',
    description: 'A SaaS application with authentication powered by Clerk.',
    stack: 'Next.js + Clerk',

  },
  {
    href: 'https://saas.wellington.codes',
    title: 'Nuxt + .NET SaaS',
    description: 'A subscription based SaaS application built with a Nuxt frontend and .NET backend.',
    stack: 'Nuxt + .NET',
  },
  {

    href: 'https://saas.wellington.codes',
    title: 'Django SaaS',
    description: 'A SaaS application built with Django.',
    stack: 'Django',
  },
  {
    href: 'https://referrals.wellington.codes',
    title: 'Laravel Referrals App',
    description: 'A referral management platform for creating, tracking, and managing customer referrals.',
    stack: 'Laravel',
  },
  {
    href: 'http://mobile-app.wellington.codes/',
    title: 'Rebates and Points Mobile App',
    description: 'A mobile app for managing customer rebates and loyalty points.',
    stack: 'React Native',
  },
];

export default function SaaSPlatformsPage() {
  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-8">
      <header className="mb-8">
        <p className="mb-2 text-sm font-medium text-gray-500">Selected work</p>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950">SaaS & Mobile</h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          Production ready platforms built to help businesses serve customers and manage their workflows.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {platforms.map((platform) => {
          const card = (
            <>
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-semibold text-gray-950">{platform.title}</h2>
              <span className="shrink-0 rounded-full bg-[#F5F2ED] px-3 py-1 text-xs font-medium text-gray-600">
                {platform.stack}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-gray-600">{platform.description}</p>
            </>
          );

          return platform.href ? (
            <Link
              key={platform.title}
              href={platform.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-gray-200 bg-white p-6 transition-colors hover:border-gray-400"
            >
              {card}
            </Link>
          ) : (
            <article key={platform.title} className="rounded-xl border border-gray-200 bg-white p-6">
              {card}
            </article>
          );
        })}
      </div>
    </div>
  );
}
