const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const userModel = require("../Models/UserModel");

// Tạo transporter gửi mail (dùng Gmail hoặc bất kỳ SMTP nào)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Vui lòng nhập email." });
    }

    const user = await userModel.findOne({ email: email.toLowerCase().trim() });

    // Luôn trả về 200 để không lộ thông tin user có tồn tại hay không
    if (!user) {
      return res.status(200).json({
        message: "Nếu email tồn tại, chúng tôi đã gửi link đặt lại mật khẩu.",
      });
    }

    // Tạo token ngẫu nhiên
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Lưu token (hash) và thời hạn 1 giờ vào DB
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 giờ
    await user.save();

    // Tạo link reset
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    // Gửi email
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"UITShare" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Đặt lại mật khẩu UITShare",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 32px; background: #f9f9f9; border-radius: 12px;">
          <h2 style="color: #7c3aed; margin-bottom: 8px;">UITShare</h2>
          <p style="color: #333; font-size: 15px;">Xin chào <strong>${user.userName}</strong>,</p>
          <p style="color: #555; font-size: 14px; line-height: 1.6;">
            Bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản này. 
            Nhấn vào nút bên dưới để tiếp tục. Link có hiệu lực trong <strong>1 giờ</strong>.
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(to right, #7c3aed, #4f46e5); color: white; 
                      padding: 14px 32px; border-radius: 8px; text-decoration: none; 
                      font-size: 15px; font-weight: 600; display: inline-block;">
              Đặt lại mật khẩu
            </a>
          </div>
          <p style="color: #888; font-size: 12px; line-height: 1.6;">
            Nếu bạn không yêu cầu điều này, hãy bỏ qua email này. Mật khẩu của bạn sẽ không thay đổi.<br/>
            Link: <a href="${resetUrl}" style="color: #7c3aed;">${resetUrl}</a>
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #bbb; font-size: 11px; text-align: center;">© 2026 UITShare</p>
        </div>
      `,
    });

    return res.status(200).json({
      message: "Nếu email tồn tại, chúng tôi đã gửi link đặt lại mật khẩu.",
    });
  } catch (error) {
    console.error("[forgotPassword]", error);
    return res.status(500).json({ message: "Lỗi server. Vui lòng thử lại." });
  }
};

// POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Mật khẩu phải có ít nhất 6 ký tự." });
    }

    // Hash lại token để so sánh với DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // chưa hết hạn
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Link không hợp lệ hoặc đã hết hạn." });
    }

    // Cập nhật mật khẩu mới và xóa token
    user.password = bcrypt.hashSync(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res
      .status(200)
      .json({ message: "Đặt lại mật khẩu thành công! Vui lòng đăng nhập." });
  } catch (error) {
    console.error("[resetPassword]", error);
    return res.status(500).json({ message: "Lỗi server. Vui lòng thử lại." });
  }
};

// GET /api/auth/validate-reset-token/:token  (kiểm tra token còn hợp lệ không)
const validateResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ valid: false, message: "Link không hợp lệ hoặc đã hết hạn." });
    }

    return res.status(200).json({ valid: true });
  } catch (error) {
    console.error("[validateResetToken]", error);
    return res.status(500).json({ valid: false, message: "Lỗi server." });
  }
};

module.exports = { forgotPassword, resetPassword, validateResetToken };