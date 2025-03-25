import React, { useState, useRef } from 'react';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  Button,
  useToast,
} from '@chakra-ui/react';
import Quill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useCreateBlogMutation } from '@/services/blogs/blogApi';

export default function BlogModal({ isOpen, handleClose }) {
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [createBlog, { isLoading }] = useCreateBlogMutation();
  const toast = useToast();
  const imageHandler = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      setAttachments(prev => [...prev, file]);
      const reader = new FileReader();
      reader.onload = e => {
        const url = e.target.result;
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', url);
      };
      reader.readAsDataURL(file);
    }
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [
          { list: 'ordered' },
          { list: 'bullet' },
          { indent: '-1' },
          { indent: '+1' },
        ],
        ['link', 'image', 'video'],
        [{ align: [] }, 'clean'],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'indent',
    'link',
    'image',
    'video',
    'align',
  ];
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      // Append basic fields
      formData.append('title', title);
      formData.append('content', content);

      // Append thumbnail if exists
      if (thumbnail) {
        formData.append('postThumbnail', thumbnail);
      }

      // Append attachments
      attachments.forEach(file => {
        formData.append('postAttachments', file);
      });

      // Send the request
      await createBlog(formData).unwrap();

      // Show success message
      toast({
        title: 'Blog created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset form and close modal
      handleClose();
    } catch (err) {
      toast({
        title: 'Error creating blog',
        description: err.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={handleClose} size='2xl' isCentered>
      <ModalOverlay />
      <ModalContent>
        <Box p={4}>
          <FormControl mb={4}>
            <FormLabel>Blog Title</FormLabel>
            <Input
              type='text'
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Thumbnail</FormLabel>
            <Input
              type='file'
              accept='image/*'
              onChange={e => setThumbnail(e.target.files[0])}
            />
            {thumbnail && (
              <FormHelperText>{thumbnail.name} selected</FormHelperText>
            )}
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Content</FormLabel>
            <Box bg='white' borderRadius='md'>
              <Quill
                ref={quillRef}
                theme='snow'
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                style={{ height: '300px' }}
              />
            </Box>
          </FormControl>

          <input
            type='file'
            accept='image/*'
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </Box>
        <Button
          colorScheme='green'
          variant={'ghost'}
          mt={50}
          mb={5}
          ml={20}
          mr={20}
          onClick={handleSubmit}
          isLoading={isLoading}
          loadingText='Submitting...'
        >
          Save
        </Button>
      </ModalContent>
    </Modal>
  );
}
