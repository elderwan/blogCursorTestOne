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
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Visibility as VisibilityIcon,
  Article as ArticleIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import axios from 'axios';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('all');

  const categories = [
    { value: 'all', label: '全部' },
    { value: 'daily', label: '日常' },
    { value: 'funny', label: '搞笑' },
    { value: 'training', label: '训练' },
    { value: 'health', label: '健康' },
    { value: 'adventure', label: '冒险' },
    { value: 'other', label: '其他' },
  ];

  useEffect(() => {
    fetchPosts();
  }, [page, category]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
      };
      if (category !== 'all') {
        params.category = category;
      }

      const response = await axios.get('/api/posts', { params });
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  if (loading && posts.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <ArticleIcon sx={{ mr: 2, color: 'primary.main', fontSize: '3rem' }} />
          全部帖子 🐾
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>分类</InputLabel>
            <Select
              value={category}
              label="分类"
              onChange={handleCategoryChange}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button 
            variant="contained" 
            component={RouterLink} 
            to="/create-post"
            sx={{ borderRadius: 3 }}
          >
            写新帖子 ✍️
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {posts.map((post) => (
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
                        label={categories.find(cat => cat.value === post.category)?.label || post.category} 
                        size="small" 
                        sx={{ 
                          backgroundColor: 'primary.light',
                          color: 'primary.contrastText',
                        }}
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

          {posts.length === 0 && (
            <Box textAlign="center" py={8}>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                暂无帖子 😊
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                还没有发布任何帖子，快来写第一篇吧！
              </Typography>
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/create-post"
                sx={{ borderRadius: 3 }}
              >
                写新帖子 ✍️
              </Button>
            </Box>
          )}

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Posts;