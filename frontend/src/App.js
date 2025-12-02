import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModelCard from './components/ModelCard';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';

// API URL configuration
// In production, set REACT_APP_API_URL environment variable to your backend URL
// Example: REACT_APP_API_URL=https://your-backend.onrender.com/api
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? window.location.origin + '/api'  // Assumes backend on same domain
    : 'http://127.0.0.1:5000/api');   // Development default

function App() {
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [agencies, setAgencies] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchModels();
    fetchAgencies();
    fetchServices();
  }, []);

  useEffect(() => {
    filterModels();
  }, [searchQuery, selectedAgency, selectedService, models]);

  const fetchModels = async () => {
    try {
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/models`);
      setModels(response.data);
      setFilteredModels(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching models:', error);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';
      setError(`Unable to connect to backend API. Make sure the Flask server is running on ${apiUrl}`);
      setLoading(false);
    }
  };

  const fetchAgencies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/agencies`);
      setAgencies(response.data);
    } catch (error) {
      console.error('Error fetching agencies:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const filterModels = async () => {
    try {
      setError(null);
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedAgency) params.append('agency', selectedAgency);
      if (selectedService) params.append('service', selectedService);

      const response = await axios.get(`${API_BASE_URL}/models?${params.toString()}`);
      setFilteredModels(response.data);
    } catch (error) {
      console.error('Error filtering models:', error);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';
      setError(`Unable to connect to backend API. Make sure the Flask server is running on ${apiUrl}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Transparency Portal for Public Algorithms
          </h1>
          <p className="mt-2 text-gray-600">
            Explore and understand the algorithmic systems used in public services
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 space-y-4">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <FilterPanel
            agencies={agencies}
            services={services}
            selectedAgency={selectedAgency}
            selectedService={selectedService}
            onAgencyChange={setSelectedAgency}
            onServiceChange={setSelectedService}
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading model cards...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Please start the backend server to view model cards.</p>
            <p className="text-gray-500 text-sm mt-2">
              Run: <code className="bg-gray-100 px-2 py-1 rounded">cd backend && python app.py</code>
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Backend should be running on: {API_BASE_URL.replace('/api', '')}
            </p>
          </div>
        ) : filteredModels.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No models found matching your criteria.</p>
            <p className="text-gray-500 text-sm mt-2">
              Try searching for: "snap", "housing", "unemployment", "food", "assistance", or "labor"
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        )}

        {!loading && filteredModels.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            Showing {filteredModels.length} of {models.length} model{models.length !== 1 ? 's' : ''}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

