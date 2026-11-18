import { Activity, Bot, Workflow } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Expertise',
};

const areas = [
  {
    icon: Bot,
    title: 'Applied AI',
    description: 'Building practical AI experiences, from agent workflows to retrieval augmented generation and tools that make information easier to use.',
  },
  {
    icon: Workflow,
    title: 'Automation',
    description: 'Connecting services and streamlining repeatable work with thoughtful, observable automation workflows.',
  },
  {
    icon: Activity,
    title: 'Full stack engineering',
    description: 'Designing and shipping web applications with a focus on useful interfaces, reliable APIs, and operational visibility.',
  },
];

export default function ExpertisePage() {
  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-8">
      <header className="mb-8">
        <p className="mb-2 text-sm font-medium text-gray-500">What I do</p>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950">Expertise & Technical Skills</h1>
        <p className="mt-3 text-gray-600">I build software that brings AI, automation, and dependable engineering together to solve real problems, using modern frameworks, technologies, and tools.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {areas.map(({ icon: Icon, title, description }) => (
          <article key={title} className="rounded-xl border border-gray-200 bg-white p-6">
            <Icon className="mb-5 h-6 w-6 text-gray-800" aria-hidden="true" />
            <h2 className="mb-2 text-lg font-semibold text-gray-950">{title}</h2>
            <p className="text-sm leading-6 text-gray-600">{description}</p>
          </article>
        ))}
      </div>
      <TechnicalSkills />


    </div>
  );

  function TechnicalSkills() {

    const technicalSkills = [
      {
        category: "Frontend",
        technologies: [
          "React",
          "Next.js",
          "Angular",
          "TypeScript",
          "Tailwind",
          "shadcn",
        ],
      },
      {
        category: "AI/ML & Automation",
        technologies: [
          "LLM APIs",
          "RAG",
          "AI Agents",
          "Machine Learning",
          "Scikit-learn",
          "LangChain",
          "n8n",
        ],
      },
      {
        category: "Backend",
        technologies: [
          "Node.js",
          "Python",
          "FastAPI",
          ".NET",
          "REST APIs",
        ],
      },
      {
        category: "Cloud & DevOps",
        technologies: [
          "AWS",
          "Docker",
          "GitHub Actions",
          "Cloudflare",
          "Vercel",
        ],
      },
      {

        category: "Databases",
        technologies: [
          "PostgreSQL",
          "MySQL",
          "Redis",
        ],
      },
      {
        category: "Web, Commerce & Mobile",
        technologies: [

          "Laravel",
          "WordPress",
          "WooCommerce",
          "React Native",
        ],
      },
    ];

    return (
        <section className="mt-10">

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {technicalSkills.map((group) => (
                <div key={group.category}>
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">
                    {group.category}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {group.technologies.map((tech) => (

                        <span
                            key={tech}
                            className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700"
                        >
                  {tech}
                </span>
                    ))}
                  </div>
                </div>

            ))}
          </div>
        </section>
    );
  }
}
