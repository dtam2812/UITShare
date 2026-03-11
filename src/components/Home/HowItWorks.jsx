import { Search, Wallet, BadgeCheck } from "lucide-react";

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
    <section className="relative py-12 text-white px-6 overflow-hidden">

      <div className="max-w-6xl mx-auto">

        {/* section title */}
        <div className="mb-12">
          <p className="text-cyan-400 text-sm font-semibold mb-2">
            ✦ Cách hoạt động
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Đơn giản như{" "}
            <span className="bg-linear-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              3 bước
            </span>
          </h2>
          <p className="mt-3 text-gray-400 text-base max-w-xl">
            Không cần biết về blockchain. Mua tài liệu nhanh như mua hàng online.
          </p>
        </div>

        {/* steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <Step key={i} step={s} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <button className="w-48 bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg font-medium transition cursor-pointer text-white">
            Bắt đầu ngay →
          </button>
        </div>

      </div>
    </section>
  );
}

function Step({ step, index }) {
  const Icon = step.icon;

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-colors">
      <div className="text-xs font-black tracking-[0.3em] text-white/20 uppercase mb-4">
        Step {step.step}
      </div>

      {/* icon + pulse ring */}
      <div className="relative flex justify-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400">
          <Icon className="w-7 h-7" strokeWidth={1.5} />
        </div>
        <div
          className="absolute w-16 h-16 rounded-2xl bg-purple-500/20 animate-ping"
          style={{ animationDuration: `${2 + index * 0.5}s` }}
        />
      </div>

      <div className="text-xl font-bold text-white mb-2">{step.title}</div>
      <div className="text-gray-400 text-sm mt-1 leading-relaxed">{step.desc}</div>
    </div>
  );
}