import { FileText, Users, Share2 } from "lucide-react";
import { Link } from "react-router";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center px-6 pt-24 pb-16 text-white sm:pt-32 sm:pb-20">
      {/* HERO TEXT */}
      <div className="relative max-w-4xl text-center">
        {/* BADGE */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-[10px] text-cyan-300 sm:px-5 sm:py-2 sm:text-sm">
          <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
          NỀN TẢNG HỌC LIỆU NFT ĐẦU TIÊN TẠI VIỆT NAM
        </div>

        <h1 className="text-2xl leading-tight font-bold sm:text-4xl md:text-6xl">
          Tài Liệu Học Tập Số
          <br />
          <span className="bg-linear-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Dành Cho Sinh Viên UIT
          </span>
        </h1>

        <p className="mt-4 text-sm text-gray-400 sm:mt-6 sm:text-lg">
          Mua tài liệu học tập dưới dạng NFT — xác minh quyền sở hữu, tự do giao
          dịch và không ai có thể lấy đi của bạn.
        </p>

        {/* BUTTONS */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/upload">
            <button className="w-48 cursor-pointer rounded-lg bg-purple-500 px-6 py-3 font-medium transition hover:bg-purple-600" aria-label="Tải lên tài liệu">
              Tải Lên Tài Liệu
            </button>
          </Link>

          <Link to="/document">
            <button className="w-48 cursor-pointer rounded-lg bg-white px-6 py-3 font-medium text-black transition hover:bg-gray-200" aria-label="Khám phá tài liệu">
              Khám Phá Tài Liệu
            </button>
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div className="relative mt-12 grid w-full max-w-6xl grid-cols-2 gap-4 sm:mt-16 sm:gap-6 md:grid-cols-3">
        <Stat icon={<FileText />} value="50K+" label="Tài Liệu Được Lưu Trữ" />
        <Stat icon={<Users />} value="12K+" label="Người Dùng Hoạt Động" />
        <Stat
          icon={<Share2 />}
          value="30K+"
          label="Tệp Được Chia Sẻ"
          className="col-span-2 md:col-span-1"
        />
      </div>
    </section>
  );
}

function Stat({ icon, value, label, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md transition hover:bg-white/10 sm:p-6 ${className}`}
      role="region"
      aria-label={`${value} ${label}`}
    >
      <div className="mb-2 flex justify-center text-purple-400" aria-hidden="true">{icon}</div>
      <div className="text-xl font-bold sm:text-2xl">{value}</div>
      <div className="mt-1 text-xs text-gray-400 sm:text-sm">{label}</div>
    </div>
  );
}