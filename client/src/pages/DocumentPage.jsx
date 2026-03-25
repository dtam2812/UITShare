import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Check } from "lucide-react";
import DocumentCard from "../components/DocumentCard";
import { fetchSubjects, fetchDocuments } from "../api/api_test";

export default function DocumentsPage() {
  const [sortBy, setSortBy] = useState("newest");

  const [subjects, setSubjects] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState(["Đại cương"]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const categories = ["Đại cương", "Cơ sở ngành", "Chuyên ngành"];

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadData = async () => {
      setLoading(true);
      try {
        const [subjectsData, docsData] = await Promise.all([
          fetchSubjects(),
          fetchDocuments(),
        ]);
        setSubjects(subjectsData);
        setDocuments(docsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSubjects, sortBy]);

  const toggleSubject = (subjectId) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId],
    );
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  // Filter logic
  const filteredDocuments = documents.filter((doc) => {
    const matchSubject =
      selectedSubjects.length === 0 || selectedSubjects.includes(doc.subject);
    return matchSubject;
  });

  // Sort logic
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "popular") return b.reviews - a.reviews;
    if (sortBy === "oldest") return a.id - b.id;
    return b.id - a.id; // newest
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedDocuments.length / itemsPerPage);
  const paginatedDocuments = sortedDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar - Filters */}
        <div className="w-full md:w-64 shrink-0  md:top-24 h-fit max-h  pr-2 mt-10 ">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Danh mục</h2>
            {selectedSubjects.length > 0 && (
              <button
                onClick={() => setSelectedSubjects([])}
                className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-2"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>

          <div className="space-y-4 mb-8">
            {categories.map((category) => {
              const categorySubjects = subjects.filter(
                (s) => s.category === category,
              );
              const isExpanded = expandedCategories.includes(category);
              const selectedInCategory = categorySubjects.filter((s) =>
                selectedSubjects.includes(s.id),
              ).length;

              return (
                <div
                  key={category}
                  className="border border-gray-800 rounded-lg overflow-hidden bg-[#131722]"
                >
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-purple-600 text-purple-400 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-200">
                        {category}
                      </span>
                      {selectedInCategory > 0 && (
                        <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                          {selectedInCategory}
                        </span>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronDown size={18} className="text-gray-500" />
                    ) : (
                      <ChevronRight size={18} className="text-gray-500" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-2 pb-3 pt-1 border-t border-gray-800/50">
                      {categorySubjects.length > 0 ? (
                        categorySubjects.map((subject) => (
                          <button
                            key={subject.id}
                            onClick={() => toggleSubject(subject.id)}
                            className="w-full flex items-center px-2 py-2 hover:bg-white/5 transition-colors text-left rounded-md group"
                          >
                            <div
                              className={`w-4 h-4 rounded border mr-3 flex items-center justify-center shrink-0 transition-colors ${selectedSubjects.includes(subject.id) ? "bg-purple-600 border-purple-600" : "border-gray-600 group-hover:border-gray-500"}`}
                            >
                              {selectedSubjects.includes(subject.id) && (
                                <Check size={12} className="text-white" />
                              )}
                            </div>
                            <span
                              className={`text-sm truncate ${selectedSubjects.includes(subject.id) ? "text-white font-medium" : "text-gray-400 group-hover:text-gray-300"}`}
                            >
                              {subject.name}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="px-2 py-2 text-sm text-gray-500">
                          Đang tải...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 mt-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 pl-4">
            <div>
              <p className="text-gray-400 text-sm">
                Hiển thị {paginatedDocuments.length} trên tổng số{" "}
                {filteredDocuments.length} tài liệu
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
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
          </div>

          {/* Document Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : paginatedDocuments.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-10">
                {paginatedDocuments.map((doc) => (
                  <DocumentCard key={doc.id} {...doc} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Trước
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                          currentPage === i + 1
                            ? "bg-purple-600 text-white font-medium"
                            : "border border-gray-800 text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-[#131722] rounded-xl border border-gray-800">
              <p className="text-gray-400">
                Không tìm thấy tài liệu nào phù hợp với bộ lọc.
              </p>
              <button
                onClick={() => setSelectedSubjects([])}
                className="mt-4 text-purple-400 hover:text-purple-300 font-medium"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
