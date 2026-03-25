import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import DocumentCard from "../components/DocumentCard";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const data = await searchDocuments(query);
        setResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchResults();
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [query]);

  // Sort logic
  const sortedDocuments = [...results].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "popular") return b.reviews - a.reviews;
    if (sortBy === "oldest") return a.id - b.id;
    return b.id - a.id; // newest
  });

  return (
    <div className="min-h-screen bg-[#0f0f16] text-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">
            Kết quả tìm kiếm cho:{" "}
            <span className="text-purple-400">"{query}"</span>
          </h1>

          {/* Sort Dropdown */}
          {!isLoading && results.length > 0 && (
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm text-gray-400">Sắp xếp theo:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#131722] border border-gray-800 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5 outline-none"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="price_asc">Giá: Thấp đến cao</option>
                <option value="price_desc">Giá: Cao đến thấp</option>
                <option value="popular">Lượt mua nhiều nhất</option>
              </select>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : sortedDocuments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedDocuments.map((doc) => (
              <DocumentCard key={doc.id} {...doc} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-white/5">
            <p className="text-xl text-gray-400">
              Không tìm thấy tài liệu nào phù hợp với từ khóa của bạn.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
