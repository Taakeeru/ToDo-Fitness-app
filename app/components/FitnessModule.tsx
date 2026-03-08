"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";

type T = Record<string, string>;

type FitnessExercise = {
  id: string;
  user_id: string;
  name: string;
  weight: string | null;
  current_set: string | null;
  total_sets: string | null;
  sets: string | null;
  reps_per_set: string | null;
};

// ... Icons (TrashIcon, PlusIcon) bleiben identisch ...
const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }} aria-hidden="true">
    <polyline points="6.5 7.5 6.5 16.5" /><polyline points="10 7.5 10 16.5" /><polyline points="13.5 7.5 13.5 16.5" />
    <rect x="3.3" y="4.8" width="13.4" height="11.2" rx="2.1" stroke="currentColor" fill="none" />
    <rect x="7.2" y="1.7" width="5.6" height="2.3" rx="1.1" stroke="currentColor" fill="none" />
  </svg>
);

function PlusIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" aria-hidden="true">
      <line x1="10" y1="4.5" x2="10" y2="15.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="4.5" y1="10" x2="15.5" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const inputCell = "border border-black/10 dark:border-white/15 rounded-2xl px-2 py-2 text-center min-w-0 w-full bg-black/[0.04] dark:bg-white/[0.06] outline-none transition-colors focus:border-black/25 dark:focus:border-white/30 focus:bg-black/[0.06] dark:focus:bg-white/[0.1]";

export default function FitnessModule({ user, darkMode, t }: { user: any; darkMode: boolean; t: T }) {
  const [exercises, setExercises] = useState<FitnessExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const fetchExercises = useCallback(async () => {
    if (!user) {
      setExercises([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    // FIX: 'sets' wurde hier im select hinzugefügt
    const { data, error } = await supabase
      .from("fitness_exercises")
      .select("id, user_id, name, weight, current_set, total_sets, sets, reps_per_set")
      .eq("user_id", user.id)
      .order("id", { ascending: true });

    if (!error && data) {
      setExercises(data.map((r: any) => ({
        ...r,
        id: String(r.id),
        name: r.name ?? "",
      })));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchExercises(); }, [fetchExercises]);

  function scheduleSave(id: string, patch: Partial<FitnessExercise>) {
    if (saveTimers.current[id]) clearTimeout(saveTimers.current[id]);
    saveTimers.current[id] = setTimeout(async () => {
      await supabase
        .from("fitness_exercises")
        .update(patch)
        .eq("id", id)
        .eq("user_id", user.id);
    }, 500);
  }

  async function addExercise() {
    if (!user) return;
    const { data, error } = await supabase
      .from("fitness_exercises")
      .insert([{ user_id: user.id, name: "", weight: "", current_set: "", total_sets: "", sets: "", reps_per_set: "" }])
      .select()
      .single();
    if (!error && data) setExercises(prev => [...prev, data]);
  }

  async function deleteExercise(id: string) {
    const { error } = await supabase.from("fitness_exercises").delete().eq("id", id);
    if (!error) setExercises(prev => prev.filter(e => e.id !== id));
  }

  const textMuted = "text-[#8E8E93]";
  const textMain = darkMode ? "text-white" : "text-black";
  const borderCard = darkMode ? "border-white" : "border-black";

  if (!user) return <div className="py-12 text-center opacity-50">Loading...</div>;

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <button onClick={addExercise} className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${borderCard}`}>
        <PlusIcon color={darkMode ? "#fff" : "#000"} />
      </button>

      <div className="w-full mt-6 space-y-5">
        {exercises.map((ex) => (
          <div 
            key={ex.id} 
            className={`relative rounded-[2rem] border-2 px-6 py-8 transition-colors ${borderCard}`}
            onMouseEnter={() => setHoveredCardId(ex.id)}
            onMouseLeave={() => setHoveredCardId(null)}
            style={{ backgroundColor: hoveredCardId === ex.id ? (darkMode ? "#2C2C2E" : "#F5F5F7") : (darkMode ? "#1C1C1E" : "#fff") }}
          >
            <button 
              onClick={() => deleteExercise(ex.id)}
              className="absolute top-4 right-4 text-red-500 opacity-40 hover:opacity-100 transition-opacity"
            >
              <TrashIcon />
            </button>

            <input
              className={`w-full text-center text-xl font-bold mb-6 bg-transparent outline-none ${textMain}`}
              value={ex.name}
              onChange={(e) => {
                const v = e.target.value;
                setExercises(prev => prev.map(x => x.id === ex.id ? { ...x, name: v } : x));
                scheduleSave(ex.id, { name: v });
              }}
              placeholder="Übung"
            />

            <div className="grid grid-cols-2 gap-4 mb-4">
               <div className="flex flex-col items-center">
                  <span className={`text-[10px] uppercase ${textMuted}`}>{t.sitz || "Sitz"}</span>
                  <div className="flex items-center gap-1">
                    <input className={inputCell} value={ex.current_set ?? ""} onChange={e => {
                      const v = e.target.value;
                      setExercises(prev => prev.map(x => x.id === ex.id ? { ...x, current_set: v } : x));
                      scheduleSave(ex.id, { current_set: v });
                    }} />
                    <span className={textMain}>/</span>
                    <input className={inputCell} value={ex.total_sets ?? ""} onChange={e => {
                      const v = e.target.value;
                      setExercises(prev => prev.map(x => x.id === ex.id ? { ...x, total_sets: v } : x));
                      scheduleSave(ex.id, { total_sets: v });
                    }} />
                  </div>
               </div>
               <div className="flex flex-col items-center">
                  <span className={`text-[10px] uppercase ${textMuted}`}>{t.gewicht || "Gewicht"}</span>
                  <input className={inputCell} value={ex.weight ?? ""} onChange={e => {
                    const v = e.target.value;
                    setExercises(prev => prev.map(x => x.id === ex.id ? { ...x, weight: v } : x));
                    scheduleSave(ex.id, { weight: v });
                  }} />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="flex flex-col items-center">
                  <span className={`text-[10px] uppercase ${textMuted}`}>{t.saetze || "Sätze"}</span>
                  <input className={inputCell} value={ex.sets ?? ""} onChange={e => {
                    const v = e.target.value;
                    setExercises(prev => prev.map(x => x.id === ex.id ? { ...x, sets: v } : x));
                    scheduleSave(ex.id, { sets: v });
                  }} />
               </div>
               <div className="flex flex-col items-center">
                  <span className={`text-[10px] uppercase ${textMuted}`}>{t.wdh || "Wdh."}</span>
                  <input className={inputCell} value={ex.reps_per_set ?? ""} onChange={e => {
                    const v = e.target.value;
                    setExercises(prev => prev.map(x => x.id === ex.id ? { ...x, reps_per_set: v } : x));
                    scheduleSave(ex.id, { reps_per_set: v });
                  }} />
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}