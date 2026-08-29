import React, { useState } from 'react';
import {
  Rss,
  Radio,
  ExternalLink,
  Search,
  Filter,
  Plus,
  Check,
  RefreshCw,
  Download,
  Flame,
  Shield,
  Layers,
  Sparkles,
  ArrowUpRight,
  Database,
  Globe,
  Clock,
  ChevronRight,
  Code,
  X,
  Eye
} from 'lucide-react';
import { ThreatFeedItem, CustomFeedSource, IOC, IOCType, SeverityLevel, TlpLevel } from '../types';

interface ThreatFeedsViewProps {
  feeds: ThreatFeedItem[];
  customSources: CustomFeedSource[];
  onIngestFeedItem: (feed: ThreatFeedItem) => void;
  onAddCustomFeedSource: (source: CustomFeedSource) => void;
  onRefreshFeeds: () => void;
  isRefreshing: boolean;
}

export const ThreatFeedsView: React.FC<ThreatFeedsViewProps> = ({
  feeds,
  customSources,
  onIngestFeedItem,
  onAddCustomFeedSource,
  onRefreshFeeds,
  isRefreshing
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedFeedItem, setSelectedFeedItem] = useState<ThreatFeedItem | null>(null);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [ingestedFeedIds, setIngestedFeedIds] = useState<Record<string, boolean>>({});

  // Government / Advanced Institute Portal States
  const [activeFeedSubTab, setActiveFeedSubTab] = useState<'stream' | 'government'>('stream');
  const [taxiiSyncState, setTaxiiSyncState] = useState<'idle' | 'handshake' | 'parsing' | 'synced'>('idle');
  const [taxiiSyncMsg, setTaxiiSyncMsg] = useState('All 5 peer TAXII/MISP government nodes are fully operational and synchronized.');
  const [selectedAdvisoryId, setSelectedAdvisoryId] = useState('adv-1');
  const [mitigationsDeployed, setMitigationsDeployed] = useState<Record<string, boolean>>({});
  const [sectorScanning, setSectorScanning] = useState<Record<string, boolean>>({});

  const handleTaxiiSync = () => {
    setTaxiiSyncState('handshake');
    setTaxiiSyncMsg('Establishing secure TLS 1.3 tunnel & TAXII 2.1 protocol handshake with US-CERT CISA & NATO nodes...');
    
    setTimeout(() => {
      setTaxiiSyncState('parsing');
      setTaxiiSyncMsg('Connected! Pulling STIX 2.1 JSON bundle delta packages... Decrypting MISP indicators...');
      
      setTimeout(() => {
        setTaxiiSyncState('synced');
        setTaxiiSyncMsg('Sync complete! Pulled 42 verified indicators, mapped 3 state-sponsored active campaigns, and updated Sector Threat Matrices.');
      }, 1500);
    }, 1500);
  };

  // Add new feed modal
  const [isAddingFeed, setIsAddingFeed] = useState(false);
  const [newFeedName, setNewFeedName] = useState('');
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [newFeedFormat, setNewFeedFormat] = useState<'TAXII 2.1' | 'STIX 2.1' | 'RSS/Atom' | 'JSON REST' | 'MISP'>('TAXII 2.1');
  const [newFeedPolling, setNewFeedPolling] = useState(15);

  const providers = Array.from(new Set(feeds.map((f) => f.provider)));

  const filteredFeeds = feeds.filter((f) => {
    const matchSearch =
      !searchQuery ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.indicator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchProvider = selectedProvider === 'all' || f.provider === selectedProvider;
    const matchSeverity = selectedSeverity === 'all' || f.severity === selectedSeverity;
    return matchSearch && matchProvider && matchSeverity;
  });

  const handleIngest = (feed: ThreatFeedItem) => {
    onIngestFeedItem(feed);
    setIngestedFeedIds((prev) => ({ ...prev, [feed.id]: true }));
  };

  const handleAddFeedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedName.trim() || !newFeedUrl.trim()) return;

    const newSource: CustomFeedSource = {
      id: `src-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: newFeedName.trim(),
      url: newFeedUrl.trim(),
      format: newFeedFormat,
      pollingIntervalMin: Number(newFeedPolling) || 15,
      status: 'active',
      lastSync: new Date().toISOString(),
      indicatorsCount: Math.floor(Math.random() * 5000) + 1200
    };

    onAddCustomFeedSource(newSource);
    setIsAddingFeed(false);
    setNewFeedName('');
    setNewFeedUrl('');
  };

  const getSeverityBadge = (sev: SeverityLevel) => {
    switch (sev) {
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'high':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getTlpBadge = (tlp: TlpLevel) => {
    switch (tlp) {
      case 'TLP:RED':
        return 'bg-red-600 text-white';
      case 'TLP:AMBER':
        return 'bg-amber-500 text-slate-950 font-bold';
      case 'TLP:GREEN':
        return 'bg-emerald-600 text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  const getProviderLogoColor = (prov: string) => {
    switch (prov) {
      case 'CISA AIS':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'AlienVault OTX':
        return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
      case 'ThreatFox':
        return 'bg-orange-50 text-orange-700 border border-orange-200';
      case 'Shadowserver':
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'URLhaus':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'SANS ISC':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'vx-underground':
        return 'bg-slate-100 text-slate-800 border border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      {/* Top Banner & Action Header with Integrated Subscribed Feed Sources */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-xs space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <Rss className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">
                Unified Offensive Intelligence
              </h2>
              <h3 className="text-[11px] sm:text-xs font-bold text-slate-900 flex items-center gap-2 font-mono">
                Aegis Global Threat Feeds & Ingestion Stream
                <span className="flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-700 font-mono font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  {customSources.filter((s) => s.status === 'active').length} Active
                </span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 font-mono max-w-md leading-relaxed">
                Aggregating real-time telemetry from CISA AIS, AlienVault OTX, ThreatFox, Shadowserver, and automated TAXII 2.1 collections.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefreshFeeds}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer font-mono shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Poll Feeds Now'}</span>
            </button>

            <button
              onClick={() => setIsAddingFeed(!isAddingFeed)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-xs font-semibold text-white shadow-xs border border-red-500/40 transition-colors cursor-pointer font-mono"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Threat Feed</span>
            </button>
          </div>
        </div>

        {/* Configured Feed Ingestion Endpoints in Title Bar (30% Increased Size) */}
        <div className="pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between mb-1.5 font-mono">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              <span>Configured Feed Ingestion Endpoints ({customSources.length})</span>
            </span>
            <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              All Channels Live
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 font-mono">
            {customSources.map((source) => (
              <div
                key={source.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-2.5 flex flex-col justify-between space-y-1.5 transition-all shadow-2xs group"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[10.5px] font-bold text-slate-900 truncate" title={source.name}>
                    {source.name}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-[8px] font-mono font-semibold text-indigo-700 shrink-0">
                    {source.format}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-100">
                  <span className="text-slate-700 font-semibold">{source.indicatorsCount.toLocaleString()} IOCs</span>
                  <span className="text-emerald-700 font-medium">Every {source.pollingIntervalMin}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sub-tab Selection Switcher + Search Bar & Filters Next to Tabs */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 gap-2 pb-1">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveFeedSubTab('stream')}
            className={`px-4 py-2 border-b-2 font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeFeedSubTab === 'stream'
                ? 'border-red-600 text-red-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <Rss className="w-3.5 h-3.5" />
            <span>Global Feed Ingestion Stream</span>
          </button>

          <button
            onClick={() => setActiveFeedSubTab('government')}
            className={`px-4 py-2 border-b-2 font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeFeedSubTab === 'government'
                ? 'border-red-600 text-red-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span>MISP & National Advisory Portal</span>
            <span className="px-1.5 py-0.2 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] rounded-md font-sans font-semibold">Gov/Inst</span>
          </button>
        </div>

        {/* Search Bar & Filters Placed Directly Next to Tabs */}
        <div className="flex items-center gap-1.5 font-mono">
          <div className="relative min-w-[200px] sm:min-w-[260px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search indicator, actor, CVE..."
              className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-red-500 font-mono shadow-2xs"
            />
          </div>

          {/* Provider Filter */}
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className={`border rounded-lg px-2 py-1 text-[11px] focus:outline-none transition-all cursor-pointer font-medium shadow-2xs ${
              selectedProvider !== 'all' 
                ? 'bg-sky-50 text-sky-800 border-sky-300 font-bold' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <option value="all">All Providers ({feeds.length})</option>
            {providers.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className={`border rounded-lg px-2 py-1 text-[11px] focus:outline-none transition-all cursor-pointer font-medium shadow-2xs ${
              selectedSeverity !== 'all' 
                ? 'bg-sky-50 text-sky-800 border-sky-300 font-bold' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Add Custom Feed Source Form / Modal */}
      {isAddingFeed && (
        <form
          onSubmit={handleAddFeedSubmit}
          className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 animate-in fade-in duration-150 font-mono"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-red-600" />
              <span>Connect New Threat Intelligence Feed / Collection</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingFeed(false)}
              className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Feed Provider Name *
              </label>
              <input
                type="text"
                required
                value={newFeedName}
                onChange={(e) => setNewFeedName(e.target.value)}
                placeholder="e.g. US-CERT STIX Stream"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:bg-slate-50 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Feed Format / Protocol *
              </label>
              <select
                value={newFeedFormat}
                onChange={(e) => setNewFeedFormat(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:bg-slate-50 focus:outline-none focus:border-red-500"
              >
                <option value="TAXII 2.1">TAXII 2.1 (STIX Collection)</option>
                <option value="STIX 2.1">STIX 2.1 JSON Endpoint</option>
                <option value="JSON REST">JSON REST API</option>
                <option value="MISP">MISP Threat Sharing Attribute Feed</option>
                <option value="RSS/Atom">RSS / Atom Advisory Feed</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Polling Interval (Minutes)
              </label>
              <input
                type="number"
                min={1}
                max={1440}
                value={newFeedPolling}
                onChange={(e) => setNewFeedPolling(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:bg-slate-50 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
              Feed Endpoint URL / Collection URI *
            </label>
            <input
              type="url"
              required
              value={newFeedUrl}
              onChange={(e) => setNewFeedUrl(e.target.value)}
              placeholder="https://threat-feed.provider.org/v2/indicators/stix"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:bg-slate-50 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white rounded-xl text-xs font-semibold shadow-xs border border-red-500/40 cursor-pointer"
            >
              Save & Start Ingestion
            </button>
          </div>
        </form>
      )}

      {activeFeedSubTab === 'stream' ? (
        <>
          {/* Header Status & Count */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-mono">
            <span className="font-bold text-slate-700">SHOWING {filteredFeeds.length} LIVE FEED NOTICES</span>
            <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              REAL-TIME TAXII 2.1 STREAM
            </span>
          </div>

          {/* 4-in-a-Row Compact Live Stream Cards (50% Size Reduction) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {filteredFeeds.map((item) => {
              const isSelected = selectedFeedItem?.id === item.id;
              const isIngested = ingestedFeedIds[item.id] || item.isIngested;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedFeedItem(item);
                    setIsInspectionModalOpen(true);
                  }}
                  className={`bg-white border rounded-lg p-2.5 transition-all cursor-pointer shadow-2xs flex flex-col justify-between space-y-1.5 group relative overflow-hidden ${
                    isSelected
                      ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/10 shadow-xs'
                      : 'border-slate-200 hover:border-slate-400 hover:shadow-xs'
                  }`}
                >
                  {/* MISP Deck Top Accent Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-indigo-600 to-amber-500 opacity-75 group-hover:opacity-100 transition-opacity" />

                  <div className="space-y-1.5">
                    {/* Top Row: Provider, Severity, TLP, Timestamp */}
                    <div className="flex items-center justify-between gap-1 pt-0.5">
                      <div className="flex items-center gap-1 font-mono flex-wrap">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider ${getProviderLogoColor(
                            item.provider
                          )}`}
                        >
                          {item.provider}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[8px] font-mono font-bold uppercase border ${getSeverityBadge(
                            item.severity
                          )}`}
                        >
                          {item.severity}
                        </span>
                        <span
                          className={`px-1 py-0.2 text-[8px] font-mono font-bold rounded ${getTlpBadge(
                            item.tlp
                          )}`}
                        >
                          {item.tlp}
                        </span>
                      </div>

                      <span className="text-[9px] font-mono text-slate-400 whitespace-nowrap">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3
                      className="text-[11px] font-bold text-slate-900 line-clamp-1 font-mono group-hover:text-red-700 transition-colors"
                      title={item.title}
                    >
                      {item.title}
                    </h3>

                    {/* Indicator Chip (Micro) */}
                    <div className="bg-slate-50 border border-slate-200 rounded px-2 py-1 flex items-center justify-between font-mono text-[9px]">
                      <div className="flex items-center gap-1 truncate max-w-[70%]">
                        <span className="text-slate-500 uppercase font-semibold text-[8px]">
                          {item.indicatorType}:
                        </span>
                        <span className="text-indigo-700 font-bold truncate select-all">
                          {item.indicator}
                        </span>
                      </div>
                      <span className="px-1 py-0.2 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200 text-[8px] shrink-0">
                        {item.confidence}% Conf
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-[9.5px] text-slate-500 line-clamp-1 leading-snug font-sans">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-[9px] font-mono">
                    <div className="flex flex-wrap gap-1">
                      {(item.tags || []).slice(0, 1).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[8px] border border-slate-200 truncate max-w-[90px]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIngest(item);
                        }}
                        disabled={isIngested}
                        className={`px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 transition-colors ${
                          isIngested
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 cursor-pointer'
                        }`}
                      >
                        {isIngested ? (
                          <>
                            <Check className="w-2.5 h-2.5 text-emerald-600" />
                            <span>Ingested</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-2.5 h-2.5" />
                            <span>Ingest</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFeedItem(item);
                          setIsInspectionModalOpen(true);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Inspect STIX Record"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deep Dossier Inspection Drawer for Selected Live Feed Event */}
          <div 
            className={`fixed inset-0 z-[100] flex justify-end transition-opacity duration-300 ${
              isInspectionModalOpen && selectedFeedItem ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsInspectionModalOpen(false)}
            />

            {/* Drawer Content */}
            {selectedFeedItem && (
              <div 
                className={`relative w-full max-w-2xl h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-900 font-mono transition-transform duration-500 ease-out ${
                  isInspectionModalOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
              >
                {/* Drawer Header */}
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-start justify-between shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getProviderLogoColor(
                        selectedFeedItem.provider
                      )}`}
                    >
                      {selectedFeedItem.provider}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getSeverityBadge(
                        selectedFeedItem.severity
                      )}`}
                    >
                      {selectedFeedItem.severity}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded ${getTlpBadge(
                        selectedFeedItem.tlp
                      )}`}
                    >
                      {selectedFeedItem.tlp}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {new Date(selectedFeedItem.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-2 font-sans">
                    {selectedFeedItem.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={selectedFeedItem.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Open External Advisory"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setIsInspectionModalOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Drawer Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">

                {/* Threat Indicator Target Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono font-bold block">
                    Threat Indicator Target
                  </span>
                  <div className="font-mono text-xs text-indigo-700 font-bold break-all select-all bg-white p-2.5 rounded-lg border border-slate-200">
                    {selectedFeedItem.indicator}
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-[9px] text-slate-500 block uppercase">Type</span>
                      <span className="text-[11px] font-bold text-slate-800 uppercase">{selectedFeedItem.indicatorType}</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-[9px] text-slate-500 block uppercase">Confidence</span>
                      <span className="text-[11px] font-bold text-emerald-700">{selectedFeedItem.confidence}%</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-[9px] text-slate-500 block uppercase">Category</span>
                      <span className="text-[11px] font-bold text-amber-700 uppercase">{selectedFeedItem.threatType}</span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Intelligence Summary & Impact
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 font-sans">
                    {selectedFeedItem.description}
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Adversary & Threat Tags
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedFeedItem.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-700"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Raw STIX Payload Preview */}
                {selectedFeedItem.rawPayload && (
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-slate-500" />
                      <span>Raw STIX / JSON Ingest Record</span>
                    </h4>
                    <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl text-[10px] font-mono overflow-x-auto leading-relaxed max-h-36 border border-slate-800">
                      {selectedFeedItem.rawPayload}
                    </pre>
                  </div>
                )}

                {/* Ingest Action Button */}
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setIsInspectionModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer font-mono"
                  >
                    Close
                  </button>

                  <button
                    onClick={() => {
                      handleIngest(selectedFeedItem);
                    }}
                    disabled={ingestedFeedIds[selectedFeedItem.id] || selectedFeedItem.isIngested}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 disabled:bg-emerald-600 disabled:from-emerald-600 disabled:to-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs border border-red-500/40 transition-colors cursor-pointer font-mono"
                  >
                    {ingestedFeedIds[selectedFeedItem.id] || selectedFeedItem.isIngested ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added to IOC Database</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ingest into IOC Database</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Government Peer-Sync Header, Alerts Bulletin & Extreme Right Dossier Block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* 1. National Alert Level & Sync Console (Left, 3 cols) */}
            <div className="lg:col-span-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-xs space-y-3 flex flex-col justify-between font-mono">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                    <span>Directives</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 text-[9px] font-bold">
                    COND. YELLOW
                  </span>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-1 shadow-2xs">
                  <h3 className="text-[10px] font-bold text-slate-900 uppercase">
                    CISA SHIELDS UP BROADCAST
                  </h3>
                  <p className="text-[9.5px] text-slate-600 leading-relaxed font-sans">
                    National cyber posture at <strong className="text-amber-800 font-bold">Condition Yellow</strong> due to state scanning on municipal utilities.
                  </p>
                  <div className="flex items-center gap-1 pt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                    <span className="text-[9px] text-amber-800 font-bold font-mono">Active Aug 2026</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-[10px] font-bold text-slate-800 uppercase flex items-center gap-1.5 pb-1 border-b border-slate-200">
                    <Database className="w-3 h-3 text-indigo-600" />
                    <span>TAXII Trust Peers</span>
                  </h3>
                  <div className="divide-y divide-slate-100 bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-[9px] shadow-2xs">
                    <div className="flex items-center justify-between py-1">
                      <span className="font-semibold text-slate-700 truncate">DHS CISA AIS Hub</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> Live
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="font-semibold text-slate-700 truncate">Shadowserver Node</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> Live
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="font-semibold text-slate-700 truncate">SANS ISC Hub</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> Live
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="font-semibold text-slate-700 truncate">NATO CCDCOE</span>
                      <span className="text-indigo-600 font-bold flex items-center gap-1 shrink-0">
                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full" /> Peer
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="font-semibold text-slate-700 truncate">ENISA CSIRT</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1 shrink-0">
                        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" /> Live
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-1.5">
                <button
                  onClick={handleTaxiiSync}
                  disabled={taxiiSyncState === 'handshake' || taxiiSyncState === 'parsing'}
                  className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-indigo-500/30 shadow-2xs"
                >
                  <RefreshCw className={`w-3 h-3 ${taxiiSyncState === 'handshake' || taxiiSyncState === 'parsing' ? 'animate-spin' : ''}`} />
                  <span>
                    {taxiiSyncState === 'idle' && 'Force TAXII Sync'}
                    {taxiiSyncState === 'handshake' && 'Handshake...'}
                    {taxiiSyncState === 'parsing' && 'Parsing Delta...'}
                    {taxiiSyncState === 'synced' && 'Sync Complete'}
                  </span>
                </button>
                <div className={`p-1.5 rounded-lg border text-[8.5px] leading-snug transition-colors ${
                  taxiiSyncState === 'synced'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : taxiiSyncState === 'handshake' || taxiiSyncState === 'parsing'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
                    : 'bg-white border-slate-200 text-slate-500'
                }`}>
                  {taxiiSyncMsg}
                </div>
              </div>
            </div>

            {/* 2. National Alerts Bulletin Board (Middle, 4 cols - 50% Reduced Horizontal Width) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col justify-between font-mono">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2.5">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-red-600" />
                    <span>National Alert & Mitigation Bulletin</span>
                  </span>
                  <span className="text-[9px] text-slate-600 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    CISA-AIS
                  </span>
                </div>

                {/* Advisory Tabs / Cards (Compact List) */}
                <div className="space-y-2 overflow-y-auto max-h-[460px] pr-1">
                  {/* Advisory 1 - Sandworm ICS */}
                  <div
                    onClick={() => setSelectedAdvisoryId('adv-1')}
                    className={`p-2.5 border rounded-lg cursor-pointer transition-all ${
                      selectedAdvisoryId === 'adv-1'
                        ? 'border-red-500 bg-red-50/20 shadow-2xs ring-1 ring-red-500/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-800 border border-red-200 text-[8.5px] font-bold">
                        CISA AA26-238A
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">Aug 2026</span>
                    </div>
                    <h4 className="text-[10.5px] font-bold text-slate-900 leading-snug">
                      Sandworm APT Targeting Municipal Utilities & ICS/SCADA Networks
                    </h4>
                    <p className="text-[9px] text-slate-500 mt-1 line-clamp-2 leading-relaxed font-sans">
                      Identifying novel OT malware clusters targeting programmable logic controllers (PLCs) & power substations.
                    </p>
                    <div className="mt-1.5 pt-1 border-t border-slate-100 flex items-center justify-between text-[8.5px]">
                      <span className="text-red-700 font-bold">CRITICAL SECTOR ALERT</span>
                      <span className="text-slate-500 font-semibold flex items-center gap-0.5">
                        Inspect Dossier <ChevronRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>

                  {/* Advisory 2 - Mirai/Mozi */}
                  <div
                    onClick={() => setSelectedAdvisoryId('adv-2')}
                    className={`p-2.5 border rounded-lg cursor-pointer transition-all ${
                      selectedAdvisoryId === 'adv-2'
                        ? 'border-amber-500 bg-amber-50/20 shadow-2xs ring-1 ring-amber-500/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200 text-[8.5px] font-bold">
                        SHADOWSERVER
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">Aug 2026</span>
                    </div>
                    <h4 className="text-[10.5px] font-bold text-slate-900 leading-snug">
                      Active Mirai/Mozi Botnet Command Hijack on Enterprise Edge Gateways
                    </h4>
                    <p className="text-[9px] text-slate-500 mt-1 line-clamp-2 leading-relaxed font-sans">
                      Mass distributed scanning detected targeting unpatched enterprise VPN appliances & residential routers.
                    </p>
                    <div className="mt-1.5 pt-1 border-t border-slate-100 flex items-center justify-between text-[8.5px]">
                      <span className="text-amber-700 font-bold">HIGH THREAT LEVEL</span>
                      <span className="text-slate-500 font-semibold flex items-center gap-0.5">
                        Inspect Dossier <ChevronRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>

                  {/* Advisory 3 - SANS ISC */}
                  <div
                    onClick={() => setSelectedAdvisoryId('adv-3')}
                    className={`p-2.5 border rounded-lg cursor-pointer transition-all ${
                      selectedAdvisoryId === 'adv-3'
                        ? 'border-indigo-500 bg-indigo-50/20 shadow-2xs ring-1 ring-indigo-500/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 text-[8.5px] font-bold">
                        SANS ISC
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">Jul 2026</span>
                    </div>
                    <h4 className="text-[10.5px] font-bold text-slate-900 leading-snug">
                      Zero-Day Exploitation Campaign Bypassing Multi-Factor Authentication
                    </h4>
                    <p className="text-[9px] text-slate-500 mt-1 line-clamp-2 leading-relaxed font-sans">
                      Adversaries abusing misconfigured token replay methods in cloud enterprise software and identity providers.
                    </p>
                    <div className="mt-1.5 pt-1 border-t border-slate-100 flex items-center justify-between text-[8.5px]">
                      <span className="text-indigo-700 font-bold">INCIDENT ADVISORY</span>
                      <span className="text-slate-500 font-semibold flex items-center gap-0.5">
                        Inspect Dossier <ChevronRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[9px] text-slate-500 flex items-center justify-between">
                <span>Directives active: 3</span>
                <span className="text-emerald-700 font-bold">TAXII Stream Synchronized</span>
              </div>
            </div>

            {/* 3. Dossier: Sandworm ICS Table & Detailed Inspector (Extreme Right, 5 cols - Arranged Vertically) */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-xs font-mono flex flex-col justify-between space-y-3">
              {selectedAdvisoryId === 'adv-1' && (
                <div className="space-y-3 flex flex-col justify-between h-full">
                  {/* Header */}
                  <div className="pb-2 border-b border-slate-200 flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="px-1.5 py-0.2 text-[8.5px] font-bold text-red-700 bg-red-50 border border-red-200 rounded">
                          Critical Incident Directive
                        </span>
                        <span className="text-[9px] text-slate-500">CISA AA26-238A</span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase">
                        Dossier: Sandworm ICS Targeting campaign (Directive AA26-238A)
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-sans">
                        Affected Targets: Municipal Water Systems, Local Hydroelectric Plants, Industrial PLCs
                      </p>
                    </div>
                  </div>

                  {/* Vertical Section 1: Observed Indicators (STIX Pattern & Technical Table) */}
                  <div className="bg-white border border-slate-200 p-2.5 rounded-lg space-y-2 shadow-2xs">
                    <span className="text-[9.5px] uppercase text-slate-600 font-bold block pb-1 border-b border-slate-100 flex items-center justify-between">
                      <span>1. Observed Technical Indicators & STIX Pattern</span>
                      <span className="text-indigo-700 text-[8px] font-mono bg-indigo-50 px-1 py-0.2 rounded border border-indigo-200">
                        STIX 2.1 Pattern
                      </span>
                    </span>
                    
                    <pre className="text-[9.5px] text-indigo-700 font-mono font-bold whitespace-pre-wrap break-all select-all bg-slate-50 p-2 rounded border border-slate-200 leading-snug">
                      [ipv4-addr:value = '198.51.100.82'] AND [file:hashes.'SHA-256' = '7e9c80d46293abff1b3bc229d4d293f7c4613c2333b664d4d62b9a117b4c803f']
                    </pre>

                    {/* Dossier Sandworm ICS Technical Attribute Table */}
                    <div className="overflow-x-auto pt-1">
                      <table className="w-full text-[9px] text-left border-collapse font-mono">
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          <tr>
                            <td className="py-1 px-1.5 font-bold text-slate-500 bg-slate-50/70 w-28">Incursion Vector</td>
                            <td className="py-1 px-1.5 font-semibold text-slate-900">CaddyWiper OT Payload Injector (Industroyer2)</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-1.5 font-bold text-slate-500 bg-slate-50/70">Attributed Actor</td>
                            <td className="py-1 px-1.5 font-semibold text-red-700">Sandworm (GRU Unit 74455 / APT44)</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-1.5 font-bold text-slate-500 bg-slate-50/70">Target Protocols</td>
                            <td className="py-1 px-1.5 text-slate-800">IEC 60870-5-104, TCP/502 (Modbus SCADA)</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-1.5 font-bold text-slate-500 bg-slate-50/70">C2 Endpoint</td>
                            <td className="py-1 px-1.5 text-indigo-700 font-bold select-all">198.51.100.82:502</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Vertical Section 2: Government Mitigation Guidance */}
                  <div className="bg-white border border-slate-200 p-2.5 rounded-lg space-y-1.5 shadow-2xs text-slate-700">
                    <span className="text-[9.5px] uppercase text-slate-600 font-bold block pb-1 border-b border-slate-100">
                      2. Government Mitigation Guidance
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-[10px] font-sans">
                      <li>Enforce isolated VLANs for all SCADA logic loops and subnets.</li>
                      <li>Deploy network ACL limits blocking port 502/TCP (Modbus) ingress boundaries.</li>
                      <li>Rotate administrative hardware tokens on secondary telemetry units.</li>
                    </ul>
                  </div>

                  {/* Vertical Section 3: Automated Playbook Interventions */}
                  <div className="bg-white border border-slate-200 p-2.5 rounded-lg space-y-2 shadow-2xs">
                    <span className="text-[9.5px] uppercase text-slate-600 font-bold block pb-1 border-b border-slate-100">
                      3. Automated Playbook Interventions
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setMitigationsDeployed((p) => ({ ...p, adv1: true }))}
                        className={`w-full py-2 rounded-lg text-[10px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                          mitigationsDeployed.adv1
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-600 hover:bg-red-500 text-white border border-red-500'
                        }`}
                      >
                        {mitigationsDeployed.adv1 ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Perimeter Block Active</span>
                          </>
                        ) : (
                          <>
                            <Shield className="w-3 h-3" />
                            <span>Inject CISA Blocks</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ type: 'bundle', id: 'stix-bundle-aa26-238a' }));
                          link.download = 'stix-aa26-238a-sandworm.json';
                          link.click();
                        }}
                        className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Download className="w-3 h-3" />
                        <span>Export STIX 2.1</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedAdvisoryId === 'adv-2' && (
                <div className="space-y-3 flex flex-col justify-between h-full">
                  {/* Header */}
                  <div className="pb-2 border-b border-slate-200 flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="px-1.5 py-0.2 text-[8.5px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded">
                          High Incident Threat
                        </span>
                        <span className="text-[9px] text-slate-500">SHADOWSERVER DIRECTIVE</span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase">
                        Dossier: Active Mirai/Mozi Botnet Command Hijack
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-sans">
                        Affected Targets: Router Gateways, IoT Peripherals, Enterprise Edge Firewalls
                      </p>
                    </div>
                  </div>

                  {/* Vertical Section 1 */}
                  <div className="bg-white border border-slate-200 p-2.5 rounded-lg space-y-2 shadow-2xs">
                    <span className="text-[9.5px] uppercase text-slate-600 font-bold block pb-1 border-b border-slate-100 flex items-center justify-between">
                      <span>1. Observed Technical Indicators & STIX Pattern</span>
                      <span className="text-amber-700 text-[8px] font-mono bg-amber-50 px-1 py-0.2 rounded border border-amber-200">
                        STIX 2.1 Pattern
                      </span>
                    </span>
                    
                    <pre className="text-[9.5px] text-indigo-700 font-mono font-bold whitespace-pre-wrap break-all select-all bg-slate-50 p-2 rounded border border-slate-200 leading-snug">
                      [url:value = 'http://45.227.254.12/bin.sh'] OR [domain:value = 'mirai-command-hub.su']
                    </pre>

                    <div className="overflow-x-auto pt-1">
                      <table className="w-full text-[9px] text-left border-collapse font-mono">
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          <tr>
                            <td className="py-1 px-1.5 font-bold text-slate-500 bg-slate-50/70 w-28">Incursion Vector</td>
                            <td className="py-1 px-1.5 font-semibold text-slate-900">UPnP / TR-069 Edge Exploitation & Dropper</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-1.5 font-bold text-slate-500 bg-slate-50/70">Attributed Actor</td>
                            <td className="py-1 px-1.5 font-semibold text-amber-700">Mirai/Mozi Autonomous Worm Mesh</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-1.5 font-bold text-slate-500 bg-slate-50/70">Target Protocols</td>
                            <td className="py-1 px-1.5 text-slate-800">TCP/23 (Telnet), TCP/2323, TCP/7547</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-1.5 font-bold text-slate-500 bg-slate-50/70">C2 Hub Domain</td>
                            <td className="py-1 px-1.5 text-indigo-700 font-bold select-all">mirai-command-hub.su</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Vertical Section 2 */}
                  <div className="bg-white border border-slate-200 p-2.5 rounded-lg space-y-1.5 shadow-2xs text-slate-700">
                    <span className="text-[9.5px] uppercase text-slate-600 font-bold block pb-1 border-b border-slate-100">
                      2. Government Mitigation Guidance
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-[10px] font-sans">
                      <li>Restrict universal UPnP inbound mapping on WAN ports.</li>
                      <li>Run immediate memory scans on gateway systems to identify raw ELF binary payloads.</li>
                      <li>Verify SSH/Telnet terminal ports do not face public IP networks.</li>
                    </ul>
                  </div>

                  {/* Vertical Section 3 */}
                  <div className="bg-white border border-slate-200 p-2.5 rounded-lg space-y-2 shadow-2xs">
                    <span className="text-[9.5px] uppercase text-slate-600 font-bold block pb-1 border-b border-slate-100">
                      3. Automated Playbook Interventions
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setMitigationsDeployed((p) => ({ ...p, adv2: true }))}
                        className={`w-full py-2 rounded-lg text-[10px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                          mitigationsDeployed.adv2
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-600 hover:bg-amber-500 text-white border border-amber-500'
                        }`}
                      >
                        {mitigationsDeployed.adv2 ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Domain Rules Active</span>
                          </>
                        ) : (
                          <>
                            <Shield className="w-3 h-3" />
                            <span>Deploy Domain Blocks</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ type: 'bundle', id: 'stix-bundle-shadowserver-mirai' }));
                          link.download = 'stix-shadowserver-mirai.json';
                          link.click();
                        }}
                        className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Download className="w-3 h-3" />
                        <span>Export STIX 2.1</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedAdvisoryId === 'adv-3' && (
                <div className="space-y-3 flex flex-col justify-between h-full">
                  {/* Header */}
                  <div className="pb-2 border-b border-slate-200 flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="px-1.5 py-0.2 text-[8.5px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded">
                          Incident Advisory
                        </span>
                        <span className="text-[9px] text-slate-500">SANS ISC DIRECTIVE</span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase">
                        Dossier: Zero-Day Bypass Exploitation Campaign
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-sans">
                        Affected Targets: Cloud Directories, SSO Portals, Active Directories
                      </p>
                    </div>
                  </div>

                  {/* Vertical Section 1 */}
                  <div className="bg-white border border-slate-200 p-2.5 rounded-lg space-y-2 shadow-2xs">
                    <span className="text-[9.5px] uppercase text-slate-600 font-bold block pb-1 border-b border-slate-100 flex items-center justify-between">
                      <span>1. Observed Technical Indicators & STIX Pattern</span>
                      <span className="text-indigo-700 text-[8px] font-mono bg-indigo-50 px-1 py-0.2 rounded border border-indigo-200">
                        STIX 2.1 Pattern
                      </span>
                    </span>
                    
                    <pre className="text-[9.5px] text-indigo-700 font-mono font-bold whitespace-pre-wrap break-all select-all bg-slate-50 p-2 rounded border border-slate-200 leading-snug">
                      [ipv4-addr:value = '203.0.113.14'] AND [user-account:user_id = 'SYSTEM_SECURE']
                    </pre>

                    <div className="overflow-x-auto pt-1">
                      <table className="w-full text-[9px] text-left border-collapse font-mono">
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          <tr>
                            <td className="py-1 px-1.5 font-bold text-slate-500 bg-slate-50/70 w-28">Incursion Vector</td>
                            <td className="py-1 px-1.5 font-semibold text-slate-900">OAuth / SAML Token Session Replay</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-1.5 font-bold text-slate-500 bg-slate-50/70">Attributed Actor</td>
                            <td className="py-1 px-1.5 font-semibold text-indigo-700">APT29 (Cozy Bear / Midnight Blizzard)</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-1.5 font-bold text-slate-500 bg-slate-50/70">Target Protocols</td>
                            <td className="py-1 px-1.5 text-slate-800">HTTPS/443, OAuth2.0 Token Bearer</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-1.5 font-bold text-slate-500 bg-slate-50/70">Origin IP Address</td>
                            <td className="py-1 px-1.5 text-indigo-700 font-bold select-all">203.0.113.14</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Vertical Section 2 */}
                  <div className="bg-white border border-slate-200 p-2.5 rounded-lg space-y-1.5 shadow-2xs text-slate-700">
                    <span className="text-[9.5px] uppercase text-slate-600 font-bold block pb-1 border-b border-slate-100">
                      2. Government Mitigation Guidance
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-[10px] font-sans">
                      <li>Audit directories to verify no orphan tokens enjoy long expiration parameters.</li>
                      <li>Force re-authentication for any system administrator logs matching outside corporate IPs.</li>
                      <li>Deactivate Legacy Basic Authentication endpoints immediately.</li>
                    </ul>
                  </div>

                  {/* Vertical Section 3 */}
                  <div className="bg-white border border-slate-200 p-2.5 rounded-lg space-y-2 shadow-2xs">
                    <span className="text-[9.5px] uppercase text-slate-600 font-bold block pb-1 border-b border-slate-100">
                      3. Automated Playbook Interventions
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setMitigationsDeployed((p) => ({ ...p, adv3: true }))}
                        className={`w-full py-2 rounded-lg text-[10px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                          mitigationsDeployed.adv3
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500'
                        }`}
                      >
                        {mitigationsDeployed.adv3 ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Audit Rules Deployed</span>
                          </>
                        ) : (
                          <>
                            <Shield className="w-3 h-3" />
                            <span>Trigger Token Re-verification</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ type: 'bundle', id: 'stix-bundle-sans-auth' }));
                          link.download = 'stix-sans-mfa-zero.json';
                          link.click();
                        }}
                        className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Download className="w-3 h-3" />
                        <span>Export STIX 2.1</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Part C: Critical Infrastructure Sector Exposure Matrix */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs font-mono space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Critical Infrastructure Exposure & Threat Vectors Matrix</span>
              </span>
              <span className="text-xs text-slate-500">Sectoral Vulnerability Indexes</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-1 px-1.5 font-bold uppercase">Sector Identifier</th>
                    <th className="py-1 px-1.5 font-bold uppercase">Current Alert Level</th>
                    <th className="py-1 px-1.5 font-bold uppercase">Primary State-Sponsored APT threat</th>
                    <th className="py-1 px-1.5 font-bold uppercase text-center">National Mitigation Index</th>
                    <th className="py-1 px-1.5 font-bold uppercase text-right font-mono">Action Playbooks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {/* Sector 1 */}
                  <tr>
                    <td className="py-1 px-1.5 font-semibold text-slate-900">Energy & Electrical Grid Systems</td>
                    <td className="py-1 px-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 font-bold border border-red-200 text-[11px]">CRITICAL</span>
                    </td>
                    <td className="py-1 px-1.5 font-mono">Sandworm (APT28/APT44)</td>
                    <td className="py-1 px-1.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-slate-100 border border-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full rounded-full" style={{ width: '92%' }} />
                        </div>
                        <span className="text-[11px] text-slate-500">92%</span>
                      </div>
                    </td>
                    <td className="py-1 px-1.5 text-right">
                      <button
                        onClick={() => setSectorScanning((p) => ({ ...p, energy: true }))}
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          sectorScanning.energy
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-pointer'
                        }`}
                      >
                        {sectorScanning.energy ? 'Completed' : 'Audit'}
                      </button>
                    </td>
                  </tr>

                  {/* Sector 2 */}
                  <tr>
                    <td className="py-1 px-1.5 font-semibold text-slate-900">Government & Municipal Civil Services</td>
                    <td className="py-1 px-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-200 text-[11px]">HIGH LEVEL</span>
                    </td>
                    <td className="py-1 px-1.5 font-mono">APT29 (Cozy Bear)</td>
                    <td className="py-1 px-1.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-slate-100 border border-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: '85%' }} />
                        </div>
                        <span className="text-[11px] text-slate-500">85%</span>
                      </div>
                    </td>
                    <td className="py-1 px-1.5 text-right">
                      <button
                        onClick={() => setSectorScanning((p) => ({ ...p, gov: true }))}
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          sectorScanning.gov
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-pointer'
                        }`}
                      >
                        {sectorScanning.gov ? 'Completed' : 'Audit'}
                      </button>
                    </td>
                  </tr>

                  {/* Sector 3 */}
                  <tr>
                    <td className="py-1 px-1.5 font-semibold text-slate-900">Defence & Commercial Aerospace</td>
                    <td className="py-1 px-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 font-bold border border-red-200 text-[11px]">CRITICAL</span>
                    </td>
                    <td className="py-1 px-1.5 font-mono">Lazarus Group (Kimsuky)</td>
                    <td className="py-1 px-1.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-slate-100 border border-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full rounded-full" style={{ width: '97%' }} />
                        </div>
                        <span className="text-[11px] text-slate-500">97%</span>
                      </div>
                    </td>
                    <td className="py-1 px-1.5 text-right">
                      <button
                        onClick={() => setSectorScanning((p) => ({ ...p, defense: true }))}
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          sectorScanning.defense
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-pointer'
                        }`}
                      >
                        {sectorScanning.defense ? 'Completed' : 'Audit'}
                      </button>
                    </td>
                  </tr>

                  {/* Sector 4 */}
                  <tr>
                    <td className="py-1 px-1.5 font-semibold text-slate-900">Healthcare Facilities & Hospitals</td>
                    <td className="py-1 px-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-800 font-bold border border-yellow-200 text-[11px]">MEDIUM</span>
                    </td>
                    <td className="py-1 px-1.5 font-mono">BlackCat / LockBit ransomware</td>
                    <td className="py-1 px-1.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-slate-100 border border-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-yellow-500 h-full rounded-full" style={{ width: '74%' }} />
                        </div>
                        <span className="text-[11px] text-slate-500">74%</span>
                      </div>
                    </td>
                    <td className="py-1 px-1.5 text-right">
                      <button
                        onClick={() => setSectorScanning((p) => ({ ...p, health: true }))}
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          sectorScanning.health
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-pointer'
                        }`}
                      >
                        {sectorScanning.health ? 'Completed' : 'Audit'}
                      </button>
                    </td>
                  </tr>

                  {/* Sector 5 */}
                  <tr>
                    <td className="py-1 px-1.5 font-semibold text-slate-900">Municipal Water & SCADA Networks</td>
                    <td className="py-1 px-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-200 text-[11px]">HIGH LEVEL</span>
                    </td>
                    <td className="py-1 px-1.5 font-mono">Volt Typhoon (APT41)</td>
                    <td className="py-1 px-1.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-slate-100 border border-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: '88%' }} />
                        </div>
                        <span className="text-[11px] text-slate-500">88%</span>
                      </div>
                    </td>
                    <td className="py-1 px-1.5 text-right">
                      <button
                        onClick={() => setSectorScanning((p) => ({ ...p, water: true }))}
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          sectorScanning.water
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-pointer'
                        }`}
                      >
                        {sectorScanning.water ? 'Completed' : 'Audit'}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
