import React from 'react';

function InteractiveDemo({ model, inputs, outputs, loading, onInputChange }) {
  const renderInput = (input) => {
    if (input.type === 'number') {
      return (
        <div key={input.name} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {input.label}
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min={input.min || 0}
              max={input.max || 100}
              step={input.step || 1}
              value={inputs[input.name] || input.default || input.min || 0}
              onChange={(e) => onInputChange(input.name, parseFloat(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              min={input.min || 0}
              max={input.max || 100}
              step={input.step || 1}
              value={inputs[input.name] || input.default || input.min || 0}
              onChange={(e) => onInputChange(input.name, parseFloat(e.target.value))}
              className="w-24 px-3 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      );
    } else if (input.type === 'boolean') {
      return (
        <div key={input.name} className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            {input.label}
          </label>
          <input
            type="checkbox"
            checked={inputs[input.name] || false}
            onChange={(e) => onInputChange(input.name, e.target.checked)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>
      );
    } else if (input.type === 'select') {
      return (
        <div key={input.name} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {input.label}
          </label>
          <select
            value={inputs[input.name] || input.default || ''}
            onChange={(e) => onInputChange(input.name, e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {input.options.map((option) => (
              <option key={option} value={option}>
                {option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-6">
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Input Parameters
        </h4>
        {model.inputs.map(renderInput)}
      </div>

      <div className="border-t border-gray-300 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
          Model Outputs
        </h4>
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : outputs ? (
          <div className="grid md:grid-cols-2 gap-4">
            {model.outputs.map((output) => {
              const value = outputs[output.name];
              let displayValue = value;

              if (output.format === 'percentage') {
                displayValue = `${value}%`;
              } else if (typeof value === 'number') {
                displayValue = value.toLocaleString();
              } else if (typeof value === 'boolean') {
                displayValue = value ? 'Yes' : 'No';
              }

              return (
                <div key={output.name} className="bg-white rounded-lg p-4 border border-gray-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-1">
                    {output.label}
                  </h5>
                  <p className={`text-2xl font-bold ${
                    output.type === 'boolean' 
                      ? value ? 'text-green-600' : 'text-red-600'
                      : 'text-blue-600'
                  }`}>
                    {displayValue}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Adjust inputs to see predictions</p>
        )}
      </div>

      {/* Special visualization for SNAP model */}
      {model.id === 'snap-eligibility' && outputs && (
        <div className="border-t border-gray-300 pt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Income vs. Eligibility Probability
          </h4>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="h-48 flex items-end justify-center space-x-2">
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((ratio) => {
                const income = (model.inputs.find(i => i.name === 'household_income')?.max || 100000) * ratio;
                const size = inputs.household_size || 3;
                const threshold = 2000 * size;
                const netIncome = income / 12 - (inputs.housing_costs || 1200);
                const prob = Math.max(0, Math.min(100, 100 - (netIncome / threshold) * 100));
                
                return (
                  <div key={ratio} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-500 rounded-t transition-all"
                      style={{ height: `${prob}%` }}
                    ></div>
                    <div className="text-xs text-gray-600 mt-2 text-center">
                      ${(income / 1000).toFixed(0)}k
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-center text-sm text-gray-600">
              Household Size: {inputs.household_size || 3}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InteractiveDemo;

