import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Web & Mobile',
};

const projects = [
  {
    href: 'https://referrals.wellington.codes/',
    title: 'Referrals App',
    description: 'A referral management application for creating, tracking, and managing customer referrals.',
    stack: 'Laravel',
  },
  {
    href: 'http://mobile-app.wellington.codes/',
    title: 'Points and Rebates App',
    description: 'A mobile app for managing customer points and rebates.',
    stack: 'React Native',
  },
];

export default function WebMobilePage() {
  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-8">
      <header className="mb-8">
        <p className="mb-2 text-sm font-medium text-gray-500">Selected work</p>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950">Web &amp; Mobile</h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          Web and mobile applications built to support customer engagement and loyalty.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.href}
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-gray-200 bg-white p-6 transition-colors hover:border-gray-400"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-semibold text-gray-950">{project.title}</h2>
              <span className="shrink-0 rounded-full bg-[#F5F2ED] px-3 py-1 text-xs font-medium text-gray-600">
                {project.stack}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-gray-600">{project.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
