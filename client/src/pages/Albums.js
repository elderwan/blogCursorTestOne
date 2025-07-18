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
  Pagination,
  CircularProgress,
} from '@mui/material';
import {
  PhotoLibrary as PhotoLibraryIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import axios from 'axios';

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAlbums();
  }, [page]);

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/albums', {
        params: { page, limit: 12 }
      });
      setAlbums(response.data.albums);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  if (loading && albums.length === 0) {
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
          <PhotoLibraryIcon sx={{ mr: 2, color: 'secondary.main', fontSize: '3rem' }} />
          相册集合 📸
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="body1" color="text.secondary">
            记录毛孩子们的美好瞬间
          </Typography>
          <Button 
            variant="contained" 
            component={RouterLink} 
            to="/create-album"
            startIcon={<AddIcon />}
            sx={{ borderRadius: 3 }}
          >
            创建新相册
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
            {albums.map((album) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={album._id}>
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
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      album.cover?.url || 
                      (album.images[0]?.url) || 
                      'https://via.placeholder.com/300x200?text=No+Image'
                    }
                    alt={album.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                      {album.title}
                    </Typography>
                    {album.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                        {album.description.length > 80 
                          ? `${album.description.substring(0, 80)}...` 
                          : album.description
                        }
                      </Typography>
                    )}
                    <Box sx={{ mt: 'auto' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {album.images.length} 张照片 · {format(new Date(album.createdAt), 'MM月dd日', { locale: zhCN })}
                      </Typography>
                      <Button 
                        size="small" 
                        component={RouterLink} 
                        to={`/albums/${album._id}`}
                        variant="contained"
                        fullWidth
                        sx={{ borderRadius: 2 }}
                      >
                        查看相册
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {albums.length === 0 && (
            <Box textAlign="center" py={8}>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                暂无相册 📷
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                还没有创建任何相册，快来创建第一个相册吧！
              </Typography>
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/create-album"
                sx={{ borderRadius: 3 }}
                startIcon={<AddIcon />}
              >
                创建新相册
              </Button>
            </Box>
          )}

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="secondary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Albums;