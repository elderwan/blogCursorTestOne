import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Grid,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  VideoLibrary as VideoLibraryIcon,
  Link as LinkIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import axios from 'axios';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'daily',
    tags: [],
    images: [],
    video: null,
    sharedLink: null,
  });
  const [currentTag, setCurrentTag] = useState('');
  const [uploading, setUploading] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkDialog, setLinkDialog] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
    { value: 'daily', label: '日常' },
    { value: 'funny', label: '搞笑' },
    { value: 'training', label: '训练' },
    { value: 'health', label: '健康' },
    { value: 'adventure', label: '冒险' },
    { value: 'other', label: '其他' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToDelete)
    }));
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (formData.images.length + files.length > 18) {
      setError('最多只能上传18张图片');
      return;
    }

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

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('video', file);
      const response = await axios.post('/api/upload/video', formDataObj);
      setFormData(prev => ({
        ...prev,
        video: response.data
      }));
      setSuccess('视频上传成功！');
    } catch (error) {
      setError('视频上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleAddLink = async () => {
    if (!linkUrl.trim()) return;

    try {
      const response = await axios.post('/api/posts/link-preview', {
        url: linkUrl
      });
      setFormData(prev => ({
        ...prev,
        sharedLink: response.data
      }));
      setLinkDialog(false);
      setLinkUrl('');
      setSuccess('链接预览生成成功！');
    } catch (error) {
      setError('链接预览生成失败');
    }
  };

  const handleDeleteImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleDeleteVideo = () => {
    setFormData(prev => ({
      ...prev,
      video: null
    }));
  };

  const handleDeleteLink = () => {
    setFormData(prev => ({
      ...prev,
      sharedLink: null
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('标题和内容不能为空');
      return;
    }

    try {
      await axios.post('/api/posts', formData);
      setSuccess('帖子发布成功！');
      setTimeout(() => {
        navigate('/posts');
      }, 2000);
    } catch (error) {
      setError('发布失败，请重试');
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
        ✍️ 写新帖子
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
                  label="标题"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  placeholder="给帖子起个有趣的标题吧 🐾"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>分类</InputLabel>
                  <Select
                    value={formData.category}
                    label="分类"
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    label="标签"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="添加标签"
                    size="small"
                    sx={{ flexGrow: 1 }}
                  />
                  <Button onClick={handleAddTag} variant="outlined" size="small">
                    <AddIcon />
                  </Button>
                </Box>
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleDeleteTag(tag)}
                      size="small"
                      color="primary"
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="内容"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  required
                  placeholder="分享你和毛孩子的美好时光吧！"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  媒体内容
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    disabled={uploading || formData.images.length >= 18}
                  >
                    上传图片 ({formData.images.length}/18)
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Button>

                  {!formData.video && (
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<VideoLibraryIcon />}
                      disabled={uploading}
                    >
                      上传视频
                      <input
                        type="file"
                        hidden
                        accept="video/*"
                        onChange={handleVideoUpload}
                      />
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    startIcon={<LinkIcon />}
                    onClick={() => setLinkDialog(true)}
                  >
                    分享链接
                  </Button>
                </Box>

                {uploading && <LinearProgress sx={{ mb: 2 }} />}

                {/* Images */}
                {formData.images.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      图片预览
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
                                height: '120px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                              }}
                            />
                            <IconButton
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                },
                              }}
                              size="small"
                              onClick={() => handleDeleteImage(index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Video */}
                {formData.video && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1">视频预览</Typography>
                      <IconButton onClick={handleDeleteVideo} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <ReactPlayer
                      url={formData.video.url}
                      width="100%"
                      height="300px"
                      controls
                    />
                  </Box>
                )}

                {/* Shared Link */}
                {formData.sharedLink && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1">链接预览</Typography>
                      <IconButton onClick={handleDeleteLink} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Card className="link-preview">
                      <Box sx={{ display: 'flex' }}>
                        {formData.sharedLink.thumbnail && (
                          <img
                            src={formData.sharedLink.thumbnail}
                            alt="Link preview"
                            style={{
                              width: '120px',
                              height: '80px',
                              objectFit: 'cover',
                            }}
                          />
                        )}
                        <Box sx={{ p: 2, flexGrow: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {formData.sharedLink.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {formData.sharedLink.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formData.sharedLink.domain}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/posts')}
                  >
                    取消
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SendIcon />}
                    disabled={uploading}
                  >
                    发布帖子
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Link Dialog */}
      <Dialog open={linkDialog} onClose={() => setLinkDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>分享链接</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="链接地址"
            type="url"
            fullWidth
            variant="outlined"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkDialog(false)}>取消</Button>
          <Button onClick={handleAddLink} variant="contained">
            添加链接
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreatePost;