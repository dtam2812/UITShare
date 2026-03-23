import { FiBook, FiShield, FiFacebook, FiStar, FiFileText, FiEye } from "react-icons/fi";
import DocumentCard from "../../components/DocumentCard";

const AuthorDetail = () => {
  const authorInfo = {
    name: "Trần Thành Vinh",
    avatar: "https://m.yodycdn.com/blog/anh-dai-dien-hai-yodyvn2.jpg",
    cover: "https://cohotech.vn/wp-content/uploads/2024/10/Do-phan-giai-cao.webp",
    cohort: "K18 - Công nghệ thông tin",
    bio: "Chuyên share tài liệu điểm cao, đề thi giữa kỳ, cuối kỳ các môn đại cương và chuyên ngành. Chúc các đồng âm UIT qua môn A+!",
    socialLink: "https://facebook.com/vinh.uit",
    stats: {
      docs: 15,
      views: 1250,
      rating: 4.8
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-white">
      <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-sm border border-white/10 overflow-hidden mb-10">
        
        <div className="relative h-48 sm:h-56 bg-white/5 border-b border-white/10">
          <img 
            src={authorInfo.cover}
            alt="Cover" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-14">
            <img 
              src={authorInfo.avatar}
              alt="Profile avatar" 
              className="w-28 h-28 rounded-full object-cover border-4 border-[#050816] shadow-md bg-[#050816]"
            />
          </div>
        </div>

        <div className="mt-16 px-6 pb-8 text-center">
          <h1 className="text-2xl font-bold text-white">{authorInfo.name}</h1>
          
          <div className="mt-4 inline-flex items-center gap-4 px-5 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 text-sm">
            <span className="flex items-center gap-1.5"><FiBook className="w-4 h-4 opacity-70" />Sinh viên UIT</span>
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
            <span className="flex items-center gap-1.5"><FiShield className="w-4 h-4 opacity-70" />{authorInfo.cohort}</span>
          </div>

          <p className="mt-5 max-w-2xl mx-auto text-gray-400 leading-relaxed text-sm">
            {authorInfo.bio}
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button className="px-8 py-2.5 text-sm font-medium text-white bg-linear-to-r from-purple-400 via-blue-400 to-cyan-400 rounded-xl hover:opacity-90 transition-opacity cursor-pointer">
              Theo dõi tác giả
            </button>
            <a 
              href={authorInfo.socialLink} 
              target="_blank" 
              rel="noreferrer"
              className="p-2.5 text-gray-400 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-cyan-400 transition-all cursor-pointer"
              title="Liên hệ Facebook"
            >
              <FiFacebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-3 border-t border-white/10 bg-white/5 divide-x divide-white/10">
          <div className="py-5 text-center">
            <div className="flex items-center justify-center gap-2 text-purple-400 mb-1">
              <FiFileText className="w-4 h-4" />
              <span className="text-sm font-medium text-gray-400">Tài liệu</span>
            </div>
            <span className="text-xl font-bold text-white">{authorInfo.stats.docs}</span>
          </div>
          <div className="py-5 text-center">
            <div className="flex items-center justify-center gap-2 text-purple-400 mb-1">
              <FiEye className="w-4 h-4" />
              <span className="text-sm font-medium text-gray-400">Lượt xem</span>
            </div>
            <span className="text-xl font-bold text-white">{authorInfo.stats.views}</span>
          </div>
          <div className="py-5 text-center flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 text-purple-400 mb-1">
              <FiStar className="w-4 h-4" />
              <span className="text-sm font-medium text-gray-400">Đánh giá</span>
            </div>
            <span className="text-xl font-bold text-white">{authorInfo.stats.rating}<span className="text-sm text-gray-500 font-normal">/5</span></span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-cyan-400 rounded-sm"></span>
          Tài liệu đã chia sẻ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(curr => <DocumentCard key={curr}/>)}
        </div>
      </div>
    </div>
  );
};

export default AuthorDetail;