
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

## Installation

```bash
npm install react-elegant-combobox
# or
yarn add react-elegant-combobox
```

## Usage

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

## API Reference

### Combobox

The root component that provides context for all the other components.

```jsx
<Combobox
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
>
  {/* children */}
</Combobox>
```

### ComboboxInput

The input element that users can type in to search.

```jsx
<ComboboxInput
  placeholder?: string;
  autoFocus?: boolean;
/>
```

### ComboboxContent

The dropdown content that contains the items.

```jsx
<ComboboxContent
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
>
  {/* children */}
</ComboboxContent>
```

### ComboboxEmpty

Displays when there are no items to show.

```jsx
<ComboboxEmpty>
  No results found
</ComboboxEmpty>
```

### ComboboxItem

An item in the dropdown.

```jsx
<ComboboxItem
  value: string;
  disabled?: boolean;
  onSelect?: (value: string) => void;
>
  Item label
</ComboboxItem>
```

### ComboboxGroup

Groups related items together.

```jsx
<ComboboxGroup
  heading?: React.ReactNode;
>
  {/* ComboboxItems */}
</ComboboxGroup>
```

### ComboboxSeparator

A visual separator between items or groups.

```jsx
<ComboboxSeparator />
```

## License

MIT
