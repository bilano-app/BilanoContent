import { type ChangeEvent, type DragEvent, type ReactNode, useMemo, useRef, useState } from 'react';
import { BarChart3, BookOpen, Check, ChevronRight, CircleHelp, Download, FileText, FolderOpen, Gauge, ImagePlus, Lightbulb, Menu, MoreHorizontal, PenLine, Plus, RefreshCw, Search, Send, Sparkles, Trash2, TrendingUp, UploadCloud, WandSparkles, X, Zap } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

const queryClient = new QueryClient();

type Surface = 'generator' | 'library' | 'analytics';
type StorySlide = { id: number; eyebrow: string; title: string; copy: string; visual: string; color: string };
type Reference = { id: number; title: string; source: string; format: string; why: string; date: string; accent: string };
type Metric = { reach: string; likes: string; saves: string; shares: string };

const navItems: { id: Surface; label: string; detail: string; icon: typeof WandSparkles }[] = [
  { id: 'generator', label: 'Content generator', detail: 'Turn an idea into a story', icon: WandSparkles },
  { id: 'library', label: 'Reference library', detail: 'Your swipe file, sorted', icon: BookOpen },
  { id: 'analytics', label: 'Analytics & learning', detail: 'Find what is working', icon: BarChart3 },
];

const initialSlides: StorySlide[] = [
  { id: 1, eyebrow: 'The hook', title: 'Your content calendar is lying to you.', copy: 'Consistency is not the same as momentum. Here is the quieter signal worth tracking instead.', visual: 'High-contrast title on a field of deep evergreen.', color: 'evergreen' },
  { id: 2, eyebrow: 'The tension', title: 'More posts can mean less attention.', copy: 'When every idea gets rushed onto the feed, your strongest point never gets the room it needs.', visual: 'One small mark surrounded by generous space.', color: 'clay' },
  { id: 3, eyebrow: 'The reframe', title: 'Think in stories, not slots.', copy: 'A carousel gives one idea a beginning, a turn, and a useful landing. That is a better brief.', visual: 'A simple path connecting three moments.', color: 'mint' },
  { id: 4, eyebrow: 'The method', title: 'Start with one sharp question.', copy: 'What does your audience believe today — and what should they believe after the final slide?', visual: 'Oversized question mark, cropped at the edge.', color: 'ochre' },
  { id: 5, eyebrow: 'The proof', title: 'Small edits compound.', copy: 'Our strongest saves came from posts with one clear job, not five clever ideas competing for the caption.', visual: 'Stacked cards with one highlighted line.', color: 'teal' },
  { id: 6, eyebrow: 'The close', title: 'Make the next idea easier to find.', copy: 'Save this framework. Then use it before your next brainstorm gets noisy.', visual: 'A tidy library shelf of future ideas.', color: 'evergreen' },
];

const initialReferences: Reference[] = [
  { id: 1, title: 'The 4-second rule', source: 'studio-notes.com', format: 'Carousel', why: 'The opening is a tiny dare. It creates a gap the reader wants to close before they even know the topic.', date: 'Added 2 days ago', accent: 'mint' },
  { id: 2, title: 'A love letter to boring systems', source: 'Mina Park · LinkedIn', format: 'Text post', why: 'A contrarian first line meets a very practical payoff. The voice makes useful advice feel personal.', date: 'Added 5 days ago', accent: 'clay' },
  { id: 3, title: 'Things I stopped optimizing', source: 'Field Notes / issue 18', format: 'Newsletter', why: 'The list structure creates easy stopping points while the specific examples reward a slower read.', date: 'Added 1 week ago', accent: 'ochre' },
];

