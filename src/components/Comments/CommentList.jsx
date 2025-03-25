import { useState } from 'react';
import {
  Box,
  Text,
  Spinner,
  Button,
  VStack,
  HStack,
  Avatar,
  Heading,
  Flex,
  Divider,
} from '@chakra-ui/react';
import { useGetCommentsByPostQuery } from '@/services/comments/commentApi';
import { format } from 'date-fns';

const CommentList = ({ postId, userId, deleteComment }) => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const { data, error, isLoading } = useGetCommentsByPostQuery({
    postId,
    page,
    size,
  });

  const comments = data?.comments || [];
  const totalPages = data?.totalPages || 1;

  return (
    <Box p={5} borderWidth={1} borderRadius='lg' shadow='md'>
      {isLoading ? (
        <Spinner size='lg' />
      ) : error ? (
        <Text color='red.500'>Failed to load comments.</Text>
      ) : (
        <VStack spacing={4} align='stretch'>
          <Heading fontSize='xl'>Comments ({data.total})</Heading>
          <Divider />
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <Box key={comment.id} p={4} bg='gray.50' borderRadius='md'>
                <Flex align='center' justify='space-between' mb={2}>
                  <Flex align='center'>
                    <Avatar
                      size='sm'
                      src={comment.user.avatar}
                      name={comment.user.name}
                    />
                    <Box ml={3}>
                      <Text fontSize='md' fontWeight='bold'>
                        {comment.user.name}
                      </Text>
                      <Text fontSize='sm' color='gray.500'>
                        {format(new Date(comment.createdAt), 'PPP p')}
                      </Text>
                    </Box>
                  </Flex>
                  {userId.toString() === comment.user._id.toString() && (
                    <Button
                      colorScheme='red'
                      size='sm'
                      onClick={() => deleteComment(comment._id)}
                    >
                      Delete
                    </Button>
                  )}
                </Flex>
                <Text fontSize='md' color='gray.700'>
                  {comment.content}
                </Text>
                {index !== comments.length - 1 && <Divider mt={3} />}
              </Box>
            ))
          ) : (
            <Text>No comments found.</Text>
          )}

          {/* Pagination Controls */}
          <HStack justify='space-between' mt={4}>
            <Button
              colorScheme='blue'
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              isDisabled={page === 1}
            >
              Previous
            </Button>
            <Text>
              Page {page} of {totalPages}
            </Text>
            <Button
              colorScheme='blue'
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              isDisabled={page === totalPages}
            >
              Next
            </Button>
          </HStack>
        </VStack>
      )}
    </Box>
  );
};

export default CommentList;
