import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Avatar,
  Paper,
  Divider,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Visibility as VisibilityIcon,
  Pets as PetsIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Article as ArticleIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import axios from 'axios';

const Home = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentAlbums, setRecentAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, albumsRes] = await Promise.all([
          axios.get('/api/posts?limit=6'),
          axios.get('/api/albums?limit=4'),
        ]);
        setRecentPosts(postsRes.data.posts);
        setRecentAlbums(albumsRes.data.albums);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const heroImageUrl = "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url(${heroImageUrl})`,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(106, 54, 30, 0.6)',
          }}
        />
        <Grid container>
          <Grid item md={6}>
            <Box
              sx={{
                position: 'relative',
                p: { xs: 3, md: 6 },
                pr: { md: 0 },
              }}
            >
              <Typography 
                component="h1" 
                variant="h3" 
                color="inherit" 
                gutterBottom
                sx={{ fontWeight: 700, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
              >
                🐾 毛孩子的温馨小屋
              </Typography>
              <Typography 
                variant="h5" 
                color="inherit" 
                paragraph
                sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
              >
                记录我家比格犬和红棕色短毛腊肠犬的美好时光
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <Chip 
                  icon={<PetsIcon />} 
                  label="比格犬" 
                  sx={{ 
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    fontWeight: 600,
                  }} 
                />
                <Chip 
                  icon={<PetsIcon />} 
                  label="腊肠犬" 
                  sx={{ 
                    backgroundColor: 'secondary.main',
                    color: 'secondary.contrastText',
                    fontWeight: 600,
                  }} 
                />
              </Box>
              <Button 
                variant="contained" 
                size="large"
                component={RouterLink}
                to="/posts"
                sx={{ 
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                浏览帖子 🐕
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Blog Introduction */}
      <Box sx={{ mb: 6 }}>
        <Card sx={{ p: 4, textAlign: 'center', backgroundColor: 'rgba(223, 174, 117, 0.1)' }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              backgroundColor: 'primary.main',
              fontSize: '2rem',
            }}
          >
            🐶
          </Avatar>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            欢迎来到我们的温馨小家
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.8 }}>
            这里是我和我的两个毛孩子的日常记录：一只活泼可爱的比格犬和一只温柔的红棕色短毛腊肠犬。
            我们会在这里分享他们的日常生活、有趣的瞬间、训练心得，以及和他们一起度过的美好时光。
            每一张照片、每一个视频都承载着我们之间深深的爱与陪伴。
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" color="text.secondary">
            🐾 用心记录，用爱分享 🐾
          </Typography>
        </Card>
      </Box>

      {/* Recent Posts */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ArticleIcon sx={{ mr: 1, color: 'primary.main', fontSize: '2rem' }} />
            最新帖子
          </Typography>
          <Button 
            component={RouterLink} 
            to="/posts"
            variant="outlined"
            sx={{ borderRadius: 3 }}
          >
            查看全部
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          {recentPosts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                {post.images && post.images.length > 0 && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.images[0].url}
                    alt={post.title}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {post.content.length > 100 
                      ? `${post.content.substring(0, 100)}...` 
                      : post.content
                    }
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Chip 
                      label={post.category} 
                      size="small" 
                      sx={{ backgroundColor: 'primary.light' }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(post.createdAt), 'MM月dd日', { locale: zhCN })}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <FavoriteIcon fontSize="small" color="error" />
                        <Typography variant="caption">{post.likes}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <VisibilityIcon fontSize="small" color="action" />
                        <Typography variant="caption">{post.views}</Typography>
                      </Box>
                    </Box>
                    <Button 
                      size="small" 
                      component={RouterLink} 
                      to={`/posts/${post._id}`}
                      sx={{ borderRadius: 2 }}
                    >
                      阅读全文
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Recent Albums */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <PhotoLibraryIcon sx={{ mr: 1, color: 'secondary.main', fontSize: '2rem' }} />
            最新相册
          </Typography>
          <Button 
            component={RouterLink} 
            to="/albums"
            variant="outlined"
            color="secondary"
            sx={{ borderRadius: 3 }}
          >
            查看全部
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          {recentAlbums.map((album) => (
            <Grid item xs={12} sm={6} md={3} key={album._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={album.cover?.url || (album.images[0]?.url) || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={album.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                    {album.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {album.images.length} 张照片
                  </Typography>
                  <Button 
                    size="small" 
                    component={RouterLink} 
                    to={`/albums/${album._id}`}
                    sx={{ borderRadius: 2 }}
                  >
                    查看相册
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;