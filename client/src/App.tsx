
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, FileText } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from 'react';
import type { Item, SearchInput } from '../../server/src/schema';

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Load initial items on mount
  const loadInitialItems = useCallback(async () => {
    try {
      const result = await trpc.getItems.query();
      setItems(result);
    } catch (error) {
      console.error('Failed to load initial items:', error);
    }
  }, []);

  useEffect(() => {
    loadInitialItems();
  }, [loadInitialItems]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      const searchInput: SearchInput = {
        query: searchQuery,
        limit: 10
      };
      const results = await trpc.searchItems.query(searchInput);
      setItems(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setHasSearched(false);
    loadInitialItems();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* App Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 text-white mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">🔍 Quick Search</h1>
          <p className="text-gray-600">Find what you're looking for instantly</p>
        </div>

        {/* Search Bar - Prominently Centered */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for items..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg rounded-full border-2 border-indigo-200 focus:border-indigo-500 shadow-lg"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={isLoading || !searchQuery.trim()}
                className="flex-1 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Searching...
                  </div>
                ) : (
                  'Search'
                )}
              </Button>
              {hasSearched && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearSearch}
                  className="px-4 py-3 rounded-full border-2 border-gray-300"
                >
                  Clear
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {hasSearched && (
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="text-sm">
                {items.length} result{items.length !== 1 ? 's' : ''} for "{searchQuery}"
              </Badge>
            </div>
          )}

          {items.length === 0 ? (
            <Card className="text-center py-8 border-dashed border-2 border-gray-300">
              <CardContent className="pt-6">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {hasSearched ? 'No results found' : 'No items yet'}
                </h3>
                <p className="text-gray-500">
                  {hasSearched 
                    ? 'Try adjusting your search terms' 
                    : 'Start by searching for something!'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {items.map((item: Item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow duration-200 border border-gray-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {item.title}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                        #{item.id}
                      </Badge>
                    </div>
                    {item.description && (
                      <CardDescription className="text-gray-600 line-clamp-2">
                        {item.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-700 line-clamp-3 mb-3">
                      {item.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Created: {item.created_at.toLocaleDateString()}</span>
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>Item</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
