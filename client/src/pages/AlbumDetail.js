import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  PhotoLibrary as PhotoLibraryIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import ImageGallery from 'react-image-gallery';
import axios from 'axios';
import 'react-image-gallery/styles/css/image-gallery.css';

const AlbumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlbum();
  }, [id]);

  const fetchAlbum = async () => {
    try {
      const response = await axios.get(`/api/albums/${id}`);
      setAlbum(response.data);
    } catch (error) {
      console.error('Failed to fetch album:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: album.title,
        text: album.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板！');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (!album) {
    return (
      <Container maxWidth="lg">
        <Box textAlign="center" py={8}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            相册不存在 😢
          </Typography>
          <Button variant="contained" onClick={() => navigate('/albums')}>
            返回相册列表
          </Button>
        </Box>
      </Container>
    );
  }

  const imageGalleryItems = album.images?.map(image => ({
    original: image.url,
    thumbnail: image.url,
    description: image.caption,
  })) || [];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/albums')}
          sx={{ mb: 2 }}
        >
          返回相册列表
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PhotoLibraryIcon sx={{ mr: 2, color: 'secondary.main', fontSize: '3rem' }} />
                <Box>
                  <Typography variant="h3" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                    {album.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(album.createdAt), 'yyyy年MM月dd日', { locale: zhCN })} · {album.images.length} 张照片
                  </Typography>
                </Box>
              </Box>

              {album.description && (
                <>
                  <Divider sx={{ mb: 3 }} />
                  <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 4 }}>
                    {album.description}
                  </Typography>
                </>
              )}

              <Divider sx={{ mb: 4 }} />

              {/* Image Gallery */}
              {imageGalleryItems.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    相册图片
                  </Typography>
                  <ImageGallery 
                    items={imageGalleryItems}
                    showThumbnails={imageGalleryItems.length > 1}
                    showFullscreenButton={true}
                    showPlayButton={imageGalleryItems.length > 1}
                    lazyLoad={true}
                    slideDuration={300}
                    slideInterval={3000}
                  />
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                  startIcon={<ShareIcon />}
                  onClick={handleShare}
                  variant="outlined"
                >
                  分享相册
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 24 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                相册信息
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    创建时间
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(album.createdAt), 'yyyy年MM月dd日', { locale: zhCN })}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    图片数量
                  </Typography>
                  <Typography variant="body1">
                    {album.images.length} 张
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    最后更新
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(album.updatedAt), 'yyyy年MM月dd日', { locale: zhCN })}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Image Grid */}
          {album.images.length > 0 && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  所有图片
                </Typography>
                <Grid container spacing={1}>
                  {album.images.map((image, index) => (
                    <Grid item xs={6} key={index}>
                      <img
                        src={image.url}
                        alt={`Album image ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          // 这里可以添加点击图片的逻辑，比如跳转到大图显示
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default AlbumDetail;