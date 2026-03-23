import { Link } from 'react-router';
import UploadedDocsStatCard from '../../components/Profile/UploadedDocsStatCard';
import { FiGift, FiTrendingUp, FiAward } from 'react-icons/fi';

const DonatedReceived = () => {
  const mockDonations = [
    {
      id: 1,
      user: 'Anonymous_0x9A...',
      avatar: 'https://ui-avatars.com/api/?name=An&background=random',
      docId: 'doc_001',
      document: 'Giải tích 1 - Đề thi 2024',
      amount: 10, 
      date: '20/03/2026',
      message: 'Tài liệu cứu rỗi điểm số của mình kì này, thanks bro!!!'
    },
    {
      id: 2,
      user: 'Trần Trung Kiên',
      avatar: 'https://ui-avatars.com/api/?name=Kiên&background=random',
      docId: 'doc_003',
      document: 'Đại số tuyến tính căn bản',
      amount: 2.5,
      date: '18/03/2026',
      message: '' 
    },
    {
      id: 3,
      user: 'CryptoMaster',
      avatar: 'https://ui-avatars.com/api/?name=Cr&background=random',
      docId: 'doc_002',
      document: 'Tài liệu ôn tập OOP',
      amount: 50,
      date: '10/03/2026',
      message: 'Code chạy mượt, logic tốt. Xứng đáng nhận được sự ủng hộ!'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-2">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Donate nhận được</h1>
        <p className="text-sm text-gray-400 mt-1">Quản lý và theo dõi các khoản đóng góp ETH từ cộng đồng cho tài liệu của bạn.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <UploadedDocsStatCard
          title="Tổng lượt Donate"
          value="34"
          icon={<FiGift className="w-6 h-6" />}
          bgColor="bg-purple-500/10"
          textColor="text-purple-400"
        />
        <UploadedDocsStatCard
          title="Tổng ETH nhận được"
          value={<>145.5 <span className="text-sm text-gray-400 font-normal">ETH</span></>}
          icon={<FiTrendingUp className="w-6 h-6" />}
          bgColor="bg-green-500/10"
          textColor="text-green-400"
        />
        <UploadedDocsStatCard
          title="Donate cao nhất"
          value={<>50 <span className="text-sm text-gray-400 font-normal">ETH</span></>}
          icon={<FiAward className="w-6 h-6" />}
          bgColor="bg-yellow-500/10"
          textColor="text-yellow-400"
        />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-sm backdrop-blur-md">
        <h3 className="text-lg font-bold text-white mb-6">Lịch sử nhận Donate</h3>
        
        <div className="space-y-6">
          {mockDonations.map((donate) => (
            <div key={donate.id} className="border-b border-white/10 last:border-0 pb-6 last:pb-0">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <img src={donate.avatar} alt="avatar" className="w-10 h-10 rounded-full bg-white/10" />
                  <div>
                    <p className="text-sm font-semibold text-white">{donate.user}</p>
                    <p className="text-xs text-gray-400">
                      Tài liệu:{' '}
                      <Link to={`/documents/${donate.docId}`} className="font-medium text-purple-400 hover:text-purple-300 hover:underline transition-colors">
                        {donate.document}
                      </Link>
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold text-green-400 mb-0.5">
                    + {donate.amount} ETH
                  </p>
                  <p className="text-xs text-gray-400">{donate.date}</p>
                </div>
              </div>

              {donate.message && (
                <div className="bg-purple-500/10 p-4 rounded-xl border border-white/10 mt-2 backdrop-blur-sm">
                  <p className="text-sm text-gray-300 italic">"{donate.message}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonatedReceived;