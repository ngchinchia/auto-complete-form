import { useState, useCallback, useEffect } from 'react';
import { AutoComplete } from "./components/AutoComplete";
import mock_currency_data from "./utils/mock_currency_data.json";
import { DollarCurrency } from './types/dollar_currency';
import { useDebounce } from './hooks/hooks';
function App() {
  {/* State for Sync */}
  const [syncSelectedItems, setSyncSelectedItems] = useState<DollarCurrency[]>([]);
  const [syncInputValue, setSyncInputValue] = useState<string>('');
  const [syncShowOptions, setSyncShowOptions] = useState<boolean>(false);
  const [isSyncMultiple, setIsSyncMultiple] = useState<boolean>(false);

   {/* State for Async */}
  const [asyncSelectedItems, setAsyncSelectedItems] = useState<DollarCurrency[]>([]);
  const [asyncInputValue, setAsyncInputValue] = useState<string>('');
  const [asyncShowOptions, setAsyncShowOptions] = useState<boolean>(false);
  const [isAsyncMultiple, setIsAsyncMultiple] = useState<boolean>(false);
  const [asyncOptions, setAsyncOptions] = useState<DollarCurrency[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  {/* Debounce Async Keystroke */}
  const debouncedAsyncInput = useDebounce(asyncInputValue, 600);

  const renderOption = (option: DollarCurrency) => (
    <div className="flex items-center">
      <span>
        {option.name} ({option.code})
      </span>
    </div>
  );

  const filterOptions = (options: DollarCurrency[], inputValue: string) => {
    return options.filter((option) =>
      Object.values(option)
        .join(' ')
        .toLowerCase()
        .includes(inputValue.toLowerCase())
    );
  }

  const handleAsyncSearch = useCallback(async (inputValue: string) => {
    if (inputValue.length < 2) {
      setAsyncOptions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://657808ff197926adf62f573d.mockapi.io/api/v1/dollars');
      
      if (!response.ok) {
        throw new Error('Error fetching currency data');
      }
      
      const data: DollarCurrency[] = await response.json();
      
      const filteredData = data.filter((currency) =>
        currency.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        currency.code.toLowerCase().includes(inputValue.toLowerCase())
      );
      
      setAsyncOptions(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setAsyncOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    if (debouncedAsyncInput) {
      handleAsyncSearch(debouncedAsyncInput);
    }
  }, [debouncedAsyncInput, handleAsyncSearch]);

  const toggleSyncMultiple = () => {
    setIsSyncMultiple(!isSyncMultiple);
    setSyncSelectedItems([]);
  };

  const toggleAsyncMultiple = () => {
    setIsAsyncMultiple(!isAsyncMultiple);
    setAsyncSelectedItems([]);
  };



  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center w-screen min-h-screen p-6 space-y-8">
      <div className="space-y-4 w-full max-w-md">
        <h2 className="text-2xl font-bold">Sync AutoComplete</h2>
        <button
          onClick={toggleSyncMultiple}
          className="px-2 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {isSyncMultiple ? "Switch to Single Select" : "Switch to Multiple Select"}
        </button>
        <AutoComplete
          isAsync={false}
          label="Sync Search"
          options={mock_currency_data}
          multiple={isSyncMultiple}
          onChange={setSyncSelectedItems}
          onInputChange={setSyncInputValue}
          renderOption={renderOption}
          placeholder="Start searching..."
          description="Synchronous search with local data"
          value={syncSelectedItems}
          inputValue={syncInputValue}
          showOptions={syncShowOptions}
          onToggleOptions={setSyncShowOptions}
          filterOptions={filterOptions}
        />
      </div>

      <div className="space-y-4 w-full max-w-md">
        <h2 className="text-2xl font-bold">Async AutoComplete</h2>
        <button
          onClick={toggleAsyncMultiple}
          className="px-2 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {isAsyncMultiple ? "Switch to Single Select" : "Switch to Multiple Select"}
        </button>
        <AutoComplete
          isAsync={true}
          label="Async Search"
          options={asyncOptions}
          multiple={isAsyncMultiple}
          onChange={setAsyncSelectedItems}
          onInputChange={setAsyncInputValue}
          renderOption={renderOption}
          placeholder="Start searching..."
          description="Asynchronous search with API call"
          value={asyncSelectedItems}
          inputValue={asyncInputValue}
          showOptions={asyncShowOptions}
          onToggleOptions={setAsyncShowOptions}
          loading={isLoading}
        />
      </div>
    </div>
  );
}

export default App;