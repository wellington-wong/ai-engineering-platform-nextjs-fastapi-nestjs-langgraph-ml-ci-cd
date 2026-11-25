import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video Gallery',
};

const videos = [
  {
    id: 'a469dc78db9e4e799a3e2700d2aa4333',
    title: 'Project walkthrough',
  },
];

export default function VideoGalleryPage() {
  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-8">
      <header className="mb-8">
        <p className="mb-2 text-sm font-medium text-gray-500">Introduction and Showcase Demos</p>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950">Video Gallery</h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          Walkthroughs and demos of selected projects.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {videos.map((video) => (
          <article key={video.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="relative h-0 pb-[56.25%]">
              <iframe
                src={`https://www.loom.com/embed/${video.id}`}
                title={video.title}
                allowFullScreen
                className="absolute left-0 top-0 h-full w-full"
              />
            </div>
            <h2 className="p-4 font-semibold text-gray-950">{video.title}</h2>
          </article>
        ))}
      </div>
    </div>
  );
}
