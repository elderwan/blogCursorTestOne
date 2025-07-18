import React from 'react';
import { Box, Typography, Container, Divider } from '@mui/material';
import { Pets as PetsIcon } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        backgroundColor: 'secondary.main', 
        color: 'secondary.contrastText',
        mt: 'auto',
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <PetsIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              毛孩子的温馨小屋
            </Typography>
            <Box sx={{ ml: 1 }}>🐕❤️🐾</Box>
          </Box>
          
          <Divider sx={{ my: 2, borderColor: 'rgba(247, 247, 247, 0.2)' }} />
          
          <Typography variant="body2" sx={{ mb: 1 }}>
            记录我家比格犬和腊肠犬的美好时光 🐶
          </Typography>
          
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2024 毛孩子的温馨小屋. 用爱记录每一个温暖瞬间.
          </Typography>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              🐾 Made with ❤️ for our furry friends
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;