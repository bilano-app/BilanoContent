import React from 'react';
import { 
  Sparkles, 
  BookMarked, 
  BarChart3, 
  Database, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useBilanoStore } from '../store/useBilanoStore';
import type { NavigationMenu } from '../types/database';

interface MenuItem {
  id: NavigationMenu;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  badge?: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'generator',
    label: 'Generator Konten',
    sublabel: 'Alur Magic AI 6-Slide',
    icon: Sparkles,
    badge: 'RAG',
  },
  {
    id: 'pustaka',
    label: 'Pustaka Referensi',
    sublabel: 'FYP Swipe File & Hook',
    icon: BookMarked,
  },
  {
    id: 'analitik',
    label: 'Analitik & Pembelajaran',
    sublabel: 'Feedback Loop Performa',
    icon: BarChart3,
  },
];

export const Sidebar: React.FC<{ mobileOpen?: boolean; onCloseMobile?: () => void }> = ({
  mobileOpen = false,
  onCloseMobile,
}) => {
  const { activeMenu, setActiveMenu, pustakaList, kontenList } = useBilanoStore();

  const handleSelect = (id: NavigationMenu) => {
    setActiveMenu(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-emerald-950/20 bg-[#0c241e] text-emerald-50 transition-transform duration-300 lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-20 items-center justify-between border-b border-emerald-900/40 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-emerald-950 shadow-lg shadow-emerald-950/40 font-black text-xl tracking-tighter">
            b/
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg font-bold tracking-tight text-white">Bilano</span>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-300">
                STUDIO
              </span>
            </div>
            <p className="font-mono text-[10px] text-emerald-400/70 uppercase tracking-wider">
              AI Content Factory
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="px-3 pb-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-400/60 font-semibold">
            Menu Utama
          </p>
        </div>

        <nav className="space-y-1.5" aria-label="Navigasi Studio">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isSelected = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left transition-all duration-200 ${
                  isSelected
                    ? 'bg-emerald-800/60 text-white shadow-sm ring-1 ring-emerald-400/30'
                    : 'text-emerald-200/75 hover:bg-emerald-900/40 hover:text-white'
                }`}
                data-testid={`menu-${item.id}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-emerald-400 text-emerald-950'
                        : 'bg-emerald-900/50 text-emerald-300 group-hover:bg-emerald-800 group-hover:text-emerald-200'
                    }`}
                  >
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold tracking-tight">{item.label}</p>
                    <p className="truncate text-[11px] text-emerald-400/60">{item.sublabel}</p>
                  </div>
                </div>

                {item.badge && (
                  <span className="rounded bg-emerald-400/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-300">
                    {item.badge}
                  </span>
                )}
                {isSelected && !item.badge && (
                  <ChevronRight size={14} className="text-emerald-400 shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Database & Model Status Widget */}
        <div className="mt-8 rounded-2xl border border-emerald-900/50 bg-emerald-950/40 p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">
              Infrastruktur RAG
            </span>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
          </div>

          <div className="mt-3 space-y-2 text-[11px] text-emerald-300/80">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-400/70">
                <Cpu size={13} /> LLM Model
              </span>
              <span className="font-mono font-medium text-white">Gemini 1.5 Flash</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-400/70">
                <Layers size={13} /> Panel Engine
              </span>
              <span className="font-mono font-medium text-white">Segmind IP-Adapter</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-400/70">
                <Database size={13} /> PostgreSQL
              </span>
              <span className="font-mono font-medium text-emerald-300">Supabase Connected</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-emerald-900/60 pt-3 text-center">
            <div className="rounded-lg bg-emerald-900/30 p-2">
              <p className="font-serif text-base font-bold text-white">{pustakaList.length}</p>
              <p className="text-[10px] text-emerald-400/70">Referensi FYP</p>
            </div>
            <div className="rounded-lg bg-emerald-900/30 p-2">
              <p className="font-serif text-base font-bold text-white">{kontenList.length}</p>
              <p className="text-[10px] text-emerald-400/70">Konten Terbuat</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Profile / Character Persona */}
      <div className="border-t border-emerald-900/40 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-emerald-950/60 p-2.5">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-emerald-400/40 bg-emerald-800">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              alt="Mascot Bilano"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-white">Maskot Bilano (Hoodie Hijau)</p>
            <p className="truncate font-mono text-[10px] text-emerald-400/70">IP-Adapter Face Locked</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
