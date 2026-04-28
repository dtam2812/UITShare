# UITShare – Nền tảng chia sẻ tài liệu học tập cho sinh viên UIT

Đây là đồ án môn **IE213 – Kỹ thuật Phát triển Hệ thống Web** tại Trường Đại học Công nghệ Thông tin – ĐHQG TP.HCM.

UITShare là một web app cho phép sinh viên UIT mua, bán và chia sẻ tài liệu học tập. Điểm khác biệt so với Google Drive hay Facebook Group là mỗi tài liệu được upload dựa trên tiêu chuẩn **NFT ERC-1155** trên Ethereum, lưu file trên **IPFS**, và mọi giao dịch mua bán đều đi qua **smart contract** — tác giả tự động nhận royalty mỗi khi tài liệu được bán lại mà không cần làm gì cả.

## Nhóm phát triển

GVHD: **ThS. Võ Tấn Khoa**

| Thành viên | MSSV | 
|---|---|
| Đinh Nguyễn Đức Tâm | 23521384 | 
| Nguyễn Phước Thịnh | 23521505 | 
| Đỗ Tấn Tường | 23521749 | 
| Trần Thành Vinh | 23521799 | 

**Phân chia công việc:** [Sheet Phân công](https://docs.google.com/spreadsheets/d/1CVuuZOVJI4OK7uQ3pJH9mm-Dp9ddJGYK/edit?gid=2103729592#gid=2103729592)<br>
**Video trình bày và hướng dẫn sử dụng:** [Video](https://www.youtube.com/watch?si=BzXBPw3y8wR4x1cQ&fbclid=IwY2xjawRdfmRleHRuA2FlbQIxMABicmlkETE5dlFRVnQ0MG9pbW9kS2pPc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHusty5VNbzwLnsbl7PbYf3YaH1gFR9gJj8LB6UgvlO0ic02w2rJ69SI2cam9_aem_UpQYuEsYUadMyJoadlz_JA&v=Wamlx2SXIL8&feature=youtu.be)<br>
**Link Web Demo:** [uit-share-36.vercel.app](https://uit-share-36.vercel.app)

> ⚠️ Hiện deploy trên **Ethereum Sepolia Testnet**. Cần MetaMask và Sepolia ETH để thực hiện giao dịch.

---

## Lưu ý khi dùng

- **Lần đầu vào web cần đợi ~30 giây** để server khởi động (server dùng free tier, tự sleep khi không có traffic)
- Cần **đăng ký tài khoản** trước khi thực hiện bất kỳ giao dịch nào
- Cần cài **MetaMask** và kết nối ví sau khi đăng nhập để mua/bán/donate
- Mỗi tài khoản chỉ được **kết nối với một ví duy nhất**, không thể thay đổi sau khi đã liên kết
- Đảm bảo MetaMask đang ở mạng **Sepolia** — lấy Sepolia ETH miễn phí tại [cloud.google.com](https://cloud.google.com/application/web3/faucet)
- Quá trình mint NFT khi upload tài liệu có thể mất 15–30 giây tùy tốc độ mạng Sepolia

- Hệ thống có sẵn một tài khoản admin để bạn đăng nhập và khám phá trang quản trị:
    |  |  |
    |---|---|
    | **Email** | `23521384@gm.uit.edu.vn` |
    | **Mật khẩu** | `123456` |
 
> ⚠️ **Lưu ý quan trọng:** Tài khoản admin này **đã được liên kết ví**, nên **không thể dùng để mua bán hay donate**. Để trải nghiệm đầy đủ các tính năng thanh toán, vui lòng **tự tạo tài khoản mới** và liên kết ví MetaMask cá nhân của bạn. Không dùng tài khoản admin này để chỉnh thêm xóa sửa dữ liệu trong trang quản lý
 

---

## Tính năng chính

- Đăng ký / đăng nhập bằng email hoặc ví Ethereum
- Upload tài liệu PDF → tự động pin lên IPFS → mint tokenId → đặt giá bán
- Mua tài liệu bằng ETH qua MetaMask, đọc ngay sau khi giao dịch confirm
- Bán lại tài liệu đã mua (secondary market), tác giả gốc nhận royalty tự động (ERC-2981)
- Donate ETH trực tiếp cho tác giả
- Tìm kiếm, lọc theo môn học, danh mục, giá
- Trang admin quản lý người dùng, tài liệu, giao dịch
- Phát hiện tài liệu trùng lặp bằng SHA-256 hash trước khi upload

---

## Tech stack

**Frontend:** React 19, Vite, TailwindCSS 4, React Router v7, TanStack Query v5  
**Web3:** wagmi v3, ethers.js v6, MetaMask  
**Backend:** Node.js, Express 5, MongoDB (Mongoose), JWT  
**Blockchain:** Solidity ^0.8.24, Hardhat, OpenZeppelin (ERC-1155, ERC-2981)  
**PDF:** pdf-lib, pdf-parse, pdfjs-dist, react-pdf, sharp

---

## Cấu trúc repo

```
UITShare/
├── client/       # React frontend
├── server/       # Node.js/Express backend
└── blockchain/   # Hardhat + Solidity contracts
```

---

## Smart contracts

Có 2 contract chính, deploy trên Sepolia:

**`UITShareNFT`** — Quản lý NFT tài liệu (ERC-1155 + ERC-2981)
- Mỗi tài liệu = 1 tokenId, tối đa 1.000 bản
- Tác giả đặt royalty 0–50% khi mint
- Chỉ server (authorized caller) mới được mint/burn

**`UITShareMarketplace`** — Sàn giao dịch
- `addOrder`: Đặt bán, NFT vào escrow của contract
- `executeOrder`: Mua — contract tự tính và chuyển phí sàn + royalty + tiền cho người bán, đồng thời transfer NFT
- `cancelOrder`: Hủy bán, NFT trả về ví người bán
- `donateToAuthor`: Donate thẳng cho tác giả gốc, không qua treasury

---

## Chạy local

<details>
<summary>Xem hướng dẫn</summary>

### Yêu cầu

- Node.js >= 18
- MongoDB Atlas (hoặc local)
- Tài khoản [Pinata](https://pinata.cloud)
- MetaMask + Sepolia ETH

### Cài dependencies

```bash
git clone https://github.com/dtam2812/UITShare.git
cd UITShare

cd server && npm install
cd ../client && npm install
cd ../blockchain && npm install
```

### Tạo file `.env`

**`server/.env`**
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
PINATA_JWT=...
PRIVATE_KEY=
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/...
NFT_CONTRACT_ADDRESS=
MARKETPLACE_CONTRACT_ADDRESS=
EMAIL_USER=
EMAIL_PASS=
```

**`client/.env`**
```env
VITE_API_URL=http://localhost:5000/api
VITE_NFT_CONTRACT_ADDRESS=
VITE_MARKETPLACE_CONTRACT_ADDRESS=
VITE_CHAIN_ID=11155111
```

**`blockchain/.env`**
```env
PRIVATE_KEY=
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/...
ETHERSCAN_API_KEY=
```

### Deploy contract và chạy

```bash
cd blockchain
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

</details>

---

## Gặp khó khăn khi trải nghiệm?
Nếu bạn gặp bất kỳ vấn đề gì trong quá trình sử dụng hệ thống — từ kết nối MetaMask, lỗi giao dịch, đến bất kỳ thắc mắc nào khác — hãy nhắn tin trực tiếp qua Facebook: [Tâm Đinh](https://www.facebook.com/tam.dinh.31924792)

Trường Đại học Công nghệ Thông tin (UIT)
