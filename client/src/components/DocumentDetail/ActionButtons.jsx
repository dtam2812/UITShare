import { Check, Loader2, ShoppingCart, Tag, X } from "lucide-react";

export const ACCESS_STATUS = {
  LOADING: "loading",
  OWNED: "owned",
  LISTED: "listed",
  AUTHOR: "author",
  NOT_OWNED: "not_owned",
  GUEST: "guest",
};

/**
 * @param {object} props
 * @param {string}   props.accessStatus
 * @param {boolean}  props.isInCart
 * @param {boolean}  props.addingToCart
 * @param {function} props.onBuyNow
 * @param {function} props.onAddToCart
 * @param {function} props.onResell      
 * @param {function} props.onCancelListing 
 * @param {function} props.onLoginRedirect
 */
export default function ActionButtons({
  accessStatus,
  isInCart,
  addingToCart,
  onBuyNow,
  onAddToCart,
  onResell,
  onCancelListing,
  onLoginRedirect,
}) {
  if (accessStatus === ACCESS_STATUS.LISTED) {
    return (
      <div className="flex flex-col gap-2">
        <button
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 py-3 font-semibold text-cyan-400"
        >
          <Tag size={16} />
          Đang bán lại trên marketplace
        </button>
        <button
          onClick={onCancelListing}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-orange-500/30 bg-orange-500/10 py-2.5 text-sm font-semibold text-orange-400 transition hover:bg-orange-500/20"
        >
          <X size={14} />
          Huỷ bán lại
        </button>
      </div>
    );
  }

  if (accessStatus === ACCESS_STATUS.OWNED) {
    return (
      <div className="flex flex-col gap-2">
        <button
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-green-500/30 bg-green-500/20 py-3 font-semibold text-green-400"
        >
          <Check size={16} />
          Bạn đã sở hữu tài liệu này
        </button>
        <button
          onClick={onResell}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 py-2.5 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-500/20"
        >
          <Tag size={14} />
          Bán lại tài liệu
        </button>
      </div>
    );
  }

  if (accessStatus === ACCESS_STATUS.AUTHOR) {
    return (
      <button
        disabled
        className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-green-500/30 bg-green-500/20 py-3 font-semibold text-green-400"
      >
        <Check size={16} />
        Tài liệu của bạn
      </button>
    );
  }

  if (accessStatus === ACCESS_STATUS.GUEST) {
    return (
      <button
        onClick={onLoginRedirect}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-purple-500 py-3 font-semibold text-white transition hover:bg-purple-600"
      >
        Đăng nhập để mua
      </button>
    );
  }

  if (accessStatus === ACCESS_STATUS.LOADING) {
    return (
      <button
        disabled
        className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-purple-500/50 py-3 font-semibold text-white"
      >
        <Loader2 size={16} className="animate-spin" />
        Đang kiểm tra...
      </button>
    );
  }

  // NOT_OWNED — default buy/cart buttons
  return (
    <div className="flex gap-2">
      <button
        onClick={onBuyNow}
        disabled={addingToCart}
        className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-purple-500 py-3 font-semibold text-white transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {addingToCart && <Loader2 size={16} className="animate-spin" />}
        Mua tài liệu ngay
      </button>
      <button
        onClick={onAddToCart}
        disabled={addingToCart || isInCart}
        title={isInCart ? "Đã có trong giỏ hàng" : "Thêm vào giỏ hàng"}
        className={`flex cursor-pointer items-center justify-center rounded-lg border px-4 py-3 transition disabled:cursor-not-allowed ${
          isInCart
            ? "border-green-500/40 bg-green-500/10 text-green-400"
            : "border-white/10 bg-white/5 text-white hover:bg-white/10"
        }`}
      >
        {isInCart ? <Check size={20} /> : <ShoppingCart size={20} />}
      </button>
    </div>
  );
}