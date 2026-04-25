import {
  FiFile,
  FiBook,
  FiChevronDown,
  FiDollarSign,
  FiCheck,
  FiSearch,
} from "react-icons/fi";
import { Listbox, Transition, Combobox } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import axios from "../../common";

const PREFIX_ORDER = ["MA", "IT", "IE"];

const sortSubjects = (list) => {
  return [...list].sort((a, b) => {
    const codeA = a._id ?? a.id ?? "";
    const codeB = b._id ?? b.id ?? "";
    const prefixA = PREFIX_ORDER.findIndex((p) => codeA.startsWith(p));
    const prefixB = PREFIX_ORDER.findIndex((p) => codeB.startsWith(p));
    const rankA = prefixA === -1 ? PREFIX_ORDER.length : prefixA;
    const rankB = prefixB === -1 ? PREFIX_ORDER.length : prefixB;
    if (rankA !== rankB) return rankA - rankB;
    const numA = parseInt(codeA.replace(/\D/g, ""), 10) || 0;
    const numB = parseInt(codeB.replace(/\D/g, ""), 10) || 0;
    return numA - numB;
  });
};

const CATEGORIES = [
  { id: "exam", label: "Đề thi / Đáp án" },
  { id: "slide", label: "Slide bài giảng" },
  { id: "assignment", label: "Bài tập / Thực hành" },
  { id: "project", label: "Đồ án / Báo cáo" },
];

