import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { pdfjs } from "react-pdf";
import { jwtDecode } from "jwt-decode";
import { useSearchParams } from "react-router";

import FeaturedDocuments from "../../components/Home/FeaturedDocument";
import DocumentReviews from "../../components/DocumentReviews/DocumentReviews";
import DocumentInfo from "../../components/DocumentInfo/DocumentInfo";
import NFTInfo from "../../components/NFTInfo/NFTInfo";
import PDFPreviewModal from "../../components/PDFPreviewModal/PDFPreviewModal";
import DocumentSidebar from "../../components/DocumentDetail/DocumentSidebar";
import ResellModal from "../../components/DocumentDetail/ResellModal";
import CancelListingModal from "../../components/DocumentDetail/CancelListingModal";
import { ACCESS_STATUS } from "../../components/DocumentDetail/ActionButtons";

import { useCart } from "../../context/CartContext";
import axios from "../../common";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function DocumentDetail() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [nftHistory, setNftHistory] = useState([]);

  const [accessStatus, setAccessStatus] = useState(ACCESS_STATUS.LOADING);
  const [activeListing, setActiveListing] = useState(null);
  const [resellListing, setResellListing] = useState(null);

  const [cartMsg, setCartMsg] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showResellModal, setShowResellModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { cartItems, addToCart } = useCart();
  const isInCart = cartItems.some((item) => item._id === doc?._id);

  // Fetch document
  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      setError(null);
      setAccessStatus(ACCESS_STATUS.LOADING);
      try {
        const response = await axios.get(
          `/api/documents/documentDetail/${documentId}`,
        );
        if (response.status === 200) setDoc(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Không tìm thấy tài liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [documentId]);

  // Fetch resell listing
  useEffect(() => {
    const listingId = searchParams.get("listingId");
    if (!listingId) return;
    const fetchListing = async () => {
      try {
        const res = await axios.get(`/api/marketplace/listing/${listingId}`);
        setResellListing(res.data);
      } catch {
        setResellListing(null);
      }
    };
    fetchListing();
  }, [searchParams]);

  // Check access
  const checkAccess = async () => {
    if (!doc) return;
    const token = localStorage.getItem("access_token");
    if (!token || token === "undefined") {
      setAccessStatus(ACCESS_STATUS.GUEST);
      return;
    }
    try {
      const res = await axios.get(`/api/marketplace/access/${doc._id}`);
      const { hasAccess, reason } = res.data;

      if (reason === "author") {
        setAccessStatus(ACCESS_STATUS.AUTHOR);
      } else if (reason === "listed") {
        setAccessStatus(ACCESS_STATUS.LISTED);
        try {
          const decoded = jwtDecode(token);
          const listRes = await axios.get(
            `/api/marketplace/author/${decoded._id || decoded.id}/resell`,
          );
          const found = listRes.data.find(
            (l) => l.document?._id === doc._id || l.document === doc._id,
          );
          setActiveListing(found || null);
        } catch {}
      } else if (hasAccess) {
        setAccessStatus(ACCESS_STATUS.OWNED);
        setActiveListing(null);
      } else {
        setAccessStatus(ACCESS_STATUS.NOT_OWNED);
        setActiveListing(null);
      }
    } catch {
      setAccessStatus(ACCESS_STATUS.NOT_OWNED);
    }
  };

  useEffect(() => {
    checkAccess();
  }, [doc]);

  // Cart helpers
  const showCartMsg = (msg) => {
    setCartMsg(msg);
    setTimeout(() => setCartMsg(null), 3000);
  };

  const handleAddToCart = async () => {
    if (!doc) return;
    const token = localStorage.getItem("access_token");
    if (!token || token === "undefined") return navigate("/login");
    if (
      accessStatus === ACCESS_STATUS.OWNED ||
      accessStatus === ACCESS_STATUS.AUTHOR
    ) {
      showCartMsg("already_owned");
      return;
    }
    setAddingToCart(true);
    const result = await addToCart(doc, searchParams.get("listingId") || null);
    setAddingToCart(false);
    showCartMsg(result.success ? "added" : result.reason);
  };

  const handleBuyNow = async () => {
    if (!doc) return;
    const token = localStorage.getItem("access_token");
    if (!token || token === "undefined") return navigate("/login");
    if (
      accessStatus === ACCESS_STATUS.OWNED ||
      accessStatus === ACCESS_STATUS.AUTHOR
    )
      return;

    if (!isInCart) {
      setAddingToCart(true);
      const result = await addToCart(
        doc,
        searchParams.get("listingId") || null,
      );
      setAddingToCart(false);
      if (!result.success && result.reason === "already_owned") {
        showCartMsg("already_owned");
        return;
      }
    }
    navigate("/cart");
  };

  // Render guards
  if (loading) {
    return (
      <section className="relative px-4 py-12 text-white sm:px-6">
        <div className="mx-auto max-w-6xl py-32 text-center text-gray-400">
          Đang tải...
        </div>
      </section>
    );
  }

  if (error || !doc) {
    return (
      <section className="relative px-4 py-12 text-white sm:px-6">
        <div className="mx-auto max-w-6xl py-32 text-center text-gray-400">
          {error || "Không tìm thấy tài liệu"}
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Background blobs */}
        <div
          className="pointer-events-none fixed top-0 -left-40 h-150 w-150 bg-purple-600/20 blur-[120px]"
          style={{ zIndex: 0 }}
        />
        <div
          className="pointer-events-none fixed top-1/2 -right-40 h-150 w-150 bg-blue-500/40 blur-[120px]"
          style={{ zIndex: 0 }}
        />
        <div
          className="pointer-events-none fixed bottom-0 -left-40 h-150 w-150 bg-purple-600/30 blur-[120px]"
          style={{ zIndex: 0 }}
        />

        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex cursor-pointer items-center gap-2 text-gray-400 transition-colors hover:text-white"
        >
          ← <span className="text-sm">Quay lại</span>
        </button>

        <p className="mb-2 text-sm font-semibold text-cyan-400">
          ✦ Chi tiết tài liệu
        </p>
        <h2 className="mb-6 text-2xl font-bold sm:mb-12 sm:text-3xl md:text-4xl">
          {doc.title}
        </h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Sidebar - lên đầu trên mobile, sang phải trên desktop */}
          <div className="order-first lg:order-last lg:col-span-1">
            <DocumentSidebar
              doc={doc}
              numPages={numPages}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              accessStatus={accessStatus}
              isInCart={isInCart}
              addingToCart={addingToCart}
              cartMsg={cartMsg}
              resellListing={resellListing}
              onBuyNow={handleBuyNow}
              onAddToCart={handleAddToCart}
              onResell={() => setShowResellModal(true)}
              onCancelListing={() => setShowCancelModal(true)}
              onLoginRedirect={() => navigate("/login")}
              onShowPreview={() => setShowPreview(true)}
              onReadDocument={() => navigate(`/documentReading/${doc._id}`)}
            />
          </div>

          {/* Left column - xuống dưới trên mobile */}
          <div className="order-last flex flex-col gap-6 lg:order-first lg:col-span-2">
            <DocumentInfo doc={doc} reviewCount={doc.commentCount} />
            <NFTInfo nft={doc} nftHistory={nftHistory} />
            <DocumentReviews />
          </div>
        </div>

        <FeaturedDocuments badge="✦ Liên quan" title="Tài liệu cùng chủ đề" />
      </div>

      {/* Modals */}
      {showPreview && (
        <PDFPreviewModal
          file={doc.fileUrl}
          onClose={() => setShowPreview(false)}
        />
      )}

      {showResellModal && (
        <ResellModal
          doc={doc}
          onClose={() => setShowResellModal(false)}
          onSuccess={() => {
            setShowResellModal(false);
            checkAccess();
          }}
        />
      )}

      {showCancelModal && activeListing && (
        <CancelListingModal
          listing={activeListing}
          onClose={() => setShowCancelModal(false)}
          onSuccess={() => {
            setShowCancelModal(false);
            checkAccess();
          }}
        />
      )}
    </section>
  );
}