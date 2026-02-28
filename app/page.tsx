"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

// --- TRANSLATION SYSTEM ---
const FLAGS: Record<string, string> = {
  de: "🇨🇭",
  en: "🇬🇧",
  tr: "🇹🇷",
  es: "🇪🇸",
  it: "🇮🇹",
  fr: "🇫🇷",
};

const LANGS = ["de", "en", "tr", "es", "it", "fr"] as const;
type Lang = typeof LANGS[number];

// -- Neuen Auth-Übersetzungen ergänzen
const translations: Record<Lang, Record<string, string>> = {
  de: {
    fokus: "Fokus.",
    kraft: "Kraft.",
    deineZiele: "Deine Ziele für heute",
    trainingsplan: "Trainingsplan & Performance",
    tasks: "Aufgaben",
    fitness: "Fitness",
    neuetodo: "Neues To-Do hinzufügen…",
    hinzufuegen: "Hinzufügen",
    nochKeineTodos: "Noch keine To-Dos.",
    laedt: "Lädt…",
    erledigt: "Erledigt",
    nochOffen: "Noch offen",
    loeschen: "Löschen",
    baldFitness: "Bald verfügbar: Fitness-Modul",
    systemV: "System v1",
    e2e: "End-to-End verschlüsselt via Supabase",
    email: "Email",
    passwort: "Passwort",
    login: "Login",
    registrieren: "Registrieren",
    logout: "Logout",
    keinAccount: "Noch kein Account?",
    schonAccount: "Schon einen Account?",
    authFehler: "Fehler bei der Anmeldung.",
  },
  en: {
    fokus: "Focus.",
    kraft: "Strength.",
    deineZiele: "Your goals for today",
    trainingsplan: "Workout Plan & Performance",
    tasks: "Tasks",
    fitness: "Fitness",
    neuetodo: "Add new to-do…",
    hinzufuegen: "Add",
    nochKeineTodos: "No to-dos yet.",
    laedt: "Loading…",
    erledigt: "Completed",
    nochOffen: "Not completed",
    loeschen: "Delete",
    baldFitness: "Coming soon: Fitness module",
    systemV: "System v1",
    e2e: "End-to-end encrypted via Supabase",
    email: "Email",
    passwort: "Password",
    login: "Login",
    registrieren: "Register",
    logout: "Logout",
    keinAccount: "No account yet?",
    schonAccount: "Already have an account?",
    authFehler: "Login failed.",
  },
  tr: {
    fokus: "Odak.",
    kraft: "Güç.",
    deineZiele: "Bugünün hedeflerin",
    trainingsplan: "Antrenman Planı & Performans",
    tasks: "Görevler",
    fitness: "Fitness",
    neuetodo: "Yeni yapılacak ekle…",
    hinzufuegen: "Ekle",
    nochKeineTodos: "Henüz yapılacak yok.",
    laedt: "Yükleniyor…",
    erledigt: "Tamamlandı",
    nochOffen: "Henüz tamamlanmadı",
    loeschen: "Sil",
    baldFitness: "Yakında: Fitness modülü",
    systemV: "Sistem v1",
    e2e: "Supabase ile uçtan uca şifreli",
    email: "Email",
    passwort: "Parola",
    login: "Giriş Yap",
    registrieren: "Kayıt Ol",
    logout: "Çıkış Yap",
    keinAccount: "Hesabın yok mu?",
    schonAccount: "Zaten hesabın var mı?",
    authFehler: "Giriş başarısız.",
  },
  es: {
    fokus: "Enfoque.",
    kraft: "Fuerza.",
    deineZiele: "Tus objetivos para hoy",
    trainingsplan: "Plan de Entrenamiento & Rendimiento",
    tasks: "Tareas",
    fitness: "Fitness",
    neuetodo: "Añadir nueva tarea…",
    hinzufuegen: "Añadir",
    nochKeineTodos: "Aún no hay tareas.",
    laedt: "Cargando…",
    erledigt: "Completado",
    nochOffen: "Pendiente",
    loeschen: "Eliminar",
    baldFitness: "Próximamente: Módulo de fitness",
    systemV: "Sistema v1",
    e2e: "Encriptado de extremo a extremo vía Supabase",
    email: "Email",
    passwort: "Contraseña",
    login: "Iniciar sesión",
    registrieren: "Registrarse",
    logout: "Cerrar sesión",
    keinAccount: "¿Sin cuenta?",
    schonAccount: "¿Ya tienes cuenta?",
    authFehler: "Fallo al iniciar sesión.",
  },
  it: {
    fokus: "Focus.",
    kraft: "Forza.",
    deineZiele: "I tuoi obiettivi per oggi",
    trainingsplan: "Piano d’allenamento & Performance",
    tasks: "Compiti",
    fitness: "Fitness",
    neuetodo: "Aggiungi nuovo task…",
    hinzufuegen: "Aggiungi",
    nochKeineTodos: "Nessun task ancora.",
    laedt: "Caricamento…",
    erledigt: "Completato",
    nochOffen: "Non completato",
    loeschen: "Elimina",
    baldFitness: "In arrivo: Modulo fitness",
    systemV: "Sistema v1",
    e2e: "Cifrato end-to-end via Supabase",
    email: "Email",
    passwort: "Password",
    login: "Login",
    registrieren: "Registrati",
    logout: "Logout",
    keinAccount: "Nessun account?",
    schonAccount: "Hai già un account?",
    authFehler: "Errore di login.",
  },
  fr: {
    fokus: "Focus.",
    kraft: "Force.",
    deineZiele: "Tes objectifs pour aujourd'hui",
    trainingsplan: "Plan d’entraînement & Performance",
    tasks: "Tâches",
    fitness: "Fitness",
    neuetodo: "Ajouter une nouvelle tâche…",
    hinzufuegen: "Ajouter",
    nochKeineTodos: "Pas encore de tâches.",
    laedt: "Chargement…",
    erledigt: "Terminé",
    nochOffen: "Non terminé",
    loeschen: "Supprimer",
    baldFitness: "Bientôt disponible : module fitness",
    systemV: "Système v1",
    e2e: "Chiffré de bout en bout via Supabase",
    email: "Email",
    passwort: "Mot de passe",
    login: "Connexion",
    registrieren: "S'inscrire",
    logout: "Déconnexion",
    keinAccount: "Pas encore de compte ?",
    schonAccount: "Déjà un compte ?",
    authFehler: "Échec de la connexion.",
  },
};

