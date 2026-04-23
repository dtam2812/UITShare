import { FileText, Users, Share2 } from "lucide-react";
import { Link } from "react-router";

export default function Hero() {
  return (
    <section className="relative flex h-screen flex-col items-center px-6 pt-32 text-white">
      {/* HERO TEXT */}
      <div className="relative max-w-4xl text-center">
        {/* BADGE */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm text-cyan-300">
          <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
          NỀN TẢNG HỌC LIỆU NFT ĐẦU TIÊN TẠI VIỆT NAM
        </div>

        <h1 className="text-5xl leading-tight font-bold md:text-6xl">
          Học liệu số
          <br />
          <span className="bg-linear-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Dành cho sinh viên UIT
          </span>
        </h1>

        <p className="mt-6 text-lg text-gray-400">
          Mua tài liệu học tập dưới dạng NFT — xác thực quyền sở hữu, giao dịch
          tự do, không ai có thể lấy đi.
        </p>

        {/* BUTTONS */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/upload">
            <button className="w-48 cursor-pointer rounded-lg bg-purple-500 px-6 py-3 font-medium transition hover:bg-purple-600">
              Tải lên tài liệu
            </button>
          </Link>

          <Link to="/document">
            <button className="w-48 cursor-pointer rounded-lg bg-white px-6 py-3 font-medium text-black transition hover:bg-gray-200">
              Khám phá tài liệu
            </button>
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div className="relative mt-16 grid w-full max-w-6xl grid-cols-2 gap-6 md:grid-cols-3">
        <Stat icon={<FileText />} value="50K+" label="Documents Stored" />
        <Stat icon={<Users />} value="12K+" label="Active Users" />
        <Stat icon={<Share2 />} value="30K+" label="Files Shared" />
      </div>
    </section>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md transition hover:bg-white/10">
      <div className="mb-3 flex justify-center text-purple-400">{icon}</div>

      <div className="text-2xl font-bold">{value}</div>

      <div className="mt-1 text-sm text-gray-400">{label}</div>
    </div>
  );
}
