import React from 'react';
import { Trick, UserLog } from '../types';
import { CheckCircle, Circle, Video } from 'lucide-react';

interface TrickCardProps {
  trick: Trick;
  log?: UserLog;
  onClick: () => void;
}

export const TrickCard: React.FC<TrickCardProps> = ({ trick, log, onClick }) => {
  const isMastered = log?.isMastered;
  
  return (
    <div 
      onClick={onClick}
      className={`relative flex items-center justify-between p-4 mb-3 rounded-xl border cursor-pointer transition-all active:scale-95
        ${isMastered 
          ? 'bg-green-900/20 border-green-500/50' 
          : 'bg-card border-gray-800 hover:border-gray-600'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${isMastered ? 'text-green-400' : 'text-gray-600'}`}>
          {isMastered ? <CheckCircle size={24} /> : <Circle size={24} />}
        </div>
        <div>
          <h3 className="font-bold text-sm text-gray-100">{trick.name}</h3>
          <p className="text-xs text-gray-400 mt-1">
             {trick.category}
          </p>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1">
        {log && (
            <span className="text-xs font-mono bg-gray-800 px-2 py-1 rounded text-primary">
                {log.cones} مانع
            </span>
        )}
        {log?.videoProofUrl && (
            <Video size={14} className="text-accent" />
        )}
      </div>
    </div>
  );
};