import { LoadingButton } from '@mui/lab';
import { fDate } from 'src/utils/format-time';
import PropTypes from 'prop-types';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Iconify from 'src/components/iconify';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import CustomDialog from 'src/components/Dialog/dialog';
import { useState, useRef } from 'react';
// import BuyIrrModel from './buy-irr-model';
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

//
const AuctionTableRow = ({ filter, row, selected, onSelectRow, table, confirm }) => {
  const WithdrawConfirm = useBoolean();
  const [invoiceModel, setInvoiceModel] = useState(false);
  const anchorRef = useRef(null);
  const popover = usePopover();
  console.log('Filter in Auction: ', filter);
  if (filter === 'CanBuy') {
    return (
      <TableRow hover selected={selected}>
        <TableCell /** Invoice Primary Id */>
          <ListItemText
            onClick={() => setInvoiceModel(true)}
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
        </TableCell>
        <TableCell /** Invoice  Secondary ID */>
          <ListItemText
            primary={row?.Invoice_id ? row?.Invoice_id : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell /** Invoice  Post For sale ID */>
          <ListItemText
            primary={row?.post_for_sellID ? row?.post_for_sellID : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell /** Sale  Remaining Units */>
          <ListItemText
            primary={row?.Invoice_remaining_units ? row?.Invoice_remaining_units : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell /** Sale Per Unit Price */>
          <ListItemText
            primary={row?.Invoice_per_unit_price ? row?.Invoice_per_unit_price : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell /** Sale Total Price */>
          <ListItemText
            primary={row?.Invoice_total_price ? row?.Invoice_total_price : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell /** Sale Start Date */>
          <ListItemText
            primary={row?.Invoice_from_date ? row?.Invoice_from_date : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell /** Sale End Date */>
          <ListItemText
            primary={row?.Invoice_to_date ? row?.Invoice_to_date : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell /** Invoice Expiration Date */>
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
        <TableCell /** Invoice XIRR */>
          <ListItemText
            primary={row?.Invoice_xirr ? row?.Invoice_xirr : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell sx={{ pr: 0 }} /** ACTIONS */>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  }
  if (filter === 'Brought') {
    return (
      <TableRow hover selected={selected}>
        <TableCell /** Invoice Primary Id */>
          <ListItemText
            onClick={() => setInvoiceModel(true)}
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
        </TableCell>
        <TableCell /** Invoice  Secondary ID */>
          <ListItemText
            primary={row?.Invoice_id ? row?.Invoice_id : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell /** Invoice  NAME */>
          <ListItemText
            primary={row?.Invoice_name ? row?.Invoice_name : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell /** Purchased Total Units */>
          <ListItemText
            primary={row?.Purchased_no_of_units ? row?.Purchased_no_of_units : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell /** Purchased_remaining_units */>
          <ListItemText
            primary={row?.Purchased_remaining_units ? row?.Purchased_remaining_units : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell /** Purchased Per Unit Price */>
          <ListItemText
            primary={row?.Purchased_per_unit_price ? row?.Purchased_per_unit_price : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell /** Invoice_interest */>
          <ListItemText
            primary={row?.Invoice_interest ? row?.Invoice_interest : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell /** Invoice XIRR */>
          <ListItemText
            primary={row?.Invoice_xirr ? row?.Invoice_xirr : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell /** Invoice IRR */>
          <ListItemText
            primary={row?.Invoice_irr ? row?.Invoice_irr : '--'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell /** Invoice Expiration Date */>
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
        <TableCell sx={{ pr: 0 }} /** ACTIONS */>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow hover selected={selected}>
      <TableCell /** Invoice Primary Id */>
        <ListItemText
          onClick={() => setInvoiceModel(true)}
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
      </TableCell>
      <TableCell /** Invoice  Secondary ID */>
        <ListItemText
          primary={row?.Invoice_id ? row?.Invoice_id : '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell /** Invoice  Post For sale ID */>
        <ListItemText
          primary={row?.post_for_sellID ? row?.post_for_sellID : '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell /** Sale Start Date */>
        <ListItemText
          primary={row?.Posted_from_date ? row?.Posted_from_date : '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell /** Sale End Date */>
        <ListItemText
          primary={row?.Posted_from_date ? row?.Posted_from_date : '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell /** Sale  Total Units */>
        <ListItemText
          primary={row?.Posted_no_of_units ? row?.Posted_no_of_units : '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell /** Sale  Remaining Units */>
        <ListItemText
          primary={row?.Posted_remaining_units ? row?.Posted_remaining_units : '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell /** Sale Per Unit Price */>
        <ListItemText
          primary={row?.Posted_per_unit_price ? row?.Posted_per_unit_price : '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell /** Sale Total Price */>
        <ListItemText
          primary={row?.Posted_total_price ? row?.Posted_total_price : '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell /** Invoice Interest */>
        <ListItemText
          primary={row?.Invoice_interest ? row?.Invoice_interest : '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell /** Invoice XIRR */>
        <ListItemText
          primary={row?.Invoice_xirr ? row?.Invoice_xirr : '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell /** Invoice IRR */>
        <ListItemText
          primary={row?.Invoice_irr ? row?.Invoice_irr : '--'}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell /** Invoice Expiration Date */>
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

      <TableCell sx={{ pr: 0 }} /** ACTIONS */>
        <IconButton
          ref={anchorRef}
          color={popover.open ? 'inherit' : 'default'}
          onClick={popover.onOpen}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
      <CustomPopover
        open={popover.open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
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

AuctionTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  table: PropTypes.any,
  confirm: PropTypes.object,
  filter: PropTypes.string,
};

export default AuctionTableRow;
