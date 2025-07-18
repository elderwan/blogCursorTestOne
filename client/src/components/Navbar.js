import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Article as ArticleIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Add as AddIcon,
  Pets as PetsIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: '首页', path: '/', icon: <HomeIcon /> },
    { text: '帖子', path: '/posts', icon: <ArticleIcon /> },
    { text: '相册', path: '/albums', icon: <PhotoLibraryIcon /> },
    { text: '写帖子', path: '/create-post', icon: <AddIcon /> },
    { text: '创建相册', path: '/create-album', icon: <PhotoLibraryIcon /> },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, textAlign: 'center', borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PetsIcon sx={{ mr: 1, color: 'primary.main' }} />
          毛孩子的温馨小屋
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            key={item.text} 
            component={RouterLink} 
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              backgroundColor: location.pathname === item.path ? 'primary.light' : 'transparent',
              '&:hover': {
                backgroundColor: 'primary.light',
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.dark' : 'text.secondary' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ 
                color: location.pathname === item.path ? 'primary.dark' : 'text.primary' 
              }} 
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: 'background.paper', color: 'text.primary' }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              fontWeight: 600,
            }}
          >
            <PetsIcon sx={{ mr: 1, color: 'primary.main', fontSize: '2rem' }} />
            毛孩子的温馨小屋
            <Box sx={{ ml: 1, display: 'inline-block' }}>
              🐕 🐾
            </Box>
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                    backgroundColor: location.pathname === item.path ? 'primary.light' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;