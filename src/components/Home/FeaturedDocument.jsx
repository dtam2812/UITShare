import React from "react";
import DocumentCard from "../DocumentCard/DocumentCard";

const documents = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
];

export default function FeaturedDocuments() {
  return (
    <section className="relative py-12 text-white px-6 overflow-hidden">

      {/* section title */}
      <div className="max-w-6xl mx-auto mb-12">

        <p className="text-cyan-400 text-sm font-semibold mb-2">
          ✦ Nổi bật
        </p>

        <div className="flex items-end justify-between flex-wrap gap-4">

          <h2 className="text-3xl md:text-4xl font-bold">
            Tài liệu được yêu thích
          </h2>

          <button className="text-cyan-400 text-sm hover:underline">
            Xem tất cả →
          </button>

        </div>

      </div>

      {/*Documents grid*/}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {documents.map((doc) => (
          <DocumentCard key={doc.id} />
        ))}

      </div>

    </section>
  );
}