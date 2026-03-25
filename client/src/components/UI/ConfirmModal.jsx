import { FiAlertTriangle } from "react-icons/fi";

const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div 
        className="fixed inset-0 bg-[#050816]/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 relative pointer-events-none">
        
        <div className="relative transform overflow-hidden rounded-xl bg-[#0a0f24] border border-white/10 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg pointer-events-auto">
          
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 bg-transparent">
            <div className="sm:flex sm:items-start">
              
              <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/10 sm:mx-0 sm:h-10 sm:w-10">
                <FiAlertTriangle className="h-6 w-6 text-red-500" aria-hidden="true" />
              </div>
              
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-base font-semibold text-white" id="modal-title">
                  Xoá tài liệu
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-400">
                    Bạn có chắc chắn muốn xoá tài liệu này? Tất cả dữ liệu liên quan sẽ bị xoá vĩnh viễn. Hành động này không thể hoàn tác.
                  </p>
                </div>
              </div>

            </div>
          </div>
          
          <div className="bg-white/5 border-t border-white/10 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600 transition-colors sm:ml-3 sm:w-auto cursor-pointer"
            >
              Vâng, xoá ngay
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-gray-300 shadow-sm ring-1 ring-inset ring-white/20 hover:bg-white/10 hover:text-white transition-colors sm:mt-0 sm:w-auto cursor-pointer"
            >
              Huỷ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;