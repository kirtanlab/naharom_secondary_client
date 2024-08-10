import { Alert, Container, Grid, Typography, AlertTitle } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { TableSkeleton, useTable } from 'src/components/table';
import { useGetAllUsers } from 'src/queries/users';

import { useAuthContext } from 'src/auth/hooks';
import { getSession } from 'src/auth/context/jwt/utils';
import { useGetAdminLedger, useGetUserLedger } from 'src/queries/ledger';
import AdminLedgerTable from './admin-ledger-table';

//
const TABLE_HEAD = [
  { id: 'transaction_id', label: 'Transaction Id' },
  { id: 'type', label: 'Type' },
  { id: 'creditedAmount', label: 'Credited Amount' },
  { id: 'debitedAmount', label: 'Debited Amount' },
  { id: 'status', label: 'Status' },
  { id: 'source', label: 'Source' },
  { id: 'purpose', label: 'Purpose' },
  { id: 'from_bank_acc', label: 'From Bank Account' },
  { id: 'to_bank_acc', label: 'To Bank Account' },
  { id: 'invoice', label: 'Invoice' },
  { id: 'time_date', label: 'Date' },
];
export default function AdminLedgerView() {
  const settings = useSettingsContext();
  const table = useTable({ defaultOrderBy: 'timeLeft' });
  const denseHeight = table.dense ? 56 : 76;
  const { user } = useAuthContext();
  const {
    data: AllUsers,
    error: AllUsersError,
    isLoading: AllUserLoading,
    isSuccess: AllUsersSuccess,
    isError: AllUsersIsError,
  } = useGetUserLedger({ userId: user });

  if (AllUserLoading || AllUsers?.data?.length === 0) {
    return (
      <>
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
          <Typography variant="h4"> Users </Typography>
          <Grid xs={12} marginTop={2}>
            {[...Array(table.rowsPerPage)].map((i, index) => (
              <TableSkeleton key={index} sx={{ height: denseHeight }} />
            ))}
          </Grid>
        </Container>
      </>
    );
  }
  if (AllUsersIsError || AllUsers?.transactions === undefined) {
    console.log('in error!');

    return (
      <>
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
          <Typography variant="h4"> Ledger </Typography>
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

  if (AllUsers?.transactions === null) {
    return (
      <>
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
          <Typography variant="h4"> Ledger </Typography>
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => console.log('closed alert')}>
            <AlertTitle>Error</AlertTitle>
            Opps! You do not have permission to access this page
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
  console.log('AdminLedgerData: ', AllUsers);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> Ledger </Typography>
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
        {/* <AuctionTable tableData={AllInvoiceData.Data} TABLE_HEAD={TABLE_HEAD} /> */}
        <AdminLedgerTable tableData={AllUsers?.transactions} TABLE_HEAD={TABLE_HEAD} />
      </Grid>
    </Container>
  );
}
