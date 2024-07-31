import { fDate } from 'src/utils/format-time';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import CustomDialog from 'src/components/Dialog/dialog';
import { useState } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingButton } from '@mui/lab';
//

import FractionalizeModel from './fractionalise-model';
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

const ContractTableRow = ({ row, selected, onSelectRow, table, confirm }) => {
  const popover = usePopover();
  const WithdrawConfirm = useBoolean();
  const [FractionalModel, setFractionalModel] = useState(false);
  console.log('row: ', row);
  return (
    <TableRow hover selected={selected}>
      <TableCell>
        <ListItemText
          onClick={() => alert('wiww')}
          primary={row?.primary_invoice_id || '--'}
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
      </TableCell>
      <TableCell>
        <ListItemText
          primary={row?.product_name ? row.product_name : '--'}
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
          primary={row?.principle_amt ? row.principle_amt : '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell>
        <ListItemText
          primary={row?.tenure_in_days ? row.tenure_in_days : '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell>
        <ListItemText
          primary={row?.type === 'fractionalized' ? row?.no_of_partitions : '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
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
            row?.type === 'fractionalized' &&
            typeof row?.principle_amt === 'number' &&
            typeof row?.no_of_partitions === 'number' &&
            row.no_of_partitions !== 0
              ? (row.principle_amt / row.no_of_partitions).toFixed(2)
              : '--'
          }
          primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell sx={{}}>
        <IconButton sx={{}} color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
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
        <MenuItem onClick={() => setFractionalModel(true)}>
          <Iconify icon="solar:eye-bold" />
          Post for Sale
        </MenuItem>
        <MenuItem
          onClick={() => {
            WithdrawConfirm.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Withdraw Sale
        </MenuItem>
      </CustomPopover>
      <CustomDialog
        openFlag={FractionalModel}
        setonClose={() => setFractionalModel(false)}
        placeHolder="Post For Sale"
        component={<FractionalizeModel row={row} />}
      />
      <ConfirmDialog
        open={WithdrawConfirm.value}
        onClose={WithdrawConfirm.onFalse}
        title="Withdraw"
        content={<>Are you sure want to withdraw this sale?</>}
        action={
          <LoadingButton
            variant="contained"
            color="error"
            onClick={async () => {
              // await HandoverMutation(row?.id);
              WithdrawConfirm.onFalse();
            }}
            // disabled={HandoverIsSuccess}
            // loading={HandoverIsLoading}
          >
            Withdraw
          </LoadingButton>
        }
      />
    </TableRow>
  );
};
ContractTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  table: PropTypes.any,
  confirm: PropTypes.object,
};

export default ContractTableRow;
