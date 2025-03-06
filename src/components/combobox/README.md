
# React Elegant Combobox

A beautiful, minimal combobox component for React with a focus on user experience and design. Inspired by command interfaces like cmdk, but with an emphasis on elegance and simplicity.

## Features

- 🔍 Searchable dropdown with keyboard navigation
- ⌨️ Full keyboard support (arrows, enter, escape)
- 🎨 Beautifully designed with smooth animations
- 🧩 Composable API (similar to Radix UI)
- 🔄 Controlled and uncontrolled modes
- ♿ Accessible by default
- 🎯 TypeScript support
- 🌙 Light and dark mode support
- ⏳ Async loading support with loading state

## Installation

```bash
npm install react-elegant-combobox
# or
yarn add react-elegant-combobox
```

## Basic Usage

```jsx
import { 
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxItem,
  ComboboxEmpty
} from 'react-elegant-combobox';

function Example() {
  const [value, setValue] = React.useState('');
  
  return (
    <Combobox value={value} onChange={setValue}>
      <ComboboxInput placeholder="Search..." />
      <ComboboxContent>
        {items.length === 0 && <ComboboxEmpty>No results found</ComboboxEmpty>}
        
        {items.map((item) => (
          <ComboboxItem key={item.value} value={item.value}>
            {item.label}
          </ComboboxItem>
        ))}
      </ComboboxContent>
    </Combobox>
  );
}
```

## Async Loading Example

```jsx
import { useState, useEffect } from 'react';
import { 
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxLoading
} from 'react-elegant-combobox';

function AsyncExample() {
  const [value, setValue] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  
  // Fetch data when search changes
  useEffect(() => {
    const fetchData = async () => {
      if (!search) return;
      
      setLoading(true);
      try {
        // Replace with your actual API call
        const response = await fetch(`/api/search?q=${search}`);
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce API calls
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [search]);
  
  return (
    <Combobox 
      value={value} 
      onChange={setValue} 
      loading={loading}
      onSearchChange={setSearch}
    >
      <ComboboxInput placeholder="Search..." />
      <ComboboxContent>
        {loading && <ComboboxLoading>Fetching results...</ComboboxLoading>}
        
        {!loading && items.length === 0 && (
          <ComboboxEmpty>No results found</ComboboxEmpty>
        )}
        
        {!loading && items.map((item) => (
          <ComboboxItem key={item.value} value={item.value}>
            {item.label}
          </ComboboxItem>
        ))}
      </ComboboxContent>
    </Combobox>
  );
}
```

## API Reference

### Combobox

The root component that provides context for all the other components.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `undefined` | The controlled value of the combobox |
| `onChange` | `(value: string) => void` | `undefined` | Handler that's called when the value changes |
| `placeholder` | `string` | `"Search..."` | Placeholder text for the input |
| `autoFocus` | `boolean` | `false` | Whether the input should be autofocused |
| `defaultOpen` | `boolean` | `false` | Whether the dropdown should be open by default |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Handler that's called when the dropdown opens or closes |
| `onSearchChange` | `(search: string) => void` | `undefined` | Handler that's called when the search input changes |
| `loading` | `boolean` | `false` | Whether the combobox is in a loading state |
| `className` | `string` | `undefined` | Additional CSS classes |
| `children` | `React.ReactNode` | Required | The components that make up the combobox |

### ComboboxInput

The input element that users can type in to search.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | `undefined` | Placeholder text for the input |
| `autoFocus` | `boolean` | `false` | Whether the input should be autofocused |
| `className` | `string` | `undefined` | Additional CSS classes |

### ComboboxContent

The dropdown content that contains the items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment of the dropdown |
| `sideOffset` | `number` | `4` | Distance from the input |
| `className` | `string` | `undefined` | Additional CSS classes |
| `children` | `React.ReactNode` | Required | The content of the dropdown |

### ComboboxEmpty

Displays when there are no items to show.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `undefined` | Additional CSS classes |
| `children` | `React.ReactNode` | Required | The content to display when empty |

### ComboboxLoading

Displays when data is being loaded asynchronously.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `undefined` | Additional CSS classes |
| `children` | `React.ReactNode` | `"Loading..."` | The content to display while loading |

### ComboboxItem

An item in the dropdown.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | Required | The value of the item |
| `disabled` | `boolean` | `false` | Whether the item is disabled |
| `onSelect` | `(value: string) => void` | `undefined` | Handler that's called when the item is selected |
| `className` | `string` | `undefined` | Additional CSS classes |
| `children` | `React.ReactNode` | Required | The content of the item |

### ComboboxGroup

Groups related items together.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `heading` | `React.ReactNode` | `undefined` | The heading for the group |
| `className` | `string` | `undefined` | Additional CSS classes |
| `children` | `React.ReactNode` | Required | The items in the group |

### ComboboxSeparator

A visual separator between items or groups.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `undefined` | Additional CSS classes |

### useCombobox

A hook that provides access to the combobox context.

```jsx
const {
  value,         // The current value
  search,        // The current search text
  setSearch,     // Function to update search text
  setValue,      // Function to update value
  open,          // Whether the dropdown is open
  setOpen,       // Function to open/close the dropdown
  activeItem,    // The currently active item
  setActiveItem, // Function to set the active item
  loading        // Whether the combobox is in a loading state
} = useCombobox();
```

## Events and Callbacks

- `onChange`: Called when the value changes
- `onOpenChange`: Called when the dropdown opens or closes
- `onSearchChange`: Called when the search input changes
- `onSelect`: Called when an item is selected (per item)

## Keyboard Navigation

- `Arrow Down`: Move to the next item
- `Arrow Up`: Move to the previous item
- `Enter`: Select the active item
- `Escape`: Close the dropdown

## Styling

The combobox components use CSS classes that can be customized. The default styling is designed to work with Tailwind CSS, but you can override any styles with your own CSS.

```jsx
<Combobox className="custom-combobox">
  <ComboboxInput className="custom-input" />
  <ComboboxContent className="custom-content">
    <ComboboxItem className="custom-item" value="item">
      Item
    </ComboboxItem>
  </ComboboxContent>
</Combobox>
```

## Accessibility

The combobox is built with accessibility in mind. It supports:

- Keyboard navigation
- ARIA attributes
- Focus management
- Screen reader announcements

## License

MIT
