import React from "react";
import DocumentCard from "../../components/DocumentCard/DocumentCard";
import Hero from "../../components/Home/HeroBanner";
import FeaturedDocuments from "../../components/Home/FeaturedDocument";
import HowItWorks from "../../components/Home/HowItWorks";

const Home = () => {
  return (
    <div className="relative">
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

      <div className="relative" style={{ zIndex: 1 }}>
        <Hero />
        <HowItWorks />
        <FeaturedDocuments />
        <FeaturedDocuments badge="✦ Mới nhất" title="Tài liệu mới tải lên" />
      </div>
    </div>
  );
};

export default Home;
