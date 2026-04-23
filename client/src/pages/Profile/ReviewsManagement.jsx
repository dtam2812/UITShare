import { FiMessageCircle } from 'react-icons/fi';
import { Link } from 'react-router';
import UploadedDocsStatCard from '../../components/Profile/UploadedDocsStatCard';

const ReviewsManagement = () => {
  const mockReviews = [
    { 
      id: 1, 
      docId: 'doc_001', 
      user: 'Nguyễn Văn A', 
      avatar: 'https://ui-avatars.com/api/?name=Nguyễn+Văn+A&background=random', 
      document: 'Giải tích 1 - Đề thi 2024', 
      rating: 5, 
      date: '12/03/2026', 
      content: 'Tài liệu rất sát đề thi thực tế, cảm ơn tác giả!' 
    },
    { 
      id: 2, 
      docId: 'doc_002',
      user: 'Trần Thị B', 
      avatar: 'https://ui-avatars.com/api/?name=Trần+Thị+B&background=random', 
      document: 'Tài liệu ôn tập OOP', 
      rating: 4, 
      date: '10/03/2026', 
      content: 'Khá đầy đủ, nhưng phần đa hình giải thích hơi ngắn gọn.' 
    },
    { 
      id: 3, 
      docId: 'doc_003',
      user: 'Lê Hoàng C', 
      avatar: 'https://ui-avatars.com/api/?name=Lê+Hoàng+C&background=random', 
      document: 'Đại số tuyến tính căn bản', 
      rating: 5, 
      date: '05/03/2026', 
      content: 'Hay quá, đọc phát hiểu luôn ma trận nghịch đảo.' 
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-2">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Phản hồi tài liệu</h1>
        <p className="text-sm text-gray-400 mt-1">Xem đánh giá từ những sinh viên đã mua tài liệu của bạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <UploadedDocsStatCard
          title="Đánh giá trung bình"
          value={<>4.8 <span className="text-base text-gray-400 font-normal">/ 5.0</span></>}
          icon={<span className="text-3xl">★</span>}
          bgColor="bg-yellow-500/10"
          textColor="text-yellow-400"
        />
        <UploadedDocsStatCard
          title="Tổng số lượt đánh giá"
          value="128"
          icon={<FiMessageCircle className="w-7 h-7" />}
          bgColor="bg-purple-500/10"
          textColor="text-purple-400"
        />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-sm backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">Phản hồi mới nhất</h3>
        </div>
        
        <div className="space-y-6">
          {mockReviews.map((review) => (
            <div key={review.id} className="border-b border-white/10 last:border-0 pb-6 last:pb-0">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <img src={review.avatar} alt="avatar" className="w-10 h-10 rounded-full bg-white/10" />
                  <div>
                    <p className="text-sm font-semibold text-white">{review.user}</p>
                    <p className="text-xs text-gray-400">
                      Đã mua:{' '}
                      <Link 
                        to={`/documents/${review.docId}`} 
                        className="font-medium text-purple-400 hover:text-purple-300 hover:underline transition-colors cursor-pointer"
                      >
                        {review.document}
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end text-yellow-400 text-lg mb-1 tracking-widest">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">{review.date}</p>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                <p className="text-sm text-gray-300">"{review.content}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsManagement;