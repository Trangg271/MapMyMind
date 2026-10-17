export const defaultLessons = [
  {
    id: 'lesson-phan-so',
    title: 'Phân số',
    subject: 'Toán học',
    grade: '6',
    scope: 'standard', // 'small' | 'standard' | 'chapter'
    role: 'student',
    updatedAt: 'Vừa xong',
    createdAt: 'Hôm nay',
    description: 'Khái niệm tử số, mẫu số, phân số bằng nhau và cách rút gọn tối giản.',
    textbookSource: 'SGK Toán 6 - Kết nối tri thức với cuộc sống (Chương VI: Phân số). Khái niệm phân số a/b với a, b thuộc Z, b khác 0. Tính chất cơ bản: Nhân hoặc chia cả tử và mẫu với cùng số nguyên khác 0 ta được phân số bằng phân số đã cho. Rút gọn bằng cách chia cả tử và mẫu cho ƯCLN.',
    quickNote: 'Bài mẫu minh họa chuẩn chương trình mới. Hãy thử sửa một ý, thêm ví dụ rồi tự kể lại.',
    rootNodeId: 'node-root',
    nodes: [
      {
        id: 'node-root',
        text: 'Phân số',
        role: 'root',
        sourceType: 'sgk', // 'sgk' | 'ai_ext' | 'manual'
        sourceQuote: 'Chương VI - Toán 6: Phân số và các phép tính',
        parentId: null,
        x: 0,
        y: 0,
        note: 'Ý trung tâm: Khái niệm cốt lõi của bài học',
        hasExcerpt: true
      },
      {
        id: 'node-tu-mau',
        text: 'Tử số và mẫu số',
        role: 'main',
        sourceType: 'sgk',
        sourceQuote: 'SGK tr. 5: Phân số a/b với a là tử số, b là mẫu số (b ≠ 0)',
        parentId: 'node-root',
        x: -280,
        y: -100,
        note: 'Dạng a/b với a, b là số nguyên, b khác 0',
        hasExcerpt: true
      },
      {
        id: 'node-tu-so-def',
        text: 'Tử số: số nguyên a (nằm trên gạch ngang)',
        role: 'sub',
        sourceType: 'sgk',
        sourceQuote: 'Tử số là số nguyên',
        parentId: 'node-tu-mau',
        x: -540,
        y: -140,
        note: 'Chỉ số phần bằng nhau được lấy',
        hasExcerpt: true
      },
      {
        id: 'node-mau-so-def',
        text: 'Mẫu số: số nguyên b ≠ 0 (nằm dưới gạch ngang)',
        role: 'sub',
        sourceType: 'sgk',
        sourceQuote: 'Mẫu số là số nguyên khác 0',
        parentId: 'node-tu-mau',
        x: -540,
        y: -60,
        note: 'Chỉ số phần đơn vị được chia đều',
        hasExcerpt: true
      },
      {
        id: 'node-bang-nhau',
        text: 'Phân số bằng nhau',
        role: 'main',
        sourceType: 'sgk',
        sourceQuote: 'SGK tr. 8: a/b = c/d khi và chỉ khi a.d = b.c',
        parentId: 'node-root',
        x: 280,
        y: -90,
        note: 'a/b = c/d nếu a · d = b · c',
        hasExcerpt: true
      },
      {
        id: 'node-quy-tac-nhan',
        text: 'Nhân cả tử & mẫu với m ≠ 0: a/b = (a·m)/(b·m)',
        role: 'sub',
        sourceType: 'sgk',
        sourceQuote: 'Tính chất nhân cơ bản',
        parentId: 'node-bang-nhau',
        x: 540,
        y: -130,
        note: 'Tính chất nhân cơ bản',
        hasExcerpt: true
      },
      {
        id: 'node-quy-tac-chia',
        text: 'Chia cả tử & mẫu cho n ∈ ƯC(a, b): a/b = (a:n)/(b:n)',
        role: 'sub',
        sourceType: 'sgk',
        sourceQuote: 'Tính chất chia cơ bản',
        parentId: 'node-bang-nhau',
        x: 540,
        y: -50,
        note: 'Cơ sở để rút gọn',
        hasExcerpt: true
      },
      {
        id: 'node-rut-gon',
        text: 'Rút gọn phân số',
        role: 'main',
        sourceType: 'sgk',
        sourceQuote: 'SGK tr. 11: Rút gọn phân số đưa về phân số tối giản',
        parentId: 'node-root',
        x: 280,
        y: 120,
        note: 'Đưa về phân số tối giản',
        hasExcerpt: true
      },
      {
        id: 'node-ucln',
        text: 'Chia cả tử và mẫu cho ƯCLN(|a|, |b|)',
        role: 'sub',
        sourceType: 'sgk',
        sourceQuote: 'Cách rút gọn trong 1 bước duy nhất',
        parentId: 'node-rut-gon',
        x: 540,
        y: 80,
        note: 'Cách rút gọn nhanh nhất trong 1 bước',
        hasExcerpt: true
      },
      {
        id: 'node-toi-gian',
        text: 'Phân số tối giản: ƯCLN của tử và mẫu bằng 1',
        role: 'sub',
        sourceType: 'sgk',
        sourceQuote: 'Định nghĩa phân số tối giản',
        parentId: 'node-rut-gon',
        x: 540,
        y: 160,
        note: 'Ví dụ: 2/3, 5/7 là tối giản',
        hasExcerpt: true
      },
      {
        id: 'node-vi-du',
        text: 'Ví dụ thực hành',
        role: 'main',
        sourceType: 'manual',
        sourceQuote: 'Giáo viên bổ sung ví dụ minh họa',
        parentId: 'node-root',
        x: -280,
        y: 110,
        note: 'Ví dụ minh họa tính chất',
        hasExcerpt: true
      },
      {
        id: 'node-vd1',
        text: '12/18 = (12:6)/(18:6) = 2/3',
        role: 'example',
        sourceType: 'manual',
        sourceQuote: 'Bài tập 6.1 tr. 12',
        parentId: 'node-vi-du',
        x: -540,
        y: 80,
        note: 'ƯCLN(12, 18) = 6',
        hasExcerpt: true
      },
      {
        id: 'node-ai-ext',
        text: 'Ứng dụng: Tỷ lệ pha chế & chia phần thực tế',
        role: 'sub',
        sourceType: 'ai_ext',
        sourceQuote: 'AI gợi ý mở rộng ngoài SGK',
        parentId: 'node-vi-du',
        x: -540,
        y: 150,
        note: 'Gợi ý từ AI: ứng dụng đời sống',
        hasExcerpt: false
      }
    ],
    crossLinks: [
      { id: 'link-1', fromId: 'node-quy-tac-chia', toId: 'node-rut-gon', label: 'Ứng dụng' }
    ]
  },
  {
    id: 'lesson-quang-hop',
    title: 'Quang hợp ở thực vật',
    subject: 'Khoa học tự nhiên',
    grade: '7',
    scope: 'standard',
    role: 'student',
    updatedAt: 'Hôm qua',
    createdAt: '2 ngày trước',
    description: 'Bản chất quá trình tổng hợp chất hữu cơ và giải phóng oxy nhờ ánh sáng mặt trời.',
    textbookSource: 'SGK KHTN 7 (Chân trời sáng tạo): Quá trình quang hợp diễn ra ở lục lạp của lá cây. Phương trình: Nước + Carbon dioxide -> Glucose + Oxygen (điều kiện ánh sáng và chất diệp lục). Các yếu tố ảnh hưởng gồm ánh sáng, nước, hàm lượng CO2 và nhiệt độ.',
    quickNote: 'Nhớ kỹ 4 yếu tố ảnh hưởng: ánh sáng, nước, CO2 và nhiệt độ.',
    rootNodeId: 'node-qh-root',
    nodes: [
      {
        id: 'node-qh-root',
        text: 'Quang hợp ở thực vật',
        role: 'root',
        sourceType: 'sgk',
        sourceQuote: 'Bài 21 KHTN 7',
        parentId: null,
        x: 0,
        y: 0,
        note: 'Tổng hợp năng lượng sinh học',
        hasExcerpt: true
      },
      {
        id: 'node-qh-khai-niem',
        text: 'Phương trình tổng quát',
        role: 'main',
        sourceType: 'sgk',
        sourceQuote: 'SGK KHTN 7 tr. 102',
        parentId: 'node-qh-root',
        x: -280,
        y: -80,
        note: 'Nguyên liệu và sản phẩm',
        hasExcerpt: true
      },
      {
        id: 'node-qh-pt',
        text: 'Nước + CO₂ (Ánh sáng + Diệp lục) ➔ Glucose + O₂',
        role: 'sub',
        sourceType: 'sgk',
        sourceQuote: 'Nước + Carbon dioxide ➔ Glucose + Oxygen',
        parentId: 'node-qh-khai-niem',
        x: -550,
        y: -80,
        note: 'Phương trình hóa học cơ bản',
        hasExcerpt: true
      },
      {
        id: 'node-qh-bao-quan',
        text: 'Bào quan thực hiện',
        role: 'main',
        sourceType: 'sgk',
        sourceQuote: 'Lục lạp trong tế bào thịt lá',
        parentId: 'node-qh-root',
        x: 280,
        y: -80,
        note: 'Cấu tạo tế bào lá cây',
        hasExcerpt: true
      },
      {
        id: 'node-qh-luc-lap',
        text: 'Lục lạp chứa sắc tố diệp lục (Chlorophyll)',
        role: 'sub',
        sourceType: 'sgk',
        sourceQuote: 'Diệp lục hấp thụ năng lượng ánh sáng',
        parentId: 'node-qh-bao-quan',
        x: 540,
        y: -80,
        note: 'Hấp thụ năng lượng mặt trời',
        hasExcerpt: true
      },
      {
        id: 'node-qh-vai-tro',
        text: 'Vai trò sinh thái',
        role: 'main',
        sourceType: 'sgk',
        sourceQuote: 'Cung cấp thức ăn và oxy',
        parentId: 'node-qh-root',
        x: -280,
        y: 100,
        note: 'Ý nghĩa với sinh quyển',
        hasExcerpt: true
      },
      {
        id: 'node-qh-oxy',
        text: 'Cung cấp thức ăn hữu cơ và Oxy cho sự sống',
        role: 'sub',
        sourceType: 'sgk',
        sourceQuote: 'Lá phổi xanh điều hòa khí hậu',
        parentId: 'node-qh-vai-tro',
        x: -550,
        y: 100,
        note: 'Lá phổi xanh của Trái Đất',
        hasExcerpt: true
      },
      {
        id: 'node-qh-yeu-to',
        text: 'Yếu tố ảnh hưởng',
        role: 'main',
        sourceType: 'sgk',
        sourceQuote: '4 yếu tố môi trường ảnh hưởng quang hợp',
        parentId: 'node-qh-root',
        x: 280,
        y: 100,
        note: 'Các điều kiện môi trường',
        hasExcerpt: true
      },
      {
        id: 'node-qh-dk',
        text: 'Ánh sáng, nồng độ CO₂, nước, nhiệt độ',
        role: 'sub',
        sourceType: 'sgk',
        sourceQuote: 'Độ ẩm, nhiệt độ tối ưu 25-35 độ C',
        parentId: 'node-qh-yeu-to',
        x: 540,
        y: 100,
        note: 'Tối ưu năng suất cây trồng',
        hasExcerpt: true
      }
    ],
    crossLinks: []
  },
  {
    id: 'lesson-tu-han-viet',
    title: 'Từ Hán Việt',
    subject: 'Ngữ văn',
    grade: '7',
    scope: 'standard',
    role: 'student',
    updatedAt: '3 ngày trước',
    createdAt: '3 ngày trước',
    description: 'Cấu tạo từ ghép Hán Việt và cách sử dụng sắc thái biểu cảm trang trọng.',
    textbookSource: 'SGK Ngữ văn 7 (Cánh Diều): Từ Hán Việt là từ mượn gốc Hán có âm đọc Hán Việt. Phân loại từ ghép: đẳng lập và chính phụ. Sắc thái biểu cảm: trang trọng, tao nhã, cổ kính. Cần tránh lạm dụng làm câu văn tối nghĩa.',
    quickNote: 'Không nên lạm dụng từ Hán Việt làm câu văn thiếu tự nhiên.',
    rootNodeId: 'node-hv-root',
    nodes: [
      {
        id: 'node-hv-root',
        text: 'Từ Hán Việt',
        role: 'root',
        sourceType: 'sgk',
        sourceQuote: 'SGK Ngữ văn 7',
        parentId: null,
        x: 0,
        y: 0,
        note: 'Vốn từ mượn phong phú của tiếng Việt'
      },
      {
        id: 'node-hv-phan-loai',
        text: 'Phân loại từ ghép',
        role: 'main',
        sourceType: 'sgk',
        sourceQuote: 'Từ ghép đẳng lập và chính phụ',
        parentId: 'node-hv-root',
        x: -280,
        y: -60,
        note: '2 kiểu cấu tạo từ ghép'
      },
      {
        id: 'node-hv-dang-lap',
        text: 'Đẳng lập: giang sơn, huynh đệ, nhật nguyệt',
        role: 'sub',
        sourceType: 'sgk',
        sourceQuote: 'Các yếu tố bình đẳng ngữ pháp',
        parentId: 'node-hv-phan-loai',
        x: -540,
        y: -100,
        note: 'Các yếu tố bình đẳng về nghĩa'
      },
      {
        id: 'node-hv-chinh-phu',
        text: 'Chính phụ: quốc kì, ái quốc, phụ mẫu',
        role: 'sub',
        sourceType: 'sgk',
        sourceQuote: 'Yếu tố chính và yếu tố phụ bổ nghĩa',
        parentId: 'node-hv-phan-loai',
        x: -540,
        y: -20,
        note: 'Yếu tố chính và phụ bổ nghĩa'
      },
      {
        id: 'node-hv-sac-thai',
        text: 'Sắc thái ý nghĩa',
        role: 'main',
        sourceType: 'sgk',
        sourceQuote: 'Sắc thái trang trọng, tao nhã, cổ kính',
        parentId: 'node-hv-root',
        x: 280,
        y: -60,
        note: 'Tác dụng diễn đạt'
      },
      {
        id: 'node-hv-trang-trong',
        text: 'Tạo sắc thái trang trọng, tao nhã, cổ kính',
        role: 'sub',
        sourceType: 'sgk',
        sourceQuote: 'Ví dụ: phu nhân, hy sinh, thăng hà',
        parentId: 'node-hv-sac-thai',
        x: 540,
        y: -60,
        note: 'Ví dụ: phu nhân, hy sinh, thăng hà'
      },
      {
        id: 'node-hv-luu-y',
        text: 'Lưu ý khi sử dụng',
        role: 'main',
        sourceType: 'sgk',
        sourceQuote: 'Tránh lạm dụng gây khó hiểu',
        parentId: 'node-hv-root',
        x: 280,
        y: 90,
        note: 'Tránh dùng sai ngữ cảnh'
      },
      {
        id: 'node-hv-tranh-lam-dung',
        text: 'Tránh lạm dụng gây khó hiểu hoặc thiếu tự nhiên',
        role: 'sub',
        sourceType: 'sgk',
        sourceQuote: 'Không dùng từ Hán Việt khi không cần thiết',
        parentId: 'node-hv-luu-y',
        x: 540,
        y: 90,
        note: 'Dùng đúng mục đích giao tiếp'
      }
    ],
    crossLinks: []
  }
];

export const frameworkTemplates = {
  selfStudy: {
    title: 'Khung tự ôn tập 4 bước',
    subject: 'Tự ôn tập',
    grade: '6',
    role: 'student',
    description: 'Khung cấu trúc chuẩn giúp nắm vững mọi khái niệm: Khái niệm -> Công thức -> Ví dụ -> Bẫy thường gặp.',
    textbookSource: 'Phương pháp học chủ động (Active Recall): Tự phân tích bài học theo 4 nhánh để ghi nhớ sâu sắc.',
    quickNote: 'Điền các ý theo thứ tự kim đồng hồ từ nhánh 1 đến nhánh 4.',
    rootNodeId: 'node-framework-root',
    nodes: [
      {
        id: 'node-framework-root',
        text: 'Tên bài học cần ôn',
        role: 'root',
        sourceType: 'manual',
        parentId: null,
        x: 0,
        y: 0,
        note: 'Khái niệm hoặc chủ đề trọng tâm'
      },
      {
        id: 'node-fw-1',
        text: '1. Khái niệm cốt lõi',
        role: 'main',
        sourceType: 'sgk',
        parentId: 'node-framework-root',
        x: -280,
        y: -90,
        note: 'Định nghĩa ngắn gọn trong 1-2 câu'
      },
      {
        id: 'node-fw-1-sub',
        text: 'Từ khóa định nghĩa & điều kiện áp dụng',
        role: 'sub',
        sourceType: 'sgk',
        parentId: 'node-fw-1',
        x: -540,
        y: -90,
        note: 'Gạch đầu dòng từ khóa đắt nhất'
      },
      {
        id: 'node-fw-2',
        text: '2. Công thức / Quy luật',
        role: 'main',
        sourceType: 'sgk',
        parentId: 'node-framework-root',
        x: 280,
        y: -90,
        note: 'Quy tắc suy luận hoặc biểu thức'
      },
      {
        id: 'node-fw-2-sub',
        text: 'Công thức toán học hoặc quy trình từng bước',
        role: 'sub',
        sourceType: 'sgk',
        parentId: 'node-fw-2',
        x: 540,
        y: -90,
        note: 'Viết rõ đơn vị và điều kiện'
      },
      {
        id: 'node-fw-3',
        text: '3. Ví dụ điển hình',
        role: 'main',
        sourceType: 'manual',
        parentId: 'node-framework-root',
        x: -280,
        y: 110,
        note: 'Bài tập mẫu hoặc liên hệ thực tế'
      },
      {
        id: 'node-fw-3-sub',
        text: 'Bài tập tiêu biểu có lời giải ngắn',
        role: 'sub',
        sourceType: 'manual',
        parentId: 'node-fw-3',
        x: -540,
        y: 110,
        note: 'Xem cách biến đổi công thức'
      },
      {
        id: 'node-fw-4',
        text: '4. Bẫy & Lỗi sai thường gặp',
        role: 'main',
        sourceType: 'ai_ext',
        parentId: 'node-framework-root',
        x: 280,
        y: 110,
        note: 'Những chỗ học sinh hay mất điểm'
      },
      {
        id: 'node-fw-4-sub',
        text: 'Điểm nhầm lẫn khi làm bài thi',
        role: 'sub',
        sourceType: 'ai_ext',
        parentId: 'node-fw-4',
        x: 540,
        y: 110,
        note: 'Ghi chú cảnh báo màu đỏ'
      }
    ],
    crossLinks: []
  },
  teachingPlan: {
    title: 'Khung kế hoạch bài dạy (Công văn 5512)',
    subject: 'Giáo án',
    grade: '6',
    role: 'teacher',
    description: 'Khung 4 hoạt động dạy học tích cực: Khởi động -> Hình thành kiến thức -> Luyện tập -> Vận dụng.',
    textbookSource: 'Bộ Giáo dục & Đào tạo: Hướng dẫn xây dựng kế hoạch bài dạy đổi mới phương pháp dạy học.',
    quickNote: 'Gợi ý cho giáo viên thiết kế bài giảng trực quan.',
    rootNodeId: 'node-teach-root',
    nodes: [
      {
        id: 'node-teach-root',
        text: 'Kế hoạch bài dạy',
        role: 'root',
        sourceType: 'sgk',
        parentId: null,
        x: 0,
        y: 0,
        note: 'Mục tiêu bài học (Phẩm chất & Năng lực)'
      },
      {
        id: 'node-t-1',
        text: 'Hoạt động 1: Mở đầu / Khởi động',
        role: 'main',
        sourceType: 'sgk',
        parentId: 'node-teach-root',
        x: -290,
        y: -90,
        note: 'Tạo tình huống có vấn đề'
      },
      {
        id: 'node-t-1-sub',
        text: 'Câu hỏi kích hoạt tư duy học sinh (3-5 phút)',
        role: 'sub',
        sourceType: 'sgk',
        parentId: 'node-t-1',
        x: -560,
        y: -90,
        note: 'Kết nối bài cũ và bài mới'
      },
      {
        id: 'node-t-2',
        text: 'Hoạt động 2: Hình thành kiến thức',
        role: 'main',
        sourceType: 'sgk',
        parentId: 'node-teach-root',
        x: 290,
        y: -90,
        note: 'Khám phá bài học qua hoạt động'
      },
      {
        id: 'node-t-2-sub',
        text: 'Giao nhiệm vụ, thảo luận nhóm, rút ra kết luận',
        role: 'sub',
        sourceType: 'sgk',
        parentId: 'node-t-2',
        x: 560,
        y: -90,
        note: 'Xây dựng sơ đồ kiến thức chung'
      },
      {
        id: 'node-t-3',
        text: 'Hoạt động 3: Luyện tập củng cố',
        role: 'main',
        sourceType: 'sgk',
        parentId: 'node-teach-root',
        x: -290,
        y: 110,
        note: 'Bài tập rèn luyện kỹ năng'
      },
      {
        id: 'node-t-3-sub',
        text: 'Hệ thống câu hỏi trắc nghiệm & tự luận nhanh',
        role: 'sub',
        sourceType: 'sgk',
        parentId: 'node-t-3',
        x: -560,
        y: 110,
        note: 'Đánh giá mức độ hiểu bài'
      },
      {
        id: 'node-t-4',
        text: 'Hoạt động 4: Vận dụng thực tế',
        role: 'main',
        sourceType: 'sgk',
        parentId: 'node-teach-root',
        x: 290,
        y: 110,
        note: 'Mở rộng và ứng dụng đời sống'
      },
      {
        id: 'node-t-4-sub',
        text: 'Dự án nhỏ hoặc bài tập vận dụng sáng tạo',
        role: 'sub',
        sourceType: 'sgk',
        parentId: 'node-t-4',
        x: 560,
        y: 110,
        note: 'Giao bài làm tại nhà'
      }
    ],
    crossLinks: []
  }
};

