import { Search, Wallet, BadgeCheck } from "lucide-react";
import { Link } from "react-router";

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Tìm tài liệu",
    desc: "Duyệt qua hàng nghìn tài liệu từ sinh viên các trường hàng đầu. Filter theo môn, trường, rating.",
  },
  {
    icon: Wallet,
    step: "02",
    title: "Thanh toán bằng ETH",
    desc: "Kết nối ví MetaMask, mua tài liệu với vài click. Giao dịch minh bạch, phí thấp trên blockchain.",
  },
  {
    icon: BadgeCheck,
    step: "03",
    title: "Sở hữu NFT vĩnh viễn",
    desc: "Tài liệu được mint thành NFT, thuộc về bạn mãi mãi. Có thể bán lại, tặng, hoặc giữ làm bộ sưu tập.",
  },
];

export default function HowItWorks() {
  return (
    <Link to="/document">
      <section className="relative overflow-hidden px-6 pt-6 pb-16 text-white">
        <div className="mx-auto max-w-6xl">
          {/* section title */}
          <div className="mb-12">
            <p className="mb-2 text-sm font-semibold text-cyan-400">
              ✦ Cách hoạt động
            </p>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Đơn giản như{" "}
              <span className="bg-linear-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                3 bước
              </span>
            </h2>
            <p className="mt-3 max-w-xl text-base text-gray-400">
              Không cần biết về blockchain. Mua tài liệu nhanh như mua hàng
              online.
            </p>
          </div>

          {/* steps grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Step key={i} step={s} index={i} />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 flex justify-center">
            <button className="w-48 cursor-pointer rounded-lg bg-purple-500 px-6 py-3 font-medium text-white transition hover:bg-purple-600">
              Bắt đầu ngay →
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
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md transition-colors hover:bg-white/10">
      <div className="mb-4 text-xs font-black tracking-[0.3em] text-white/20 uppercase">
        Step {step.step}
      </div>

      {/* icon + pulse ring */}
      <div className="relative mb-6 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-400/30 bg-purple-500/20 text-purple-400">
          <Icon className="h-7 w-7" strokeWidth={1.5} />
        </div>
        <div
          className="absolute h-16 w-16 animate-ping rounded-2xl bg-purple-500/20"
          style={{ animationDuration: `${2 + index * 0.5}s` }}
        />
      </div>

      <div className="mb-2 text-xl font-bold text-white">{step.title}</div>
      <div className="mt-1 text-sm leading-relaxed text-gray-400">
        {step.desc}
      </div>
    </div>
  );
}
