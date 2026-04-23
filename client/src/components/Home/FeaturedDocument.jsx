import React, { useEffect } from "react";
import DocumentCard from "../DocumentCard/DocumentCard";
import axios from "../../common";
import { Link } from "react-router";

export default function FeaturedDocuments({
  badge = "✦ Nổi bật",
  title = "Tài liệu được yêu thích",
  showAll = "Xem tất cả →",
}) {
  const [documents, setDocuments] = React.useState([]);

  const getListDocument = async () => {
    try {
      const response = await axios.get("/api/documents/documentList");

      if (response.status === 200) {
        if (badge === "✦ Nổi bật") {
          setDocuments(
            response.data.sort(
              (a, b) => (b.downloadCount || 0) - (a.downloadCount || 0),
            ),
          );
        } else {
          setDocuments(
            response.data.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            ),
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getListDocument();
  }, []);

  console.log(documents);

  return (
    <section className="relative overflow-hidden px-6 py-12 text-white">
      <div className="mx-auto mb-12 max-w-6xl">
        <p className="mb-2 text-sm font-semibold text-cyan-400">{badge}</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
          <Link to="/document">
            <button className="cursor-pointer text-sm text-cyan-400 hover:underline">
              {showAll}
            </button>
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {documents.slice(0, 4).map((doc) => (
          <DocumentCard key={doc._id} {...doc} />
        ))}
      </div>
    </section>
  );
}
