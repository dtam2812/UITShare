import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router";
import { HiOutlineShoppingCart, HiX, HiArrowLeft } from "react-icons/hi";
import { FileText } from "lucide-react";

export default function Cart() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 text-white">
      {/* Header */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex cursor-pointer items-center gap-2 text-gray-400 transition-colors hover:text-white"
      >
        <HiArrowLeft className="h-4 w-4" />
        <span className="text-sm">Quay lại</span>
      </button>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="mb-1 text-sm font-semibold text-cyan-400">✦ Giỏ hàng</p>
          <h1 className="text-3xl font-bold text-white">Giỏ hàng của bạn</h1>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="cursor-pointer rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/20"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 py-24 backdrop-blur-md">
          <HiOutlineShoppingCart className="mb-4 h-16 w-16 text-gray-600" />
          <p className="mb-2 text-lg font-semibold text-gray-400">
            Giỏ hàng trống
          </p>
          <p className="mb-6 text-sm text-gray-600">
            Hãy thêm tài liệu vào giỏ hàng
          </p>
          <button
            onClick={() => navigate("/document")}
            className="cursor-pointer rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Khám phá tài liệu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Danh sách */}
          <div className="flex flex-col gap-3 lg:col-span-2">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
              >
                {/* Icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/20">
                  <FileText className="h-6 w-6 text-purple-400" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p
                    className="line-clamp-2 cursor-pointer text-sm font-semibold text-white hover:text-purple-300"
                    onClick={() => navigate(`/documentDetail/${item._id}`)}
                  >
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {item.subject} · {item.category}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Tác giả: {item.author?.userName || "—"}
                  </p>
                </div>

                {/* Price + Remove */}
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="text-sm font-bold text-purple-400">
                    {item.price > 0 ? `${item.price} ETH` : "Free"}
                  </span>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="cursor-pointer text-gray-600 transition hover:text-red-400"
                  >
                    <HiX size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="self-start rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h2 className="mb-4 text-lg font-bold text-white">Tổng đơn hàng</h2>

            <div className="mb-4 flex flex-col gap-2 border-b border-white/10 pb-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between"
                >
                  <span className="line-clamp-1 max-w-[160px] text-xs text-gray-400">
                    {item.title}
                  </span>
                  <span className="text-xs font-medium text-white">
                    {item.price > 0 ? `${item.price} ETH` : "Free"}
                  </span>
                </div>
              ))}
            </div>

            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-300">
                Tổng cộng
              </span>
              <span className="text-xl font-black text-purple-400">
                {total.toFixed(4)} ETH
              </span>
            </div>

            <button className="w-full cursor-pointer rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white transition hover:bg-purple-700">
              Thanh toán ngay
            </button>

            <button
              onClick={() => navigate("/document")}
              className="mt-3 w-full cursor-pointer rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