type TodoFromDB = {
  id: number;
  title: string;
  is_completed: boolean;
  created_at: string;
  user_id?: string; // für später
};

// SVG Trash Icon (Reacts to color / opacity via props)
const TrashIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block" }}
    aria-hidden="true"
  >
    <polyline points="6.5 7.5 6.5 16.5" />
    <polyline points="10 7.5 10 16.5" />
    <polyline points="13.5 7.5 13.5 16.5" />
    <rect x="4" y="4.8" width="12" height="2.5" rx="1.2" fill="currentColor" opacity="0" />
    <rect x="3.3" y="4.8" width="13.4" height="11.2" rx="2.1" stroke="currentColor" fill="none" />
    <rect x="7.2" y="1.7" width="5.6" height="2.3" rx="1.1" stroke="currentColor" fill="none" />
  </svg>
);

// Neuer, schmaler, schlichter Plus-Icon
function PlusIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <line x1="10" y1="4.5" x2="10" y2="15.5" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="4.5" y1="10" x2="15.5" y2="10" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
}

// ---------- Auth View Komponente ----------
function AuthView({
  onLogin,
  darkMode,
  t,
}: {
  onLogin: () => void;
  darkMode: boolean;
  t: Record<string, string>;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Optimiertes minimalistisches Input und Button Design
  const inputClass = `w-full px-5 py-3 mb-4 rounded-2xl border-none outline-none text-base focus:ring-2 focus:ring-blue-500 transition-all font-medium ${
    darkMode
      ? "bg-[#232325] text-white placeholder-[#8E8E93]"
      : "bg-[#E5E5EA] text-black placeholder-[#8E8E93]"
    }`;

  const buttonClass = `w-full py-3 rounded-2xl mt-2 font-bold text-lg border-none shadow-md transition-all active:scale-98 ${
    darkMode
      ? "bg-white text-[#171717]"
      : "bg-black text-white"
    }`;

  // Hover-State für Login/Registrieren-Button
  const [hoverMainBtn, setHoverMainBtn] = useState(false);

  return (
    <div
      className={`p-10 rounded-[2.5rem] border shadow-2xl w-full max-w-[380px] mx-auto mt-12 ${
        darkMode ? "bg-[#1C1C1E] border-[#38383A]" : "bg-white border-[#D1D1D6]"
      } transition-all duration-500`}
    >
      <form className="flex flex-col gap-2" onSubmit={async (e) => {
        e.preventDefault();
        setErrorMsg(null);
        if (!email || !pw) {
          setErrorMsg(t.authFehler);
          return;
        }
        setLoading(true);
        try {
          let res;
          if (mode === "login") {
            res = await supabase.auth.signInWithPassword({
              email,
              password: pw,
            });
          } else {
            res = await supabase.auth.signUp({
              email,
              password: pw,
            });
          }
          if (res.error || !res.data?.user) {
            setErrorMsg(t.authFehler);
            setLoading(false);
            return;
          }
          setTimeout(() => {
            setLoading(false);
            onLogin();
          }, 640);
        } catch (e) {
          setErrorMsg(t.authFehler);
          setLoading(false);
        }
      }}>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={t.email}
          className={inputClass}
          disabled={loading}
          required
          style={{
            cursor: "text", // Für input-Felder
            transition: "box-shadow 0.18s",
          }}
        />
        <input
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          value={pw}
          onChange={e => setPw(e.target.value)}
          placeholder={t.passwort}
          className={inputClass}
          disabled={loading}
          required
          style={{
            cursor: "text",
            transition: "box-shadow 0.18s",
          }}
        />
        <button
          type="submit"
          className={buttonClass}
          disabled={loading}
          onMouseEnter={() => setHoverMainBtn(true)}
          onMouseLeave={() => setHoverMainBtn(false)}
          style={{
            letterSpacing: ".04em",
            opacity: loading ? 0.7 : 1,
            marginTop: 2,
            fontWeight: 900,
            transition: "filter 0.18s, background 0.22s",
            cursor: "pointer",
            filter: hoverMainBtn
              ? (darkMode ? "brightness(0.95)" : "brightness(1.16)")
              : "none",
            background: darkMode
              ? hoverMainBtn
                ? "#ECECEE" // Leichtes Aufhellen
                : "#fff"
              : hoverMainBtn
                ? "#232325"
                : "#000",
            color: darkMode
              ? "#171717"
              : "#fff"
          }}
        >
          {mode === "login" ? t.login : t.registrieren}
        </button>
      </form>
      {errorMsg && (
        <div
          className="mt-4 text-center text-red-500 font-medium text-sm transition-all"
          aria-live="polite"
        >
          {errorMsg}
        </div>
      )}
      <div className="flex flex-col items-center gap-2 mt-6">
        <button
          type="button"
          className="text-sm underline opacity-65 hover:opacity-100 transition-all"
          onClick={() =>
            setMode(mode === "login" ? "register" : "login")
          }
          tabIndex={0}
          style={{
            cursor: "pointer",
            transition: "opacity 0.16s, color 0.22s",
            color: darkMode ? "#ECECEE" : "#232325",
          }}
        >
          {mode === "login"
            ? `${t.keinAccount} ${t.registrieren}`
            : `${t.schonAccount} ${t.login}`}
        </button>
      </div>
    </div>
  );
}

// ----------- START Home -----------
export default function Home() {
  // --- SPRACH- & DESIGN STATE ---
  const [lang, setLang] = useState<Lang>("de");
  const [langDropdown, setLangDropdown] = useState(false);

  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<"todo" | "fitness">("todo");

  // AUTH State
  const [user, setUser] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // TODO state
  const [todos, setTodos] = useState<TodoFromDB[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  const bgClass = darkMode ? "bg-black text-white" : "bg-[#F2F2F7] text-black";
  const cardClass = darkMode ? "bg-[#1C1C1E] border-[#38383A]" : "bg-white border-[#D1D1D6]";
  const navClass = darkMode ? "bg-black/60 border-[#38383A]" : "bg-white/60 border-[#D1D1D6]";
  const inputClass = `flex-1 px-5 py-4 rounded-2xl border-none outline-none text-base focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? "bg-[#2C2C2E] text-white placeholder-[#8E8E93]" : "bg-[#E5E5EA] text-black placeholder-[#8E8E93]"}`;
  const todoItemBase =
    "flex items-center gap-3 w-full rounded-2xl px-3 py-3 border transition-colors shadow-lg group mb-2 relative";
  const todoItemClass = darkMode
    ? `${todoItemBase} border-[#38383A] bg-[#232325] text-white`
    : `${todoItemBase} border-[#D1D1D6] bg-white text-black`;

  // -- TODO LOGIC: alle mit user_id!
  async function fetchTodos() {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("todos")
      .select("id, title, is_completed, created_at, user_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    if (!error && data) setTodos(data as TodoFromDB[]);
    setLoading(false);
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !user) return;
    const { data, error } = await supabase
      .from("todos")
      .insert([{ title: input.trim(), is_completed: false, user_id: user.id }])
      .select();
    if (!error && data && data[0]) {
      setTodos((todos) => [...todos, data[0]]);
      setInput("");
    }
  }

  async function toggleTodo(id: number, current: boolean) {
    if (!user) return;
    const { data, error } = await supabase
      .from("todos")
      .update({ is_completed: !current })
      .eq("id", id)
      .eq("user_id", user.id)
      .select();
    if (!error && data && data[0]) {
      setTodos((oldTodos) =>
        oldTodos.map((todo) =>
          todo.id === id ? { ...todo, is_completed: !current } : todo
        )
      );
    }
  }

  async function deleteTodo(id: number) {
    if (!user) return;
    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (!error) {
      setTodos((oldTodos) => oldTodos.filter((todo) => todo.id !== id));
    }
  }

  // AUTH MANAGEMENT
  useEffect(() => {
    let ignore = false;
    setAuthLoading(true);
    supabase.auth.getSession().then((res) => {
      if (!ignore) {
        setUser(res.data.session?.user ?? null);
        setAuthLoading(false);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      ignore = true;
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Fetch TODOS, Theme & Language
  useEffect(() => {
    if (user) fetchTodos();
    try {
      const stored = window.localStorage.getItem("darkMode");
      if (stored !== null) setDarkMode(JSON.parse(stored));
    } catch {}
    try {
      const langStored = window.localStorage.getItem("language");
      if (langStored && LANGS.includes(langStored as Lang)) setLang(langStored as Lang);
    } catch {}
  // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    try {
      window.localStorage.setItem("darkMode", JSON.stringify(darkMode));
    } catch {}
  }, [darkMode]);

  useEffect(() => {
    try {
      window.localStorage.setItem("language", lang);
    } catch {}
  }, [lang]);

  // --- Hover Styles for Todo Items ---
  const [hoveredTodoId, setHoveredTodoId] = useState<number | null>(null);
  // --- Hover State for Add Button ---
  const [hoverAdd, setHoverAdd] = useState(false);

  // Sprach Toggle oder Dropdown Logik
  function handleLangClick() {
    setLangDropdown((drop) => !drop);
  }
  function selectLang(l: Lang) {
    setLangDropdown(false);
    setLang(l);
  }

  // Outside Click zum Schließen des Dropdowns
  const langBtnRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!langDropdown) return;
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        langBtnRef.current &&
        !langBtnRef.current.contains(e.target as Node)
      ) {
        setLangDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [langDropdown]);

  // translations shortcut
  const t = translations[lang];

  // -- Logout
  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setTodos([]);
  }

  // Hover-State für Logout
  const [hoverLogout, setHoverLogout] = useState(false);

  // -- Home Render
  if (authLoading) {
    // Kleines minimalistisches Loader-Design
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgClass}`}>
        <span className="opacity-80 text-2xl">{t.laedt}</span>
      </div>
    );
  }

  if (!user) {
    // Zeige NUR Authview
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgClass}`}>
        <AuthView onLogin={() => { fetchTodos(); }} darkMode={darkMode} t={t} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full font-sans antialiased transition-colors duration-700 ${bgClass}`}>
      {/* NAVIGATION */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b pt-12 pb-4 px-6 flex justify-between items-center ${navClass}`}>
        <span className="text-sm font-bold tracking-widest uppercase opacity-50">{t.systemV}</span>
        {/* Tabs */}
        <div className="flex bg-gray-500/10 p-1 rounded-xl items-center">
          <button 
            onClick={() => setActiveTab("todo")}
            className={`px-5 py-1.5 text-sm font-semibold rounded-lg transition-all ${activeTab === "todo" ? (darkMode ? "bg-[#3A3A3C] shadow-lg" : "bg-white shadow-sm") : "opacity-40"}`}
            style={{ cursor: "pointer" }}
          >
            {t.tasks}
          </button>
          <button 
            onClick={() => setActiveTab("fitness")}
            className={`px-5 py-1.5 text-sm font-semibold rounded-lg transition-all ${activeTab === "fitness" ? (darkMode ? "bg-[#3A3A3C] shadow-lg" : "bg-white shadow-sm") : "opacity-40"}`}
            style={{ cursor: "pointer" }}
          >
            {t.fitness}
          </button>
        </div>
        <div className="flex gap-2 items-center relative">
          {/* Sprach-Button */}
          <button
            ref={langBtnRef}
            onClick={handleLangClick}
            className="hover:opacity-60 transition-opacity backdrop-blur-lg"
            aria-label="Sprache"
            style={{
              cursor: "pointer",
              fontSize: "1.75rem",
              width: "2.2rem",
              height: "2.2rem",
              borderRadius: "0.7rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              userSelect: "none",
              border: "none",
              background: darkMode ? "rgba(25,25,25,0.7)" : "rgba(255,255,255,0.7)"
            }}
          >
            {FLAGS[lang]}
          </button>
          {langDropdown && (
            <div
              ref={dropdownRef}
              className={`absolute top-[2.6rem] right-0 z-10 rounded-xl shadow-lg border ${darkMode ? "bg-[#232325] border-[#38383A]" : "bg-white border-[#D1D1D6]"}`}
            >
              <ul className="py-1 min-w-[142px]" style={{fontSize:"1.16rem"}}>
                {LANGS.map(l => (
                  <li key={l} style={{cursor: 'pointer'}}>
                    <button
                      className={`flex items-center gap-2 px-4 py-2 w-full text-left rounded-lg transition-all ${
                        l === lang
                          ? darkMode
                            ? "bg-[#3A3A3C]"
                            : "bg-gray-200"
                          : "hover:bg-gray-100"
                      } ${darkMode ? "text-white" : "text-black"}`}
                      style={{
                        fontWeight: l === lang ? 700 : undefined,
                        opacity: l === lang ? 1 : 0.8,
                        cursor: l === lang ? "default" : "pointer"
                      }}
                      onClick={() => l !== lang && selectLang(l)}
                      tabIndex={0}
                    >
                      <span style={{fontSize:"1.25rem"}}>{FLAGS[l]}</span>
                      <span>
                        {{
                          de: "Deutsch",
                          en: "English",
                          tr: "Türkçe",
                          es: "Español",
                          it: "Italiano",
                          fr: "Français"
                        }[l]}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Darkmode Button */}
          <button
            onClick={() => setDarkMode((d) => !d)}
            className="hover:opacity-60 transition-opacity backdrop-blur-lg"
            style={{
              cursor: 'pointer',
              fontSize: "1.75rem",
              width: "2.2rem",
              height: "2.2rem",
              borderRadius: "0.7rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              background: darkMode ? "rgba(25,25,25,0.7)" : "rgba(255,255,255,0.7)"
            }}
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            onMouseEnter={() => setHoverLogout(true)}
            onMouseLeave={() => setHoverLogout(false)}
            className="ml-3 px-4 py-1 rounded-lg font-semibold text-sm transition-colors"
            style={{
              fontWeight: 900,
              letterSpacing: ".02em",
              marginLeft: 16,
              minWidth: 90,
              background: darkMode
                ? hoverLogout
                  ? "#232325"
                  : "#1C1C1E"
                : hoverLogout
                  ? "#232325"
                  : "#fff",
              color: darkMode ? "#fff" : "#232325",
              opacity: hoverLogout ? 1 : 0.5,
              border: "none",
              boxShadow: darkMode && hoverLogout ? "0 1px 8px 0 #27272a22" : undefined,
              cursor: "pointer",
              transition: "background 0.18s, color 0.18s, opacity 0.18s",
            }}
          >
            {t.logout}
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="max-w-[480px] mx-auto pt-40 px-6 min-h-[70vh]">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold tracking-tighter mb-2 italic">
            {activeTab === "todo" ? t.fokus : t.kraft}
          </h1>
          <p className="text-[#8E8E93] font-medium uppercase tracking-[0.2em] text-[10px]">
            {activeTab === "todo" ? t.deineZiele : t.trainingsplan}
          </p>
        </header>
        
        {/* CARD */}
        <div className={`p-10 rounded-[2.5rem] border shadow-2xl ${cardClass} transition-all duration-500`}>
          {activeTab === "todo" && (
            <div>
              {/* To-Do Eingabe */}
              <form
                className="flex items-center mb-8 gap-3 justify-center"
                onSubmit={addTodo}
              >
                <input
                  type="text"
                  value={input}
                  maxLength={120}
                  onChange={e => setInput(e.target.value)}
                  className={inputClass}
                  style={{ minWidth: 0 }}
                  placeholder={t.neuetodo}
                  autoComplete="off"
                  disabled={loading}
                />
                <button
                  type="submit"
                  aria-label={t.hinzufuegen}
                  disabled={loading}
                  className={`flex items-center justify-center rounded-2xl focus:outline-none transition active:scale-95 shadow-sm border
                    ${darkMode
                      ? "bg-white border-white shadow-lg"
                      : "bg-black border-black shadow-lg"
                    }
                  `}
                  style={{
                    width: "3.3rem",
                    height: "3.3rem",
                    minWidth: "3.3rem",
                    minHeight: "3.3rem",
                    fontWeight: 900,
                    fontSize: "1.85rem",
                    lineHeight: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    background: hoverAdd
                      ? darkMode
                          ? "#ECECEE"
                          : "#232325"
                      : darkMode
                        ? "#fff"
                        : "#000",
                    borderColor: darkMode ? "#fff" : "#000",
                    transition: "background 0.18s, border 0.18s, color 0.16s",
                  }}
                  onMouseEnter={() => setHoverAdd(true)}
                  onMouseLeave={() => setHoverAdd(false)}
                >
                  <span
                    className="pointer-events-none select-none flex items-center justify-center"
                    style={{
                      color: darkMode ? "#171717" : "#fff",
                      width: "100%",
                      height: "100%",
                      fontWeight: 400,
                      fontSize: "1.35rem",
                      lineHeight: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "-1px"
                    }}
                  >
                    <PlusIcon color={darkMode ? "#171717" : "#fff"} />
                  </span>
                </button>
              </form>
              {/* LISTE */}
              <ul className="flex flex-col w-full">
                {loading ? (
                  <li className="italic text-[#8E8E93] py-6 text-center text-[16px]">{t.laedt}</li>
                ) : todos.length === 0 ? (
                  <li className="italic text-[#8E8E93] py-6 text-center text-[16px]">{t.nochKeineTodos}</li>
                ) : (
                  todos.map(todo => {
                    // --- HOVER VISUAL FEEDBACK for TODO ITEM ---
                    let hoverBg: string | undefined;
                    let hoverBorderColor: string | undefined;
                    if (hoveredTodoId === todo.id) {
                      if (
                        (todo.is_completed && darkMode) ||
                        (!todo.is_completed && !darkMode)
                      ) {
                        hoverBg = "#F3F3F3";
                        hoverBorderColor = "#F3F3F3";
                      } else {
                        hoverBg = "#1A1A1A";
                        hoverBorderColor = "#1A1A1A";
                      }
                    }
                    const baseBg =
                      todo.is_completed
                        ? (darkMode ? "#fff" : "#111")
                        : (darkMode ? "#232325" : "#fff");
                    const baseBorder =
                      todo.is_completed
                        ? (darkMode ? "#fff" : "#111")
                        : (darkMode ? "#38383A" : "#D1D1D6");
                    return (
                      <li
                        key={todo.id}
                        className={`${todoItemClass} px-4 py-2`}
                        style={{
                          background: hoverBg || baseBg,
                          borderColor: hoverBorderColor || baseBorder,
                          transition: "background 0.22s, border-color 0.22s, color 0.16s",
                          opacity: 1,
                          boxShadow: (todo.is_completed ? undefined : (darkMode ? "0 4px 32px 0 rgba(60,60,60,0.10)" : "0 4px 32px 0 rgba(180,180,185,0.06)")),
                          cursor: "pointer"
                        }}
                        onMouseEnter={() => setHoveredTodoId(todo.id)}
                        onMouseLeave={() => setHoveredTodoId(null)}
                      >
                        {/* Apple-style Checkbox */}
                        <button
                          type="button"
                          aria-label={todo.is_completed ? t.erledigt : t.nochOffen}
                          className="flex items-center justify-center mr-3 shrink-0 rounded-xl transition-all duration-200"
                          onClick={() => toggleTodo(todo.id, todo.is_completed)}
                          tabIndex={0}
                          style={{
                            width: 32,
                            height: 32,
                            background: todo.is_completed
                              ? (darkMode ? "#fff" : "#111")
                              : "transparent",
                            border: todo.is_completed
                              ? "2px solid " + (darkMode ? "#fff" : "#111")
                              : (darkMode ? "2px solid #5c5c67" : "2px solid #B8B8BD"),
                            cursor: "pointer",
                            boxShadow: todo.is_completed
                              ? (darkMode ? "0 1px 6px 1px #fff1" : "0 1px 6px 1px #1111")
                              : undefined,
                            transition: "all 0.2s"
                          }}
                          onKeyPress={e => {
                            if (e.key === " " || e.key === "Enter") toggleTodo(todo.id, todo.is_completed);
                          }}
                        >
                          {todo.is_completed ? (
                            <svg
                              width="22"
                              height="22"
                              viewBox="0 0 22 22"
                              fill="none"
                              style={{ display: "block" }}
                            >
                              <path
                                d="M5.7 11.5L9.5 15.3L16.2 8.2"
                                stroke={darkMode ? "#111" : "#fff"}
                                strokeWidth="3.1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : null}
                        </button>
                        {/* Titel */}
                        <span
                          className="flex-1 select-none pl-1 text-base flex items-center"
                          style={{
                            textDecoration: todo.is_completed ? "line-through" : "none",
                            color:
                              todo.is_completed
                                ? (darkMode ? "#232325" : "#fff")
                                : undefined,
                            opacity: todo.is_completed ? 0.68 : 1,
                            transition: "opacity .25s, color 0.16s",
                            cursor: "pointer",
                            justifyContent: 'center'
                          }}
                          onClick={() => toggleTodo(todo.id, todo.is_completed)}
                          tabIndex={0}
                          onKeyPress={e => {
                            if (e.key === " " || e.key === "Enter") toggleTodo(todo.id, todo.is_completed);
                          }}
                        >
                          {todo.title}
                        </span>
                        {/* Löschen */}
                        <button
                          aria-label={t.loeschen}
                          title={t.loeschen}
                          onClick={() => deleteTodo(todo.id)}
                          className="ml-2 flex items-center justify-center px-2 py-2 rounded-lg transition focus:outline-none"
                          style={{
                            minWidth: "2.5rem",
                            opacity: 0.2,
                            color: "#e00",
                            transition: "color 0.2s, opacity 0.2s",
                            cursor: "pointer",
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.color = "#e00";
                            (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.color = "#e00";
                            (e.currentTarget as HTMLButtonElement).style.opacity = "0.2";
                          }}
                        >
                          <TrashIcon />
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          )}
          {activeTab === "fitness" && (
            <div className="flex flex-col items-center min-h-[320px] justify-center py-12 text-center text-xl italic text-[#8E8E93]">
              {t.baldFitness}
            </div>
          )}
        </div>
        {/* FOOTER */}
        <footer className="mt-12 text-center opacity-30 text-[10px] uppercase tracking-widest">
          {t.e2e}
        </footer>
      </main>
    </div>
  );
}