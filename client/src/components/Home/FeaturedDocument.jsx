import React, { useEffect } from "react";
import DocumentCard from "../DocumentCard/DocumentCard";
import axios from "../../common";
import { Link } from "react-router";

export default function FeaturedDocuments({
  badge = "✦ Nổi Bật",
  title = "Tài Liệu Được Yêu Thích Nhất",
  showAll = "Xem Tất Cả →",
}) {
  const [documents, setDocuments] = React.useState([]);

  const getListDocument = async () => {
    try {
      const response = await axios.get("/api/documents/documentList");

      if (response.status === 200) {
        if (badge === "✦ Nổi Bật") {
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

  return (
    <section className="relative overflow-hidden px-4 py-10 text-white sm:px-6 sm:py-12">
      <div className="mx-auto mb-8 max-w-6xl sm:mb-12">
        <p className="mb-2 text-sm font-semibold text-cyan-400">{badge}</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">{title}</h2>
          <Link to="/document">
            <button className="cursor-pointer text-sm text-cyan-400 hover:underline">
              {showAll}
            </button>
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {documents.slice(0, 4).map((doc) => (
          <DocumentCard key={doc._id} {...doc} />
        ))}
      </div>
    </section>
  );
}