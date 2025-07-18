import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  LinearProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateAlbum = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [],
    cover: null,
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formDataObj = new FormData();
        formDataObj.append('image', file);
        const response = await axios.post('/api/upload/image', formDataObj);
        return response.data;
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }));
      setSuccess('图片上传成功！');
    } catch (error) {
      setError('图片上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSetCover = (image) => {
    setFormData(prev => ({
      ...prev,
      cover: image
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!formData.title.trim()) {
      setError('相册标题不能为空');
      return;
    }

    if (formData.images.length === 0) {
      setError('请至少上传一张图片');
      return;
    }

    try {
      await axios.post('/api/albums', formData);
      setSuccess('相册创建成功！');
      setTimeout(() => {
        navigate('/albums');
      }, 2000);
    } catch (error) {
      setError('创建失败，请重试');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography 
        variant="h3" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          textAlign: 'center',
          mb: 4,
        }}
      >
        📸 创建新相册
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="相册标题"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  placeholder="给相册起个好听的名字 📷"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="相册描述"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="介绍一下这个相册的内容吧"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  上传图片
                </Typography>
                
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  disabled={uploading}
                  sx={{ mb: 3 }}
                >
                  选择图片
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>

                {uploading && <LinearProgress sx={{ mb: 2 }} />}

                {formData.images.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      图片预览 ({formData.images.length} 张)
                    </Typography>
                    <Grid container spacing={2}>
                      {formData.images.map((image, index) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                          <Box sx={{ position: 'relative' }}>
                            <img
                              src={image.url}
                              alt={`Preview ${index + 1}`}
                              style={{
                                width: '100%',
                                height: '150px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: formData.cover?.url === image.url ? '3px solid #DFAE75' : 'none',
                              }}
                            />
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                              }}
                            >
                              <IconButton
                                sx={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                  '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                  },
                                }}
                                size="small"
                                onClick={() => handleDeleteImage(index)}
                              >
                                <DeleteIcon fontSize="small" color="error" />
                              </IconButton>
                            </Box>
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 4,
                                left: 4,
                                right: 4,
                              }}
                            >
                              <Button
                                variant="contained"
                                size="small"
                                fullWidth
                                onClick={() => handleSetCover(image)}
                                sx={{
                                  backgroundColor: formData.cover?.url === image.url ? 'success.main' : 'primary.main',
                                  fontSize: '0.7rem',
                                }}
                              >
                                {formData.cover?.url === image.url ? '封面' : '设为封面'}
                              </Button>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/albums')}
                  >
                    取消
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={uploading}
                  >
                    创建相册
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CreateAlbum;