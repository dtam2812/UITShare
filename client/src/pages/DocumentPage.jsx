import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Check } from "lucide-react";
import DocumentCard from "../components/DocumentCard/DocumentCard";
import { fetchSubjects } from "../api/api_test";
import axios from "../common";

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

  const getListDocument = async () => {
    try {
      const response = await axios.get("/api/documents/documentList");

      if (response.status === 200) {
        setDocuments(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getListDocument();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadData = async () => {
      setLoading(true);
      try {
        const [subjectsData] = await Promise.all([fetchSubjects()]);
        setSubjects(subjectsData);
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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Left Sidebar - Filters */}
        <div className="max-h mt-10 h-fit w-full shrink-0 pr-2 md:top-24 md:w-64">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Danh mục</h2>
            {selectedSubjects.length > 0 && (
              <button
                onClick={() => setSelectedSubjects([])}
                className="text-xs text-purple-400 underline underline-offset-2 hover:text-purple-300"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>

          <div className="mb-8 space-y-4">
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
                  className="overflow-hidden rounded-lg border border-gray-800 bg-[#131722]"
                >
                  <button
                    onClick={() => toggleCategory(category)}
                    className="flex w-full items-center justify-between px-4 py-3 text-purple-400 transition-colors hover:bg-purple-600"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-200">
                        {category}
                      </span>
                      {selectedInCategory > 0 && (
                        <span className="rounded-full bg-purple-600 px-2 py-0.5 text-xs text-white">
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
                    <div className="border-t border-gray-800/50 px-2 pt-1 pb-3">
                      {categorySubjects.length > 0 ? (
                        categorySubjects.map((subject) => (
                          <button
                            key={subject.id}
                            onClick={() => toggleSubject(subject.id)}
                            className="group flex w-full items-center rounded-md px-2 py-2 text-left transition-colors hover:bg-white/5"
                          >
                            <div
                              className={`mr-3 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${selectedSubjects.includes(subject.id) ? "border-purple-600 bg-purple-600" : "border-gray-600 group-hover:border-gray-500"}`}
                            >
                              {selectedSubjects.includes(subject.id) && (
                                <Check size={12} className="text-white" />
                              )}
                            </div>
                            <span
                              className={`truncate text-sm ${selectedSubjects.includes(subject.id) ? "font-medium text-white" : "text-gray-400 group-hover:text-gray-300"}`}
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
        <div className="mt-10 flex-1">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 pl-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-gray-400">
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
                className="block rounded-lg border border-gray-800 bg-[#131722] p-2.5 text-sm text-white outline-none focus:border-purple-500 focus:ring-purple-500"
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
            <div className="flex items-center justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : paginatedDocuments.length > 0 ? (
            <>
              <div className="mb-10 grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {paginatedDocuments.map((element) => (
                  <DocumentCard key={element._id} {...element} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="rounded-lg border border-gray-800 px-4 py-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Trước
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                          currentPage === i + 1
                            ? "bg-purple-600 font-medium text-white"
                            : "border border-gray-800 text-gray-400 hover:bg-white/5 hover:text-white"
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
                    className="rounded-lg border border-gray-800 px-4 py-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-gray-800 bg-[#131722] py-20 text-center">
              <p className="text-gray-400">
                Không tìm thấy tài liệu nào phù hợp với bộ lọc.
              </p>
              <button
                onClick={() => setSelectedSubjects([])}
                className="mt-4 font-medium text-purple-400 hover:text-purple-300"
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
