// @mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';
import Iconify from 'src/components/iconify';

// components
import { useSettingsContext } from 'src/components/settings';
import { useRouter } from 'src/routes/hooks';
import { getComparator, TableSkeleton, useTable } from 'src/components/table';
import {
  Card,
  Grid,
  Stack,
  Tab,
  Tabs,
  TextField,
  InputAdornment,
  Button,
  Alert,
  AlertTitle,
} from '@mui/material';
import { useAuthContext } from 'src/auth/hooks';
import Scrollbar from 'src/components/scrollbar';
import Label from 'src/components/label';
import { useBoolean } from 'src/hooks/use-boolean';
import { useCallback, useEffect, useState } from 'react';
import { useGetAllInvoicesById } from 'src/queries/auction';

import { applyFilter } from 'src/layouts/_common/searchbar/utils';
import AuctionTableToolbar from './auction-table-toolbar';
import AuctionTable from './auction-table';

// import AllInvoiceData from '../../dummyData/data.json';
// ----------------------------------------------------------------------
const TABLE_HEAD_BUY = [
  { id: 'Invoice_primary_id', label: 'Primary Invoice id', align: 'center' },
  { id: 'Invoice_id', label: 'Secondary Invoice id', align: 'center' },
  { id: 'post_for_sellID', label: 'Sale ID', align: 'center' },
  { id: 'Invoice_remaining_units', label: 'Units for sale', align: 'center' },
  { id: 'Invoice_per_unit_price', label: 'Per Unit Price', align: 'center' },
  { id: 'Invoice_total_price', label: 'Total Sale price', align: 'center' },
  { id: 'Invoice_from_date', label: 'Sale Start Date', align: 'center' },
  { id: 'Invoice_to_date', label: 'Sale End Date', align: 'center' },
  { id: 'Invoice_expiration_time', label: 'Invoice Expiration Date', align: 'center' },
  { id: 'Invoice_xirr', label: 'Annual Xirr' },
  { id: 'actions', label: 'Actions' },
];
const TABLE_HEAD_SELL = [
  { id: 'Invoice_primary_id', label: 'Primary Invoice id', align: 'center' },
  { id: 'Invoice_id', label: 'Secondary Invoice id', align: 'center' },
  { id: 'Invoice_name', label: 'Invoice Name', align: 'center' },
  { id: 'Purchased_no_of_units', label: 'Total units bought' },
  { id: 'Purchased_remaining_units', label: 'Remaining Units' },
  { id: 'Purchased_per_unit_price', label: 'Per Unit Price' },
  { id: 'Invoice_interest', label: 'Total Interest' },
  { id: 'Invoice_xirr', label: 'Annual XIRR' },
  { id: 'Invoice_irr', label: 'Annual IRR' },
  { id: 'Invoice_expiration_time', label: 'Invoice Expiration Date', align: 'center' },
  { id: 'actions', label: 'Actions' },
];
const TABLE_HEAD_POSTED_FOR_SALE = [
  { id: 'Invoice_primary_id', label: 'Primary Invoice id', align: 'center' },
  { id: 'Invoice_id', label: 'Secondary Invoice id', align: 'center' },
  { id: 'post_for_sellID', label: 'Sale ID', align: 'center' },
  { id: 'Posted_from_date', label: 'Start Sale Date' },
  { id: 'Posted_to_date', label: 'End Sale Date' },
  { id: 'Posted_no_of_units', label: 'Total Units in Sale' },
  { id: 'Posted_remaining_units', label: 'Remaining Units in Sale' },
  { id: 'Posted_per_unit_price', label: 'Per Unit Price' },
  { id: 'Posted_total_price', label: 'Total Sale Amount' },
  { id: 'Invoice_interest', label: 'Total Interest' },
  { id: 'Invoice_xirr', label: 'Annual XIRR' },
  { id: 'Invoice_irr', label: 'Annual IRR' },
  { id: 'Invoice_expiration_time', label: 'Invoice Expiration Date', align: 'center' },
  { id: 'actions', label: 'Actions' },
];

export default function AuctionView() {
  const settings = useSettingsContext();
  const { user: userId } = useAuthContext();
  const table = useTable({ defaultOrderBy: 'timeLeft' });

  const {
    data: AllInvoiceData,
    error: AllInvoiceError,
    isLoading: AllInvoiceIsLoading,
    isSuccess: AllInvoiceIsSuccess,
    isError: AllInvoiceIsError,
    status,
    isRefetching,
  } = useGetAllInvoicesById({ userId });
  const denseHeight = table.dense ? 56 : 76;
  if (AllInvoiceIsLoading || isRefetching || AllInvoiceData?.data?.length === 0) {
    return (
      <>
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
          <Typography variant="h4"> Auction </Typography>
          <Grid xs={12} marginTop={2}>
            {[...Array(table.rowsPerPage)].map((i, index) => (
              <TableSkeleton key={index} sx={{ height: denseHeight }} />
            ))}
          </Grid>
        </Container>
      </>
    );
  }
  if (AllInvoiceIsError || !AllInvoiceData) {
    console.log('in error!');

    return (
      <>
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
          <Typography variant="h4"> Auction </Typography>
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => console.log('closed alert')}>
            <AlertTitle>Error</AlertTitle>
            Oops! Check your internet connectivity
          </Alert>
          <Grid xs={12} marginTop={2}>
            {[...Array(table.rowsPerPage)].map((i, index) => (
              <TableSkeleton key={index} sx={{ height: denseHeight }} />
            ))}
          </Grid>
        </Container>
      </>
    );
  }
  console.log('AllInvoiceDataTest: ', AllInvoiceData.invoices);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> Auctions </Typography>
      <Grid xs={12} marginTop={2}>
        {/* <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      /> */}
        <AuctionTable
          tableData={AllInvoiceData.invoices}
          TABLE_HEAD_BUY={TABLE_HEAD_BUY}
          TABLE_HEAD_SELL={TABLE_HEAD_SELL}
          TABLE_HEAD_POSTED_FOR_SALE={TABLE_HEAD_POSTED_FOR_SALE}
        />
      </Grid>
    </Container>
  );
}
