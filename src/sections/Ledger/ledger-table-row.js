import { fDate, fDateTime } from 'src/utils/format-time';
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

const LedgerTableRow = ({
  TABLE_HEAD,
  row,
  selected,
  onSelectRow,
  table,
  confirm,
  visibleColumns,
}) => {
  const popover = usePopover();
  console.log('row in UserMgtL ', visibleColumns);

  //
  return (
    <TableRow hover selected={selected}>
      {TABLE_HEAD.map(
        (column) =>
          visibleColumns[column.id] && (
            <TableCell key={column.id}>
              {renderCellContent({
                columnId: column.id,
                row,
              })}
            </TableCell>
          )
      )}
    </TableRow>
  );
};

function renderCellContent({ columnId, row }) {
  switch (columnId) {
    case 'transaction_id':
      return (
        <TableCell>
          <ListItemText
            primary={row?.transaction_id ? row.transaction_id : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
      );
    case 'type':
      return (
        <TableCell>
          <ListItemText
            primary={row?.type ? row.type : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
      );
    case 'creditedAmount':
      return (
        <TableCell>
          <ListItemText
            primary={row?.creditedAmount ? row.creditedAmount : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
      );
    case 'debitedAmount':
      return (
        <TableCell>
          <ListItemText
            primary={row?.debitedAmount ? row.debitedAmount : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
      );
    case 'status':
      return (
        <TableCell>
          <ListItemText
            primary={row?.status ? row.status : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
      );
    case 'source':
      return (
        <TableCell>
          <ListItemText
            primary={row?.source ? row.source : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
      );
    case 'purpose':
      return (
        <TableCell>
          <ListItemText
            primary={row?.purpose ? row.purpose : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
      );
    case 'from_bank_acc':
      return (
        <TableCell>
          <ListItemText
            primary={row?.from_bank_acc ? row.from_bank_acc : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
      );
    case 'to_bank_acc':
      return (
        <TableCell>
          <ListItemText
            primary={row?.to_bank_acc ? row.to_bank_acc : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
      );
    case 'invoice':
      return (
        <TableCell>
          <ListItemText
            primary={row?.invoice ? row.invoice : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
      );
    case 'time_date':
      return (
        <TableCell>
          <ListItemText
            primary={row?.time_date ? fDateTime(row.time_date) : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
      );
    default:
      return (
        <ListItemText
          primary={row[columnId] || '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
        />
      );
  }
}
LedgerTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  table: PropTypes.any,
  confirm: PropTypes.object,
  visibleColumns: PropTypes.any,
  TABLE_HEAD: PropTypes.any,
};

export default LedgerTableRow;