const Step2FileCard = ({
  item,
  formData,
  updateForm,
  submit,
}) => {
  const selectedCategory = CATEGORIES.find((c) => c.id === formData.category) || null;
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("/api/subjects");
        if (res.status === 200) setSubjects(sortSubjects(res.data));
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, []);

  const getSubjectCode = (s) => s._id ?? s.id ?? "";

  const selectedSubject = subjects.find((s) => getSubjectCode(s) === formData.subject) || null;

  const filteredSubjects = query.trim() === ""
    ? subjects
    : subjects.filter((s) => {
        const q = query.toLowerCase();
        return (
          getSubjectCode(s).toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q)
        );
      });

  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <FiFile className="h-6 w-6" />
          </div>
          <div className="truncate">
            <p className="truncate text-base font-semibold text-white">
              {item.name}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              {item.size / (1024 * 1024) >= 1.0
                ? `${(item.size / (1024 * 1024)).toFixed(2)} MB`
                : `${(item.size / 1024).toFixed(0)} KB`}
            </p>
          </div>
        </div>
      </div>

      {/* Môn học — Combobox có search */}
      <div className="relative z-50">
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Môn học
        </label>
        <Combobox
          value={selectedSubject}
          onChange={(subject) => {
            updateForm("subject", getSubjectCode(subject));
            setQuery("");
          }}
        >
          <div className="relative mt-1">
            <div
              className={`relative flex w-full items-center rounded-xl border text-sm transition-all ${
                submit && !formData.subject
                  ? "border-red-400 bg-red-500/10"
                  : "border-white/20 bg-[#050816]"
              }`}
            >
              <span className="pointer-events-none absolute left-3 text-gray-400">
                {query.length > 0 ? <FiSearch /> : <FiBook />}
              </span>
              <Combobox.Input
                className="w-full bg-transparent py-3 pl-10 pr-10 text-sm text-white placeholder-gray-400 outline-none"
                placeholder="Tìm theo mã hoặc tên môn..."
                displayValue={(subject) =>
                  subject ? `${getSubjectCode(subject)} - ${subject.name}` : ""
                }
                onChange={(e) => setQuery(e.target.value)}
              />
              <Combobox.Button className="absolute right-3 text-gray-400 hover:text-white">
                <FiChevronDown className="h-4 w-4" />
              </Combobox.Button>
            </div>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-white/20 bg-[#050816]/95 py-2 shadow-2xl backdrop-blur-xl focus:outline-none custom-scrollbar">
                {loadingSubjects ? (
                  <li className="px-4 py-3 text-sm text-gray-500">Đang tải...</li>
                ) : filteredSubjects.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-gray-500">
                    Không tìm thấy môn học nào.
                  </li>
                ) : (
                  filteredSubjects.map((subject) => (
                    <Combobox.Option
                      key={getSubjectCode(subject)}
                      value={subject}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-3 pl-10 pr-4 text-sm transition-colors ${
                          active ? "bg-purple-500/20 text-purple-300" : "text-gray-300"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? "font-semibold text-white" : "font-normal"}`}>
                            {getSubjectCode(subject)} - {subject.name}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-400">
                              <FiCheck className="h-4 w-4" />
                            </span>
                          )}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>

        {submit && !formData.subject && (
          <span className="mt-1 block text-xs text-red-400">
            Môn học không được để trống
          </span>
        )}
      </div>

      {formData.subject?.trim().length > 0 && (
        <div className="animate-in slide-in-from-top-4 fade-in mt-6 space-y-6 duration-300">
          {/* Loại tài liệu */}
          <div className="relative z-40">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Loại tài liệu
            </label>
            <Listbox
              value={selectedCategory}
              onChange={(cat) => updateForm("category", cat.id)}
            >
              <div className="relative mt-1">
                <Listbox.Button
                  className={`relative w-full cursor-pointer rounded-xl border py-3 pl-4 pr-10 text-left text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                    submit && !formData.category
                      ? "border-red-400 bg-red-500/10 text-white"
                      : "border-white/20 bg-[#050816] text-white"
                  }`}
                >
                  <span className={`block truncate ${!selectedCategory ? "text-gray-400" : ""}`}>
                    {selectedCategory ? selectedCategory.label : "Chọn phân loại..."}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                    <FiChevronDown className="h-4 w-4 text-gray-400" />
                  </span>
                </Listbox.Button>

                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-2 max-h-60 w-full overflow-auto rounded-xl border border-white/20 bg-[#050816]/95 py-2 shadow-2xl backdrop-blur-xl focus:outline-none custom-scrollbar">
                    {CATEGORIES.map((cat) => (
                      <Listbox.Option
                        key={cat.id}
                        value={cat}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-3 pl-10 pr-4 text-sm transition-colors ${
                            active ? "bg-purple-500/20 text-purple-300" : "text-gray-300"
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${selected ? "font-semibold text-white" : "font-normal"}`}>
                              {cat.label}
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-400">
                                <FiCheck className="h-4 w-4" />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>

            {submit && !formData.category && (
              <span className="mt-1 block text-xs text-red-400">
                Vui lòng chọn loại tài liệu
              </span>
            )}
          </div>

          {/* Tên tài liệu */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Tên tài liệu
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FiBook className="text-gray-400" />
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                className={`w-full rounded-xl border py-3 pr-4 pl-10 text-sm text-white transition-all outline-none ${
                  submit && !formData.title
                    ? "border-red-400 bg-red-500/10 focus:border-red-400 focus:ring-2 focus:ring-red-400"
                    : "border-white/20 bg-white/5 focus:border-purple-400 focus:ring-2 focus:ring-purple-400"
                }`}
                placeholder="Nhập tên tài liệu..."
                onChange={(e) => updateForm(e.target.name, e.target.value)}
              />
            </div>
            {submit && !formData.title && (
              <span className="mt-1 block text-xs text-red-400">
                Tên tài liệu không được để trống
              </span>
            )}
          </div>

          {/* Mô tả */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Mô tả tài liệu
            </label>
            <textarea
              name="description"
              value={formData.description}
              rows="2"
              className="w-full resize-none rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 transition-all outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400"
              placeholder="Tóm tắt ngắn gọn nội dung tài liệu này (không bắt buộc)..."
              onChange={(e) => updateForm(e.target.name, e.target.value)}
            />
          </div>

          {/* Định giá & Royalty */}
          <div className="rounded-xl border border-purple-500/20 bg-purple-900/10 p-5">
            <label className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
              <FiDollarSign className="text-purple-400" />
              Định giá NFT & Bản quyền
            </label>

            <div className="relative rounded-xl border-2 border-purple-500/50 bg-[#050816]/50 p-5 shadow-sm backdrop-blur-md">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <span className="mb-1 block text-sm font-bold text-white">
                    Định giá bằng ETH
                  </span>
                  <p className="text-xs text-gray-400">
                    Yêu cầu người khác trả ETH để được mở khoá file này. Vẫn đúc
                    NFT để lưu bản quyền.
                  </p>
                </div>
                <div className="shrink-0 rounded-full bg-purple-500/20 p-1">
                  <FiCheck className="h-4 w-4 text-purple-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 border-t border-white/10 pt-4 md:grid-cols-2">
                {/* Giá bán */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-300">
                    Giá bán
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      min="0"
                      step="any"
                      className={`w-full rounded-lg border py-2.5 pr-12 pl-4 text-sm text-white transition-colors outline-none ${
                        submit && !formData.price
                          ? "border-red-400 bg-red-500/10 focus:border-red-400 focus:ring-2 focus:ring-red-400"
                          : "border-white/20 bg-white/5 focus:border-purple-400 focus:bg-white/10 focus:ring-2 focus:ring-purple-400"
                      }`}
                      placeholder="VD: 0.01"
                      onChange={(e) => updateForm(e.target.name, e.target.value)}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                      <span className="text-xs font-bold text-purple-400">ETH</span>
                    </div>
                  </div>
                  {submit && !formData.price && (
                    <span className="mt-1 block text-xs text-red-400">
                      Vui lòng nhập giá bán
                    </span>
                  )}
                </div>

                {/* Royalty */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-300">
                    Royalty (% nhận mỗi lần bán lại)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="royaltyPercent"
                      value={formData.royaltyPercent}
                      min="0"
                      max="50"
                      step="1"
                      className="w-full rounded-lg border border-white/20 bg-white/5 py-2.5 pr-12 pl-4 text-sm text-white transition-colors outline-none focus:border-purple-400 focus:bg-white/10 focus:ring-2 focus:ring-purple-400"
                      placeholder="VD: 10"
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === "") { updateForm(e.target.name, ""); return; }
                        const val = Math.min(Math.max(parseInt(raw) || 0, 0), 50);
                        updateForm(e.target.name, val);
                      }}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                      <span className="text-xs font-bold text-purple-400">%</span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Tối đa 50%. Mặc định 10%.</p>
                </div>

                {/* Amount */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-300">
                    Số lượng NFT
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    min="1"
                    step="1"
                    max="1000"
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white transition-colors outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400"
                    placeholder="VD: 10"
                    onChange={(e) => updateForm(e.target.name, e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Số lượng bản sao NFT có thể bán trên marketplace.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2FileCard;