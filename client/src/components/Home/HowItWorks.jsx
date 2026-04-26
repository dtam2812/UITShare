import { Search, Wallet, BadgeCheck } from "lucide-react";
import { Link } from "react-router";

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Tìm Tài Liệu",
    desc: "Duyệt hàng nghìn tài liệu từ sinh viên các trường đại học hàng đầu. Lọc theo môn học, trường và đánh giá.",
  },
  {
    icon: Wallet,
    step: "02",
    title: "Thanh Toán Bằng ETH",
    desc: "Kết nối ví MetaMask và mua tài liệu chỉ trong vài cú nhấp chuột. Giao dịch minh bạch với phí blockchain thấp.",
  },
  {
    icon: BadgeCheck,
    step: "03",
    title: "Sở Hữu NFT Mãi Mãi",
    desc: "Tài liệu được đúc thành NFT và thuộc về bạn vĩnh viễn. Bán lại, tặng hoặc giữ làm vật sưu tầm.",
  },
];

export default function HowItWorks() {
  return (
    <Link to="/document">
      <section className="relative overflow-hidden px-6 pt-6 pb-16 text-white">
        <div className="mx-auto max-w-6xl">
          {/* section title */}
          <div className="mb-10 sm:mb-12">
            <p className="mb-2 text-sm font-semibold text-cyan-400">
              ✦ Cách Thức Hoạt Động
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Đơn Giản Chỉ Với{" "}
              <span className="bg-linear-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                3 Bước
              </span>
            </h2>
            <p className="mt-3 w-full text-sm text-gray-400 sm:text-base">
              Không cần kiến thức về blockchain. Mua tài liệu dễ dàng như mua
              sắm trực tuyến.
            </p>
          </div>

          {/* steps grid */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Step key={i} step={s} index={i} />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 flex justify-center sm:mt-12">
            <button className="w-48 cursor-pointer rounded-lg bg-purple-500 px-6 py-3 font-medium text-white transition hover:bg-purple-600">
              Bắt Đầu Ngay →
            </button>
          </div>
        </div>
      </section>
    </Link>
  );
}

function Step({ step, index }) {
  const Icon = step.icon;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-md transition-colors hover:bg-white/10 sm:p-6">
      <div className="mb-4 text-xs font-black tracking-[0.3em] text-white/20 uppercase">
        Bước {step.step}
      </div>

      {/* icon + pulse ring */}
      <div className="relative mb-5 flex justify-center sm:mb-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-400/30 bg-purple-500/20 text-purple-400 sm:h-16 sm:w-16">
          <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.5} />
        </div>
        <div
          className="absolute h-14 w-14 animate-ping rounded-2xl bg-purple-500/20 sm:h-16 sm:w-16"
          style={{ animationDuration: `${2 + index * 0.5}s` }}
        />
      </div>

      <div className="mb-2 text-lg font-bold text-white sm:text-xl">{step.title}</div>
      <div className="mt-1 text-sm leading-relaxed text-gray-400">{step.desc}</div>
    </div>
  );
}