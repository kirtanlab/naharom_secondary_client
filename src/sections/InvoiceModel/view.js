import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  Typography,
} from '@mui/material';
import { ExpandLess, ExpandMore, ChevronLeft, ChevronRight } from '@mui/icons-material';

const drawerWidth = 240;

function InvoiceModel() {
  const [open, setOpen] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState({});

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    setOpenSubMenu({ ...openSubMenu, [menu]: !openSubMenu[menu] });
  };

  const menuItems = [
    { name: 'Dashboard', subMenus: ['Overview', 'Analytics'] },
    { name: 'Users', subMenus: ['List', 'Add User'] },
    { name: 'Reports', subMenus: ['Sales', 'Inventory'] },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: open ? drawerWidth : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={handleDrawerToggle}>
            {open ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Box>
        <List>
          {menuItems.map((item) => (
            <React.Fragment key={item.name}>
              <ListItem button onClick={() => handleMenuClick(item.name)}>
                <ListItemText primary={item.name} />
                {openSubMenu[item.name] ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openSubMenu[item.name]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subMenus.map((subMenu) => (
                    <ListItem button sx={{ pl: 4 }} key={subMenu}>
                      <ListItemText primary={subMenu} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
          marginLeft: open ? `${drawerWidth}px` : 0,
          transition: (theme) =>
            theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Typography variant="h4" gutterBottom>
          {selectedMenu ? `${selectedMenu} Content` : 'Welcome'}
        </Typography>
        <Typography paragraph>
          {selectedMenu
            ? `This area will display data or graphs related to ${selectedMenu}.`
            : 'Select a menu item to view its content.'}
        </Typography>
      </Box>
    </Box>
  );
}

export default InvoiceModel;
