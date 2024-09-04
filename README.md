This project demonstrates a flexible Autocomplete component implemented in React using Vite as the build tool. It showcases both synchronous and asynchronous search functionality.

Project Structure
Copysrc/
├── components/  (UI components)
├── hooks/       (Custom React hooks)
├── services/    (API calls and data management)
├── utils/       (Helper functions used across the app)
├── types/       (TypeScript type definitions)
└── App.tsx      (Main component)
Getting Started

Clone the repository:
git clone [your-repo-url]
cd [your-repo-name]

Install dependencies:
npm install

Run the development server:
npm run dev

Open your browser and navigate to http://localhost:5173 (or the port specified in the console).

Autocomplete Props
The AutocompleteProps<T> type defines the properties for the Autocomplete component:

description: string: Provides additional information about the Autocomplete field.
disabled?: boolean: If true, the Autocomplete input is disabled.
filterOptions?: (options: T[], inputValue: string) => T[]: A function to filter options based on input value (for synchronous search).
label: string: The label for the Autocomplete field.
loading?: boolean: Indicates if the Autocomplete is in a loading state.
multiple: boolean: If true, allows multiple selections.
onChange?: (value: T[]) => void: Callback function triggered when selected values change.
onInputChange?: (inputValue: string) => void: Callback function triggered when input value changes.
options: T[]: Array of options to display in the dropdown.
placeholder: string: Placeholder text for the input field.
renderOption: (option: T) => React.ReactNode: Function to render each option in the dropdown.
value: T[]: Currently selected value(s).
inputValue: string: Current value of the input field.
showOptions: boolean: Controls visibility of the options dropdown.
onToggleOptions: (show: boolean) => void: Callback to toggle options visibility.
isAsync: boolean: If true, enables asynchronous search functionality.
onAsyncSearch?: (inputValue: string) => Promise<void>: Async function for fetching options based on input.