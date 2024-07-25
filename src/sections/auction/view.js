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
const TABLE_HEAD = [
  { id: 'Invoice_id', label: 'Invoice id', align: 'center' },
  // { id: 'timeLeft', label: 'Time Left' },
  { id: 'Invoice_expiration_time', label: 'Due Date' },
  // { id: 'status', label: 'Status' },
  { id: 'Invoice_remaining_partitions', label: 'Units for Sale' },
  { id: 'Invoice_principle_amt', label: 'Total Amount' },
  { id: 'Invoice_interest', label: 'Interest fractional' },
  { id: 'actions', label: 'Actions' },
];
export default function AuctionView() {
  const settings = useSettingsContext();
  const userId = 2;
  const table = useTable({ defaultOrderBy: 'timeLeft' });

  const {
    data: AllInvoiceData,
    error: AllInvoiceError,
    isLoading: AllInvoiceIsLoading,
    isSuccess: AllInvoiceIsSuccess,
    isError: AllInvoiceIsError,
    status,
  } = useGetAllInvoicesById(userId);
  const denseHeight = table.dense ? 56 : 76;
  if (AllInvoiceIsLoading || AllInvoiceData?.data?.length === 0) {
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
  if (AllInvoiceIsError || AllInvoiceData === undefined) {
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
  console.log('AllInvoiceDataTest: ', AllInvoiceData);
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
        <AuctionTable tableData={AllInvoiceData.Data} TABLE_HEAD={TABLE_HEAD} />
      </Grid>
    </Container>
  );
}
