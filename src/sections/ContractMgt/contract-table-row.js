import { fDate } from 'src/utils/format-time';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import CustomDialog from 'src/components/Dialog/dialog';
import { useRef, useState } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingButton } from '@mui/lab';
//

import FractionalizeModel from './fractionalise-model';
import InvoiceModel from '../InvoiceModel/view';
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

const ContractTableRow = ({
  filter,
  row,
  selected,
  onSelectRow,
  table,
  confirm,
  visibleColumns,
  TABLE_HEAD_NON_FRACTIONALIZED,
  TABLE_HEAD_FRACTIONALIZED,
}) => {
  const [invoiceModel, setInvoiceModel] = useState(false);
  const anchorRef_Fractionalized = useRef(null);
  const anchorRef_NonFractionalized = useRef(null);
  const popover = usePopover();
  const popoverFractionalized = usePopover();
  const popoverNonFractionalized = usePopover();
  const WithdrawConfirm = useBoolean();
  const [FractionalModel, setFractionalModel] = useState(false);

  const currentTableHead =
    filter === 'unfractionalized' ? TABLE_HEAD_NON_FRACTIONALIZED : TABLE_HEAD_FRACTIONALIZED;
  // unfractionalized;
  console.log('ContractRow: ', row);
  if (filter === 'unfractionalized') {
    return (
      <TableRow hover selected={selected}>
        {currentTableHead.map(
          (column) =>
            visibleColumns[column.id] && (
              <TableCell key={column.id}>
                {renderCellContent({
                  columnId: column.id,
                  row,
                  anchorRef_NonFractionalized,
                  popoverNonFractionalized,
                  popoverFractionalized,
                  WithdrawConfirm,
                  anchorRef_Fractionalized,
                })}
              </TableCell>
            )
        )}

        <CustomPopover
          open={popoverNonFractionalized.open}
          onClose={popoverNonFractionalized.onClose}
          anchorEl={anchorRef_NonFractionalized.current}
          placement="bottom-end"
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
          {/* <MenuItem
            onClick={() => {
              WithdrawConfirm.onTrue();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            Withdraw Sale
          </MenuItem> */}
        </CustomPopover>
        <CustomDialog
          openFlag={FractionalModel}
          setonClose={() => {
            setFractionalModel(false);
            popover.onClose();
          }}
          placeHolder="Post For Sale"
          component={
            <FractionalizeModel
              onClose={() => {
                setFractionalModel(false);
                popover.onClose();
              }}
              row={row}
            />
          }
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
        <CustomDialog
          openFlag={invoiceModel}
          maxWidth="xl"
          setonClose={() => setInvoiceModel(false)}
          placeHolder="Borrower's Data"
          component={<InvoiceModel />}
        />
      </TableRow>
    );
  }

  return (
    <TableRow hover selected={selected}>
      {currentTableHead.map(
        (column) =>
          visibleColumns[column.id] && (
            <TableCell key={column.id}>
              {renderCellContent({
                columnId: column.id,
                row,
                anchorRef_NonFractionalized,
                popoverNonFractionalized,
                popoverFractionalized,
                WithdrawConfirm,
                anchorRef_Fractionalized,
              })}
            </TableCell>
          )
      )}
      <CustomPopover
        open={popoverFractionalized.open}
        anchorEl={anchorRef_Fractionalized.current}
        placement="bottom-end"
        onClose={popoverFractionalized.onClose}
        arrow="right-top"
        sx={{
          width: 'auto',
          backgroundColor: '#e4e6ed',
          '& .MuiPopover-arrow': {
            color: 'black',
          },
        }}
      >
        {/* <MenuItem onClick={() => setFractionalModel(true)}>
          <Iconify icon="solar:eye-bold" />
          Post for Sale
        </MenuItem> */}
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
      {/* <CustomDialog
        openFlag={FractionalModel}
        setonClose={() => setFractionalModel(false)}
        placeHolder="Post For Sale"
        component={<FractionalizeModel row={row} />}
      /> */}
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
      <CustomDialog
        openFlag={invoiceModel}
        maxWidth="xl"
        setonClose={() => setInvoiceModel(false)}
        placeHolder="Borrower's Data"
        component={<InvoiceModel />}
      />
    </TableRow>
  );
};
function renderCellContent({
  columnId,
  row,
  anchorRef_NonFractionalized,
  popoverNonFractionalized,
  popoverFractionalized,
  WithdrawConfirm,
  anchorRef_Fractionalized,
}) {
  switch (columnId) {
    case 'primary_invoice_id':
      return (
        <ListItemText
          // onClick={() => setInvoiceModel(true)}
          primary={row?.primary_invoice_id || '--'}
          primaryTypographyProps={{
            typography: 'subtitle',
            noWrap: true,
            align: 'center',
            style: { textDecoration: 'underline', cursor: 'pointer' },
          }}
          sx={{
            '&:hover': {
              '& .MuiTypography-root': {
                fontSize: '1.3rem',
              },
            },
          }}
        />
      );
    case 'invoice_id':
      return (
        <ListItemText
          primary={row?.invoice_id || '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      );
    case 'post_for_saleID':
      return (
        <ListItemText
          primary={row?.post_for_saleID || '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      );
    case 'product_name':
      return (
        <ListItemText
          primary={row?.product_name || '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      );
    case 'buyer_poc_name':
      return (
        <ListItemText
          primary={row?.buyer_poc_name || '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      );
    case 'tenure_in_days':
      return (
        <ListItemText
          primary={row?.tenure_in_days || '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
        />
      );
    case 'expiration_time':
      return (
        <ListItemText
          primary={row?.expiration_time ? fDate(row.expiration_time) : '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
        />
      );
    case 'total_price':
      return (
        <ListItemText
          primary={row?.total_price || '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
        />
      );
    case 'principle_amt':
      return (
        <ListItemText
          primary={row?.principle_amt || '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
        />
      );
    case 'remaining_amt':
      return (
        <ListItemText
          primary={row?.remaining_amt || '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
        />
      );
    case 'per_unit_price':
      return (
        <ListItemText
          primary={row?.per_unit_price || '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
        />
      );
    case 'no_of_units':
      return (
        <ListItemText
          primary={row?.no_of_units || '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
        />
      );
    case 'remaining_units':
      return (
        <ListItemText
          primary={row?.remaining_units || '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
        />
      );
    case 'xirr':
      return (
        <ListItemText
          primary={row?.xirr || '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
        />
      );
    case 'interest_rate':
      return (
        <ListItemText
          primary={row?.interest_rate || '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      );
    case 'interest':
      return (
        <ListItemText
          primary={row?.interest || '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
        />
      );
    case 'from_date':
      return (
        <ListItemText
          primary={row?.from_date || '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
        />
      );
    case 'to_date':
      return (
        <ListItemText
          primary={row?.to_date || '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
        />
      );
    case 'actions_nonFractionalized':
      return (
        <TableCell sx={{}}>
          <IconButton
            ref={anchorRef_NonFractionalized}
            sx={{}}
            color={popoverNonFractionalized.open ? 'inherit' : 'default'}
            onClick={popoverNonFractionalized.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      );
    case 'actions_fractionalized':
      return (
        <TableCell sx={{}}>
          <IconButton
            ref={anchorRef_Fractionalized}
            sx={{}}
            color={popoverFractionalized.open ? 'inherit' : 'default'}
            onClick={popoverFractionalized.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
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
ContractTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  table: PropTypes.any,
  confirm: PropTypes.object,
  filter: PropTypes.string,
  visibleColumns: PropTypes.object,
  TABLE_HEAD_NON_FRACTIONALIZED: PropTypes.array,
  TABLE_HEAD_FRACTIONALIZED: PropTypes.array,
};

export default ContractTableRow;

// const unfractionalizedrows = () => {
//   return (
//     <TableCell /** Primary Invoice ID */>
//           <ListItemText
//             onClick={() => setInvoiceModel(true)}
//             primary={row?.primary_invoice_id || '--'}
//             primaryTypographyProps={{
//               typography: 'subtitle',
//               noWrap: true,
//               align: 'center',
//               style: { textDecoration: 'underline', cursor: 'pointer' },
//             }}
//             secondaryTypographyProps={{
//               mt: 0.5,
//               component: 'span',
//               typography: 'caption',
//             }}
//             sx={{
//               '&:hover': {
//                 '& .MuiTypography-root': {
//                   fontSize: '1.3rem', // Adjust this value as needed
//                 },
//               },
//             }}
//           />
//         </TableCell>
//         <TableCell /** Product Name */>
//           <ListItemText
//             primary={row?.product_name ? row.product_name : '--'}
//             primaryTypographyProps={{ typography: 'body2', noWrap: true }}
//             secondaryTypographyProps={{
//               mt: 0.5,
//               component: 'span',
//               typography: 'caption',
//             }}
//           />
//         </TableCell>
//         <TableCell /** Tenure in days */>
//           <ListItemText
//             primary={row?.tenure_in_days ? row.tenure_in_days : '--'}
//             primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
//             secondaryTypographyProps={{
//               mt: 0.5,
//               component: 'span',
//               typography: 'caption',
//             }}
//           />
//         </TableCell>
//         <TableCell /** Expiration Date */>
//           <ListItemText
//             primary={row?.expiration_time ? fDate(row.expiration_time) : '--'}
//             primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
//             secondaryTypographyProps={{
//               mt: 0.5,
//               component: 'span',
//               typography: 'caption',
//             }}
//           />
//         </TableCell>
//         <TableCell /** Principle Amount */>
//           <ListItemText
//             primary={row?.principle_amt ? row.principle_amt : '--'}
//             primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
//             secondaryTypographyProps={{
//               mt: 0.5,
//               component: 'span',
//               typography: 'caption',
//             }}
//           />
//         </TableCell>
//         <TableCell /** Remaining Amount */>
//           <ListItemText
//             primary={row?.remaining_amt ? row.remaining_amt : '--'}
//             primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
//             secondaryTypographyProps={{
//               mt: 0.5,
//               component: 'span',
//               typography: 'caption',
//             }}
//           />
//         </TableCell>
//         <TableCell /** interest */>
//           <ListItemText
//             primary={row?.interest_rate ? row.interest_rate : '--'}
//             primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
//             secondaryTypographyProps={{
//               mt: 0.5,
//               component: 'span',
//               typography: 'caption',
//             }}
//           />
//         </TableCell>
//         <TableCell /** IRR */>
//           <ListItemText
//             primary={row?.irr ? row.irr : '--'}
//             primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
//             secondaryTypographyProps={{
//               mt: 0.5,
//               component: 'span',
//               typography: 'caption',
//             }}
//           />
//         </TableCell>
//         <TableCell /** XIRR */>
//           <ListItemText
//             primary={row?.xirr ? row.xirr : '--'}
//             primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
//             secondaryTypographyProps={{
//               mt: 0.5,
//               component: 'span',
//               typography: 'caption',
//             }}
//           />
//         </TableCell>
//   )
// }

// const fractionalizedRow = () => {
//   return (  <TableCell /** Primary Invoice ID */>
//         <ListItemText
//           onClick={() => setInvoiceModel(true)}
//           primary={row?.primary_invoice_id || '--'}
//           primaryTypographyProps={{
//             typography: 'subtitle',
//             noWrap: true,
//             align: 'center',
//             style: { textDecoration: 'underline', cursor: 'pointer' },
//           }}
//           secondaryTypographyProps={{
//             mt: 0.5,
//             component: 'span',
//             typography: 'caption',
//           }}
//           sx={{
//             '&:hover': {
//               '& .MuiTypography-root': {
//                 fontSize: '1.3rem', // Adjust this value as needed
//               },
//             },
//           }}
//         />
//       </TableCell>
//       <TableCell /** Secondary Invoice ID */>
//         <ListItemText
//           primary={row?.invoice_id ? row.invoice_id : '--'}
//           primaryTypographyProps={{ typography: 'body2', noWrap: true }}
//           secondaryTypographyProps={{
//             mt: 0.5,
//             component: 'span',
//             typography: 'caption',
//           }}
//         />
//       </TableCell>
//       <TableCell /** Post for Sale ID */>
//         <ListItemText
//           primary={row?.post_for_saleID ? row.post_for_saleID : '--'}
//           primaryTypographyProps={{ typography: 'body2', noWrap: true }}
//           secondaryTypographyProps={{
//             mt: 0.5,
//             component: 'span',
//             typography: 'caption',
//           }}
//         />
//       </TableCell>
//       <TableCell /** Product Name */>
//         <ListItemText
//           primary={row?.product_name ? row.product_name : '--'}
//           primaryTypographyProps={{ typography: 'body2', noWrap: true }}
//           secondaryTypographyProps={{
//             mt: 0.5,
//             component: 'span',
//             typography: 'caption',
//           }}
//         />
//       </TableCell>
//       <TableCell /** Tenure in days */>
//         <ListItemText
//           primary={row?.tenure_in_days ? row.tenure_in_days : '--'}
//           primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
//           secondaryTypographyProps={{
//             mt: 0.5,
//             component: 'span',
//             typography: 'caption',
//           }}
//         />
//       </TableCell>
//       <TableCell /** Expiration Date */>
//         <ListItemText
//           primary={row?.expiration_time ? fDate(row.expiration_time) : '--'}
//           primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
//           secondaryTypographyProps={{
//             mt: 0.5,
//             component: 'span',
//             typography: 'caption',
//           }}
//         />
//       </TableCell>
//       <TableCell /** Total Price */>
//         <ListItemText
//           primary={row?.total_price ? row.total_price : '--'}
//           primaryTypographyProps={{ typography: 'body2', noWrap: true }}
//           secondaryTypographyProps={{
//             mt: 0.5,
//             component: 'span',
//             typography: 'caption',
//           }}
//         />
//       </TableCell>
//       <TableCell /** Price Per Unit */>
//         <ListItemText
//           primary={row?.per_unit_price ? row.per_unit_price : '--'}
//           primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
//           secondaryTypographyProps={{
//             mt: 0.5,
//             component: 'span',
//             typography: 'caption',
//           }}
//         />
//       </TableCell>
//       <TableCell /** Total Units */>
//         <ListItemText
//           primary={row?.no_of_units ? row?.no_of_units : '--'}
//           primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
//           secondaryTypographyProps={{
//             mt: 0.5,
//             component: 'span',
//             typography: 'caption',
//           }}
//         />
//       </TableCell>
//       <TableCell /** Remaining Units */>
//         <ListItemText
//           primary={row?.remaining_units ? row?.remaining_units : '--'}
//           primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
//           secondaryTypographyProps={{
//             mt: 0.5,
//             component: 'span',
//             typography: 'caption',
//           }}
//         />
//       </TableCell>
//       <TableCell /** IRR */>
//         <ListItemText
//           primary={row?.irr ? row.irr : '--'}
//           primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
//           secondaryTypographyProps={{
//             mt: 0.5,
//             component: 'span',
//             typography: 'caption',
//           }}
//         />
//       </TableCell>
//       <TableCell /** XIRR */>
//         <ListItemText
//           primary={row?.xirr ? row.xirr : '--'}
//           primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
//           secondaryTypographyProps={{
//             mt: 0.5,
//             component: 'span',
//             typography: 'caption',
//           }}
//         />
//       </TableCell>
//       <TableCell /** interest */>
//         <ListItemText
//           primary={row?.interest_rate ? row.interest_rate : '--'}
//           primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
//           secondaryTypographyProps={{
//             mt: 0.5,
//             component: 'span',
//             typography: 'caption',
//           }}
//         />
//       </TableCell>
//       <TableCell /** From Date */>
//         <ListItemText
//           primary={row?.from_date ? row.from_date : '--'}
//           primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
//           secondaryTypographyProps={{
//             mt: 0.5,
//             component: 'span',
//             typography: 'caption',
//           }}
//         />
//       </TableCell>
//       <TableCell /** To Date */>
//         <ListItemText
//           primary={row?.to_date ? row.to_date : '--'}
//           primaryTypographyProps={{ typography: 'body2', noWrap: true, align: 'center' }}
//           secondaryTypographyProps={{
//             mt: 0.5,
//             component: 'span',
//             typography: 'caption',
//           }}
//         />
//       </TableCell>)
// }
