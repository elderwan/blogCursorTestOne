import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Grid,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Visibility as VisibilityIcon,
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import ImageGallery from 'react-image-gallery';
import ReactPlayer from 'react-player';
import axios from 'axios';
import 'react-image-gallery/styles/css/image-gallery.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`/api/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error('Failed to fetch post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.post(`/api/posts/${id}/like`);
      setPost(prev => ({
        ...prev,
        likes: response.data.likes
      }));
      setLiked(!liked);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content,
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

  if (!post) {
    return (
      <Container maxWidth="lg">
        <Box textAlign="center" py={8}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            帖子不存在 😢
          </Typography>
          <Button variant="contained" onClick={() => navigate('/posts')}>
            返回帖子列表
          </Button>
        </Box>
      </Container>
    );
  }

  const imageGalleryItems = post.images?.map(image => ({
    original: image.url,
    thumbnail: image.url,
    description: image.caption,
  })) || [];

  const categories = {
    daily: '日常',
    funny: '搞笑',
    training: '训练',
    health: '健康',
    adventure: '冒险',
    other: '其他',
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/posts')}
          sx={{ mb: 2 }}
        >
          返回帖子列表
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
                {post.title}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Chip 
                  label={categories[post.category] || post.category} 
                  color="primary"
                />
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(post.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VisibilityIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {post.views} 次浏览
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 4 }}>
                {post.content}
              </Typography>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    标签
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {post.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Images */}
              {imageGalleryItems.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    图片
                  </Typography>
                  <ImageGallery 
                    items={imageGalleryItems}
                    showThumbnails={imageGalleryItems.length > 1}
                    showFullscreenButton={true}
                    showPlayButton={false}
                    lazyLoad={true}
                  />
                </Box>
              )}

              {/* Video */}
              {post.video && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    视频
                  </Typography>
                  <ReactPlayer
                    url={post.video.url}
                    width="100%"
                    height="400px"
                    controls
                  />
                </Box>
              )}

              {/* Shared Link */}
              {post.sharedLink && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    分享链接
                  </Typography>
                  <Card 
                    className="link-preview"
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      }
                    }}
                    onClick={() => window.open(post.sharedLink.url, '_blank')}
                  >
                    <Box sx={{ display: 'flex' }}>
                      {post.sharedLink.thumbnail && (
                        <img
                          src={post.sharedLink.thumbnail}
                          alt="Link preview"
                          style={{
                            width: '120px',
                            height: '80px',
                            objectFit: 'cover',
                          }}
                        />
                      )}
                      <Box sx={{ p: 2, flexGrow: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {post.sharedLink.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {post.sharedLink.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            {post.sharedLink.domain}
                          </Typography>
                          <OpenInNewIcon fontSize="small" color="action" />
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    startIcon={liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    onClick={handleLike}
                    color={liked ? "error" : "primary"}
                    variant={liked ? "contained" : "outlined"}
                  >
                    {post.likes} 喜欢
                  </Button>
                  <Button
                    startIcon={<ShareIcon />}
                    onClick={handleShare}
                    variant="outlined"
                  >
                    分享
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 24 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                关于这篇帖子
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    发布时间
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(post.createdAt), 'yyyy年MM月dd日', { locale: zhCN })}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    分类
                  </Typography>
                  <Typography variant="body1">
                    {categories[post.category] || post.category}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    浏览次数
                  </Typography>
                  <Typography variant="body1">
                    {post.views} 次
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    获得喜欢
                  </Typography>
                  <Typography variant="body1">
                    {post.likes} 个
                  </Typography>
                </Box>
                {post.images && post.images.length > 0 && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      图片数量
                    </Typography>
                    <Typography variant="body1">
                      {post.images.length} 张
                    </Typography>
                  </Box>
                )}
                {post.video && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      包含视频
                    </Typography>
                    <Typography variant="body1">
                      是
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PostDetail;