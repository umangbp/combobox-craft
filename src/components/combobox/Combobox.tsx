
import React, { 
  createContext, 
  forwardRef, 
  useContext, 
  useEffect, 
  useRef, 
  useState 
} from 'react';
import { cn } from '@/lib/utils';
import { Search, Loader2 } from 'lucide-react';

// Types
type ComboboxContextType = {
  value: string;
  search: string;
  setSearch: (search: string) => void;
  setValue: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: string | null;
  setActiveItem: (id: string | null) => void;
  registerItem: (id: string, ref: React.RefObject<HTMLDivElement>) => void;
  unregisterItem: (id: string) => void;
  loading: boolean;
};

type ComboboxProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
  autoFocus?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSearchChange?: (search: string) => void;
  loading?: boolean;
};

type ComboboxEmptyProps = {
  children: React.ReactNode;
  className?: string;
};

type ComboboxInputProps = {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
};

type ComboboxContentProps = {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
};

type ComboboxItemProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onSelect?: (value: string) => void;
};

type ComboboxGroupProps = {
  heading?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

type ComboboxSeparatorProps = {
  className?: string;
};

type ComboboxLoadingProps = {
  className?: string;
  children?: React.ReactNode;
};

// Context
const ComboboxContext = createContext<ComboboxContextType | undefined>(undefined);

const useCombobox = () => {
  const context = useContext(ComboboxContext);
  if (!context) {
    throw new Error('useCombobox must be used within a Combobox provider');
  }
  return context;
};

// Main Component
const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  ({ 
    value: controlledValue, 
    onChange, 
    placeholder = 'Search...', 
    children, 
    className, 
    autoFocus = false,
    defaultOpen = false,
    onOpenChange,
    onSearchChange,
    loading = false,
    ...props 
  }, ref) => {
    const [search, setSearch] = useState('');
    const [open, setOpenState] = useState(defaultOpen);
    const [value, setValueState] = useState(controlledValue || '');
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const itemsMap = useRef<Map<string, React.RefObject<HTMLDivElement>>>(new Map());
    
    // Handle controlled open state
    const setOpen = (newOpen: boolean) => {
      setOpenState(newOpen);
      onOpenChange?.(newOpen);
    };

    // Handle controlled value
    useEffect(() => {
      if (controlledValue !== undefined) {
        setValueState(controlledValue);
      }
    }, [controlledValue]);

    // Handle value changes
    const setValue = (newValue: string) => {
      setValueState(newValue);
      if (onChange) {
        onChange(newValue);
      }
    };

    // Handle search changes
    const handleSearchChange = (newSearch: string) => {
      setSearch(newSearch);
      if (onSearchChange) {
        onSearchChange(newSearch);
      }
    };

    // Item registration system
    const registerItem = (id: string, itemRef: React.RefObject<HTMLDivElement>) => {
      itemsMap.current.set(id, itemRef);
    };

    const unregisterItem = (id: string) => {
      itemsMap.current.delete(id);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === 'ArrowDown' || e.key === 'Enter') {
          setOpen(true);
        }
        return;
      }

      const items = Array.from(itemsMap.current.keys());
      if (!items.length) return;

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const currentIndex = activeItem ? items.indexOf(activeItem) : -1;
          const nextIndex = (currentIndex + 1) % items.length;
          setActiveItem(items[nextIndex]);
          const nextItemRef = itemsMap.current.get(items[nextIndex]);
          nextItemRef?.current?.scrollIntoView({ block: 'nearest' });
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const currentIndex = activeItem ? items.indexOf(activeItem) : 0;
          const prevIndex = (currentIndex - 1 + items.length) % items.length;
          setActiveItem(items[prevIndex]);
          const prevItemRef = itemsMap.current.get(items[prevIndex]);
          prevItemRef?.current?.scrollIntoView({ block: 'nearest' });
          break;
        }
        case 'Enter': {
          e.preventDefault();
          if (activeItem) {
            setValue(activeItem);
            setOpen(false);
            setSearch('');
          }
          break;
        }
        case 'Escape': {
          e.preventDefault();
          setOpen(false);
          break;
        }
      }
    };

    return (
      <ComboboxContext.Provider
        value={{
          value,
          search,
          setSearch: handleSearchChange,
          setValue,
          open,
          setOpen,
          activeItem,
          setActiveItem,
          registerItem,
          unregisterItem,
          loading
        }}
      >
        <div 
          ref={ref}
          className={cn(
            "relative w-full max-w-md",
            className
          )} 
          onKeyDown={handleKeyDown}
          {...props}
        >
          {children}
        </div>
      </ComboboxContext.Provider>
    );
  }
);

