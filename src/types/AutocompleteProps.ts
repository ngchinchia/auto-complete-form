export type AutocompleteProps<T> = {
  description: string;
  disabled?: boolean;
  filterOptions?: (options: T[], inputValue: string) => T[];
  label: string;
  loading?: boolean;
  multiple: boolean;
  onChange?: (value: T[]) => void;
  onInputChange?: (inputValue: string) => void;
  options: T[];
  placeholder: string;
  renderOption: (option: T) => React.ReactNode;
  value: T[];
  inputValue: string;
  showOptions: boolean;
  onToggleOptions: (show: boolean) => void;
  isAsync: boolean;
  onAsyncSearch?: (inputValue: string) => Promise<void>;
};