const initialMetrics: Record<number, Metric> = {
  1: { reach: '24,810', likes: '1,284', saves: '542', shares: '186' },
  2: { reach: '18,420', likes: '968', saves: '731', shares: '204' },
  3: { reach: '31,760', likes: '1,902', saves: '884', shares: '312' },
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Studio} />
        <Route path="/generator" component={Studio} />
        <Route path="/library" component={Studio} />
        <Route path="/analytics" component={Studio} />
        <Route component={Studio} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Studio() {
  const [location, setLocation] = useLocation();
  const [surface, setSurface] = useState<Surface>(() => location.includes('library') ? 'library' : location.includes('analytics') ? 'analytics' : 'generator');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [slides, setSlides] = useState(initialSlides);
  const [idea, setIdea] = useState('How to build a content system that makes your best ideas easier to repeat');
  const [isGenerating, setIsGenerating] = useState(false);
  const [visualState, setVisualState] = useState<'idle' | 'loading' | 'ready'>('idle');
  const [references, setReferences] = useState(initialReferences);
  const [referenceTitle, setReferenceTitle] = useState('');
  const [referenceWhy, setReferenceWhy] = useState('');
  const [uploadName, setUploadName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [savedMetrics, setSavedMetrics] = useState(initialMetrics);
  const [insight, setInsight] = useState('Posts with a clear reframe in slide three are earning 1.6× more saves than posts that lead with advice. Let the audience recognize the problem before you solve it.');
  const [savedInsight, setSavedInsight] = useState(insight);
  const fileInput = useRef<HTMLInputElement>(null);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  };

  const navigate = (next: Surface) => {
    setSurface(next);
    setLocation(next === 'generator' ? '/' : `/${next}`);
    setMobileOpen(false);
  };

  const generateScript = () => {
    setIsGenerating(true);
    window.setTimeout(() => {
      setSlides((current) => current.map((slide, index) => index === 0 ? { ...slide, title: 'Your best ideas deserve a home.', copy: 'A repeatable content system turns a good thought into a body of work.' } : slide));
      setIsGenerating(false);
      showToast('New six-slide script is ready to shape.');
    }, 900);
  };

  const updateSlide = (id: number, field: keyof StorySlide, value: string) => {
    setSlides((current) => current.map((slide) => slide.id === id ? { ...slide, [field]: value } : slide));
  };

  const generateVisuals = () => {
    setVisualState('loading');
    window.setTimeout(() => {
      setVisualState('ready');
      showToast('Visual direction generated for all six slides.');
    }, 1200);
  };

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploadName(file.name);
    showToast(`${file.name} is ready to add to your library.`);
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => handleFiles(event.target.files);
  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const addReference = () => {
    if (!referenceTitle.trim()) {
      showToast('Give this reference a name first.');
      return;
    }
    setReferences((current) => [{ id: Date.now(), title: referenceTitle.trim(), source: uploadName || 'Added by you', format: uploadName ? 'Uploaded file' : 'Web reference', why: referenceWhy.trim() || 'A strong example worth returning to when a story needs a clearer point of view.', date: 'Added just now', accent: 'teal' }, ...current]);
    setReferenceTitle('');
    setReferenceWhy('');
    setUploadName('');
    if (fileInput.current) fileInput.current.value = '';
    showToast('Reference added to the swipe file.');
  };

  const updateReference = (id: number, why: string) => {
    setReferences((current) => current.map((reference) => reference.id === id ? { ...reference, why } : reference));
  };

  const removeReference = (id: number) => {
    setReferences((current) => current.filter((reference) => reference.id !== id));
    showToast('Reference removed.');
  };

  const exportLibrary = () => {
    const data = JSON.stringify(references, null, 2);
    const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'bilano-reference-library.json';
    anchor.click();
    URL.revokeObjectURL(url);
    showToast('Library exported as a JSON file.');
  };

  const updateMetric = (id: number, field: keyof Metric, value: string) => {
    setMetrics((current) => ({ ...current, [id]: { ...current[id], [field]: value } }));
  };

  const saveAnalytics = () => {
    setSavedMetrics(metrics);
    setSavedInsight(insight);
    showToast('Learning notes and performance metrics saved.');
  };

  const activeTitle = navItems.find((item) => item.id === surface)?.label;

  return (
    <div className="texture min-h-[100dvh] bg-background text-foreground">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[286px] flex-col bg-sidebar px-5 py-6 text-sidebar-foreground transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`} aria-label="Main navigation">
        <div className="flex items-center justify-between px-2">
          <button className="focus-ring flex items-center gap-3 rounded-lg text-left" onClick={() => navigate('generator')} data-testid="button-brand-home">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground"><span className="text-lg font-bold tracking-[-0.12em]">b/</span></span>
            <span><span className="block text-[15px] font-bold tracking-[-0.03em]">bilano</span><span className="font-mono text-[9px] uppercase tracking-[0.18em] text-sidebar-foreground/55">content studio</span></span>
          </button>
          <button className="focus-ring rounded-md p-2 text-sidebar-foreground/65 hover:bg-sidebar-accent lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation" data-testid="button-close-navigation"><X size={18} /></button>
        </div>
        <div className="mt-12 px-2"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/40">Workspace</p></div>
        <nav className="mt-3 space-y-1" aria-label="Studio surfaces">
          {navItems.map((item) => {
            const Icon = item.icon;
            const selected = surface === item.id;
            return <button key={item.id} onClick={() => navigate(item.id)} className={`focus-ring group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 ${selected ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/65 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground'}`} aria-current={selected ? 'page' : undefined} data-testid={`nav-${item.id}`}>
              <span className={`grid h-9 w-9 place-items-center rounded-lg transition-colors ${selected ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'bg-sidebar-foreground/5 text-sidebar-foreground/65 group-hover:text-sidebar-primary'}`}><Icon size={17} strokeWidth={1.8} /></span>
              <span className="min-w-0"><span className="block text-[13px] font-semibold">{item.label}</span><span className="mt-0.5 block truncate text-[11px] text-sidebar-foreground/40">{item.detail}</span></span>
              {selected && <ChevronRight className="ml-auto text-sidebar-primary" size={15} />}
            </button>;
          })}
        </nav>
        <div className="mt-auto">
          <div className="rounded-2xl border border-sidebar-border bg-sidebar-accent/60 p-4">
            <div className="flex items-center justify-between"><span className="font-mono text-[10px] uppercase tracking-[0.16em] text-sidebar-foreground/45">Studio pulse</span><span className="h-2 w-2 rounded-full bg-sidebar-primary shadow-[0_0_0_4px_rgba(157,222,195,.12)]" /></div>
            <p className="mt-3 text-[13px] leading-5 text-sidebar-foreground/80">Your library is giving the team a sharper point of view.</p>
            <button onClick={() => navigate('library')} className="focus-ring mt-3 flex items-center gap-1 text-[12px] font-semibold text-sidebar-primary hover:gap-2 transition-all" data-testid="button-view-pulse">View library <ChevronRight size={14} /></button>
          </div>
          <div className="mt-5 flex items-center gap-3 border-t border-sidebar-border pt-5">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#d59b77] text-xs font-bold text-[#19352c]">MC</div>
            <div className="min-w-0"><p className="truncate text-[13px] font-semibold">Maya Chen</p><p className="font-mono text-[10px] text-sidebar-foreground/40">Content strategist</p></div>
            <button className="focus-ring ml-auto rounded-md p-1.5 text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground" onClick={() => showToast('Profile settings are coming soon.')} aria-label="Open profile settings" data-testid="button-profile-settings"><MoreHorizontal size={17} /></button>
          </div>
        </div>
      </aside>
      {mobileOpen && <button className="fixed inset-0 z-30 bg-[#102c26]/40 backdrop-blur-[2px] lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu" data-testid="button-menu-overlay" />}
      <main className="min-h-[100dvh] lg:pl-[286px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border/80 bg-background/90 px-5 backdrop-blur-md sm:px-8 lg:px-10">
          <div className="flex items-center gap-3"><button className="focus-ring rounded-lg p-2 hover:bg-muted lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation" data-testid="button-open-navigation"><Menu size={20} /></button><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Tuesday, October 15</p><p className="mt-0.5 text-[13px] font-semibold text-foreground/80">{activeTitle}</p></div></div>
          <div className="flex items-center gap-2 sm:gap-4"><button className="focus-ring hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground sm:flex" onClick={() => showToast('Search is ready for your next query.')} data-testid="button-search"><Search size={15} /> <span>Search studio</span><span className="font-mono text-[9px] text-muted-foreground/70">⌘ K</span></button><button className="focus-ring relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" onClick={() => showToast('You are all caught up.')} aria-label="View notifications" data-testid="button-notifications"><Zap size={18} strokeWidth={1.8} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#d47c5a]" /></button><div className="hidden h-7 w-px bg-border sm:block" /><div className="grid h-8 w-8 place-items-center rounded-full bg-[#d59b77] text-[10px] font-bold text-[#19352c] sm:h-9 sm:w-9">MC</div></div>
        </header>
        <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
          {surface === 'generator' && <GeneratorPage idea={idea} setIdea={setIdea} slides={slides} updateSlide={updateSlide} isGenerating={isGenerating} generateScript={generateScript} visualState={visualState} generateVisuals={generateVisuals} showToast={showToast} />}
          {surface === 'library' && <LibraryPage references={references} referenceTitle={referenceTitle} setReferenceTitle={setReferenceTitle} referenceWhy={referenceWhy} setReferenceWhy={setReferenceWhy} uploadName={uploadName} isDragging={isDragging} setIsDragging={setIsDragging} fileInput={fileInput} onFileChange={onFileChange} onDrop={onDrop} addReference={addReference} updateReference={updateReference} removeReference={removeReference} exportLibrary={exportLibrary} showToast={showToast} />}
          {surface === 'analytics' && <AnalyticsPage metrics={metrics} savedMetrics={savedMetrics} insight={insight} savedInsight={savedInsight} setInsight={setInsight} updateMetric={updateMetric} saveAnalytics={saveAnalytics} />}
        </div>
      </main>
      {toast && <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 animate-in items-center gap-2 rounded-full bg-sidebar px-4 py-2.5 text-xs font-semibold text-sidebar-foreground shadow-xl" role="status" data-testid="status-toast"><Check className="text-sidebar-primary" size={15} />{toast}</div>}
    </div>
  );
}