Combobox.displayName = 'Combobox';

// Subcomponents
const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  ({ placeholder, className, autoFocus, ...props }, ref) => {
    const { search, setSearch, setOpen, loading } = useCombobox();
    
    return (
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm",
            "ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed",
            "disabled:opacity-50 transition-colors duration-200",
            className
          )}
          placeholder={placeholder}
          autoFocus={autoFocus}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setOpen(true)}
          {...props}
        />
        {loading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        ) : search && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-muted p-0 opacity-70 hover:opacity-100 transition-opacity"
            onClick={() => setSearch('')}
          >
            <span className="sr-only">Clear</span>
            <span aria-hidden className="flex h-full w-full items-center justify-center">
              ×
            </span>
          </button>
        )}
      </div>
    );
  }
);

ComboboxInput.displayName = 'ComboboxInput';

const ComboboxContent = forwardRef<HTMLDivElement, ComboboxContentProps>(
  ({ children, className, align = 'center', sideOffset = 4, ...props }, ref) => {
    const { open } = useCombobox();
    
    if (!open) return null;
    
    return (
      <div 
        className={cn(
          "absolute z-50 w-full min-w-[8rem] overflow-hidden rounded-md border",
          "bg-popover text-popover-foreground shadow-md animate-scale-in",
          "data-[state=closed]:animate-scale-out focus-visible:outline-none mt-2",
          "glass",
          align === 'start' ? 'left-0' : align === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2',
          className
        )}
        style={{ marginTop: sideOffset }}
        ref={ref}
        {...props}
      >
        <div className="max-h-[300px] overflow-y-auto p-1 combobox-viewport">
          {children}
        </div>
      </div>
    );
  }
);

ComboboxContent.displayName = 'ComboboxContent';

const ComboboxEmpty = forwardRef<HTMLDivElement, ComboboxEmptyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "py-6 text-center text-sm text-muted-foreground",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ComboboxEmpty.displayName = 'ComboboxEmpty';

const ComboboxLoading = forwardRef<HTMLDivElement, ComboboxLoadingProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "py-6 text-center text-sm text-muted-foreground flex items-center justify-center",
          className
        )}
        {...props}
      >
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {children || "Loading..."}
      </div>
    );
  }
);

ComboboxLoading.displayName = 'ComboboxLoading';

const ComboboxItem = forwardRef<HTMLDivElement, ComboboxItemProps>(
  ({ value, children, className, disabled = false, onSelect, ...props }, ref) => {
    const { setValue, setOpen, setSearch, activeItem, setActiveItem, registerItem, unregisterItem } = useCombobox();
    const itemRef = useRef<HTMLDivElement>(null);
    const combinedRef = useCombinedRefs(ref, itemRef);
    
    // Register/unregister this item
    useEffect(() => {
      registerItem(value, itemRef);
      return () => unregisterItem(value);
    }, [value, registerItem, unregisterItem]);
    
    const isActive = activeItem === value;
    
    const handleSelect = () => {
      if (disabled) return;
      setValue(value);
      if (onSelect) onSelect(value);
      setOpen(false);
      setSearch('');
    };
    
    return (
      <div
        ref={combinedRef}
        className={cn(
          "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm",
          "outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
          className
        )}
        data-disabled={disabled ? "true" : undefined}
        data-highlighted={isActive ? "true" : undefined}
        onMouseDown={(e) => e.preventDefault()}
        onMouseEnter={() => !disabled && setActiveItem(value)}
        onClick={handleSelect}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ComboboxItem.displayName = 'ComboboxItem';

const ComboboxGroup = forwardRef<HTMLDivElement, ComboboxGroupProps>(
  ({ heading, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("overflow-hidden p-1", className)}
        {...props}
      >
        {heading && (
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            {heading}
          </div>
        )}
        <div className="space-y-1">{children}</div>
      </div>
    );
  }
);

ComboboxGroup.displayName = 'ComboboxGroup';

const ComboboxSeparator = forwardRef<HTMLDivElement, ComboboxSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("my-1 h-px bg-muted", className)}
        {...props}
      />
    );
  }
);

ComboboxSeparator.displayName = 'ComboboxSeparator';

// Helper function for combining refs
function useCombinedRefs<T>(
  ...refs: Array<React.ForwardedRef<T> | React.RefObject<T> | null | undefined>
) {
  const targetRef = useRef<T>(null);

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        (ref as React.MutableRefObject<T | null>).current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
}

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxGroup,
  ComboboxSeparator,
  ComboboxLoading,
  useCombobox
};
