import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Container,
  Heading,
  UnorderedList,
  ListItem,
  Text,
  Image,
} from "@chakra-ui/react";

const FAQ = () => {
  const faqItems = [
    {
      question:
        'Các đối tượng có mức độ hoạt động thể lực khác điều chỉnh thực đơn như thế nào?',
      answer: (
        <>
          <Text mb={4}>
            Phụ nữ mang thai và bà mẹ cho con bú có mức độ hoạt động thể lực khác (chủ yếu là mức hoạt động thể lực nhẹ như nhân viên văn phòng, nhân viên bán hàng...) có thể điều chỉnh thực đơn bằng cách điều chỉnh lượng thực phẩm ăn vào theo hướng dẫn như sau:
          </Text>
          <UnorderedList mb={4} spacing={2}>
            <ListItem>
              Bước 1: Xác định nhu cầu năng lượng của bạn mỗi ngày theo hướng dẫn tại "Ngân hàng thực đơn cân bằng dinh dưỡng dùng cho phụ nữ mang thai và bà mẹ cho con bú".
            </ListItem>
            <ListItem>
              Bước 2: Lấy nhu cầu năng lượng ăn vào vừa xác định được ở bước 1 chia cho nhu cầu năng lượng khuyến nghị của bạn ở bảng 1 Bảng nhu cầu dinh dưỡng khuyến nghị cho người Việt Nam.
            </ListItem>
            <ListItem>
              Bước 3: Hiệu chỉnh lượng thực phẩm cần ăn theo hệ số 3.4 Đạt được số với ngân hàng thực đơn cân bằng dinh dưỡng.
            </ListItem>
          </UnorderedList>
          <Image
            src="https://storage.googleapis.com/a1aa/image/PiDdfBQO-rG8z3LGc1lpTOJ2GR9P3Uv9ABIC_ru4eEI.jpg"
            alt="A pregnant woman holding an apple"
            borderRadius="lg"
            mb={4}
            width="100%"
            height="auto"
          />
          <Text mb={4}>
            Ví dụ, nếu bạn là phụ nữ mang thai có độ tuổi trong khoảng 20 - 29 tuổi, ở giai đoạn 3 tháng đầu thai kỳ, bạn áp dụng theo các bước như hướng dẫn thì có thông tin như sau:
          </Text>
          <UnorderedList mb={4} spacing={2}>
            <ListItem>
              Nhu cầu khuyến nghị năng lượng của bạn là 1.810 Kcal
            </ListItem>
            <ListItem>
              Hệ số A của bạn là 1.810/((1.978+2.082)/2) (0.9 (Của bảng 9/10)
            </ListItem>
          </UnorderedList>
          <Text>
            Lượng thực phẩm bạn cần ăn = 9/10 so với lượng thực phẩm của Ngân hàng thực đơn cân bằng dinh dưỡng.
          </Text>
        </>
      ),
    },
    {
      question: "Nhu cầu năng lượng dành cho phụ nữ mang thai, bà mẹ cho con bú mức hoạt động thể lực nhẹ là như thế nào?",
      answer: (
        <Text>Nội dung câu trả lời sẽ được thêm vào đây</Text>
      )
    },
    {
      question: "Thực đơn đã được phát triển theo tiêu chuẩn như thế nào?",
      answer: (
        <Text>Nội dung câu trả lời sẽ được thêm vào đây</Text>
      )
    },
    {
      question: "Thực đơn dành cho phụ nữ mang thai đơn hay thai đôi? Nếu chỉ dành cho thai đơn thì những người mang thai đôi có tham khảo được không?",
      answer: (
        <Text>Nội dung câu trả lời sẽ được thêm vào đây</Text>
      )
    },
    {
      question: "Nếu bà mẹ chỉ có thể ăn một hoặc vài bữa trong thực đơn, không thể ăn đầy đủ tất cả các bữa trong 1 ngày của thực đơn thì có được không",
      answer: (
        <Text>Nội dung câu trả lời sẽ được thêm vào đây</Text>
      )
    },
    {
      question: "Nếu bà mẹ không ăn được một số thực phẩm/món ăn trong thực đơn thì phải làm sao?",
      answer: (
        <Text>Nội dung câu trả lời sẽ được thêm vào đây</Text>
      )
    },
    {
      question: "Làm thế nào để đảm bảo chế độ ăn đủ chất cho thai nhi trong 3 tháng đầu?",
      answer: (
        <Text>Nội dung câu trả lời sẽ được thêm vào đây</Text>
      )
    },
    {
      question: "Các dấu hiệu nhận biết thiếu dinh dưỡng trong thai kỳ là gì?",
      answer: (
        <Text>Nội dung câu trả lời sẽ được thêm vào đây</Text>
      )
    },
    {
      question: "Những thực phẩm nào cần tránh trong thời kỳ mang thai?",
      answer: (
        <Text>Nội dung câu trả lời sẽ được thêm vào đây</Text>
      )
    },
    {
      question: "Cách bổ sung sắt và acid folic hiệu quả trong thai kỳ?",
      answer: (
        <Text>Nội dung câu trả lời sẽ được thêm vào đây</Text>
      )
    },
    {
      question: "Chế độ ăn cho bà mẹ bị đái tháo đường thai kỳ cần lưu ý gì?",
      answer: (
        <Text>Nội dung câu trả lời sẽ được thêm vào đây</Text>
      )
    },
    {
      question: "Chế độ ăn cho bà mẹ bị nghén nặng cần điều chỉnh như thế nào?",
      answer: (
        <Text>Nội dung câu trả lời sẽ được thêm vào đây</Text>
      )
    },
    {
      question: "Làm sao để duy trì cân nặng hợp lý trong thai kỳ?",
      answer: (
        <Text>Nội dung câu trả lời sẽ được thêm vào đây</Text>
      )
    }
  ];

  return (
    <Box 
      w="100%" 
      minH="100vh" 
      py={8}
    >
      <Container maxW="6xl" py={6}> {/* Thay đổi maxW từ 3xl thành 6xl */}
        <Box 
          bg="white"
          p={8}
          borderRadius="xl"
          boxShadow="lg"
          border="1px"
          borderColor="gray.200"
          mx="auto" // Thêm margin auto để căn giữa
        >
          <Heading 
            as="h1" 
            size="xl" 
            textAlign="center" 
            mb={8} 
            color="gray.800"
          >
            Những Câu Hỏi Thường Gặp
          </Heading>
          <Box 
            borderRadius="lg" 
            overflow="hidden"
          >
          <Accordion allowToggle>
            {faqItems.map((item, index) => (
              <AccordionItem key={index} borderBottom="1px" borderColor="gray.100">
                <h2>
                  <AccordionButton 
                    py={4} 
                    _hover={{ bg: 'gray.50' }}
                  >
                    <Box flex="1" textAlign="left" fontWeight="semibold">
                      {item.question}
                    </Box>
                    <AccordionIcon color="red.400" />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  {item.answer}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      </Box>
    </Container>
  </Box>
);
};

export default FAQ;
