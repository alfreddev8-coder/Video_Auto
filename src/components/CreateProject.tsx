"use client";

import { useState } from "react";
import { createProject, triggerWorkflow } from "@/lib/actions";
import { Loader2, Plus, Sword, Trophy, User, Music, Video } from "lucide-react";

const NICHES = [
  { id: "war-facts", name: "War Facts", icon: Sword, color: "from-red-500 to-orange-600" },
  { id: "nfl", name: "NFL", icon: Trophy, color: "from-blue-600 to-indigo-700" },
  { id: "sports", name: "Sports", icon: Trophy, color: "from-green-500 to-emerald-700" },
  { id: "celebrities", name: "Celebrities", icon: User, color: "from-purple-500 to-pink-600" },
  { id: "rappers", name: "Rappers", icon: Music, color: "from-yellow-400 to-orange-500" },
];

export default function CreateProject() {
  const [loading, setLoading] = useState(false);
  const [selectedNiche, setSelectedNiche] = useState("");
  const [customScript, setCustomScript] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleCreate = async () => {
    if (!selectedNiche) return;
    setLoading(true);
    try {
      const data = await createProject(selectedNiche, customScript);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const handleStartWorkflow = async () => {
    if (!result?.id) return;
    setLoading(true);
    try {
      await triggerWorkflow(result.id);
      alert("Success! Automation started. check back in a few minutes.");
      setResult(null);
      setSelectedNiche("");
      setCustomScript("");
    } catch (error) {
      console.error(error);
      alert("Failed to trigger workflow");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {!result ? (
        <>
          <h2 className="text-3xl font-bold text-white mb-6">Select a Niche</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {NICHES.map((niche) => (
              <button
                key={niche.id}
                onClick={() => setSelectedNiche(niche.id)}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                  selectedNiche === niche.id 
                    ? `bg-gradient-to-br ${niche.color} border-transparent text-white scale-105 shadow-xl` 
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <niche.icon size={32} />
                <span className="font-medium text-sm text-center">{niche.name}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-zinc-400">Custom Script (Optional)</label>
            <textarea
              value={customScript}
              onChange={(e) => setCustomScript(e.target.value)}
              placeholder="Paste your own script here or let AI generate one..."
              className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={!selectedNiche || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
            Generate Script & Metadata
          </button>
        </>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">Review Project</h3>
            <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-500/20">
              Draft Created
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Generated Title</h4>
            <p className="text-lg text-white font-semibold">{result.titles?.[0] || "No title"}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Script</h4>
            <div className="bg-black/50 rounded-xl p-4 text-zinc-300 text-sm leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap">
              {result.script}
            </div>
          </div>

          <div className="flex gap-4">
            <button
               onClick={() => setResult(null)}
               className="flex-1 border border-zinc-800 hover:bg-zinc-800 text-white font-bold py-3 rounded-xl transition-all"
            >
              Back
            </button>
            <button
              onClick={handleStartWorkflow}
              disabled={loading}
              className="flex-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/20"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Video size={20} />}
              Start Video Workflow
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