function SectionIntro({ eyebrow, title, description, action }: { eyebrow: string; title: ReactNode; description: string; action?: ReactNode }) {
  return <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div className="animate-in"><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">{eyebrow}</p><h1 className="mt-2 max-w-3xl font-serif text-[38px] leading-[.98] tracking-[-0.035em] text-foreground sm:text-[48px]">{title}</h1><p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">{description}</p></div>{action && <div className="animate-in animate-delay-1 shrink-0">{action}</div>}</div>;
}

function GeneratorPage({ idea, setIdea, slides, updateSlide, isGenerating, generateScript, visualState, generateVisuals, showToast }: { idea: string; setIdea: (value: string) => void; slides: StorySlide[]; updateSlide: (id: number, field: keyof StorySlide, value: string) => void; isGenerating: boolean; generateScript: () => void; visualState: 'idle' | 'loading' | 'ready'; generateVisuals: () => void; showToast: (message: string) => void }) {
  return <div>
    <SectionIntro eyebrow="Content generator / 01" title={<>Make the idea<br /><em className="text-primary">impossible to skim.</em></>} description="Shape a six-slide story with a clear point of view, then give every frame a job." action={<div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-[11px] font-semibold text-muted-foreground"><span className="grid h-5 w-5 place-items-center rounded-full bg-accent text-accent-foreground"><Check size={12} /></span> Draft saved 2m ago</div>} />
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,.65fr)]">
      <div className="space-y-6">
        <div className="soft-shadow animate-in rounded-2xl border border-card-border bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-primary">Start with a spark</p><h2 className="mt-1 text-lg font-semibold tracking-[-.02em]">What are we making today?</h2></div><span className="rounded-full bg-muted px-2.5 py-1 font-mono text-[10px] text-muted-foreground">Brief → script</span></div>
          <textarea value={idea} onChange={(event) => setIdea(event.target.value)} className="focus-ring mt-5 min-h-[102px] w-full resize-none rounded-xl border border-input bg-background/60 p-4 text-[15px] leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60" aria-label="Content idea" data-testid="textarea-content-idea" />
          <div className="mt-4 flex flex-col items-start justify-between gap-3 border-t border-border/80 pt-4 sm:flex-row sm:items-center"><p className="flex items-center gap-2 text-xs text-muted-foreground"><Sparkles size={14} className="text-primary" /> Keep it specific. The sharper the tension, the stronger the story.</p><button onClick={generateScript} disabled={isGenerating || !idea.trim()} className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60 sm:w-auto" data-testid="button-generate-script">{isGenerating ? <><RefreshCw className="animate-spin" size={15} /> Building story</> : <><WandSparkles size={15} /> Generate script</>}</button></div>
        </div>
        <div className="animate-in animate-delay-1">
          <div className="mb-3 flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Storyboard / 06 frames</p><p className="mt-1 text-xs text-muted-foreground">Write for the thumb, then refine for the save.</p></div><button onClick={() => showToast('Slide order is already doing good work.')} className="focus-ring rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Storyboard options" data-testid="button-storyboard-options"><MoreHorizontal size={18} /></button></div>
          <div className="grid gap-3 md:grid-cols-2">
            {slides.map((slide) => <SlideEditor key={slide.id} slide={slide} updateSlide={updateSlide} />)}
          </div>
        </div>
      </div>
      <div className="animate-in animate-delay-2">
        <FinalPreview visualState={visualState} generateVisuals={generateVisuals} showToast={showToast} />
      </div>
    </div>
  </div>;
}

