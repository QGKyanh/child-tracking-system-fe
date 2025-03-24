import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  Icon,
  List,
  ListItem,
  ListIcon,
  Link,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import {
  FaCircle
} from 'react-icons/fa';

function AboutUs() {
  return (
    <Container maxW="3xl" py={10}>
      <Box bg="white" shadow="lg" p={8} borderRadius="xl">
        <Heading
          as="h1"
          size="md"
          textAlign="center"
          mb={4}
        >
          LỜI GIỚI THIỆU VỀ CHƯƠNG TRÌNH
        </Heading>


        <Heading
          as="h2"
          size="xl"
          color="green.600"
          textAlign="center"
          mb={6}
        >
          LỜI GIỚI THIỆU
        </Heading>

        <VStack spacing={4} align="stretch">
          <Text textAlign="justify">
            Trong khuôn khổ các sự kiện diễn ra trong năm 2011 - 2020 và nhằm mục tiêu nâng cao nhận thức của cộng đồng về các vấn đề liên quan đến sức khỏe, chúng tôi xin giới thiệu chương trình này.
          </Text>

          <Text textAlign="justify">
            Chương trình này sẽ bao gồm các hoạt động nhằm nâng cao nhận thức và cung cấp thông tin về các vấn đề sức khỏe quan trọng. Chúng tôi hy vọng rằng thông qua chương trình này, mọi người sẽ có thêm kiến thức và hiểu biết để chăm sóc sức khỏe của mình và gia đình.
          </Text>

          <Box
            borderLeft="4px"
            borderColor="red.600"
            bg="red.50"
            p={4}
            borderRadius="lg"
          >
            <Text color="red.600" fontStyle="italic">
              "Mục tiêu của Chương trình là đóng góp vào việc cải thiện sức khỏe của cộng đồng thông qua việc cung cấp thông tin, giáo dục và hỗ trợ các hoạt động liên quan đến sức khỏe. Chúng tôi tin rằng với sự tham gia và ủng hộ của các bạn, chúng ta sẽ đạt được những kết quả tốt đẹp."
            </Text>
          </Box>

          <Box bg="yellow.100" p={4} borderRadius="lg">
            <Text textAlign="justify">
              Các hoạt động của chương trình sẽ được tổ chức với sự hợp tác của các tổ chức và cá nhân có uy tín trong lĩnh vực y tế và sức khỏe. Chúng tôi cam kết sẽ nỗ lực hết mình để mang lại những thông tin và dịch vụ tốt nhất cho cộng đồng.
            </Text>
          </Box>

          <Text textAlign="justify">
            Các đơn vị tham gia tổ chức và thực hiện chương trình bao gồm:
          </Text>

          <List spacing={2}>
            <ListItem>
              <ListIcon as={FaCircle} color="gray.500" fontSize="xs" />
              <Text as="span" fontWeight="bold">Hội Y học Việt Nam</Text>: Hội Y học Việt Nam là một trong những đơn vị hàng đầu trong lĩnh vực y tế và sức khỏe tại Việt Nam.
            </ListItem>
            <ListItem>
              <ListIcon as={FaCircle} color="gray.500" fontSize="xs" />
              <Text as="span" fontWeight="bold">Viện Dinh dưỡng Quốc gia</Text>: Viện Dinh dưỡng Quốc gia là đơn vị nghiên cứu và cung cấp thông tin về dinh dưỡng và sức khỏe.
            </ListItem>
            <ListItem>
              <ListIcon as={FaCircle} color="gray.500" fontSize="xs" />
              <Text as="span" fontWeight="bold">Công ty Alimexco Việt Nam</Text>: Công ty Alimexco Việt Nam là một trong những đơn vị hàng đầu trong lĩnh vực cung cấp các sản phẩm và dịch vụ y tế.
            </ListItem>
          </List>

          <Text textAlign="justify">
            Chương trình sẽ bao gồm các hoạt động như hội thảo, tọa đàm, triển lãm và các hoạt động giáo dục cộng đồng. Chúng tôi hy vọng rằng thông qua các hoạt động này, mọi người sẽ có thêm kiến thức và hiểu biết để chăm sóc sức khỏe của mình và gia đình.
          </Text>

          <Text textAlign="justify">
            Chúng tôi xin cảm ơn các đơn vị và cá nhân đã tham gia và ủng hộ chương trình này. Chúng tôi hy vọng rằng với sự tham gia và ủng hộ của các bạn, chúng ta sẽ đạt được những kết quả tốt đẹp.
          </Text>

          <Box bg="green.100" p={4} borderRadius="lg" textAlign="center" fontWeight="bold">
              Xin cảm ơn
          </Box>
        </VStack>
      </Box>
    </Container>
  );
}

export default AboutUs;