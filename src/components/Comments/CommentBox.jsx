import { useState } from 'react';
import { Box, Textarea, Button, VStack, useToast } from '@chakra-ui/react';
import { useCreateCommentMutation } from '@/services/comments/commentApi';

const CommentBox = ({ postId }) => {
  const [content, setContent] = useState('');
  const toast = useToast();
  const [createComment, { isLoading }] = useCreateCommentMutation();

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: 'Comment cannot be empty',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await createComment({ postId, content }).unwrap();
      setContent('');
      toast({
        title: 'Comment added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to add comment',
        description: error?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} borderWidth={1} borderRadius='lg'>
      <VStack spacing={3} align='stretch'>
        <Textarea
          placeholder='Write a comment...'
          value={content}
          onChange={e => setContent(e.target.value)}
          size='md'
          resize='none'
        />
        <Button
          colorScheme='blue'
          onClick={handleSubmit}
          isLoading={isLoading}
          isDisabled={!content.trim()}
        >
          Submit
        </Button>
      </VStack>
    </Box>
  );
};

export default CommentBox;
