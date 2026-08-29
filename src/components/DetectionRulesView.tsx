import React, { useState } from 'react';
import {
  Terminal,
  FileCode,
  Search,
  Plus,
  Copy,
  Check,
  Sparkles,
  Download,
  Shield,
  Layers,
  ExternalLink,
  Code
} from 'lucide-react';
import { DetectionRule, SeverityLevel } from '../types';

interface DetectionRulesViewProps {
  rules: DetectionRule[];
  onAddRule: (rule: DetectionRule) => void;
}

export const DetectionRulesView: React.FC<DetectionRulesViewProps> = ({
  rules,
  onAddRule
}) => {
  const [selectedRuleType, setSelectedRuleType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Rule Generator Form State
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [genType, setGenType] = useState<'YARA' | 'Sigma' | 'Snort'>('YARA');
  const [genThreat, setGenThreat] = useState('');
  const [genDesc, setGenDesc] = useState('');
  const [genTTP, setGenTTP] = useState('');
  const [genArtifacts, setGenArtifacts] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredRules = rules.filter((rule) => {
    const matchType = selectedRuleType === 'all' || rule.type === selectedRuleType;
    const matchSearch =
      !searchQuery ||
      rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.targetThreat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.ruleContent.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSynthesizeRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genThreat.trim()) return;

    try {
      setIsGenerating(true);
      const res = await fetch('/api/threat-intel/generate-rule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ruleType: genType,
          threatName: genThreat.trim(),
          description: genDesc.trim(),
          ttp: genTTP.trim(),
          targetArtifacts: genArtifacts.trim()
        })
      });

      if (!res.ok) throw new Error('Failed to generate rule');
      const data = await res.json();

      const newRule: DetectionRule = {
        id: `rule-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title: data.title || `${genThreat.replace(/\s+/g, '_')}_Detection`,
        type: genType,
        severity: (data.severity as SeverityLevel) || 'high',
        author: data.author || 'Aegis Threat Intelligence Studio',
        targetThreat: genThreat.trim(),
        targetTTP: data.targetTTP || genTTP.trim() || 'T1059',
        ruleContent: data.ruleContent || '# Rule synthesized',
        dateCreated: new Date().toISOString().split('T')[0],
        description: data.description || genDesc || 'Synthesized detection rule.',
        status: 'production'
      };

      onAddRule(newRule);
      setIsSynthesizing(false);
      setGenThreat('');
      setGenDesc('');
      setGenTTP('');
      setGenArtifacts('');
    } catch (err) {
      console.error('Rule synthesis failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const getRuleTypeBadge = (type: string) => {
    switch (type) {
      case 'YARA':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Sigma':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Snort':
      case 'Suricata':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatRuleContent = (content: string, type: string) => {
    if ((type === 'Snort' || type === 'Suricata') && !content.includes('\n')) {
      return content
        .replace(/\s*\(\s*/, ' (\n    ')
        .replace(/;\s*/g, ';\n    ')
        .replace(/\n\s*;\s*$/, ';')
        .replace(/\n\s*\)\s*$/, '\n)');
    }
    return content;
  };

  return (
    <div className="space-y-4 text-slate-900 font-sans">
      {/* Header Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">
              Unified Offensive Intelligence
            </h2>
            <h3 className="text-[11px] sm:text-xs font-bold text-slate-900 font-mono">
              Aegis Threat Hunting & Detection Engineering Rules
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
              Production YARA memory/binary signatures, generic Sigma SIEM rules, and Snort/Suricata network IDS signatures
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSynthesizing(!isSynthesizing)}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs border border-red-500/40 transition-all cursor-pointer font-mono"
          >
            <Sparkles className="w-4 h-4 text-pink-200" />
            <span>Synthesize Custom Rule (AI)</span>
          </button>
        </div>
      </div>

      {/* Synthesis Modal / Expanded Form */}
      {isSynthesizing && (
        <form
          onSubmit={handleSynthesizeRule}
          className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 animate-in fade-in duration-200 font-mono"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>AI Detection Rule Generator</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsSynthesizing(false)}
              className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs uppercase font-mono text-slate-500 font-bold block mb-1">
                Rule Format
              </label>
              <select
                value={genType}
                onChange={(e) => setGenType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:bg-slate-50 focus:outline-none focus:border-red-500"
              >
                <option value="YARA">YARA (Memory / Binary / PE Strings)</option>
                <option value="Sigma">Sigma (Generic SIEM / Sysmon / EDR)</option>
                <option value="Snort">Snort / Suricata (Network IDS)</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase font-mono text-slate-500 font-bold block mb-1">
                Target Threat / Malware Family *
              </label>
              <input
                type="text"
                required
                value={genThreat}
                onChange={(e) => setGenThreat(e.target.value)}
                placeholder="e.g. Cobalt Strike 4.9 Beacon or LockBit Black"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 font-mono focus:bg-slate-50 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-xs uppercase font-mono text-slate-500 font-bold block mb-1">
                MITRE Technique / TTP
              </label>
              <input
                type="text"
                value={genTTP}
                onChange={(e) => setGenTTP(e.target.value)}
                placeholder="e.g. T1059.001 PowerShell"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 font-mono focus:bg-slate-50 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs uppercase font-mono text-slate-500 font-bold block mb-1">
                Key Artifacts / Strings / Signatures to Match
              </label>
              <textarea
                value={genArtifacts}
                onChange={(e) => setGenArtifacts(e.target.value)}
                rows={3}
                placeholder="Hex bytes, unique DLL exports, command flags, regex patterns..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 font-mono resize-none focus:bg-slate-50 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-xs uppercase font-mono text-slate-500 font-bold block mb-1">
                Behavioral Description / Context
              </label>
              <textarea
                value={genDesc}
                onChange={(e) => setGenDesc(e.target.value)}
                rows={3}
                placeholder="Explain the adversary technique, false positive avoidance, and environment assumptions..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 font-mono resize-none focus:bg-slate-50 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={isGenerating || !genThreat.trim()}
              className="px-5 py-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs border border-red-500/40 cursor-pointer font-mono"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Synthesizing Rule with AI...' : 'Generate & Save Rule'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl shadow-xs overflow-hidden font-mono space-y-0">
        {/* Tab with underline theme */}
        <div className="flex border-b border-slate-200 gap-1 overflow-x-auto px-2 pt-1 bg-white">
          <button
            onClick={() => setSelectedRuleType('all')}
            className={`px-4 py-2.5 border-b-2 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              selectedRuleType === 'all'
                ? 'border-red-600 text-red-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Formats</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] ${
                selectedRuleType === 'all'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              {rules.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedRuleType('YARA')}
            className={`px-4 py-2.5 border-b-2 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              selectedRuleType === 'YARA'
                ? 'border-red-600 text-red-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>YARA</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] ${
                selectedRuleType === 'YARA'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              {rules.filter((r) => r.type === 'YARA').length}
            </span>
          </button>

          <button
            onClick={() => setSelectedRuleType('Sigma')}
            className={`px-4 py-2.5 border-b-2 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              selectedRuleType === 'Sigma'
                ? 'border-red-600 text-red-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Sigma</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] ${
                selectedRuleType === 'Sigma'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              {rules.filter((r) => r.type === 'Sigma').length}
            </span>
          </button>

          <button
            onClick={() => setSelectedRuleType('Snort')}
            className={`px-4 py-2.5 border-b-2 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              selectedRuleType === 'Snort'
                ? 'border-red-600 text-red-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Snort / Suricata</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] ${
                selectedRuleType === 'Snort'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              {rules.filter((r) => r.type === 'Snort' || r.type === 'Suricata').length}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 bg-slate-50">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rule title, target threat, or rule contents..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-red-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="space-y-3 font-mono">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-xs space-y-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span
                  className={`px-1.5 py-0.5 rounded border text-[11px] font-mono font-bold uppercase ${getRuleTypeBadge(
                    rule.type
                  )}`}
                >
                  {rule.type}
                </span>
                <h3 className="text-xs font-bold text-slate-900 font-mono">{rule.title}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500">
                  Target: <strong className="text-indigo-700">{rule.targetThreat}</strong>
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-[10px] font-mono text-indigo-700 font-semibold">{rule.targetTTP}</span>
                <button
                  onClick={() => handleCopy(rule.id, rule.ruleContent)}
                  className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors ml-1 cursor-pointer border border-slate-200"
                  title="Copy Rule Syntax"
                >
                  {copiedId === rule.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-700 leading-relaxed font-sans">{rule.description}</p>

            {/* Rule Code Container */}
            <div className="relative">
              <pre
                className={`bg-slate-100 p-3 rounded-lg border border-slate-200 text-[11px] font-mono text-indigo-900 overflow-auto leading-relaxed selection:bg-purple-200 ${
                  rule.type === 'Snort' || rule.type === 'Suricata'
                    ? 'w-full md:w-1/2 aspect-square max-h-64 min-h-[190px] whitespace-pre'
                    : 'max-h-48'
                }`}
              >
                {formatRuleContent(rule.ruleContent, rule.type)}
              </pre>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
              <span>Author: {rule.author}</span>
              <span>Created: {rule.dateCreated}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
