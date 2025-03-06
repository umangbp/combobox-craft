
import React, { useState, useEffect } from 'react';
import { 
  Combobox, 
  ComboboxInput, 
  ComboboxContent, 
  ComboboxEmpty, 
  ComboboxItem, 
  ComboboxGroup,
  ComboboxSeparator,
  ComboboxLoading
} from '@/components/combobox';

interface Framework {
  value: string;
  label: string;
  type: 'language' | 'framework' | 'library';
}

const frameworks: Framework[] = [
  { value: 'react', label: 'React', type: 'framework' },
  { value: 'vue', label: 'Vue', type: 'framework' },
  { value: 'angular', label: 'Angular', type: 'framework' },
  { value: 'svelte', label: 'Svelte', type: 'framework' },
  { value: 'next', label: 'Next.js', type: 'framework' },
  { value: 'nuxt', label: 'Nuxt.js', type: 'framework' },
  { value: 'javascript', label: 'JavaScript', type: 'language' },
  { value: 'typescript', label: 'TypeScript', type: 'language' },
  { value: 'redux', label: 'Redux', type: 'library' },
  { value: 'zustand', label: 'Zustand', type: 'library' },
  { value: 'tailwind', label: 'Tailwind CSS', type: 'library' },
  { value: 'styled-components', label: 'Styled Components', type: 'library' },
];

const Index = () => {
  const [value, setValue] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [asyncValue, setAsyncValue] = useState('');
  const [asyncSearch, setAsyncSearch] = useState('');
  const [asyncLoading, setAsyncLoading] = useState(false);
  const [asyncResults, setAsyncResults] = useState<Framework[]>([]);
  
  // Filter frameworks based on search
  const filteredItems = search === '' 
    ? frameworks 
    : frameworks.filter((framework) =>
        framework.label.toLowerCase().includes(search.toLowerCase())
      );
      
  // Group frameworks by type
  const languages = filteredItems.filter(f => f.type === 'language');
  const frameworksOnly = filteredItems.filter(f => f.type === 'framework');
  const libraries = filteredItems.filter(f => f.type === 'library');
  
  // Regular search handler
  const handleSearch = (searchValue: string) => {
    setSearch(searchValue);
  };

  // Simulate async search with a delay
  useEffect(() => {
    if (!asyncSearch) {
      setAsyncResults([]);
      return;
    }
    
    setAsyncLoading(true);
    
    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      const results = frameworks.filter(item => 
        item.label.toLowerCase().includes(asyncSearch.toLowerCase())
      );
      setAsyncResults(results);
      setAsyncLoading(false);
    }, 1000); // Simulate network delay
    
    return () => clearTimeout(timer);
  }, [asyncSearch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full mx-auto space-y-20">
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text tracking-tighter">
              React Elegant Combobox
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
              A beautiful, minimal combobox component with a focus on design and user experience
            </p>
          </div>
          
          {/* Primary demo */}
          <div className="max-w-md w-full mx-auto pt-8">
            <Combobox 
              value={value} 
              onChange={setValue}
              className="w-full"
            >
              <ComboboxInput 
                placeholder="Search frameworks..." 
                autoFocus
                className="w-full" 
              />
              <ComboboxContent align="start">
                {filteredItems.length === 0 && (
                  <ComboboxEmpty>No results found</ComboboxEmpty>
                )}
                
                {filteredItems.map((framework) => (
                  <ComboboxItem key={framework.value} value={framework.value}>
                    {framework.label}
                  </ComboboxItem>
                ))}
              </ComboboxContent>
            </Combobox>
            
            {value && (
              <div className="mt-4 text-sm text-center animate-fade-in">
                Selected: <span className="font-medium">{frameworks.find(f => f.value === value)?.label}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Advanced demo with groups */}
          <div className="space-y-4 p-6 rounded-lg border glass">
            <h2 className="text-xl font-medium">Grouped Examples</h2>
            <p className="text-sm text-muted-foreground">Items organized into logical groups.</p>
            
            <div className="pt-4">
              <Combobox className="w-full">
                <ComboboxInput placeholder="Search tech..." />
                <ComboboxContent>
                  {filteredItems.length === 0 ? (
                    <ComboboxEmpty>No results found</ComboboxEmpty>
                  ) : (
                    <>
                      {languages.length > 0 && (
                        <ComboboxGroup heading="Languages">
                          {languages.map((item) => (
                            <ComboboxItem key={item.value} value={item.value}>
                              {item.label}
                            </ComboboxItem>
                          ))}
                        </ComboboxGroup>
                      )}
                      
                      {languages.length > 0 && frameworksOnly.length > 0 && (
                        <ComboboxSeparator />
                      )}
                      
                      {frameworksOnly.length > 0 && (
                        <ComboboxGroup heading="Frameworks">
                          {frameworksOnly.map((item) => (
                            <ComboboxItem key={item.value} value={item.value}>
                              {item.label}
                            </ComboboxItem>
                          ))}
                        </ComboboxGroup>
                      )}
                      
                      {frameworksOnly.length > 0 && libraries.length > 0 && (
                        <ComboboxSeparator />
                      )}
                      
                      {libraries.length > 0 && (
                        <ComboboxGroup heading="Libraries">
                          {libraries.map((item) => (
                            <ComboboxItem key={item.value} value={item.value}>
                              {item.label}
                            </ComboboxItem>
                          ))}
                        </ComboboxGroup>
                      )}
                    </>
                  )}
                </ComboboxContent>
              </Combobox>
            </div>
          </div>
          
          {/* Async loading demo */}
          <div className="space-y-4 p-6 rounded-lg border glass">
            <h2 className="text-xl font-medium">Async Loading</h2>
            <p className="text-sm text-muted-foreground">Load data asynchronously with loading states.</p>
            
            <div className="pt-4">
              <Combobox 
                className="w-full"
                value={asyncValue}
                onChange={setAsyncValue}
                onSearchChange={setAsyncSearch}
                loading={asyncLoading}
              >
                <ComboboxInput placeholder="Search frameworks..." />
                <ComboboxContent>
                  {asyncLoading ? (
                    <ComboboxLoading>Searching frameworks...</ComboboxLoading>
                  ) : asyncResults.length === 0 ? (
                    <ComboboxEmpty>No frameworks found</ComboboxEmpty>
                  ) : (
                    asyncResults.map((item) => (
                      <ComboboxItem 
                        key={item.value} 
                        value={item.value}
                      >
                        {item.label}
                        <span className="ml-2 text-xs text-muted-foreground">
                          {item.type}
                        </span>
                      </ComboboxItem>
                    ))
                  )}
                </ComboboxContent>
              </Combobox>
              
              {asyncValue && (
                <div className="mt-4 text-sm animate-fade-in">
                  Selected: <span className="font-medium">{frameworks.find(f => f.value === asyncValue)?.label}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Feature highlight section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">🔍 Full Text Search</h3>
            <p className="text-sm text-muted-foreground">
              Intelligent search with keyboard navigation for quick access.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">🎨 Beautiful Design</h3>
            <p className="text-sm text-muted-foreground">
              Clean aesthetics with smooth transitions and animations.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">⌨️ Keyboard First</h3>
            <p className="text-sm text-muted-foreground">
              Complete keyboard support for power users.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">⏳ Async Support</h3>
            <p className="text-sm text-muted-foreground">
              Load data asynchronously with beautiful loading states.
            </p>
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground pt-8 pb-4">
          <p>React Elegant Combobox • MIT License</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
