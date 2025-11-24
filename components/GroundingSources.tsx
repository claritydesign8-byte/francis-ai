import React from 'react';
import { GroundingMetadata, GroundingChunk } from '../types';
import { ExternalLink, Search, MapPin } from 'lucide-react';

interface GroundingSourcesProps {
  metadata: GroundingMetadata;
}

export const GroundingSources: React.FC<GroundingSourcesProps> = ({ metadata }) => {
  const sources: GroundingChunk[] = metadata.groundingChunks || [];

  if (sources.length === 0) return null;

  // Filter out duplicate URLs to keep the list clean
  const uniqueSources = sources.reduce((acc, current) => {
    const webUri = current.web?.uri;
    const mapUri = current.maps?.uri;

    if (webUri) {
      if (!acc.find(item => item.web?.uri === webUri)) {
        acc.push(current);
      }
    } else if (mapUri) {
       if (!acc.find(item => item.maps?.uri === mapUri)) {
        acc.push(current);
      }
    }
    return acc;
  }, [] as GroundingChunk[]);

  if (uniqueSources.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-slate-200">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
        <Search className="w-3 h-3" />
        <span>Sources</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {uniqueSources.map((source, index) => {
          const uri = source.web?.uri || source.maps?.uri;
          const title = source.web?.title || source.maps?.title || 'Location';
          const isMap = !!source.maps;

          if (!uri) return null;

          return (
            <a
              key={index}
              href={uri}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 hover:bg-slate-50 hover:border-primary-300 hover:text-primary-700 transition-colors shadow-sm"
            >
              {isMap ? <MapPin className="w-3 h-3 text-red-500" /> : null}
              <span className="truncate max-w-[150px]">{title}</span>
              <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-50" />
            </a>
          );
        })}
      </div>
    </div>
  );
};