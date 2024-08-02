import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  Typography,
  Divider,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

function InvoiceModel() {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [subMenu, setSubMenu] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState({});

  const handleMenuClick = (menu) => {
    console.log('handleMenuClick: ', menu);
    setSelectedMenu(menu);
    setOpenSubMenu({ ...openSubMenu, [menu]: !openSubMenu[menu] });
  };

  const menuItems = [
    { name: 'Dashboard', subMenus: ['Overview', 'Analytics'] },
    { name: 'Users', subMenus: ['List', 'Add User'] },
    { name: 'Reports', subMenus: ['Sales', 'Inventory'] },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', maxHeight: '100%' }}>
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Box sx={{ width: 200, borderRight: 1, borderColor: 'divider', overflowY: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <React.Fragment key={item.name}>
                <ListItem onClick={() => handleMenuClick(item.name)}>
                  <ListItemText primaryTypographyProps={{ fontSize: 17 }} primary={item.name} />
                  {openSubMenu[item.name] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openSubMenu[item.name]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subMenus.map((_subMenu) => (
                      <ListItem sx={{ pl: 4 }} key={_subMenu} onClick={() => setSubMenu(_subMenu)}>
                        <ListItemText
                          primaryTypographyProps={{ fontSize: 15 }}
                          primary={_subMenu}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
                <Divider sx={{ width: 2 }} />
              </React.Fragment>
            ))}
          </List>
        </Box>
        <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
          <Typography variant="h4" gutterBottom>
            {selectedMenu ? `${selectedMenu} Content` : 'Welcome'}
          </Typography>
          <Typography paragraph>
            {selectedMenu
              ? `This area will display data or graphs related to ${subMenu ?? selectedMenu}.`
              : 'Select a menu item to view its content.'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default InvoiceModel;
