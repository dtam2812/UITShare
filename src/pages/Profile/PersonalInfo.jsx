import { useRef, useState } from "react";
import { FiImage, FiEdit2, FiBook, FiShield } from "react-icons/fi";
import Input from "../../components/UI/Input";

const PersonalInfo = () => {

  const [img, setImg] = useState({
    cover: 'https://cohotech.vn/wp-content/uploads/2024/10/Do-phan-giai-cao.webp',
    avatar: 'https://m.yodycdn.com/blog/anh-dai-dien-hai-yodyvn2.jpg'
  })
  const clickInput = useRef(null)
  const typeUpload = useRef('')

  const handleClick = (type) => {
    typeUpload.current = type
    clickInput.current.click()
  }

  const handleChange = (e) => {
    const file = e.files[0]
    
    if(!file) return

    const currentImgUrl = img[typeUpload.current]

    if(currentImgUrl.startsWith('blob:')) {
      URL.revokeObjectURL(currentImgUrl)
    }

    setImg(prev => ({
      ...prev,
      [typeUpload.current]: URL.createObjectURL(file)
    }))

    e.value = null
  }

  const inittialForm = {
    firstName: '',
    lastName: '',
    studentId: '',
    cohort: '',
    bio: '',
    major: '',
    socialLink: ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormInput(inittialForm)
  }

  const handleCancel = () => {
    setFormInput(inittialForm)
  }

  const [formInput, setFormInput] = useState(inittialForm)

  const handleChangeForm = (e) => {
    const { id, value} = e.target

    setFormInput(prev => ({
      ...prev,
      [id]: value
    })) 
  }

  return (
    <div className="bg-white/5 rounded-2xl shadow-sm border border-white/10 overflow-hidden backdrop-blur-md">
      <div className="relative h-48 bg-white/10 rounded-t-2xl">
        <img 
          src={img.cover}
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        <button 
            className="absolute top-4 right-4 px-4 py-2 text-sm font-medium text-white bg-black/40 hover:bg-black/60 border border-white/10 rounded-full shadow-sm backdrop-blur-md transition-colors flex items-center gap-2 hover:cursor-pointer"
            onClick={() => handleClick('cover')}
        >
          <FiImage className="w-4 h-4" />
          Cập nhật ảnh bìa
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-12">
          <div className="relative">
            <img 
              src={img.avatar}
              alt="Profile avatar" 
              className="w-24 h-24 rounded-full object-cover border-4 border-[#050816] shadow-md hover:cursor-pointer"
              onClick={() => handleClick('avatar')}
            />
            <button 
                className="absolute bottom-0 right-0 p-1.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors border-2 border-[#050816] hover:cursor-pointer"
                onClick={() => handleClick('avatar')}
            >
              <FiEdit2 className="w-3 h-3" />
            </button>
          </div>
        </div>
        <input 
          type="file"
          accept="image/*"
          hidden
          ref={clickInput}
          onChange={(e) => handleChange(e.target)}
        />
      </div>

      <div className="mt-14 px-6 pb-8 text-center border-b border-white/10">
        <h2 className="text-xl font-bold text-white">Trần Thành Vinh</h2>
        <p className="text-sm text-gray-400 mt-1 flex items-center justify-center gap-4">
          <span className="flex items-center gap-1"><FiBook className="w-4 h-4 text-gray-400" />Sinh viên UIT</span>
          <span className="flex items-center gap-1"><FiShield className="w-4 h-4 text-gray-400" />K18</span>
        </p>

        <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-6 max-w-3xl mx-auto">
          <div className="w-full md:w-2/3">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-gray-300">Hoàn thành hồ sơ</span>
              <span className="text-purple-400">85%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
              <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-white mb-6">Thông tin cá nhân cơ bản:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="sr-only">Họ</label>
                <Input 
                  id="firstName" 
                  value={formInput.firstName}
                  placeholder="Họ và tên đệm"
                  onChange={handleChangeForm} 
                />
              </div>
              <div>
                <label htmlFor="lastName" className="sr-only">Tên</label>
                <Input 
                  id="lastName" 
                  value={formInput.lastName}
                  placeholder="Tên"
                  onChange={handleChangeForm} 
                />
              </div>
              <div>
                <label htmlFor="studentId" className="sr-only">MSSV</label>
                <Input 
                  id="studentId" 
                  value={formInput.studentId}
                  placeholder="Mã số sinh viên (MSSV)"
                  onChange={handleChangeForm} 
                />
              </div>
              <div>
                <label htmlFor="cohort" className="sr-only">Khoá</label>
                <Input 
                  id="cohort" 
                  value={formInput.cohort}
                  placeholder="Khóa (VD: K18)"
                  onChange={handleChangeForm}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="bio" className="sr-only">Tiểu sử</label>
                <textarea 
                  id="bio" 
                  rows="4" 
                  value={formInput.bio}
                  placeholder="Giới thiệu ngắn gọn (VD: Chuyên share tài liệu điểm cao môn Đại cương...)" 
                  className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-xl text-white focus:border-purple-400 focus:ring-0 outline-none transition-all resize-y placeholder:text-gray-500 text-sm"
                  onChange={handleChangeForm}
                ></textarea>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Chuyên môn & Liên hệ:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="major" className="sr-only">Khoa</label>
                <Input
                  id="major" 
                  value={formInput.major}
                  placeholder="Khoa (VD: Công nghệ phần mềm)"
                  onChange={handleChangeForm} 
                />
              </div>
              <div>
                <label htmlFor="socialLink" className="sr-only">Facebook</label>
                <Input 
                  id="socialLink"
                  value={formInput.socialLink} 
                  placeholder="Link Facebook (Hỗ trợ người mua tài liệu)"
                  onChange={handleChangeForm} 
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-end gap-4">
            <button type="button" className="px-6 py-3 text-sm font-medium text-gray-300 bg-transparent border border-white/10 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer" onClick={handleCancel}>Hủy bỏ</button>
            <button type="submit" className="px-6 py-3 text-sm font-medium text-white bg-purple-600 rounded-2xl hover:bg-purple-700 transition-colors shadow-sm cursor-pointer">Lưu thay đổi</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfo;