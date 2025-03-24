import React, { useState } from "react";

const FAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleAnswer = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "Các đối tượng có mức độ hoạt động thể lực khác điều chỉnh thực đơn như thế nào?",
      answer: (
        <>
          <p className="mb-4">
            Phụ nữ mang thai và bà mẹ cho con bú có mức độ hoạt động thể lực khác (chủ yếu là mức hoạt động thể lực nhẹ như nhân viên văn phòng, nhân viên bán hàng...) có thể điều chỉnh thực đơn bằng cách điều chỉnh lượng thực phẩm ăn vào theo hướng dẫn như sau:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li className="mb-2">
              Bước 1: Xác định nhu cầu năng lượng của bạn mỗi ngày theo hướng dẫn tại "Ngân hàng thực đơn cân bằng dinh dưỡng dùng cho phụ nữ mang thai và bà mẹ cho con bú".
            </li>
            <li className="mb-2">
              Bước 2: Lấy nhu cầu năng lượng ăn vào vừa xác định được ở bước 1 chia cho nhu cầu năng lượng khuyến nghị của bạn ở bảng 1 Bảng nhu cầu dinh dưỡng khuyến nghị cho người Việt Nam.
            </li>
            <li className="mb-2">
              Bước 3: Hiệu chỉnh lượng thực phẩm cần ăn theo hệ số 3.4 Đạt được số với ngân hàng thực đơn cân bằng dinh dưỡng.
            </li>
          </ul>
          <img
            src="https://storage.googleapis.com/a1aa/image/PiDdfBQO-rG8z3LGc1lpTOJ2GR9P3Uv9ABIC_ru4eEI.jpg"
            alt="A pregnant woman holding an apple"
            className="w-full h-auto mb-4 rounded-lg"
          />
          <p className="mb-4">
            Ví dụ, nếu bạn là phụ nữ mang thai có độ tuổi trong khoảng 20 - 29 tuổi, ở giai đoạn 3 tháng đầu thai kỳ, bạn áp dụng theo các bước như hướng dẫn thì có thông tin như sau:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li className="mb-2">
              Nhu cầu khuyến nghị năng lượng của bạn là 1.810 Kcal
            </li>
            <li className="mb-2">
              Hệ số A của bạn là 1.810/((1.978+2.082)/2) (0.9 (Của bảng 9/10)
            </li>
          </ul>
          <p>
            Lượng thực phẩm bạn cần ăn = 9/10 so với lượng thực phẩm của Ngân hàng thực đơn cân bằng dinh dưỡng.
          </p>
        </>
      )
    },
    {
      question: "Nhu cầu năng lượng dành cho phụ nữ mang thai, bà mẹ cho con bú mức hoạt động thể lực nhẹ là như thế nào?",
      answer: "Nội dung câu trả lời sẽ được thêm vào đây"
    },
    {
      question: "Thực đơn đã được phát triển theo tiêu chuẩn như thế nào?",
      answer: "Nội dung câu trả lời sẽ được thêm vào đây"
    },
    {
      question: "Thực đơn dành cho phụ nữ mang thai đơn hay thai đôi? Nếu chỉ dành cho thai đơn thì những người mang thai đôi có tham khảo được không?",
      answer: "Nội dung câu trả lời sẽ được thêm vào đây"
    },
    {
      question: "Nếu bà mẹ chỉ có thể ăn một hoặc vài bữa trong thực đơn, không thể ăn đầy đủ tất cả các bữa trong 1 ngày của thực đơn thì có được không",
      answer: "Nội dung câu trả lời sẽ được thêm vào đây"
    },
    {
      question: "Nếu bà mẹ không ăn được một số thực phẩm/món ăn trong thực đơn thì phải làm sao?",
      answer: "Nội dung câu trả lời sẽ được thêm vào đây"
    },
    {
      question: "Làm thế nào để đảm bảo chế độ ăn đủ chất cho thai nhi trong 3 tháng đầu?",
      answer: "Nội dung câu trả lời sẽ được thêm vào đây"
    },
    {
      question: "Các dấu hiệu nhận biết thiếu dinh dưỡng trong thai kỳ là gì?",
      answer: "Nội dung câu trả lời sẽ được thêm vào đây"
    },
    {
      question: "Những thực phẩm nào cần tránh trong thời kỳ mang thai?",
      answer: "Nội dung câu trả lời sẽ được thêm vào đây"
    },
    {
      question: "Cách bổ sung sắt và acid folic hiệu quả trong thai kỳ?",
      answer: "Nội dung câu trả lời sẽ được thêm vào đây"
    },
    {
      question: "Chế độ ăn cho bà mẹ bị đái tháo đường thai kỳ cần lưu ý gì?",
      answer: "Nội dung câu trả lời sẽ được thêm vào đây"
    },
    {
      question: "Chế độ ăn cho bà mẹ bị nghén nặng cần điều chỉnh như thế nào?",
      answer: "Nội dung câu trả lời sẽ được thêm vào đây"
    },
    {
      question: "Làm sao để duy trì cân nặng hợp lý trong thai kỳ?",
      answer: "Nội dung câu trả lời sẽ được thêm vào đây"
    }
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Những Câu Hỏi Thường Gặp</h1>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {faqItems.map((item, index) => (
          <div key={index} className="border-b border-gray-100 last:border-b-0">
          <div
            className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50"
            onClick={() => toggleAnswer(index)}
          >
            <h2 className="text-lg font-semibold pr-8">{item.question}</h2>
            <span className="text-red-400 text-xl font-bold min-w-[20px] flex justify-center transition-transform duration-200">
              {expandedIndex === index ? '−' : '+'}
            </span>
          </div>
          <div className={`overflow-hidden transition-all duration-300 ${
            expandedIndex === index ? 'max-h-[2000px]' : 'max-h-0'
          }`}>
            <div className="px-6 pb-6 mt-4">
              {item.answer}
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;