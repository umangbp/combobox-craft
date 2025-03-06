
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// Types
export type ComboboxContextType = {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  items: React.RefObject<HTMLDivElement[]>;
  loading?: boolean;
  onSearchChange?: (value: string) => void;
};

export interface ComboboxProps {
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  onSearchChange?: (value: string) => void;
}

export interface ComboboxInputProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}

export interface ComboboxContentProps {
  className?: string;
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
}

export interface ComboboxItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface ComboboxGroupProps {
  children: React.ReactNode;
  heading: string;
  className?: string;
}

export interface ComboboxEmptyProps {
  children: React.ReactNode;
  className?: string;
}

export interface ComboboxLoadingProps {
  children: React.ReactNode;
  className?: string;
}

export interface ComboboxSeparatorProps {
  className?: string;
}

// Context
const ComboboxContext = createContext<ComboboxContextType | undefined>(undefined);

const useCombobox = () => {
  const context = useContext(ComboboxContext);
  if (!context) {
    throw new Error('Combobox components must be used within a Combobox');
  }
  return context;
};

// Main Components
export const Combobox = ({
  value,
  onChange,
  children,
  className,
  loading = false,
  onSearchChange,
}: ComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  const handleValueChange = (newValue: string) => {
    onChange?.(newValue);
    setOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        itemsRef.current &&
        !itemsRef.current.some(ref => 
          ref && ref.contains(event.target as Node)
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <ComboboxContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        open,
        setOpen,
        searchValue,
        setSearchValue,
        activeIndex,
        setActiveIndex,
        items: itemsRef,
        loading,
        onSearchChange,
      }}
    >
      <div 
        className={cn("relative w-full", className)}
        ref={(el) => {
          if (el) itemsRef.current[0] = el;
        }}
      >
        {children}
      </div>
    </ComboboxContext.Provider>
  );
};

export const ComboboxInput = ({
  placeholder,
  className,
  autoFocus = false,
  disabled = false,
}: ComboboxInputProps) => {
  const { 
    setOpen, 
    searchValue, 
    setSearchValue, 
    activeIndex, 
    setActiveIndex, 
    items,
    onValueChange,
    onSearchChange,
  } = useCombobox();
  const inputRef = useRef<HTMLInputElement>(null);

  // Calculate the number of items by finding the total minus the first (container) and second (input)
  const itemCount = items.current ? items.current.length - 2 : 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setOpen(true);
        setActiveIndex(prev => (prev < itemCount - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setOpen(true);
        setActiveIndex(prev => (prev > 0 ? prev - 1 : itemCount - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < itemCount) {
          const selectedItem = items.current[activeIndex + 2]; // +2 to skip container and input
          if (selectedItem && selectedItem.dataset.value) {
            onValueChange?.(selectedItem.dataset.value);
          }
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange?.(value);
    setOpen(true);
    setActiveIndex(-1);
  };

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div 
      className="relative"
      ref={(el) => {
        if (el) items.current[1] = el;
      }}
    >
      <input
        ref={inputRef}
        type="text"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background",
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        value={searchValue}
        autoComplete="off"
        role="combobox"
        aria-expanded={true}
        disabled={disabled}
      />
    </div>
  );
};

export const ComboboxContent = ({
  className,
  children,
  align = 'center',
}: ComboboxContentProps) => {
  const { open } = useCombobox();
  
  if (!open) return null;
  
  return (
    <div 
      className={cn(
        "absolute z-50 min-w-[200px] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
        "animate-in fade-in-80 mt-1 max-h-60 overflow-auto p-1",
        {
          "left-0": align === 'start',
          "right-0": align === 'end',
          "left-1/2 -translate-x-1/2": align === 'center',
        },
        className
      )}
      role="listbox"
    >
      {children}
    </div>
  );
};

export const ComboboxItem = ({
  value,
  children,
  className,
  disabled = false,
}: ComboboxItemProps) => {
  const { 
    onValueChange, 
    activeIndex, 
    setActiveIndex, 
    items 
  } = useCombobox();
  const itemRef = useRef<HTMLDivElement>(null);

  // Find the current index of this item in the items array
  const index = items.current.findIndex(item => item === itemRef.current) - 2; // -2 to adjust for container and input
  const isActive = index === activeIndex;

  // Register item ref to the items array
  useEffect(() => {
    if (itemRef.current) {
      const currentIndex = items.current.findIndex(item => item === itemRef.current);
      if (currentIndex === -1) {
        items.current.push(itemRef.current);
      }
    }
    
    return () => {
      if (itemRef.current) {
        const index = items.current.indexOf(itemRef.current);
        if (index !== -1) {
          items.current.splice(index, 1);
        }
      }
    };
  }, [items]);

  const handleClick = () => {
    if (!disabled) {
      onValueChange?.(value);
    }
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      setActiveIndex(index);
    }
  };

  return (
    <div
      ref={itemRef}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "hover:bg-accent hover:text-accent-foreground",
        {
          "bg-accent text-accent-foreground": isActive,
        },
        className
      )}
      role="option"
      aria-selected={isActive}
      data-value={value}
      data-disabled={disabled}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      tabIndex={-1}
    >
      {children}
    </div>
  );
};

export const ComboboxGroup = ({
  children,
  heading,
  className,
}: ComboboxGroupProps) => {
  return (
    <div className="px-2 py-1.5">
      <div className="text-xs font-medium text-muted-foreground mb-1">
        {heading}
      </div>
      <div className={cn("space-y-1", className)}>
        {children}
      </div>
    </div>
  );
};

export const ComboboxEmpty = ({
  children,
  className,
}: ComboboxEmptyProps) => {
  return (
    <div 
      className={cn(
        "py-6 text-center text-sm text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  );
};

export const ComboboxLoading = ({ 
  children,
  className,
}: ComboboxLoadingProps) => {
  return (
    <div 
      className={cn(
        "py-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2",
        className
      )}
    >
      <svg 
        className="animate-spin h-4 w-4" 
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {children}
    </div>
  );
};

export const ComboboxSeparator = ({
  className,
}: ComboboxSeparatorProps) => {
  return (
    <div 
      className={cn(
        "h-px bg-muted my-1",
        className
      )}
      role="separator"
    />
  );
};
