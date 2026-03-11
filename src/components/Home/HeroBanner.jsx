    import { FileText, Users, Share2 } from "lucide-react";

    export default function Hero() {
      return (
        <section className="relative min-h-screen pt-32 pb-16 text-white flex flex-col items-center px-6">
          
          {/* HERO TEXT */}
          <div className="relative text-center max-w-4xl">

            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-5 py-2 mb-6 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 text-sm">
              <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
              NỀN TẢNG HỌC LIỆU NFT ĐẦU TIÊN TẠI VIỆT NAM
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Học liệu số
              <br />
              <span className="bg-linear-to-r from-purple-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text">
                Dành cho sinh viên UIT
              </span>
            </h1>

            <p className="mt-6 text-gray-400 text-lg">
            Mua tài liệu học tập dưới dạng NFT — xác thực quyền sở hữu, giao dịch tự do, không ai có thể lấy đi.
            </p>

            {/* BUTTONS */}
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <button className="w-48 bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg font-medium transition cursor-pointer">
                Tải lên tài liệu
              </button>

              <button className="w-48 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition cursor-pointer">
                Khám phá tài liệu
              </button>
            </div>

          </div>

          {/* STATS */}
          <div className="relative mt-16 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl w-full">

            <Stat icon={<FileText />} value="50K+" label="Documents Stored" />
            <Stat icon={<Users />} value="12K+" label="Active Users" />
            <Stat icon={<Share2 />} value="30K+" label="Files Shared" />

          </div>

        </section>
      );
    }

    function Stat({ icon, value, label }) {
      return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition">

          <div className="flex justify-center text-purple-400 mb-3">
            {icon}
          </div>

          <div className="text-2xl font-bold">{value}</div>

          <div className="text-gray-400 text-sm mt-1">
            {label}
          </div>

        </div>
      );
    }