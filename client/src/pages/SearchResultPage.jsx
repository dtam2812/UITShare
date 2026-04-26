import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import DocumentCard from "../components/DocumentCard/DocumentCard";

const BASE_URL = import.meta.env.VITE_API_URL;

async function searchDocumentsAPI(query) {
  const res = await fetch(
    `${BASE_URL}/api/documents/search?q=${encodeURIComponent(query)}`,
  );
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

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
        const data = await searchDocumentsAPI(query);
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

  const sortedDocuments = [...results].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "popular")
      return (b.commentCount ?? 0) - (a.commentCount ?? 0);
    if (sortBy === "oldest")
      return new Date(a.createdAt) - new Date(b.createdAt);
    return new Date(b.createdAt) - new Date(a.createdAt); // newest
  });

  return (
    <div className="min-h-screen bg-[#0f0f16] px-6 pt-24 pb-12 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold">
            Kết quả tìm kiếm cho:{" "}
            <span className="text-purple-400">"{query}"</span>
          </h1>

          {!isLoading && results.length > 0 && (
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-sm text-gray-400">Sắp xếp theo:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block rounded-lg border border-gray-800 bg-[#131722] p-2.5 text-sm text-white outline-none focus:border-purple-500 focus:ring-purple-500"
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
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : sortedDocuments.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {sortedDocuments.map((doc) => (
              <DocumentCard key={doc._id} {...doc} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/5 bg-gray-800/30 py-20 text-center">
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
