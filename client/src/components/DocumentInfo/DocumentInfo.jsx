import { Star } from "lucide-react";

function StarRating({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3.5 w-3.5 ${
            s <= Math.round(value)
              ? "fill-yellow-400 text-yellow-400"
              : "text-white/20"
          }`}
        />
      ))}
    </div>
  );
}

const CATEGORY_LABELS = {
  exam: "Exam",
  slide: "Slides",
  assignment: "Assignment",
  project: "Project",
};

export default function DocumentInfo({ doc, reviewCount }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      {/* Category + AccessType badges */}
      <div className="mb-4 flex flex-wrap gap-2">
        {doc.category && (
          <span className="rounded-full border border-purple-400/30 bg-purple-500/20 px-3 py-1 text-xs text-purple-300">
            {CATEGORY_LABELS[doc.category] || doc.category}
          </span>
        )}
        {doc.subject && (
          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300">
            {doc.subject}
          </span>
        )}
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-6">
        {/* Author */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-purple-400 to-blue-500 text-sm font-bold text-white">
            {doc.author?.userName?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <p className="text-xs text-gray-500">Author</p>
            <p className="text-sm font-semibold text-white">
              {doc.author?.userName || "—"}
            </p>
          </div>
        </div>

        <div className="h-8 w-px bg-white/10" />

        {/* Pages */}
        <div>
          <p className="text-xs text-gray-500">Pages</p>
          <p className="text-sm font-semibold text-white">
            {doc.pageCount ? `${doc.pageCount} pages` : "—"}
          </p>
        </div>

        <div className="h-8 w-px bg-white/10" />

        {/* Created year */}
        <div>
          <p className="text-xs text-gray-500">Published Year</p>
          <p className="text-sm font-semibold text-white">
            {doc.createdAt ? new Date(doc.createdAt).getFullYear() : "—"}
          </p>
        </div>

        <div className="h-8 w-px bg-white/10" />

        {/* Royalty */}
        <div>
          <p className="text-xs text-gray-500">Royalty</p>
          <p className="text-sm font-semibold text-white">
            {doc.royaltyPercent ? `${doc.royaltyPercent}%` : "—"}
          </p>
        </div>
      </div>

      {/* Rating */}
      {reviewCount !== undefined && (
        <div className="mb-5 flex items-center gap-3">
          <StarRating value={doc.averageRating || 0} />
          <span className="text-sm font-bold text-yellow-400">
            {doc.averageRating || "—"}
          </span>
          <span className="text-sm text-gray-500">
            ({reviewCount} reviews)
          </span>
        </div>
      )}

      {/* Description */}
      <p className="text-sm leading-relaxed text-gray-400">
        {doc.description || "No description available."}
      </p>
    </div>
  );
}