'use client';

export default function FilterPanel({
  agencies,
  services,
  selectedAgency,
  selectedService,
  onAgencyChange,
  onServiceChange,
}) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Filter by Agency
        </label>
        <select
          value={selectedAgency}
          onChange={(e) => onAgencyChange(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="">All Agencies</option>
          {agencies.map((agency) => (
            <option key={agency} value={agency}>
              {agency}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Filter by Service
        </label>
        <select
          value={selectedService}
          onChange={(e) => onServiceChange(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="">All Services</option>
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

