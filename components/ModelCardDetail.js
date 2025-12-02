'use client';

import { useState, useEffect, useCallback } from 'react';
import InteractiveDemo from './InteractiveDemo';

export default function ModelCardDetail({ model, onClose }) {
  const [inputs, setInputs] = useState({});
  const [outputs, setOutputs] = useState(null);
  const [loading, setLoading] = useState(false);

  const predict = useCallback(async (inputValues) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/models/${model.id}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: inputValues }),
      });
      const data = await response.json();
      setOutputs(data);
    } catch (error) {
      console.error('Error predicting:', error);
    } finally {
      setLoading(false);
    }
  }, [model.id]);

  useEffect(() => {
    // Initialize inputs with default values
    const initialInputs = {};
    model.inputs.forEach((input) => {
      initialInputs[input.name] = input.default !== undefined ? input.default : 
        input.type === 'number' ? (input.min || 0) :
        input.type === 'boolean' ? false : '';
    });
    setInputs(initialInputs);
    predict(initialInputs);
  }, [model.id, model.inputs, predict]);

  const handleInputChange = (name, value) => {
    const newInputs = { ...inputs, [name]: value };
    setInputs(newInputs);
    predict(newInputs);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{model.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700">{model.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Agency</h4>
              <p className="text-gray-900">{model.agency}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Service</h4>
              <p className="text-gray-900">{model.service}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Last Audited</h4>
              <p className="text-gray-900">{new Date(model.last_audited).toLocaleDateString()}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Algorithm Type</h4>
              <p className="text-gray-900">{model.algorithm_type}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Interactive Demo</h3>
            <InteractiveDemo
              model={model}
              inputs={inputs}
              outputs={outputs}
              loading={loading}
              onInputChange={handleInputChange}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Transparency Notes</h3>
            <ul className="space-y-2">
              {model.transparency_notes.map((note, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-700">{note}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Fairness Metrics</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(model.fairness_metrics).map(([metric, value]) => (
                <div key={metric} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1 capitalize">
                    {metric.replace(/_/g, ' ')}
                  </h4>
                  <p className="text-2xl font-bold text-blue-600">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {model.feature_importance && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Feature Importance</h3>
              <div className="space-y-2">
                {Object.entries(model.feature_importance)
                  .sort((a, b) => b[1] - a[1])
                  .map(([feature, importance]) => (
                    <div key={feature}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 capitalize">
                          {feature.replace(/_/g, ' ')}
                        </span>
                        <span className="text-gray-600 font-medium">
                          {(importance * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${importance * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Sources</h3>
            <ul className="space-y-1">
              {model.data_sources.map((source, index) => (
                <li key={index} className="text-gray-700 flex items-start">
                  <span className="text-gray-400 mr-2">→</span>
                  {source}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-yellow-900 mb-1">
              Decision Sensitivity
            </h4>
            <p className="text-sm text-yellow-800">{model.decision_sensitivity}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

