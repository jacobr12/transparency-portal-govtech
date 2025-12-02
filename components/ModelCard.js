'use client';

import { useState } from 'react';
import ModelCardDetail from './ModelCardDetail';

export default function ModelCard({ model }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
        onClick={() => setIsOpen(true)}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-semibold text-gray-900">{model.name}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded ${
              model.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {model.status}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{model.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
              {model.agency}
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
              {model.service}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Last audited: {new Date(model.last_audited).toLocaleDateString()}
          </div>
        </div>
      </div>

      {isOpen && (
        <ModelCardDetail model={model} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}

