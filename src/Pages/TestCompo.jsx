import React, { useCallback, useState } from 'react';
import AsyncSelect from 'react-select/async';

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

function AdvancedSearch() {
  const [selected, setSelected] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);

  // Your API call function
  const searchAPI = async (query) => {
    try {
      const response = await fetch(
        `https://dummyjson.com/products/search?q=${(query)}`
      );
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      return data.products.map(item => ({
        value: item.id,
        label: item.title,
        category: item.category
      }));
    } catch (err) {
      setError(err.message);
      return [];
    }
  };
  
  // Debounced version of the search
  const loadOptions = useCallback(
    debounce(async (inputValue, callback) => {
      if (inputValue.length < 2) {
        callback([]);
        return;
      }
      
      const options = await searchAPI(inputValue);
      callback(options);
    }, 500),
    []
  );
    const handleInputChange = (newValue, { action }) => {
    if (action === 'input-change') {
      setInputValue(newValue);
      setError(null);
    }
  };
  
  return (
    <div>
      <AsyncSelect
        cacheOptions
        defaultOptions={false} // Don't load options on mount
        loadOptions={loadOptions}
        onChange={setSelected}
        onInputChange={handleInputChange}
        value={selected}
        placeholder="Type at least 2 characters..."
        isClearable
        noOptionsMessage={({ inputValue }) => {
          if (inputValue.length < 2) {
            return 'Type at least 2 characters';
          }
          return error ? `Error: ${error}` : 'No results found';
        }}
        loadingMessage={() => 'Searching...'}
        // Optional: Add custom styling
        styles={{
          control: (base) => ({
            ...base,
            borderColor: error ? '#ef4444' : base.borderColor
          })
        }}
      />
    </div>
  );
}

const TestCompo = () => {
  return (
    <div>
      <AdvancedSearch />
    </div>
  )
}

export default TestCompo