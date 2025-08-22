import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BASE_URL } from '../config';
import { ProductResponse, SearchResponse } from '../interfaces';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const query = searchParams.get('q') || '';

  const searchProducts = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const url = `${BASE_URL}/products/search?q=${encodeURIComponent(searchQuery)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 401) {
        throw new Error('Please sign in to search products');
      }

      if (!response.ok) {
        const errorData = await response.json() as { error: string };
        throw new Error(`Search failed: ${errorData.error}`);
      }

      const data = await response.json() as SearchResponse;
      setProducts(data.products);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
      setProducts([]);
    } finally {
      setLoading(false);
    } 
  };

  useEffect(() => {
    if (query) {
      searchProducts(query);
    }
  }, [query]);

  if (loading) {
    return (
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-semibold mb-4">Search Results</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
          {error.includes('sign in') && (
            <div className="mt-4">
              <Link
                to="/signin"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Sign In
              </Link>
            </div>
          )}
          {query && (
            <p className="mt-4 text-gray-600">
              Search query: <span className="font-semibold">"{query}"</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Search Results</h1>
          {query && (
            <p className="mt-2 text-gray-600">
              Showing results for: <span className="font-semibold">"{query}"</span>
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            {products.length} {products.length === 1 ? 'result' : 'results'} found
          </p>
        </div>

        {products.length === 0 && query ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search terms or browse our full catalog.
            </p>
            <Link
              to="/"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover object-center"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-lg font-bold text-blue-600">${product.price}</p>
                    {product.filamentType && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {product.filamentType}
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/product/${product.id}`}
                    className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-center rounded-lg px-4 py-2 transition-colors duration-200"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}