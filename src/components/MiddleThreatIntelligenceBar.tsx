import React from 'react';
import { Layers, ShieldCheck, Map, Lock } from 'lucide-react';

export const MiddleThreatIntelligenceBar: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs font-mono text-xs font-bold">
      <div className="flex items-center gap-2 text-indigo-700 hover:text-indigo-900 cursor-pointer">
        <Layers className="w-4 h-4" /> <span>MITRE ATT&CK</span>
      </div>
      <div className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 cursor-pointer">
        <ShieldCheck className="w-4 h-4" /> <span>MITRE DEFEND</span>
      </div>
      <div className="flex items-center gap-2 text-orange-700 hover:text-orange-900 cursor-pointer">
        <Map className="w-4 h-4" /> <span>MITRE ATLAS</span>
      </div>
      <div className="flex items-center gap-2 text-sky-700 hover:text-sky-900 cursor-pointer">
        <Lock className="w-4 h-4" /> <span>SPIFFE / SPIRE</span>
      </div>
    </div>
  );
};
