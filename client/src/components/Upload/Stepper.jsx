import { FiUploadCloud, FiFileText, FiCheckCircle } from "react-icons/fi";

const Stepper = ({ currentStep }) => {
  const steps = [
    {
      id: 1,
      name: "Tải file lên",
      icon: <FiUploadCloud className="w-5 h-5" />,
    },
    { id: 2, name: "Chi tiết", icon: <FiFileText className="w-5 h-5" /> },
    { id: 3, name: "Hoàn tất", icon: <FiCheckCircle className="w-5 h-5" /> },
  ];

  return (
    <div className="flex items-center justify-center w-full max-w-2xl mx-auto mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center w-full relative">
          <div className="flex flex-col items-center relative z-10 w-full">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors duration-300
                ${
                  currentStep >= step.id
                    ? "bg-purple-600 text-white border-2 border-transparent"
                    : "bg-[#050816] text-gray-400 border-2 border-white/20"
                }`}
            >
              {step.icon}
            </div>
            <span
              className={`mt-2 text-sm font-medium ${currentStep >= step.id ? "text-purple-400" : "text-gray-400"}`}
            >
              {step.name}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div className="absolute top-5 left-[50%] w-full h-[2px] -z-0">
              <div
                className={`h-full ${currentStep > step.id ? "bg-purple-600" : "bg-white/10"}`}
              ></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
