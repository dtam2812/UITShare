export const fetchSubjects = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    { id: "MA006", name: "Giải tích", category: "Đại cương" },
    { id: "MA003", name: "Đại số tuyến tính", category: "Đại cương" },
    { id: "MA004", name: "Cấu trúc rời rạc", category: "Đại cương" },
    { id: "MA005", name: "Xác suất thống kê", category: "Đại cương" },
    { id: "IT001", name: "Nhập môn lập trình", category: "Đại cương" },
    { id: "IT002", name: "Lập trình hướng đối tượng", category: "Cơ sở ngành" },
    {
      id: "IT003",
      name: "Cấu trúc dữ liệu và giải thuật",
      category: "Cơ sở ngành",
    },
    { id: "IT004", name: "Cơ sở dữ liệu", category: "Cơ sở ngành" },
    { id: "IT005", name: "Nhập môn mạng máy tính", category: "Cơ sở ngành" },
    {
      id: "IT012",
      name: "Tổ chức và cấu trúc máy tính II",
      category: "Cơ sở ngành",
    },
    { id: "IT007", name: "Hệ điều hành", category: "Cơ sở ngành" },
    {
      id: "IE005",
      name: "Giới thiệu ngành Công nghệ Thông tin",
      category: "Cơ sở ngành",
    },
    {
      id: "IE101",
      name: "Cơ sở hạ tầng công nghệ thông tin",
      category: "Cơ sở ngành",
    },
    { id: "IE103", name: "Quản lý thông tin", category: "Cơ sở ngành" },
    { id: "IE104", name: "Internet và công nghệ Web", category: "Cơ sở ngành" },
    {
      id: "IE106",
      name: "Thiết kế giao diện người dùng",
      category: "Cơ sở ngành",
    },
    {
      id: "IE105",
      name: "Nhập môn đảm bảo và an ninh thông tin",
      category: "Chuyên ngành",
    },
    {
      id: "IE108",
      name: "Phân tích thiết kế phần mềm",
      category: "Chuyên ngành",
    },
    { id: "IS402", name: "Điện toán đám mây", category: "Chuyên ngành" },
  ];
};

export const searchDocuments = async (query) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const allDocs = await fetchDocuments();

  if (!query || query.trim() === "") return [];

  const lowerQuery = query.toLowerCase();
  return allDocs.filter(
    (doc) =>
      doc.id.toString() === lowerQuery ||
      doc.subject.toLowerCase().includes(lowerQuery) ||
      doc.title.toLowerCase().includes(lowerQuery) ||
      doc.subjectName.toLowerCase().includes(lowerQuery) ||
      doc.author.toLowerCase().includes(lowerQuery),
  );
};

export const fetchDocuments = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const baseDocs = [
    {
      id: 1,
      title: "Đề thi cuối kỳ Giải tích 2023",
      subject: "MA006",
      subjectName: "Giải tích",
      author: "Nguyễn Văn A",
      price: 50000,
      rating: 4.8,
      reviews: 120,
      thumbnail: "https://picsum.photos/seed/doc1/400/300",
      category: "Đại cương",
    },
    {
      id: 2,
      title: "Tài liệu ôn tập Cấu trúc dữ liệu",
      subject: "IT003",
      subjectName: "Cấu trúc dữ liệu và giải thuật",
      author: "Trần Thị B",
      price: 75000,
      rating: 4.9,
      reviews: 85,
      thumbnail: "https://picsum.photos/seed/doc2/400/300",
      category: "Cơ sở ngành",
    },
    {
      id: 3,
      title: "Bài tập lớn Cơ sở dữ liệu",
      subject: "IT004",
      subjectName: "Cơ sở dữ liệu",
      author: "Lê Văn C",
      price: 100000,
      rating: 4.7,
      reviews: 200,
      thumbnail: "https://picsum.photos/seed/doc3/400/300",
      category: "Cơ sở ngành",
    },
    {
      id: 4,
      title: "Slide bài giảng Mạng máy tính",
      subject: "IT005",
      subjectName: "Nhập môn mạng máy tính",
      author: "Phạm Thị D",
      price: 0,
      rating: 4.5,
      reviews: 50,
      thumbnail: "https://picsum.photos/seed/doc4/400/300",
      category: "Cơ sở ngành",
    },
    {
      id: 5,
      title: "Đồ án Điện toán đám mây",
      subject: "IS402",
      subjectName: "Điện toán đám mây",
      author: "Hoàng Văn E",
      price: 150000,
      rating: 5.0,
      reviews: 30,
      thumbnail: "https://picsum.photos/seed/doc5/400/300",
      category: "Chuyên ngành",
    },
    {
      id: 6,
      title: "Tóm tắt Đại số tuyến tính",
      subject: "MA003",
      subjectName: "Đại số tuyến tính",
      author: "Ngô Thị F",
      price: 30000,
      rating: 4.6,
      reviews: 150,
      thumbnail: "https://picsum.photos/seed/doc6/400/300",
      category: "Đại cương",
    },
  ];

  const moreDocs = [];
  for (let i = 7; i <= 35; i++) {
    const template = baseDocs[i % 6];
    moreDocs.push({
      ...template,
      id: i,
      title: `${template.title} (Phần ${i})`,
      thumbnail: `https://picsum.photos/seed/doc${i}/400/300`,
      price: template.price + i * 1000,
    });
  }

  return [...baseDocs, ...moreDocs];
};