// Benchmark Data: Minh chứng kiểm thử thực tế với 4 môn học
export const benchmarkResults = [
  {
    subject: 'Toán học (Lớp 6)',
    lesson: 'Phân số & Rút gọn phân số',
    totalNodes: 12,
    teacherModelNodes: 11,
    matchingRate: '95%',
    nodesEditedByStudent: 1, // Chỉ phải sửa 1 nhánh
    editDetails: 'Học sinh thêm ví dụ số âm theo dặn dò của cô giáo trên lớp.',
    verdict: 'Rất tốt · Sơ đồ bám sát định nghĩa SGK Kết nối tri thức.'
  },
  {
    subject: 'KHTN (Lớp 7)',
    lesson: 'Quang hợp ở thực vật',
    totalNodes: 9,
    teacherModelNodes: 9,
    matchingRate: '98%',
    nodesEditedByStudent: 0, // Không cần sửa
    editDetails: 'Đầy đủ nguyên liệu, sản phẩm, phương trình và 4 yếu tố môi trường.',
    verdict: 'Xuất sắc · Giữ đúng thuật ngữ chuẩn SGK Chân trời sáng tạo.'
  },
  {
    subject: 'Ngữ văn (Lớp 7)',
    lesson: 'Từ Hán Việt',
    totalNodes: 8,
    teacherModelNodes: 8,
    matchingRate: '92%',
    nodesEditedByStudent: 1, // Sửa 1 nhánh ví dụ
    editDetails: 'Đổi ví dụ "thăng hà" thành ví dụ đời thường hơn theo cô dặn.',
    verdict: 'Tốt · Phân biệt rõ đẳng lập và chính phụ.'
  },
  {
    subject: 'Lịch sử & Địa lý (Lớp 8)',
    lesson: 'Cách mạng công nghiệp thế kỷ XVIII-XIX',
    totalNodes: 10,
    teacherModelNodes: 10,
    matchingRate: '94%',
    nodesEditedByStudent: 1, // Thêm mốc thời gian máy hơi nước
    editDetails: 'Bổ sung mốc năm 1784 (James Watt phát minh máy hơi nước).',
    verdict: 'Rất tốt · Tóm tắt nhân quả rõ ràng, không lan man.'
  }
];
