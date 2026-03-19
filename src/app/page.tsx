import CreateProject from "@/components/CreateProject";
import VideoLibrary from "@/components/VideoLibrary";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white py-12 px-4 selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <div className="inline-block p-2 px-4 bg-zinc-900 border border-zinc-800 rounded-full text-sm font-medium text-zinc-400 mb-4 animate-fade-in">
            Editing Automation Dashboard ✨
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white drop-shadow-2xl">
            Viral <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500">Shorts</span> Factory
          </h1>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-medium">
            Generate viral scripts, scrape matching TikTok clips, and assemble high-retention videos in minutes.
          </p>
        </header>

        <section className="animate-slide-up">
          <CreateProject />
        </section>

        <section className="animate-slide-up [animation-delay:200ms]">
          <VideoLibrary />
        </section>
      </div>
    </main>
  );
}
