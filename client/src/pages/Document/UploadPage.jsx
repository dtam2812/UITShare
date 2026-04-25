import { useState } from "react";
import Stepper from "../../components/Upload/Stepper";
import Step1Dropzone from "../../components/Upload/Step1Dropzone";
import Step2Detail from "../../components/Upload/Step2Details";
import toast from "react-hot-toast";
import Step3Processing from "../../components/Upload/Step3Processing";

const UploadPage = () => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState([]);

  const onClick = (file) => {
    if (!file[0]) {
      toast.error("Chưa chọn file để upload");
      return;
    }
    setStep((prev) => prev + 1);
    setFile(file);
  };

  const prev = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (formData) => {
    setStep((prev) => prev + 1);
  };

  const handleReset = () => {
    setStep(1);
    setFile([]);
  };

  return (
    <div className="min-h-screen bg-[#050816] p-6 font-sans md:p-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Đăng bán tài liệu</h1>
          <p className="mt-2 text-sm text-gray-400">
            Chia sẻ kiến thức và nhận lại giá trị qua hệ thống NFT
          </p>
        </div>

        <Stepper currentStep={step} />

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-8">
          {step === 1 && (
            <Step1Dropzone onNextStep={onClick} initialFile={file} />
          )}
          {step === 2 && (
            <Step2Detail
              file={file}
              prevStep={prev}
              onReset={handleReset}
              onSubmit={handleSubmit}
            />
          )}
          {step === 3 && <Step3Processing onReset={handleReset} />}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
