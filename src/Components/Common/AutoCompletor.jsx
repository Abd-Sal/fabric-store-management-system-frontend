import { useCallback, useState } from 'react';
import AsyncSelect from 'react-select/async';

const AutoCompletor = ({placeholder, onSearchMessage = 'Type at least 2 characters', fetchData, dataMapper, selected, setSelected, inputValue, setInputValue}) => {
    const [error, setError] = useState(null);

    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    const searchAPI = async (query) => {
        try {
            const response = await fetchData(query)
            if (response.status >= 200 && response.status < 300) {
                const data = response.data;                
                return dataMapper(data);
            } else {
                throw new Error(`API request failed with status ${response.status}`);
            }
        } catch (err) {
            setError(err.message);
            return [];
        }
    };

    const loadOptions = useCallback(
        debounce(async (inputValue, callback) => {
        if (inputValue.length < 2) {
            callback([]);
            return;
        }
        
        const options = await searchAPI(inputValue);
        callback(options);
        }, 750),
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
                defaultOptions={false}
                loadOptions={loadOptions}
                onChange={setSelected}
                onInputChange={handleInputChange}
                value={selected}
                placeholder={placeholder}
                isClearable
                className='text-secondary'
                noOptionsMessage={({ inputValue }) => {
                    if (inputValue.length < 2) {
                        return onSearchMessage;
                    }
                    return error ? `خطأ: ${error}` : 'لا يوجد نتائج بحث';
                    }}
                    loadingMessage={() => 'جاري البحث'}
                    styles={{
                        control: (base) => ({
                            ...base,
                            borderColor: error ? '#ef4444' : base.borderColor,
                            color: 'red'
                        })
                    }}
            />
        </div>
    )
}

export default AutoCompletor