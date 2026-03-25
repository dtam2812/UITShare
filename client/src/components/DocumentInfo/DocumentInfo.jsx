import { Star } from "lucide-react";

function StarRating({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${
            s <= Math.round(value)
              ? "text-yellow-400 fill-yellow-400"
              : "text-white/20"
          }`}
        />
      ))}
    </div>
  );
}

export default function DocumentInfo({ doc, reviewCount }) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {doc.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="text-cyan-400 text-sm font-semibold mb-5">{doc.school}</p>

      <div className="flex items-center gap-6 flex-wrap mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-blue-500 flex items-center justify-center text-sm font-bold text-white">
            {doc.authorAvatar}
          </div>
          <div>
            <p className="text-xs text-gray-500">Tác giả</p>
            <p className="text-sm font-semibold text-white">{doc.author}</p>
          </div>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div>
          <p className="text-xs text-gray-500">Số trang</p>
          <p className="text-sm font-semibold text-white">{doc.pages} trang</p>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div>
          <p className="text-xs text-gray-500">Năm học</p>
          <p className="text-sm font-semibold text-white">{doc.year}</p>
        </div>
      </div>

      {reviewCount !== undefined && (
        <div className="flex items-center gap-3 mb-5">
          <StarRating value={doc.rating} />
          <span className="text-yellow-400 font-bold text-sm">{doc.rating}</span>
          <span className="text-gray-500 text-sm">({reviewCount} đánh giá)</span>
        </div>
      )}

      <p className="text-gray-400 text-sm leading-relaxed">{doc.description}</p>
    </div>
  );
}