function SlideEditor({ slide, updateSlide }: { slide: StorySlide; updateSlide: (id: number, field: keyof StorySlide, value: string) => void }) {
  const accent = slide.color === 'mint' ? 'bg-[#c8ead9]' : slide.color === 'clay' ? 'bg-[#e7b398]' : slide.color === 'ochre' ? 'bg-[#e5c875]' : slide.color === 'teal' ? 'bg-[#81c7bd]' : 'bg-primary';
  return <article className="group rounded-2xl border border-card-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_10px_24px_rgba(22,67,54,.06)]" data-testid={`card-slide-${slide.id}`}>
    <div className="flex items-start gap-3"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${accent} text-xs font-bold text-[#17382e]`}>{String(slide.id).padStart(2, '0')}</span><div className="min-w-0 flex-1"><input value={slide.eyebrow} onChange={(event) => updateSlide(slide.id, 'eyebrow', event.target.value)} className="focus-ring w-full bg-transparent font-mono text-[9px] uppercase tracking-[.16em] text-primary outline-none" aria-label={`Slide ${slide.id} label`} data-testid={`input-slide-eyebrow-${slide.id}`} /><input value={slide.title} onChange={(event) => updateSlide(slide.id, 'title', event.target.value)} className="focus-ring mt-1 w-full bg-transparent text-[15px] font-bold leading-5 tracking-[-.02em] outline-none" aria-label={`Slide ${slide.id} title`} data-testid={`input-slide-title-${slide.id}`} /></div><PenLine size={14} className="mt-1 text-muted-foreground/35 transition-colors group-hover:text-primary" /></div>
    <textarea value={slide.copy} onChange={(event) => updateSlide(slide.id, 'copy', event.target.value)} className="focus-ring mt-3 min-h-[64px] w-full resize-none bg-transparent text-xs leading-5 text-muted-foreground outline-none" aria-label={`Slide ${slide.id} copy`} data-testid={`textarea-slide-copy-${slide.id}`} />
    <div className="mt-3 flex items-start gap-2 border-t border-border/70 pt-3"><ImagePlus size={14} className="mt-0.5 shrink-0 text-muted-foreground/65" /><input value={slide.visual} onChange={(event) => updateSlide(slide.id, 'visual', event.target.value)} className="focus-ring min-w-0 flex-1 bg-transparent text-[11px] leading-4 text-muted-foreground outline-none" aria-label={`Slide ${slide.id} visual direction`} data-testid={`input-slide-visual-${slide.id}`} /></div>
  </article>;
}

function FinalPreview({ visualState, generateVisuals, showToast }: { visualState: 'idle' | 'loading' | 'ready'; generateVisuals: () => void; showToast: (message: string) => void }) {
  return <div className="soft-shadow sticky top-[94px] overflow-hidden rounded-2xl border border-card-border bg-card">
    <div className="flex items-center justify-between border-b border-border/80 px-5 py-4"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Output preview</p><h2 className="mt-1 text-base font-semibold">The repeatable idea</h2></div><button className="focus-ring rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => showToast('Preview options are open for later polish.')} aria-label="Preview options" data-testid="button-preview-options"><MoreHorizontal size={18} /></button></div>
    <div className="bg-[#d9e7dc] p-6">
      <div className="relative mx-auto aspect-[4/5] max-w-[260px] overflow-hidden rounded-[14px] bg-[#10382e] p-5 text-[#ecf0dd] shadow-[0_20px_35px_rgba(16,56,46,.2)] transition-all duration-500">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border-[18px] border-[#9ddfc3]/50" /><div className="absolute bottom-12 -left-8 h-28 w-28 rounded-full border border-[#d58d6c]/70" />
        <div className="relative flex h-full flex-col justify-between"><div className="flex items-center justify-between"><span className="font-mono text-[9px] uppercase tracking-[.18em] text-[#a7ddc4]">Bilano / 01—06</span><span className="rounded-full border border-[#a7ddc4]/40 px-2 py-1 font-mono text-[8px]">Draft</span></div><div><p className="font-mono text-[9px] uppercase tracking-[.15em] text-[#a7ddc4]">A field note</p><p className="mt-3 font-serif text-[31px] leading-[.95] tracking-[-.03em]">Good ideas need a place to land.</p><p className="mt-4 max-w-[190px] text-[11px] leading-4 text-[#c5d9ca]">A six-slide story for people who have too many tabs open.</p></div><div className="flex items-end justify-between"><span className="h-1.5 w-16 rounded-full bg-[#a7ddc4]" /><span className="font-mono text-[9px] text-[#a7ddc4]">Swipe →</span></div></div>
        {visualState === 'loading' && <div className="absolute inset-0 grid place-items-center bg-[#10382e]/90"><div className="text-center"><RefreshCw className="mx-auto animate-spin text-[#a7ddc4]" size={23} /><p className="mt-2 text-[11px] text-[#d1e7d3]">Composing visual direction</p></div></div>}
        {visualState === 'ready' && <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-[#a7ddc4] px-2.5 py-1.5 text-[9px] font-bold text-[#15372e]"><Check size={11} /> Visuals ready</div>}
      </div>
    </div>
    <div className="p-5"><div className="flex items-center justify-between"><span className="text-xs font-semibold">Readiness</span><span className="font-mono text-xs text-primary">82%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full w-[82%] rounded-full bg-primary transition-all" /></div><div className="mt-5 space-y-3">{['Hook earns the next swipe', 'One idea per frame', 'Close gives a clear next move'].map((check, index) => <div key={check} className="flex items-center gap-2.5 text-xs text-muted-foreground"><span className={`grid h-5 w-5 place-items-center rounded-full ${index === 2 ? 'bg-accent text-accent-foreground' : 'bg-secondary text-primary'}`}><Check size={12} /></span>{check}</div>)}</div><button onClick={generateVisuals} disabled={visualState === 'loading'} className="focus-ring mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/5 py-3 text-xs font-bold text-primary transition-all hover:bg-primary/10 disabled:opacity-60" data-testid="button-generate-visuals"><ImagePlus size={15} />{visualState === 'ready' ? 'Regenerate visuals' : 'Generate visuals'}</button><button onClick={() => showToast('Final review link copied to clipboard.')} className="focus-ring mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" data-testid="button-review-output"><Send size={14} /> Share for review</button></div>
  </div>;
}

function LibraryPage({ references, referenceTitle, setReferenceTitle, referenceWhy, setReferenceWhy, uploadName, isDragging, setIsDragging, fileInput, onFileChange, onDrop, addReference, updateReference, removeReference, exportLibrary, showToast }: { references: Reference[]; referenceTitle: string; setReferenceTitle: (value: string) => void; referenceWhy: string; setReferenceWhy: (value: string) => void; uploadName: string; isDragging: boolean; setIsDragging: (value: boolean) => void; fileInput: React.RefObject<HTMLInputElement | null>; onFileChange: (event: ChangeEvent<HTMLInputElement>) => void; onDrop: (event: DragEvent<HTMLDivElement>) => void; addReference: () => void; updateReference: (id: number, why: string) => void; removeReference: (id: number) => void; exportLibrary: () => void; showToast: (message: string) => void }) {
  return <div>
    <SectionIntro eyebrow="Reference library / 02" title={<>Keep the good<br /><em className="text-primary">stuff close.</em></>} description="A living swipe file for the moments when a blank page needs a little voltage." action={<button onClick={exportLibrary} className="focus-ring inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-xs font-bold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40" data-testid="button-export-library"><Download size={15} /> Export library</button>} />
    <div className="mb-8 grid gap-3 sm:grid-cols-3"><LibraryStat value={String(references.length).padStart(2, '0')} label="saved references" /><LibraryStat value="04" label="themes emerging" /><LibraryStat value="12m" label="since last addition" /></div>
    <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
      <div className="soft-shadow h-fit rounded-2xl border border-card-border bg-card p-5"><div className="flex items-start justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-primary">Add a reference</p><h2 className="mt-1 text-lg font-semibold">Feed the file</h2></div><Plus className="text-muted-foreground" size={18} /></div><div onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={onDrop} onClick={() => fileInput.current?.click()} className={`focus-ring mt-5 cursor-pointer rounded-xl border border-dashed p-5 text-center transition-all ${isDragging ? 'border-primary bg-accent/30' : 'border-input bg-background/40 hover:border-primary/50 hover:bg-muted/40'}`} role="button" tabIndex={0} data-testid="dropzone-reference"><input ref={fileInput} type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg,.txt" onChange={onFileChange} data-testid="input-reference-file" /><span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary"><UploadCloud size={19} /></span><p className="mt-3 text-xs font-semibold">{uploadName || 'Drop a file or browse'}</p><p className="mt-1 text-[11px] leading-4 text-muted-foreground">PDF, image, or notes. Up to 20 MB.</p></div><label className="mt-5 block"><span className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Reference name</span><input value={referenceTitle} onChange={(event) => setReferenceTitle(event.target.value)} placeholder="e.g. The quiet CTA" className="focus-ring mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground/55 focus:border-primary/60" data-testid="input-reference-title" /></label><label className="mt-4 block"><span className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Why does it engage?</span><textarea value={referenceWhy} onChange={(event) => setReferenceWhy(event.target.value)} placeholder="Name the move, not just the feeling..." className="focus-ring mt-2 min-h-[86px] w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm leading-5 outline-none placeholder:text-muted-foreground/55 focus:border-primary/60" data-testid="textarea-reference-why" /></label><button onClick={addReference} className="focus-ring mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-xs font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90" data-testid="button-add-reference"><Plus size={15} /> Add to library</button></div>
      <div className="min-w-0"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-semibold tracking-[-.02em]">Recently saved</h2><p className="mt-1 text-xs text-muted-foreground">The team's collective taste, with receipts.</p></div><button onClick={() => showToast('Filters are ready for your next sort.')} className="focus-ring rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground" data-testid="button-filter-library">Filter <span className="ml-1 text-primary">3</span></button></div><div className="space-y-3">{references.length === 0 ? <EmptyLibrary onAdd={() => document.querySelector<HTMLInputElement>('[data-testid="input-reference-file"]')?.click()} /> : references.map((reference, index) => <ReferenceCard key={reference.id} reference={reference} index={index} updateReference={updateReference} removeReference={removeReference} />)}</div></div>
    </div>
  </div>;
}

function LibraryStat({ value, label }: { value: string; label: string }) {
  return <div className="rounded-xl border border-card-border bg-card px-4 py-4"><p className="font-serif text-3xl text-primary">{value}</p><p className="mt-1 font-mono text-[9px] uppercase tracking-[.16em] text-muted-foreground">{label}</p></div>;
}

function ReferenceCard({ reference, index, updateReference, removeReference }: { reference: Reference; index: number; updateReference: (id: number, why: string) => void; removeReference: (id: number) => void }) {
  const accent = reference.accent === 'mint' ? 'bg-[#c8ead9]' : reference.accent === 'clay' ? 'bg-[#e7b398]' : reference.accent === 'ochre' ? 'bg-[#e5c875]' : 'bg-[#81c7bd]';
  return <article className="animate-in group rounded-2xl border border-card-border bg-card p-4 transition-all duration-200 hover:border-primary/35 hover:shadow-[0_10px_24px_rgba(22,67,54,.06)] sm:p-5" style={{ animationDelay: `${index * 70}ms` }} data-testid={`card-reference-${reference.id}`}><div className="flex gap-4"><div className={`hidden h-[88px] w-[88px] shrink-0 place-items-center rounded-xl ${accent} sm:grid`}><FileText className="text-[#17382e]/70" size={25} strokeWidth={1.6} /></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-muted px-2 py-1 font-mono text-[9px] uppercase tracking-[.12em] text-muted-foreground">{reference.format}</span><span className="font-mono text-[10px] text-muted-foreground/70">{reference.date}</span></div><h3 className="mt-2 text-base font-bold tracking-[-.02em]">{reference.title}</h3><p className="mt-1 text-[11px] text-primary">{reference.source}</p></div><button onClick={() => removeReference(reference.id)} className="focus-ring rounded-md p-1.5 text-muted-foreground/50 opacity-70 transition-all hover:bg-destructive/10 hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100" aria-label={`Remove ${reference.title}`} data-testid={`button-remove-reference-${reference.id}`}><Trash2 size={15} /></button></div><div className="mt-4 rounded-lg bg-muted/60 p-3"><div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[.13em] text-primary"><Lightbulb size={12} /> Why it works</div><textarea value={reference.why} onChange={(event) => updateReference(reference.id, event.target.value)} className="focus-ring mt-1.5 min-h-[42px] w-full resize-none bg-transparent text-xs leading-5 text-muted-foreground outline-none" aria-label={`Why ${reference.title} engages`} data-testid={`textarea-reference-note-${reference.id}`} /></div></div></div></article>;
}

function EmptyLibrary({ onAdd }: { onAdd: () => void }) {
  return <div className="rounded-2xl border border-dashed border-input bg-card p-12 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary"><FolderOpen size={22} /></div><h3 className="mt-4 font-serif text-2xl">A little too tidy in here.</h3><p className="mx-auto mt-2 max-w-xs text-sm leading-5 text-muted-foreground">Drop in the first reference your future self will thank you for.</p><button onClick={onAdd} className="focus-ring mt-5 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground" data-testid="button-empty-add-reference">Add a reference</button></div>;
}

function AnalyticsPage({ metrics, savedMetrics, insight, savedInsight, setInsight, updateMetric, saveAnalytics }: { metrics: Record<number, Metric>; savedMetrics: Record<number, Metric>; insight: string; savedInsight: string; setInsight: (value: string) => void; updateMetric: (id: number, field: keyof Metric, value: string) => void; saveAnalytics: () => void }) {
  const chart = useMemo(() => [42, 58, 47, 72, 63, 86, 78, 94, 69, 82, 89, 100], []);
  const rows = [{ id: 1, title: 'The post-work brain dump', date: 'Oct 11', metric: metrics[1] }, { id: 2, title: 'A better content brief', date: 'Oct 08', metric: metrics[2] }, { id: 3, title: 'Stop chasing consistency', date: 'Oct 02', metric: metrics[3] || { reach: '31,760', likes: '1,902', saves: '884', shares: '312' } }];
  const isDirty = insight !== savedInsight || JSON.stringify(metrics) !== JSON.stringify(savedMetrics);
  return <div>
    <SectionIntro eyebrow="Analytics & learning / 03" title={<>Notice what<br /><em className="text-primary">people keep.</em></>} description="Performance is a creative input. Turn the numbers into a sharper instinct for the next story." action={<button onClick={saveAnalytics} disabled={!isDirty} className="focus-ring inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-default disabled:bg-muted disabled:text-muted-foreground" data-testid="button-save-analytics"><Check size={15} /> {isDirty ? 'Save learning' : 'All changes saved'}</button>} />
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,.7fr)]">
      <div className="space-y-6">
        <div className="soft-shadow animate-in overflow-hidden rounded-2xl border border-card-border bg-card"><div className="flex items-center justify-between border-b border-border/80 px-5 py-4"><div><p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.18em] text-primary"><Sparkles size={13} /> AI learning note</p><p className="mt-1 text-xs text-muted-foreground">Updated from the last 30 posts</p></div><span className="rounded-full bg-accent/60 px-2.5 py-1 font-mono text-[9px] text-accent-foreground">High confidence</span></div><div className="p-5 sm:p-6"><textarea value={insight} onChange={(event) => setInsight(event.target.value)} className="focus-ring min-h-[96px] w-full resize-none bg-transparent font-serif text-[23px] leading-[1.16] tracking-[-.025em] text-foreground outline-none" aria-label="AI insight" data-testid="textarea-ai-insight" /><div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/70 pt-4"><span className="rounded-full bg-secondary px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.12em] text-primary">#reframe</span><span className="rounded-full bg-secondary px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.12em] text-primary">#saves</span><span className="text-[11px] text-muted-foreground">Worth testing in your next two briefs.</span></div></div></div>
        <div className="animate-in animate-delay-1 rounded-2xl border border-card-border bg-card p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Reach velocity</p><h2 className="mt-1 text-lg font-semibold">The last 12 posts</h2></div><div className="flex items-center gap-1.5 rounded-full bg-accent/60 px-2.5 py-1.5 text-[10px] font-bold text-accent-foreground"><TrendingUp size={13} /> +18.4%</div></div><div className="mt-7 flex h-36 items-end gap-2 border-b border-border/80 pb-0 sm:gap-3">{chart.map((height, index) => <div key={index} className="group relative flex h-full flex-1 items-end"><div className={`w-full rounded-t-sm transition-all duration-300 group-hover:bg-primary ${index === chart.length - 1 ? 'bg-primary' : 'bg-secondary'}`} style={{ height: `${height}%` }} /><span className="absolute -top-6 left-1/2 hidden -translate-x-1/2 rounded bg-sidebar px-1.5 py-1 font-mono text-[9px] text-sidebar-foreground group-hover:block">{height}k</span></div>)}</div><div className="mt-3 flex justify-between font-mono text-[9px] text-muted-foreground"><span>Sep 18</span><span>Oct 15</span></div></div>
      </div>
      <div className="animate-in animate-delay-2 rounded-2xl border border-card-border bg-primary p-5 text-primary-foreground sm:p-6"><div className="flex items-center justify-between"><span className="font-mono text-[10px] uppercase tracking-[.18em] text-primary-foreground/60">This month</span><Gauge size={18} className="text-accent" /></div><div className="mt-8"><p className="font-serif text-6xl leading-none">2.8×</p><p className="mt-3 max-w-[190px] text-sm leading-5 text-primary-foreground/70">more saves on posts with a clear point of view.</p></div><div className="mt-10 space-y-4 border-t border-primary-foreground/15 pt-5"><MetricSummary label="Avg. reach" value="25.4k" /><MetricSummary label="Save rate" value="4.7%" /><MetricSummary label="Best day" value="Tuesday" /></div><button onClick={saveAnalytics} className="focus-ring mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-xs font-bold text-accent-foreground transition-all hover:bg-accent/90" data-testid="button-save-learning-card"><Check size={15} /> Save learning</button></div>
    </div>
    <div className="mt-8 animate-in animate-delay-3"><div className="mb-4 flex items-end justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Post performance</p><h2 className="mt-1 text-lg font-semibold">Edit the receipts</h2></div><p className="hidden text-xs text-muted-foreground sm:block">Numbers stay local until you save them.</p></div><div className="overflow-x-auto rounded-2xl border border-card-border bg-card"><table className="w-full min-w-[720px] border-collapse text-left"><thead><tr className="border-b border-border/80 font-mono text-[9px] uppercase tracking-[.14em] text-muted-foreground"><th className="px-5 py-4 font-normal">Post</th><th className="px-3 py-4 font-normal">Reach</th><th className="px-3 py-4 font-normal">Likes</th><th className="px-3 py-4 font-normal">Saves</th><th className="px-3 py-4 font-normal">Shares</th><th className="px-5 py-4 text-right font-normal">Signal</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id} className="border-b border-border/60 last:border-0"><td className="px-5 py-4"><p className="text-sm font-semibold">{row.title}</p><p className="mt-1 font-mono text-[10px] text-muted-foreground">{row.date}</p></td>{(['reach', 'likes', 'saves', 'shares'] as (keyof Metric)[]).map((field) => <td key={field} className="px-3 py-4"><input value={row.metric[field]} onChange={(event) => updateMetric(row.id, field, event.target.value)} className="focus-ring w-[92px] rounded-md border border-transparent bg-muted/60 px-2 py-2 font-mono text-xs outline-none transition-colors focus:border-primary/50 focus:bg-background" aria-label={`${field} for ${row.title}`} data-testid={`input-${field}-${row.id}`} /></td>)}<td className="px-5 py-4 text-right"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 font-mono text-[9px] ${row.id === 2 ? 'bg-accent text-accent-foreground' : 'bg-secondary text-primary'}`}><TrendingUp size={11} /> {row.id === 2 ? 'Save magnet' : 'Healthy'}</span></td></tr>)}</tbody></table></div></div>
  </div>;
}

function MetricSummary({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between text-sm"><span className="text-primary-foreground/60">{label}</span><span className="font-mono text-xs text-accent">{value}</span></div>;
}

export default App;