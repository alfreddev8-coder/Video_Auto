"use client";

import { useEffect, useState } from "react";
import { turso } from "@/lib/turso";
import { Download, ExternalLink, Film, CheckCircle2, Clock, PlayCircle } from "lucide-react";

export default function VideoLibrary() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await fetch("/api/projects");
        const data = await result.json();
        setProjects(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
    const interval = setInterval(fetchProjects, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-zinc-500 text-center py-12">Loading your library...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Film className="text-blue-500" /> My Videos
        </h2>
        <span className="text-zinc-500 text-sm">{projects.length} total projects</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:bg-zinc-900 transition-all group overflow-hidden relative">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                  {project.niche.replace("-", " ")}
                </span>
                <h3 className="text-xl font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                  {project.title || "Untitled Project"}
                </h3>
              </div>
              <StatusBadge status={project.status} />
            </div>

            <p className="text-sm text-zinc-400 line-clamp-2 mb-6 leading-relaxed">
              {project.script}
            </p>

            <div className="flex gap-3">
              {project.video_url ? (
                <>
                  <a
                    href={project.video_url}
                    target="_blank"
                    className="flex-1 bg-white hover:bg-zinc-200 text-black font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
                  >
                    <Download size={16} /> Download
                  </a>
                  <button className="p-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-400 transition-all">
                    <PlayCircle size={20} />
                  </button>
                </>
              ) : (
                <div className="flex-1 bg-zinc-800/30 text-zinc-500 font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm border border-zinc-800/50 italic">
                  <Clock size={16} /> Creating your video...
                </div>
              )}
            </div>
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-blue-600/10 transition-all" />
          </div>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full border-2 border-dashed border-zinc-800 rounded-3xl py-24 flex flex-col items-center justify-center text-zinc-600 gap-4">
             <div className="p-4 bg-zinc-900 rounded-full">
               <Film size={40} className="opacity-20" />
             </div>
             <p className="text-lg">No videos yet. Create your first one above!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    pending: { icon: Clock, color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20", label: "Pending" },
    processing: { icon: Loader2, color: "text-blue-500 bg-blue-500/10 border-blue-500/20", label: "Processing", animate: true },
    completed: { icon: CheckCircle2, color: "text-green-500 bg-green-500/10 border-green-500/20", label: "Ready" },
    failed: { icon: Clock, color: "text-red-500 bg-red-500/10 border-red-500/20", label: "Failed" },
  };

  const config = configs[status] || configs.pending;
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${config.color}`}>
      <config.icon size={10} className={config.animate ? "animate-spin" : ""} />
      {config.label}
    </div>
  );
}

function Loader2(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
