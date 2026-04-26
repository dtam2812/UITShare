import { Search, Wallet, BadgeCheck } from "lucide-react";
import { Link } from "react-router";

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Find Documents",
    desc: "Browse thousands of documents from students at top universities. Filter by subject, school, and rating.",
  },
  {
    icon: Wallet,
    step: "02",
    title: "Pay with ETH",
    desc: "Connect your MetaMask wallet and buy documents in just a few clicks. Transparent transactions with low blockchain fees.",
  },
  {
    icon: BadgeCheck,
    step: "03",
    title: "Own NFT Forever",
    desc: "Documents are minted as NFTs and belong to you forever. Resell, gift, or keep them as collectibles.",
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
              ✦ How It Works
            </p>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Simple in{" "}
              <span className="bg-linear-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                3 Steps
              </span>
            </h2>
            <p className="mt-3 max-w-xl text-base text-gray-400">
              No blockchain knowledge needed. Buy documents as easily as shopping online.
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
              Get Started →
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