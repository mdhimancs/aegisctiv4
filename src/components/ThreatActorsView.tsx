import React, { useState } from 'react';
import {
  Users,
  Shield,
  Target,
  Flame,
  Globe,
  Radio,
  Cpu,
  Terminal,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Bug,
  Activity,
  Zap,
  Lock
} from 'lucide-react';
import { ThreatActor, DiamondModel } from '../types';

interface ThreatActorsViewProps {
  actors: ThreatActor[];
  selectedActor: ThreatActor | null;
  onSelectActor: (actor: ThreatActor) => void;
  onGenerateActorRule: (actor: ThreatActor) => void;
}

const getFlagEmoji = (countryCode: string) => {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export const ThreatActorsView: React.FC<ThreatActorsViewProps> = ({
  actors,
  selectedActor,
  onSelectActor,
  onGenerateActorRule,
}) => {
  const currentActor = selectedActor || actors[0];

  const [sortOption, setSortOption] = useState<'default' | 'name' | 'sophistication' | 'motivation' | 'sponsor'>('default');
  const [selectedTTP, setSelectedTTP] = useState<string | null>(null);

  // Reset selection when actor changes
  React.useEffect(() => {
    setSelectedTTP(null);
  }, [currentActor.id]);

  const sortedActors = [...actors].sort((a, b) => {
    if (sortOption === 'default') {
      const sophOrder: Record<string, number> = { 'elite': 3, 'advanced': 2, 'intermediate': 1 };
      const sDiff = (sophOrder[b.sophistication] || 0) - (sophOrder[a.sophistication] || 0);
      if (sDiff !== 0) return sDiff;
      
      const mDiff = a.motivation.localeCompare(b.motivation);
      if (mDiff !== 0) return mDiff;
      
      const cDiff = a.originCountry.localeCompare(b.originCountry);
      if (cDiff !== 0) return cDiff;
      
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'sophistication') {
      const sophOrder: Record<string, number> = { 'elite': 3, 'advanced': 2, 'intermediate': 1 };
      return (sophOrder[b.sophistication] || 0) - (sophOrder[a.sophistication] || 0);
    } else if (sortOption === 'motivation') {
      return a.motivation.localeCompare(b.motivation);
    } else if (sortOption === 'sponsor') {
      return a.originCountry.localeCompare(b.originCountry);
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-3 text-slate-900 font-sans">
      {/* Unified Offensive Intelligence Header */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shadow-sm">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] leading-none mb-1.5">
              Unified Offensive Intelligence
            </h2>
            <h3 className="text-sm font-bold text-slate-900 font-mono tracking-tight">
              Strategic Adversary Registry & Tactical APT Dossier
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
      {/* Left Column: Actor Directory List (2.5 cols) */}
      <div className="lg:col-span-2 space-y-2">
        <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm h-full">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
            <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.1em] flex items-center gap-1.5 font-mono">
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>Registry</span>
            </h3>
            
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="text-[9px] font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 outline-none cursor-pointer uppercase font-mono"
            >
              <option value="default">Sort</option>
              <option value="name">Name</option>
              <option value="sophistication">Tier</option>
              <option value="motivation">Goal</option>
              <option value="sponsor">State</option>
            </select>
          </div>

          <div className="space-y-1 max-h-[780px] overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-slate-200">
            {sortedActors.map((actor) => {
              const isSelected = currentActor?.id === actor.id;
              return (
                <div
                  key={actor.id}
                  onClick={() => onSelectActor(actor)}
                  className={`p-2 rounded-lg border transition-all cursor-pointer group relative overflow-hidden ${
                    isSelected
                      ? 'bg-red-50/30 border-red-200 ring-1 ring-red-500/10'
                      : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: actor.avatarColor || '#EF4444' }}
                      />
                      <h4 className={`text-[11px] font-bold truncate font-mono tracking-tight ${isSelected ? 'text-red-700' : 'text-slate-900'}`}>
                        {actor.name}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-1 pt-1 border-t border-slate-50">
                    <div className="text-[9px] font-mono text-slate-400 font-bold flex items-center gap-1">
                      <span>{getFlagEmoji(actor.countryCode)}</span>
                      <span className="truncate max-w-[60px]">{actor.originCountry}</span>
                    </div>
                    <span className="text-[9px] text-amber-600 font-bold uppercase tracking-tight shrink-0">
                      {actor.motivation}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Center Column: Intelligence Workspace (7 cols) */}
      <div className="lg:col-span-7 space-y-2">
        {currentActor ? (
          <div className="space-y-2">
            {/* Dossier Header Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs relative overflow-hidden group">
              <div className="flex flex-wrap items-start justify-between gap-2.5 relative z-10">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-red-600 rounded-full" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-black text-slate-900 font-mono tracking-tight">{currentActor.name}</h2>
                        <span className="px-1.5 py-0.2 rounded bg-red-600 text-white text-[9px] font-mono uppercase font-bold">
                          {currentActor.status}
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.2 uppercase tracking-wider font-bold">
                        Identifiers: <span className="text-indigo-600">{currentActor.aliases.join(', ')}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onGenerateActorRule(currentActor)}
                  className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer font-mono uppercase"
                >
                  <Sparkles className="w-2.5 h-2.5 text-pink-200" />
                  <span>Synthesize</span>
                </button>
              </div>

              {/* Intelligence Grid & Dossier Summary Section */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-2 border-t border-slate-200 pt-3 font-mono">
                {/* Intelligence Core (6 cols) */}
                <div className="md:col-span-6 space-y-2 pr-3 border-r border-slate-100">
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Briefing Summary</h4>
                  <div className="text-[11px] text-slate-600 leading-relaxed font-sans italic space-y-1.5">
                    {currentActor.description.split('. ').map((sentence, idx, arr) => (
                      <p key={idx} className="relative pl-3">
                        <span className="absolute left-0 top-1.5 w-1 h-1 rounded-full bg-slate-300" />
                        {sentence.trim()}{(!sentence.trim().endsWith('.') && idx < arr.length - 1) ? '.' : ''}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Metadata Grid (6 cols) */}
                <div className="md:col-span-6 grid grid-cols-1 gap-1">
                  <div className="p-1 hover:bg-slate-50 transition-colors rounded">
                    <span className="text-[8px] uppercase text-slate-400 font-bold block mb-0.5">Origin</span>
                    <span className="font-bold text-slate-800 text-[10px] flex items-center gap-1">
                      {getFlagEmoji(currentActor.countryCode)} {currentActor.originCountry}
                    </span>
                  </div>
                  <div className="p-1 hover:bg-slate-50 transition-colors rounded border-t border-slate-50">
                    <span className="text-[8px] uppercase text-slate-400 font-bold block mb-0.5">Sponsor</span>
                    <span className="font-bold text-amber-600 uppercase text-[10px]">{currentActor.sponsorType.replace('_', ' ')}</span>
                  </div>
                  <div className="p-1 hover:bg-slate-50 transition-colors rounded border-t border-slate-50">
                    <span className="text-[8px] uppercase text-slate-400 font-bold block mb-0.5">Tier</span>
                    <span className="font-bold text-red-600 uppercase text-[10px]">{currentActor.sophistication}</span>
                  </div>
                  <div className="p-1 hover:bg-slate-50 transition-colors rounded border-t border-slate-50">
                    <span className="text-[8px] uppercase text-slate-400 font-bold block mb-0.5">Motivation</span>
                    <span className="font-bold text-orange-600 uppercase text-[10px]">{currentActor.motivation}</span>
                  </div>
                  <div className="p-1 hover:bg-slate-50 transition-colors rounded border-t border-slate-50">
                    <span className="text-[8px] uppercase text-slate-400 font-bold block mb-0.5">Platforms</span>
                    <span className="font-bold text-slate-700 text-[10px] break-words block">{currentActor.platforms.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Diamond Model of Intrusion Visualizer */}
            <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 mb-2">
                <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-[0.1em] flex items-center gap-2 font-mono">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Diamond Model Matrix</span>
                </h3>
              </div>
 
              <div className="grid grid-cols-4 gap-2 font-mono text-[10px]">
                <div className="bg-red-50/20 p-2 rounded-lg border border-red-100">
                  <div className="flex items-center gap-1 text-[8px] font-black text-red-700 uppercase mb-1 border-b border-red-100/50 pb-1">
                    <Target className="w-2.5 h-2.5" />
                    <span>Adversary</span>
                  </div>
                  <div className="space-y-1 text-slate-600 leading-snug font-sans">
                    {currentActor.diamondModel.adversary.split(/[,;]/).map((point, idx) => (
                      <p key={idx} className="flex items-start gap-1">
                        <span className="shrink-0 mt-1 w-1 h-1 rounded-full bg-red-400" />
                        {point.trim()}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-50/20 p-2 rounded-lg border border-purple-100">
                  <div className="flex items-center gap-1 text-[8px] font-black text-purple-700 uppercase mb-1 border-b border-purple-100/50 pb-1">
                    <Cpu className="w-2.5 h-2.5" />
                    <span>Capability</span>
                  </div>
                  <div className="space-y-1 text-slate-600 leading-snug font-sans">
                    {currentActor.diamondModel.capability.split(/[,;]/).map((point, idx) => (
                      <p key={idx} className="flex items-start gap-1">
                        <span className="shrink-0 mt-1 w-1 h-1 rounded-full bg-purple-400" />
                        {point.trim()}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="bg-sky-50/20 p-2 rounded-lg border border-sky-100">
                  <div className="flex items-center gap-1 text-[8px] font-black text-sky-700 uppercase mb-1 border-b border-sky-100/50 pb-1">
                    <Globe className="w-2.5 h-2.5" />
                    <span>Infrastructure</span>
                  </div>
                  <div className="space-y-1 text-slate-600 leading-snug font-sans">
                    {currentActor.diamondModel.infrastructure.split(/[,;]/).map((point, idx) => (
                      <p key={idx} className="flex items-start gap-1">
                        <span className="shrink-0 mt-1 w-1 h-1 rounded-full bg-sky-400" />
                        {point.trim()}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-50/20 p-2 rounded-lg border border-emerald-100">
                  <div className="flex items-center gap-1 text-[8px] font-black text-emerald-700 uppercase mb-1 border-b border-emerald-100/50 pb-1">
                    <Shield className="w-2.5 h-2.5" />
                    <span>Victimology</span>
                  </div>
                  <div className="space-y-1 text-slate-600 leading-snug font-sans">
                    {currentActor.diamondModel.victim.split(/[,;]/).map((point, idx) => (
                      <p key={idx} className="flex items-start gap-1">
                        <span className="shrink-0 mt-1 w-1 h-1 rounded-full bg-emerald-400" />
                        {point.trim()}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white border border-slate-200 rounded-xl p-2.5 space-y-1.5">
                <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-3 h-3 text-indigo-600" />
                  <span>Targeted Industries</span>
                </h3>
                <div className="flex flex-wrap gap-0.5">
                  {currentActor.targetSectors.map((sector, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-[9px] text-indigo-700 font-bold uppercase">
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-2.5 space-y-1.5">
                <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Flame className="w-3 h-3 text-rose-600" />
                  <span>Weaponized CVEs</span>
                </h3>
                <div className="flex flex-wrap gap-0.5">
                  {currentActor.cvesExploited.map((cve, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 bg-amber-50 border border-amber-100 rounded text-[9px] text-amber-700 font-bold uppercase">
                      {cve}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center text-slate-500 font-mono shadow-xs text-[10px]">
            Select an adversary from the left directory to view full intelligence dossier.
          </div>
        )}
      </div>

      {/* Right Column: Tactical Frameworks (3 cols) */}
      <div className="lg:col-span-3 space-y-2">
        {currentActor && (
          <div className="space-y-2 font-mono overflow-y-auto max-h-[850px] pr-0.5 scrollbar-thin scrollbar-thumb-slate-200">
            {/* MITRE ATT&CK */}
            <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-xs space-y-1.5">
              <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5 pb-1 border-b border-slate-100">
                <Terminal className="w-3 h-3 text-emerald-600" />
                <span className="whitespace-nowrap">MITRE ATT&CK</span>
              </h3>
              <div className="flex flex-col gap-1">
                {currentActor.primaryTTPs.map((ttp, idx) => {
                  const ttpCode = ttp.split(' ')[0];
                  const isSelected = selectedTTP === ttpCode;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedTTP(isSelected ? null : ttpCode)}
                      className={`p-1.5 rounded border text-[9px] text-slate-700 leading-tight cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-400/20 shadow-xs' 
                          : 'bg-slate-50/30 border-slate-100 hover:border-emerald-300'
                      }`}
                    >
                      <span className={`${isSelected ? 'font-bold text-emerald-900' : ''} break-words`}>{ttp}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MITRE D3FEND */}
            <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-xs space-y-1.5">
              <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5 pb-1 border-b border-slate-100">
                <Shield className="w-3 h-3 text-blue-600" />
                <span className="whitespace-nowrap">MITRE D3FEND</span>
              </h3>
              <div className="flex flex-col gap-1">
                {(currentActor.mitreD3fend || []).map((d3f, idx) => {
                  const isHighlighted = selectedTTP && d3f.relatedTTPs?.some(code => selectedTTP.startsWith(code));
                  return (
                    <div 
                      key={idx} 
                      className={`p-1.5 rounded border flex flex-col gap-0.5 transition-all ${
                        isHighlighted 
                          ? 'bg-blue-100 border-blue-400 ring-1 ring-blue-400/30 shadow-xs' 
                          : 'bg-blue-50/20 border-blue-100'
                      }`}
                    >
                      <span className={`text-[9px] font-bold ${isHighlighted ? 'text-blue-900' : 'text-blue-800'} break-words`}>{d3f.name}</span>
                      <p className={`text-[8px] leading-tight ${isHighlighted ? 'text-blue-700' : 'text-blue-600'} break-words`}>{d3f.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MITRE ATLAS */}
            <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-xs space-y-1.5">
              <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5 pb-1 border-b border-slate-100">
                <Cpu className="w-3 h-3 text-purple-600" />
                <span className="whitespace-nowrap">MITRE ATLAS</span>
              </h3>
              <div className="flex flex-col gap-1">
                {(currentActor.mitreAtlas || []).map((atlas, idx) => {
                  const isHighlighted = selectedTTP && atlas.relatedTTPs?.some(code => selectedTTP.startsWith(code));
                  return (
                    <div 
                      key={idx} 
                      className={`p-1.5 rounded border flex flex-col gap-0.5 transition-all ${
                        isHighlighted 
                          ? 'bg-purple-100 border-purple-400 ring-1 ring-purple-400/30 shadow-xs' 
                          : 'bg-purple-50/20 border-purple-100'
                      }`}
                    >
                      <span className={`text-[9px] font-bold ${isHighlighted ? 'text-purple-900' : 'text-purple-800'} break-words`}>{atlas.name}</span>
                      <p className={`text-[8px] leading-tight ${isHighlighted ? 'text-purple-700' : 'text-purple-600'} break-words`}>{atlas.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SPIFFE / SPIRE */}
            <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-xs space-y-1.5">
              <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5 pb-1 border-b border-slate-100">
                <Lock className="w-3 h-3 text-teal-600" />
                <span className="whitespace-nowrap">SPIFFE / SPIRE</span>
              </h3>
              <div className="flex flex-col gap-1">
                {(currentActor.spiffeSpire || []).map((spiffe, idx) => {
                  const isHighlighted = selectedTTP && spiffe.relatedTTPs?.some(code => selectedTTP.startsWith(code));
                  return (
                    <div 
                      key={idx} 
                      className={`p-1.5 rounded border flex flex-col gap-0.5 transition-all ${
                        isHighlighted 
                          ? 'bg-teal-100 border-teal-400 ring-1 ring-teal-400/30 shadow-xs' 
                          : 'bg-teal-50/20 border-teal-100'
                      }`}
                    >
                      <span className={`text-[9px] font-bold ${isHighlighted ? 'text-teal-900' : 'text-teal-800'} break-words`}>{spiffe.name}</span>
                      <p className={`text-[8px] leading-tight ${isHighlighted ? 'text-teal-700' : 'text-teal-600'} break-words`}>{spiffe.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};
