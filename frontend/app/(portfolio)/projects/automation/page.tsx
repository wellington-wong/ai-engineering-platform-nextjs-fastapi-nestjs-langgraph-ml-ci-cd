import type { Metadata } from 'next';
import Image from 'next/image';
import AutomationClient from './automation-client';



import { ModalTrigger } from '@/components/modal';
export const metadata: Metadata = {
  title: 'Automation'
};

export default function AutomationPage() {
  const techStack = [ "Next.js", "n8n", "OpenAI", "Socket.io", "Docker" ];
  return (
      <div className="mx-auto max-w-7xl p-6 lg:p-8">


        <header className="mb-5">
          <h1 className="text-lg lg:text-2xl font-medium">Smart Lead Router</h1>
          <p className="mt-2 text-gray-500">An intelligent workflow automation system built with n8n and OpenAI to streamline repetitive tasks, connect services, and automate business processes. Leverages AI-driven decision-making to create flexible and efficient workflows.</p>
        </header>

        <AutomationClient />

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <ModalTrigger size="full" title="Smart Lead Router - n8n" trigger={<Image src="/images/n8n-workflow-automation.png" width="1697" height="588" alt="Automation Workflow - n8n" />}>


            <Image src="/images/n8n-workflow-automation.png" width="1697" height="588" alt="Automation Workflow - n8n" />
          </ModalTrigger>
        </section>

        <div className="mt-6">

          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
                <span
                    key={tech}
                    className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700"
                >
                          {tech}
                        </span>
            ))}
          </div>
        </div>
      </div>
  );
}
