import React, { useRef, useEffect, useState, KeyboardEvent } from "react";
import { Loader } from "./Loader";
import { AutocompleteProps } from "../types/AutocompleteProps";

export const AutoComplete = <T,>({
  description,
  disabled = false,
  filterOptions,
  label,
  loading = false,
  multiple = false,
  onChange,
  onInputChange,
  options,
  placeholder = "Search...",
  renderOption,
  value,
  inputValue,
  showOptions,
  onToggleOptions,
  isAsync,
  onAsyncSearch,
}: AutocompleteProps<T>) => {

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const optionsListRef = useRef<HTMLUListElement>(null);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(-1);
  const [hasInitialFocus, setHasInitialFocus] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Handle user input value
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = e.target.value;
    onInputChange?.(newInputValue);

    if (isAsync && onAsyncSearch) {
      setIsSearching(true);
      await onAsyncSearch(newInputValue);
      setIsSearching(false);
    }
  };

  // Item selection based on multiple state
  const handleSelectOption = (option: T) => {
    if (!onChange) return;

    let newValue: T[];
    if (multiple) {
      const isSelected = value.some(
        (item) => JSON.stringify(item) === JSON.stringify(option)
      );
      newValue = isSelected
        ? value.filter(
            (item) => JSON.stringify(item) !== JSON.stringify(option)
          )
        : [...value, option];
    } else {
      newValue =
        JSON.stringify(value[0]) === JSON.stringify(option) ? [] : [option];
    }
    onChange(newValue);

    onInputChange?.("");

    if (!multiple) {
      onToggleOptions(false);
    }
  };

  // Scroll to focused option
  const scrollToOption = (index: number) => {
    if (optionsListRef.current) {
      const optionElement = optionsListRef.current.children[
        index
      ] as HTMLElement;
      if (optionElement) {
        optionElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showOptions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedOptionIndex((prevIndex) => {
          const newIndex =
            prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0;
          scrollToOption(newIndex);
          return newIndex;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedOptionIndex((prevIndex) => {
          const newIndex =
            prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1;
          scrollToOption(newIndex);
          return newIndex;
        });
        break;
      case "Enter":
        e.preventDefault();
        if (focusedOptionIndex !== -1) {
          handleSelectOption(filteredOptions[focusedOptionIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        onToggleOptions(false);
        break;
    }
  };

  // Toggle drop down
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        onToggleOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onToggleOptions]);

  // Reset focused option when input changes
  useEffect(() => {
    setFocusedOptionIndex(-1);
  }, [inputValue]);

  const filteredOptions = isAsync
    ? options
    : filterOptions
    ? filterOptions(options, inputValue)
    : options;

  return (
    <div
      className="bg-white rounded-md max-w-md p-6 shadow-sm space-y-4"
      ref={wrapperRef}
    >
      <div className="relative w-full">
        {label && (
          <label className="block mb-2 text-sm text-gray-500">{label}</label>
        )}
        <div className="flex flex-wrap items-center border border-gray-300 rounded-md p-2 focus-within:border-blue-500">
          {value.map((option, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded my-2 flex"
            >
              {renderOption(option)}
              <button
                type="button"
                onClick={() => handleSelectOption(option)}
                className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                ×
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => {
              onToggleOptions(true);
              setHasInitialFocus(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : ""}
            disabled={disabled}
            className="flex-grow outline-none"
          />
        </div>
        {(loading || isSearching) && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
           <Loader/>
          </div>
        )}
        {showOptions && (
          <ul
            ref={optionsListRef}
            className="absolute z-10 w-full max-h-48 mt-1 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg"
          >
            {isSearching ? (
              <li className="p-2 text-gray-500">Searching...</li>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={index}
                  className={`p-2 hover:bg-gray-100 cursor-pointer flex items-center ${
                    index === focusedOptionIndex ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleSelectOption(option)}
                  onMouseEnter={() => setFocusedOptionIndex(index)}
                >
                  <input
                    type="checkbox"
                    checked={value.some(
                      (selectedOption) =>
                        JSON.stringify(selectedOption) ===
                        JSON.stringify(option)
                    )}
                    readOnly
                    className="mr-2"
                  />
                  {renderOption(option)}
                </li>
              ))
            ) : (
              hasInitialFocus && (
                <li className="p-2 text-gray-500">No results found</li>
              )
            )}
          </ul>
        )}
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
};

export default AutoComplete;
