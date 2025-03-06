
# React Elegant Combobox

A beautiful, minimal combobox component with a focus on design and user experience.

## Features

- 🔍 Full-text search capabilities
- ⌨️ Complete keyboard navigation
- 🧩 Composable API with multiple subcomponents
- ⏳ Async loading support
- 🎨 Fully customizable with Tailwind CSS
- ♿ Accessible and ARIA compliant

## Installation

```bash
npm install @yourname/react-elegant-combobox
```

## Basic Usage

```jsx
import { 
  Combobox, 
  ComboboxInput, 
  ComboboxContent, 
  ComboboxItem 
} from '@yourname/react-elegant-combobox';

// Basic example
const Example = () => {
  const [value, setValue] = useState('');
  
  return (
    <Combobox value={value} onChange={setValue}>
      <ComboboxInput placeholder="Search..." />
      <ComboboxContent>
        <ComboboxItem value="react">React</ComboboxItem>
        <ComboboxItem value="vue">Vue</ComboboxItem>
        <ComboboxItem value="angular">Angular</ComboboxItem>
      </ComboboxContent>
    </Combobox>
  );
};
```

## API Reference

### Combobox

The main container component that provides context for all other components.

| Prop | Type | Description |
|------|------|-------------|
| value | string | The currently selected value |
| onChange | (value: string) => void | Callback when value changes |
| loading | boolean | Whether the combobox is in a loading state |
| onSearchChange | (search: string) => void | Callback when search input changes |
| className | string | Additional classes for the combobox container |
| children | ReactNode | The combobox children components |

### ComboboxInput

The input field component.

| Prop | Type | Description |
|------|------|-------------|
| placeholder | string | Placeholder text |
| className | string | Additional classes for the input |
| autoFocus | boolean | Whether the input should auto-focus |
| disabled | boolean | Whether the input is disabled |

### ComboboxContent

Container for the dropdown items.

| Prop | Type | Description |
|------|------|-------------|
| className | string | Additional classes for the content container |
| align | 'start' \| 'center' \| 'end' | Alignment of the dropdown |
| children | ReactNode | The combobox items or groups |

### ComboboxItem

Individual selectable item.

| Prop | Type | Description |
|------|------|-------------|
| value | string | The value of the item |
| className | string | Additional classes for the item |
| disabled | boolean | Whether the item is disabled |
| children | ReactNode | The item content |

### ComboboxGroup

Groups related items together with a heading.

| Prop | Type | Description |
|------|------|-------------|
| heading | string | The group heading text |
| className | string | Additional classes for the group |
| children | ReactNode | The items within the group |

### ComboboxEmpty

Displays when no items match the search.

| Prop | Type | Description |
|------|------|-------------|
| className | string | Additional classes for the empty state |
| children | ReactNode | The empty state content |

### ComboboxLoading

Displays when items are being loaded.

| Prop | Type | Description |
|------|------|-------------|
| className | string | Additional classes for the loading state |
| children | ReactNode | The loading state content |

### ComboboxSeparator

Visual separator between groups or items.

| Prop | Type | Description |
|------|------|-------------|
| className | string | Additional classes for the separator |

## Advanced Examples

### Grouped Items

```jsx
<Combobox>
  <ComboboxInput placeholder="Search..." />
  <ComboboxContent>
    <ComboboxGroup heading="Frameworks">
      <ComboboxItem value="react">React</ComboboxItem>
      <ComboboxItem value="vue">Vue</ComboboxItem>
    </ComboboxGroup>
    <ComboboxSeparator />
    <ComboboxGroup heading="Languages">
      <ComboboxItem value="javascript">JavaScript</ComboboxItem>
      <ComboboxItem value="typescript">TypeScript</ComboboxItem>
    </ComboboxGroup>
  </ComboboxContent>
</Combobox>
```

### Async Loading

```jsx
const AsyncExample = () => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  
  const handleSearch = async (search) => {
    setLoading(true);
    // Simulate API call
    const data = await fetchData(search);
    setItems(data);
    setLoading(false);
  };
  
  return (
    <Combobox 
      value={value} 
      onChange={setValue}
      loading={loading}
      onSearchChange={handleSearch}
    >
      <ComboboxInput placeholder="Search..." />
      <ComboboxContent>
        {loading ? (
          <ComboboxLoading>Loading results...</ComboboxLoading>
        ) : items.length === 0 ? (
          <ComboboxEmpty>No results found</ComboboxEmpty>
        ) : (
          items.map(item => (
            <ComboboxItem key={item.id} value={item.id}>
              {item.name}
            </ComboboxItem>
          ))
        )}
      </ComboboxContent>
    </Combobox>
  );
};
```

## License

MIT
