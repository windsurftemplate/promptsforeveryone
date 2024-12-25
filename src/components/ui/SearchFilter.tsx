import React, { useState } from 'react';

interface SearchFilterProps {
  onSearch: (searchTerm: string) => void;
  onFilter: (tag: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTag(event.target.value);
    onFilter(event.target.value);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <input
        type="text"
        placeholder="Search prompts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border rounded-md p-2"
      />
      <button onClick={handleSearch} className="ml-2 bg-blue-500 text-white rounded-md p-2">
        Search
      </button>
      <select value={selectedTag} onChange={handleFilterChange} className="ml-4 border rounded-md p-2">
        <option value="">Filter by Tag</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
        {/* Add more options as needed */}
      </select>
    </div>
  );
};

export default SearchFilter;
