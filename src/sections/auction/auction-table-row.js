import { fDate } from 'src/utils/format-time';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import CustomDialog from 'src/components/Dialog/dialog';
import { useState } from 'react';
import BuyIrrModel from './buy-irr-model';
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

//
const AuctionTableRow = ({ row, selected, onSelectRow, table, confirm }) => {
  const [buyModel, setBuyModel] = useState(false);
  const TextButton = styled(Button)(({ theme }) => ({
    textAlign: 'center',
    textTransform: 'none',
    padding: theme.spacing(1),
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '&:active': {
      backgroundColor: 'transparent',
    },
  }));
  const theme = useTheme();
  const popover = usePopover();
  const rowConfirm = useBoolean();
  // const approveConfirm = useBoolean();
  // const RejectConfi = useBoolean();
  const invoicePrincipleAmt = row?.Invoice_principle_amt;
  const invoiceNoOfPartitions = row?.Invoice_no_of_partitions;
  const perUnitValue =
    typeof invoicePrincipleAmt === 'number' &&
    typeof invoiceNoOfPartitions === 'number' &&
    invoiceNoOfPartitions !== 0
      ? invoicePrincipleAmt / invoiceNoOfPartitions
      : 0;
  return (
    <TableRow hover selected={selected}>
      {/* <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}
      <TableCell>
        {/* <TextButton> */}

        <ListItemText
          onClick={() => alert('wiww')}
          primary={row?.Invoice_id || '--'}
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
                fontSize: '1.3rem', // Adjust this value as needed
              },
            },
          }}
        />
        {/* </TextButton> */}
      </TableCell>
      <TableCell>
        <ListItemText
          primary={row?.Invoice_expiration_time ? fDate(row?.Invoice_expiration_time) : '--'}
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
          primary={
            row?.Invoice_remaining_partitions
              ? `${row?.Invoice_remaining_partitions}\xa0Units`
              : '--'
          }
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondary={`Per Unit Value: ${perUnitValue}`}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell>
        <ListItemText
          primary={row?.Invoice_principle_amt ? row?.Invoice_principle_amt : '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      </TableCell>
      <TableCell>
        <ListItemText
          primary={row?.Invoice_interest ? `${row?.Invoice_interest} %` : '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: false, align: 'center', pr: 10 }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell sx={{ pr: 0 }}>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{
          width: 'auto',
          backgroundColor: '#e4e6ed',
          '& .MuiPopover-arrow': {
            color: 'black',
          },
        }}
      >
        <MenuItem>
          <Iconify icon="solar:eye-bold" />
          View Invoice
        </MenuItem>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <MenuItem onClick={() => setBuyModel(true)}>
          <Iconify icon="solar:eye-bold" />
          Buy / IRR Calculator
        </MenuItem>
        {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}
      </CustomPopover>
      <CustomDialog
        openFlag={buyModel}
        setonClose={() => setBuyModel(false)}
        placeHolder="IRR Calculator for Buying"
        component={<BuyIrrModel row={row} />}
      />
    </TableRow>
  );
};
AuctionTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  table: PropTypes.any,
  confirm: PropTypes.object,
};

export default AuctionTableRow;
