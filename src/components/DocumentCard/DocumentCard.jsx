import React from 'react'
import pic2 from '../../assets/pic2.jpg'
import logouit from '../../assets/logouit.png'

const DocumentCard = () => {
  return (
    <div className='pt-4 pl-4'>
      <div className='bg-white rounded-xl shadow-md overflow-hidden w-64 border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer'>

        {/*Tầng 1: Ảnh*/}
        <div className='relative h-32'>
          <img src={pic2} alt="course" className='w-full h-full object-cover' />
          <div className='absolute top-2 right-2 bg-white px-2 py-0.5 rounded-full text-xs font-medium border border-gray-300 shadow-sm'>
            Preview
          </div>
        </div>

        {/*Tầng 2: Info*/}
        <div className='px-4 py-3 border-b border-gray-100'>
          {/* School */}
          <div className='flex items-center gap-2 mb-2'>
            <div className='border border-gray-200 w-6 h-6 flex items-center justify-center flex-shrink-0 rounded-md bg-gray-50'>
              <img src={logouit} alt="logouit" className='w-4 h-4 object-contain' />
            </div>
            <span className='text-xs text-gray-500 line-clamp-1'>UIT - ĐHQG TP.HCM</span>
          </div>

          {/* Title */}
          <h2 className='text-sm font-bold text-gray-900 mb-2 line-clamp-2 leading-snug'>
            Ôn tập cuối kì Hệ Điều Hành
          </h2>

          {/* Author */}
          <div className='flex items-center gap-1.5 mb-2'>
            <div className='w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center flex-shrink-0'>
              <span className='text-white text-xs font-bold'>N</span>
            </div>
            <span className='text-xs text-gray-500'>
              <span className='font-semibold text-gray-700'>Nguyễn Văn A</span>
            </span>
          </div>

          {/* Rating + meta */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1'>
              <span className='text-yellow-400 text-sm'>★</span>
              <span className='text-xs font-bold text-gray-800'>4.8</span>
              <span className='text-xs text-gray-400'>(17K)</span>
            </div>
            <span className='text-xs text-gray-400'>10 trang · 2025</span>
          </div>
        </div>

        {/*Tầng 3: CTA*/}
        <div className='px-4 py-3 flex items-center justify-between bg-gray-50'>
          <div className='flex items-center gap-1'>
            <svg className='w-3.5 h-3.5 text-purple-500' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <polygon points='13 2 3 14 12 14 11 22 21 10 12 10 13 2' />
            </svg>
            <span className='text-sm font-bold text-purple-600'>0.05</span>
            <span className='text-xs text-purple-400 font-medium'>ETH</span>
          </div>
          <button className='bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all duration-150 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow-sm'>
            Xem ngay
          </button>
        </div>

      </div>
    </div>
  )
}

export default DocumentCard