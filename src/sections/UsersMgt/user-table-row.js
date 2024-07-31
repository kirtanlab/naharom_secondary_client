import { fDate } from 'src/utils/format-time';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import CustomDialog from 'src/components/Dialog/dialog';
import { useState } from 'react';
import { getSession } from 'src/auth/context/jwt/utils';
//
const { useTheme } = require('@emotion/react');
const {
  TableRow,
  TableCell,
  ListItemText,
  Checkbox,
  styled,
  Button,
  IconButton,
  MenuItem,
  Divider,
} = require('@mui/material');
const { usePopover } = require('src/components/custom-popover');
const { useBoolean } = require('src/hooks/use-boolean');
//

const UserTableRow = ({ row, selected, onSelectRow, table, confirm }) => {
  const popover = usePopover();
  const { accessToken } = getSession();
  async function handleImpersonate(userId) {
    if (!userId) {
      alert('Something went wrong');
      return;
    }
    const newTab = window.open('about:blank', '_blank');
    console.log('setting UserId: ', row?.user_id, accessToken);
    newTab.document.write(`
    <html>
      <head>
        <title>Impersonation</title>
      </head>
      <body>
        <h1>Logging in as impersonated user...</h1>
        <script>
        sessionStorage.setItem('isImpersonate', '${true}');
          sessionStorage.setItem('accessToken', '${accessToken}');
          sessionStorage.setItem('userId', '${row?.user_id}');
        window.location.href = '/dashboard?impersonation=true';
        </script>
      </body>
    </html>
  `);
    newTab.document.close();
  }
  //
  return (
    <TableRow hover selected={selected}>
      <TableCell>
        <ListItemText
          primary={row?.email ? row.email : '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell>
        <ListItemText
          primary={row?.first_name ? row.first_name : '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell>
        <ListItemText
          primary={row?.last_name ? row.last_name : '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell>
        <ListItemText
          primary={row?.company_name ? row.company_name : '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell>
        <ListItemText
          primary={row?.date_of_joining ? fDate(row.date_of_joining) : '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell>
        <ListItemText
          primary={row?.is_admin ? 'Admin' : 'User'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell>
        <ListItemText
          primary={row?.pan_card_no ? row?.pan_card_no : '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell>
        <ListItemText
          onClick={() => handleImpersonate(row?.user_id)}
          primary="Impersonate"
          primaryTypographyProps={{
            typography: 'subtitle',
            noWrap: true,
            align: 'center',
            style: { textDecoration: 'underline', cursor: 'pointer' },
          }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
          sx={{
            '&:hover': {
              '& .MuiTypography-root': {
                fontSize: '1.1rem', // Adjust this value as needed
              },
            },
          }}
        />
      </TableCell>
    </TableRow>
  );
};
UserTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  table: PropTypes.any,
  confirm: PropTypes.object,
};

export default UserTableRow;
