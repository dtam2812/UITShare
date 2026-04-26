import { useEffect, useRef, useState } from "react";
import { FiImage, FiEdit2, FiBook, FiShield } from "react-icons/fi";
import Input from "../../components/UI/Input";
import { useParams } from "react-router";
import axios from "../../common";
import toast from "react-hot-toast";

const PersonalInfo = () => {
  const [user, setUser] = useState(null);

  const initialForm = {
    userName: "",
    studentId: "",
    bio: "",
    facebookLink: "",
  };
  const initialImg = {
    avatar: "",
    coverImage: "",
  };

  const [formInput, setFormInput] = useState(initialForm);
  const [img, setImg] = useState(initialImg);

  const { userId } = useParams();

  const clickInput = useRef(null);
  const typeUpload = useRef("");

  useEffect(() => {
    const getUserId = async () => {
      try {
        const response = await axios.get(`/api/personal/userDetail/${userId}`);
        if (response.status === 200) {
          setUser(response.data);

          setFormInput({
            userName: response.data.userName || "",
            studentId: response.data.studentId || "",
            bio: response.data.bio || "",
            facebookLink: response.data.facebookLink || "",
          });

          setImg({
            avatar: response.data.avatar || "",
            coverImage: response.data.coverImage || "",
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUserId();
  }, [userId]);

  const handleClick = (type) => {
    typeUpload.current = type;
    clickInput.current.click();
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("userName", formInput.userName);
      if (formInput.studentId) {
        formData.append("studentId", formInput.studentId);
      }
      formData.append("bio", formInput.bio);
      formData.append("facebookLink", formInput.facebookLink);

      if (img.avatar instanceof File) formData.append("avatar", img.avatar);
      if (img.coverImage instanceof File)
        formData.append("coverImage", img.coverImage);

      const response = await axios.put(
        `/api/personal/updateUserInfo/${userId}`,
        formData,
      );

      if (response.status === 200) {
      if (response.data.newToken) {
        localStorage.setItem("access_token", response.data.newToken);
        window.dispatchEvent(new Event("token-updated"));
      }
      setUser(response.data);
      setImg((prev) => ({
        avatar: response.data.avatar,
        coverImage: response.data.coverImage,
        avatarPreview: prev.avatarPreview || "",
        coverImagePreview: prev.coverImagePreview || "",
      }));
      toast.success("Cập nhật thành công");
    }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setFormInput({
      userName: user?.userName || "",
      studentId: user?.studentId || "",
      bio: user?.bio || "",
      facebookLink: user?.facebookLink || "",
    });
    setImg({
      avatar: user?.avatar || "",
      coverImage: user?.coverImage || "",
    });
  };

  const handleChangeForm = (e) => {
    const { id, value } = e.target;

    setFormInput((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImg((prev) => ({
      ...prev,
      [typeUpload.current]: file,
      [`${typeUpload.current}Preview`]: URL.createObjectURL(file),
    }));

    e.target.value = null
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm backdrop-blur-md">
      <div className="relative h-48 rounded-t-2xl bg-white/10">
        <img
          src={img.coverImagePreview || img.coverImage || undefined}
          alt="Cover"
          className="h-full w-full object-cover"
        />
        <button
          className="absolute top-4 right-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm font-medium text-white shadow-sm backdrop-blur-md transition-colors hover:cursor-pointer hover:bg-black/60"
          onClick={() => handleClick("coverImage")}
        >
          <FiImage className="h-4 w-4" />
          Cập nhật ảnh bìa
        </button>
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <div className="relative">
            <img
              src={img.avatarPreview || img.avatar || undefined}
              alt="Profile avatar"
              className="h-24 w-24 rounded-full border-4 border-[#050816] object-cover shadow-md hover:cursor-pointer"
              onClick={() => handleClick("avatar")}
            />
            <button
              className="absolute right-0 bottom-0 rounded-full border-2 border-[#050816] bg-purple-600 p-1.5 text-white transition-colors hover:cursor-pointer hover:bg-purple-700"
              onClick={() => handleClick("avatar")}
            >
              <FiEdit2 className="h-3 w-3" />
            </button>
          </div>
        </div>
        <input
          onChange={handleChangeImage}
          type="file"
          accept="image/*"
          hidden
          ref={clickInput}
        />
      </div>

      <div className="mt-14 border-b border-white/10 px-6 pb-8 text-center">
        <h2 className="text-xl font-bold text-white">{user?.userName}</h2>
        <p className="mt-1 flex items-center justify-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <FiBook className="h-4 w-4 text-gray-400" />
            Sinh viên UIT
          </span>
        </p>
      </div>

      <div className="mx-auto max-w-4xl p-6 md:p-8">
        <form onSubmit={handleUpdateUser}>
          <div className="mb-10">
            <h3 className="mb-6 text-lg font-semibold text-white">
              Thông tin cá nhân cơ bản:
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <p className="py-3 text-sm text-gray-400">Tên</p>
                <label htmlFor="userName" className="sr-only">
                  Tên
                </label>
                <Input
                  className="text-white"
                  id="userName"
                  value={formInput?.userName}
                  placeholder="Tên"
                  onChange={handleChangeForm}
                />
              </div>
              <div>
                <p className="py-3 text-sm text-gray-400">Mã số sinh viên</p>
                <label htmlFor="studentId" className="sr-only">
                  MSSV
                </label>
                <Input
                  className="text-white"
                  id="studentId"
                  value={formInput?.studentId}
                  placeholder="Mã số sinh viên (MSSV)"
                  onChange={handleChangeForm}
                />
              </div>
              <div className="md:col-span-2">
                <p className="py-3 text-sm text-gray-400">Tiểu sử</p>
                <label htmlFor="bio" className="sr-only">
                  Tiểu sử
                </label>
                <textarea
                  id="bio"
                  rows="4"
                  value={formInput?.bio}
                  placeholder="Giới thiệu ngắn gọn (VD: Chuyên share tài liệu điểm cao môn Đại cương...)"
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 pr-10 text-sm text-white transition-all outline-none placeholder:text-gray-400 focus:border-purple-400 focus:bg-white/10 focus:ring-1 focus:ring-purple-400/50"
                  onChange={handleChangeForm}
                ></textarea>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">Liên hệ:</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="facebookLink" className="sr-only">
                  Facebook
                </label>
                <Input
                  id="facebookLink"
                  value={formInput?.facebookLink}
                  placeholder="Link Facebook (Hỗ trợ người mua tài liệu)"
                  onChange={handleChangeForm}
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-end gap-4">
            <button
              type="button"
              className="cursor-pointer rounded-2xl border border-white/10 bg-transparent px-6 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5"
              onClick={handleCancel}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-2xl bg-purple-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-purple-700"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfo;
