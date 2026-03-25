  import { useNavigate } from 'react-router'
  import pic2 from '../../assets/pic2.jpg'
  import logouit from '../../assets/logouit.png'

  const DocumentCard = ({ id = 1 }) => {
    const navigate = useNavigate()

    return (
      <div className='pt-4 pl-4'>
        <div className='bg-linear-to-br from-[#12121f] to-[#1a1a2e] rounded-xl shadow-md overflow-hidden w-64 border border-white/10 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer'>

          {/*Ảnh*/}
          <div className='relative h-32'>
            <img src={pic2} alt="course" className='w-full h-full object-cover' />
            <div className='absolute top-2 right-2 bg-black/60 text-white px-2 py-0.5 rounded-full text-xs font-medium border border-white/20 shadow-sm'>
              Preview
            </div>
          </div>

          {/*Info*/}
          <div className='px-4 py-3 border-b border-white/10'>

            {/* School */}
            <div className='flex items-center gap-2 mb-2'>
              <div className='border border-white/10 w-6 h-6 flex items-center justify-center shrink-0 rounded-md bg-white'>
                <img src={logouit} alt="logouit" className='w-4 h-4 object-contain' />
              </div>
              <span className='text-xs text-gray-400 line-clamp-1'>UIT - ĐHQG TP.HCM</span>
            </div>

            {/* Title */}
            <h2 className='text-sm font-bold text-white mb-2 line-clamp-2 leading-snug'>
              Ôn tập cuối kì Hệ Điều Hành
            </h2>

            {/* Author */}
            <div className='flex items-center gap-1.5 mb-2'>
              <div className='w-5 h-5 rounded-full bg-linear-to-br from-orange-400 to-pink-500 flex items-center justify-center shrink-0'>
                <span className='text-white text-xs font-bold'>N</span>
              </div>
              <span className='text-xs text-gray-400'>
                <span className='font-semibold text-gray-300'>Nguyễn Văn A</span>
              </span>
            </div>

            {/* Rating + meta */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-1'>
                <span className='text-yellow-400 text-sm'>★</span>
                <span className='text-xs font-bold text-yellow-400'>4.8</span>
                <span className='text-xs text-white'>(17K)</span>
              </div>
              <span className='text-xs text-white'>10 trang · 2025</span>
            </div>

          </div>

          {/*Tầng 3: CTA*/}
          <div className='px-4 py-3 flex items-center justify-between bg-black/20'>

            <div className='flex items-center gap-1'>
              <svg className='w-3.5 h-3.5 text-purple-400' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <polygon points='13 2 3 14 12 14 11 22 21 10 12 10 13 2' />
              </svg>
              <span className='text-sm font-bold text-purple-400'>0.05</span>
              <span className='text-xs text-purple-500 font-medium'>ETH</span>
            </div>

            <button
              onClick={() => navigate(`/document/${id}`)}
              className='bg-linear-to-r from-purple-600 to-indigo-600 hover:opacity-90 active:scale-95 transition-all duration-150 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow-sm cursor-pointer'
            >
              Xem ngay
            </button>

          </div>

        </div>
      </div>
    )
  }

  export default DocumentCard