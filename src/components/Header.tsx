import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Activity,
  Search,
  Users,
  Grid,
  Bug,
  Brain,
  Terminal,
  Bot,
  Radio,
  FileDown,
  Rss,
  Zap,
  RotateCw,
  Clock,
  Table,
  BarChart3,
  Compass,
  Flame,
  Globe,
  Globe2,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  Sparkles,
  Lock,
  Cpu,
  ArrowUpRight,
  Power
} from 'lucide-react';
import { TelemetryMetrics, AutoRefreshInterval, ThreatActorSummary } from '../types';

export type ActiveTab =
  | 'world-map'
  | 'cti-dashboard'
  | 'overview'
  | 'vuln-assessment'
  | 'feeds'
  | 'anomalies'
  | 'iocs'
  | 'actors'
  | 'mitre'
  | 'cve'
  | 'ai-analyst'
  | 'rules'
  | 'next-gen';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  telemetry: TelemetryMetrics;
  onOpenCopilot: () => void;
  onExportSTIX: () => void;
  onOpenExitModal?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  autoRefreshInterval: AutoRefreshInterval;
  setAutoRefreshInterval: (interval: AutoRefreshInterval) => void;
  secondsRemaining: number;
  onManualRefresh: () => void;
  isRefreshing: boolean;
  isPlainView: boolean;
  setIsPlainView: (plain: boolean) => void;
  isCopilotOpen: boolean;
  feedCount: number;
  anomalyCount: number;
  campaignCount?: number;
  vulnCount?: number;
  actorsSummary: ThreatActorSummary;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  telemetry,
  onOpenCopilot,
  onExportSTIX,
  onOpenExitModal,
  searchQuery,
  setSearchQuery,
  autoRefreshInterval,
  setAutoRefreshInterval,
  secondsRemaining,
  onManualRefresh,
  isRefreshing,
  isPlainView,
  setIsPlainView,
  isCopilotOpen,
  feedCount,
  anomalyCount,
  campaignCount = 6,
  vulnCount = 7,
  actorsSummary
}) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('24h');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatClock = (timeZone: string) => {
    try {
      return new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(currentTime);
    } catch {
      return currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const estTime = formatClock('America/New_York');
  const gmtTime = formatClock('UTC');
  const istTime = formatClock('Asia/Kolkata');
  const jstTime = formatClock('Asia/Tokyo');

  const tabs = [
    // 1. FINDING THE THREAT (Discovery, Ingestion & Behavioral Detection)
    {
      id: 'world-map' as ActiveTab,
      label: 'World Vector Map',
      subtitle: 'Active Campaigns & Victims',
      icon: Globe2,
      badge: 'Live',
      alert: true,
      phase: 'Find'
    },
    {
      id: 'overview' as ActiveTab,
      label: 'SOC Telemetry',
      subtitle: 'Frontline Sensor Triage',
      icon: Activity,
      phase: 'Find'
    },
    {
      id: 'feeds' as ActiveTab,
      label: 'National Feeds & MISP',
      subtitle: 'CISA & ISAC Intelligence',
      icon: Rss,
      badge: `${feedCount}`,
      phase: 'Find'
    },
    {
      id: 'anomalies' as ActiveTab,
      label: 'Anomaly Engine',
      subtitle: 'ML Behavioral Hunter',
      icon: Zap,
      badge: `${anomalyCount}`,
      alert: true,
      phase: 'Find'
    },

    // 2. INVESTIGATING THE THREAT (Deep Analysis, Attribution & TTPs)
    {
      id: 'iocs' as ActiveTab,
      label: 'Threat Graph & IOCs',
      subtitle: 'Verdicts & Detonation',
      icon: Search,
      badge: `${telemetry.trackedIocsCount.toLocaleString()}`,
      phase: 'Investigate'
    },
    {
      id: 'actors' as ActiveTab,
      label: 'Adversary Dossiers',
      subtitle: 'UNCs & Nation-States',
      icon: Users,
      badge: `${telemetry.monitoredActorsCount}`,
      phase: 'Investigate'
    },
    {
      id: 'mitre' as ActiveTab,
      label: 'MITRE ATT&CK',
      subtitle: 'Enterprise Matrix Navigator',
      icon: Grid,
      phase: 'Investigate'
    },
    {
      id: 'cve' as ActiveTab,
      label: '0-Day / CVE Radar',
      subtitle: 'Weaponized Exploits',
      icon: Bug,
      badge: `${telemetry.weaponizedCvesCount}`,
      phase: 'Investigate'
    },
    {
      id: 'vuln-assessment' as ActiveTab,
      label: 'Exposure & RBVM',
      subtitle: 'Continuous Threat Management',
      icon: ShieldAlert,
      badge: `${vulnCount} Crit`,
      alert: true,
      phase: 'Investigate'
    },

    // 3. DEPLOYING COUNTERMEASURE (Detection Engineering & Signatures)
    {
      id: 'rules' as ActiveTab,
      label: 'YARA-L & Sigma',
      subtitle: 'Detection Engineering',
      icon: Terminal,
      phase: 'Countermeasure'
    },

    // 4. GENERATING REPORT (Incident Reports & Executive Briefing)
    {
      id: 'ai-analyst' as ActiveTab,
      label: 'Aegis AI Analyst',
      subtitle: 'Agentic DFIR & Triage',
      icon: Brain,
      isSpecial: true,
      phase: 'Report'
    },
    {
      id: 'cti-dashboard' as ActiveTab,
      label: 'CTI Dashboard',
      subtitle: 'Executive Intel & Campaigns',
      icon: Compass,
      badge: `${campaignCount} Ops`,
      phase: 'Report'
    }
  ];

  return (
    <header className="bg-slate-50 border-b border-slate-200 text-slate-900 sticky top-0 z-40 shadow-xs backdrop-blur-md">
      {/* 1. Top Level Box: Unified Aegis Command Header with Branding, Global Clocks + Search, Threat Status, & Controls/Filters */}
      <div className="bg-slate-950 font-mono text-left text-slate-100 px-3 py-2.5 min-h-[64px] border-b border-slate-900 flex flex-col gap-2 shadow-md" id="top-level-box">
        {/* Main Row: Brand, Watches + Search, DEFCON Status */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          {/* Part 1: Brand & Suite Title */}
          <div className="flex items-center gap-2.5 shrink-0" id="top-box-part-1">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-md border border-red-500/30 shrink-0">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col gap-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-wider text-white font-sans flex items-center">
                  AEGIS
                  <span className="ml-1.5 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-900 tracking-normal uppercase">
                    Global CYBER THREAT INTELLIGENCE Matrix
                  </span>
                  <div className="ml-6 hidden lg:flex items-center gap-5 border-l border-slate-800 pl-6 font-mono">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-1">Global APTs</span>
                      <span className="text-sm text-red-500 font-bold tabular-nums leading-none">{actorsSummary.total}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-1">Sponsors</span>
                      <span className="text-sm text-amber-500 font-bold tabular-nums leading-none">{actorsSummary.sponsors}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-1">Tiers</span>
                      <span className="text-sm text-indigo-500 font-bold tabular-nums leading-none">{actorsSummary.sophistication}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-1">Motivations</span>
                      <span className="text-sm text-emerald-500 font-bold tabular-nums leading-none">{actorsSummary.motivations}</span>
                    </div>
                  </div>
                </span>
              </div>
              <div className="text-[9px] text-slate-400 font-mono leading-tight mt-0.5 hidden sm:block opacity-80">
                Continuous threat exposure management (CTEM), EPSS exploit likelihood rating,<br />
                CISA KEV correlation, and AI-directed patch verification.
              </div>
            </div>
          </div>

          {/* Right Aligned Container for Watches, Search, and DEFCON */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-end gap-3 flex-1 overflow-x-hidden">
            
            {/* Part 2: Global Time Zones (EST, GMT, IST, JST) & Search Input */}
            <div className="flex items-center gap-2.5 shrink-0" id="top-box-part-2">
              {/* Time Zones Frame */}
              <div className="flex items-center bg-slate-700 border border-slate-600/50 rounded-lg h-7 font-mono shadow-inner shrink-0 divide-x divide-slate-600/50 animate-in fade-in" id="world-watch-banner">
                {/* EST */}
                <div className="flex items-center gap-1.5 px-2 text-[10px]">
                  <span className="text-[8.5px] font-bold text-slate-400 tracking-tight">EST</span>
                  <span className="font-semibold text-emerald-500 font-mono tracking-tight">{estTime}</span>
                </div>

                {/* GMT */}
                <div className="flex items-center gap-1.5 px-2 text-[10px]">
                  <span className="text-[8.5px] font-bold text-slate-400 tracking-tight">GMT</span>
                  <span className="font-semibold text-emerald-500 font-mono tracking-tight">{gmtTime}</span>
                </div>

                {/* IST (India) */}
                <div className="flex items-center gap-1.5 px-2 text-[10px]">
                  <span className="text-[8.5px] font-bold text-slate-400 tracking-tight">IST</span>
                  <span className="font-semibold text-emerald-500 font-mono tracking-tight">{istTime}</span>
                </div>

                {/* JST (Japan) */}
                <div className="flex items-center gap-1.5 px-2 text-[10px]">
                  <span className="text-[8.5px] font-bold text-slate-400 tracking-tight">JST</span>
                  <span className="font-semibold text-emerald-500 font-mono tracking-tight">{jstTime}</span>
                </div>
              </div>

              {/* Search Input in Top Banner after Watches */}
              <div className="w-[420px] relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search IP, Hash, Domain, Threat..."
                  className="w-full h-7 bg-slate-700 border border-slate-600/50 rounded-lg pl-8 pr-2.5 text-[10px] text-slate-50 placeholder-slate-400 focus:bg-slate-800 focus:border-blue-500/80 transition-all font-mono shadow-inner outline-none"
                />
              </div>
            </div>

            {/* Part 3: DEFCON, Active Adversaries & Sensor Ingestion */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-200 shrink-0" id="top-box-part-3">
              <div className="flex items-center gap-1 bg-slate-700 text-slate-50 px-1.5 h-7 rounded border border-slate-600/50 font-bold text-[10px] tracking-wider">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                </span>
                DEFCON 2
              </div>
              <span className="text-slate-700">|</span>
              <span className="text-[10px] flex items-center gap-1">
                <Flame className="w-3 h-3 text-red-400 shrink-0" />
                <span className="text-slate-200 font-bold">UNC3886, APT41, APT29</span>
              </span>
              <span className="text-slate-700 hidden 2xl:inline">|</span>
              <span className="text-[10px] hidden 2xl:flex items-center gap-1">
                <Cpu className="w-3 h-3 text-blue-400 shrink-0" />
                <span className="text-blue-400 font-bold">2.41M EPS</span>
              </span>
            </div>

          </div>
        </div>

        {/* Integrated Controls & Filters Bar directly in Top Box */}
        <div className="pt-2 border-t border-slate-900 flex flex-wrap items-center justify-between gap-2 text-[10px]" id="top-box-controls-and-filters">
          <div className="flex items-center gap-2">
            {/* Sync Status */}
            <div className="flex items-center gap-2 px-2 h-7 bg-slate-700 rounded-lg border border-slate-600/50 shadow-inner">
              <div className="flex items-center gap-1 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> SYNC:
              </div>
              <div className="text-[10px] font-black font-mono text-emerald-500 uppercase">ACTIVE</div>
              <div className="text-[9px] text-slate-50 font-bold px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded">14 FEEDS</div>
            </div>
          </div>

          {/* Right Action Suite inside Top Div */}
          <div className="flex flex-wrap items-center gap-2 text-[10px]">
            {/* Time Range Selector */}
            <div className="flex items-center bg-slate-700 border border-slate-600/50 rounded-lg px-1 h-7 text-[10px] font-mono shadow-inner">
              {(['24h', '7d', '30d'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2 h-5 flex items-center justify-center rounded uppercase font-bold transition-colors cursor-pointer text-[10px] ${
                    timeRange === r
                      ? 'bg-blue-500 text-white shadow-xs'
                      : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            
            {/* Portal for World Map Filters */}
            <div id="world-map-filters-portal" className="flex items-center gap-2"></div>

            {/* Merged Sync & Auto Refresh Control */}
            <div className="flex items-center bg-slate-700 border border-slate-600/50 rounded-lg h-7 shadow-inner text-[10px] shrink-0 w-[195px]">
              <button
                onClick={onManualRefresh}
                disabled={isRefreshing}
                title="Trigger Manual Sync"
                className="flex items-center gap-1.5 px-2.5 h-full hover:bg-slate-600/50 rounded-l-lg text-slate-50 font-bold transition-colors cursor-pointer border-r border-slate-600/50 shrink-0"
              >
                <RotateCw className={`w-3 h-3 text-slate-200 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>
              <div className="flex items-center justify-between gap-1 px-2 h-full flex-1 min-0">
                <div className="flex items-center gap-1 min-w-0 flex-1">
                  <Clock className="w-3 h-3 text-slate-200 shrink-0" />
                  <select
                    value={autoRefreshInterval}
                    onChange={(e) => setAutoRefreshInterval(Number(e.target.value) as AutoRefreshInterval)}
                    className="bg-transparent font-bold text-slate-50 text-[10px] focus:outline-none cursor-pointer w-full truncate border-none outline-none"
                  >
                    <option value={0} className="bg-slate-700 text-slate-50">Manual</option>
                    <option value={5} className="bg-slate-700 text-slate-50">5s Live</option>
                    <option value={10} className="bg-slate-700 text-slate-50">10s</option>
                    <option value={30} className="bg-slate-700 text-slate-50">30s</option>
                    <option value={60} className="bg-slate-700 text-slate-50">60s</option>
                  </select>
                </div>
                {autoRefreshInterval > 0 && (
                  <span className="text-emerald-400 font-bold ml-0.5 bg-emerald-950 border border-emerald-900 px-1 rounded text-[9px] shrink-0">
                    {secondsRemaining}s
                  </span>
                )}
              </div>
            </div>

            <span className="h-3.5 w-px bg-slate-800" />

            {/* Visual Table Toggle */}
            <button
              onClick={() => setIsPlainView(!isPlainView)}
              className={`flex items-center gap-1 px-2.5 h-7 rounded-lg border text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                isPlainView
                  ? 'bg-blue-500 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-50 border-slate-600/50'
              }`}
            >
              {isPlainView ? <BarChart3 className="w-3 h-3 text-red-400" /> : <Table className="w-3 h-3 text-slate-200" />}
              <span>{isPlainView ? 'Visual' : 'Table'}</span>
            </button>

            {/* STIX Export */}
            <button
              onClick={onExportSTIX}
              className="flex items-center gap-1 px-2.5 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600/50 text-[10px] font-mono font-bold text-slate-50 transition-colors cursor-pointer"
            >
              <FileDown className="w-3 h-3 text-blue-400" />
              <span>STIX</span>
            </button>

            {/* Next-Gen Blueprint */}
            <button
              onClick={() => setActiveTab('next-gen')}
              className={`flex items-center gap-1 px-2.5 h-7 rounded-lg text-[10px] font-mono font-bold shadow-xs transition-all cursor-pointer border ${
                activeTab === 'next-gen'
                  ? 'bg-blue-500 text-white border-blue-600'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-50 border-slate-600/50'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'next-gen' ? 'text-white' : 'text-blue-400'}`} />
              <span>Next-Gen Blueprint</span>
            </button>

            {/* AI Copilot */}
            <button
              onClick={onOpenCopilot}
              className={`flex items-center gap-1 px-2.5 h-7 rounded-lg text-[10px] font-mono font-bold shadow-xs transition-all cursor-pointer border ${
                isCopilotOpen 
                  ? 'bg-red-500 text-white border-red-600' 
                  : 'bg-slate-700 hover:bg-slate-600 text-red-400 border-slate-600/50'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Copilot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Suite Rail */}
      <nav className="px-2 flex items-center gap-0.5 overflow-x-auto border-t border-slate-200 scrollbar-none py-0.5 bg-slate-50">
        {tabs.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const prevTab = tabs[idx - 1];
          const isNewPhase = idx > 0 && tab.phase !== prevTab?.phase;

          return (
            <React.Fragment key={tab.id}>
              {isNewPhase && (
                <div className="h-3.5 w-px bg-slate-300 mx-0.5 shrink-0" aria-hidden="true" />
              )}
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-2 py-1.5 border-b-2 text-xs whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border-red-600 text-red-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive
                      ? 'text-red-600'
                      : tab.alert
                      ? 'text-amber-600'
                      : 'text-slate-400'
                  }`}
                />
                <div className="text-left">
                  <div className="leading-tight">{tab.label}</div>
                </div>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono leading-none ${
                      isActive
                        ? 'bg-red-50 text-red-700 border border-red-200 font-bold'
                        : tab.alert
                        ? 'bg-amber-100 text-amber-800 font-bold border border-amber-200'
                        : 'bg-slate-100 text-slate-600 font-medium'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </nav>
    </header>
  );
};
