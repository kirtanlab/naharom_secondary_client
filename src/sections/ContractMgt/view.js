import { useAuthContext } from 'src/auth/hooks';
import { Alert, Container, Grid, Typography, AlertTitle } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useSettingsContext } from 'src/components/settings';
import { TableSkeleton, useTable } from 'src/components/table';
import { useGetAllInvoices } from 'src/queries/invoices';
import ContractTable from './contract-table';

const TABLE_HEAD_FRACTIONALIZED = [
  { id: 'primary_invoice_id', label: 'Invoice id', align: 'center' },
  { id: 'invoice_id', label: 'Secondary Invoice id', align: 'center' },
  { id: 'post_for_saleID', label: 'Sale id', align: 'center' },
  { id: 'product_name', label: 'Name', disableSort: true },
  { id: 'tenure_in_days', label: 'Loan Period (Days)', align: 'center' },
  { id: 'expiration_time', label: 'Expiration Date', align: 'center' },
  { id: 'total_price', label: 'Total Sale Amount', align: 'center' },
  { id: 'per_unit_price', label: 'Fractionalized Amount', align: 'center' },
  { id: 'no_of_units', label: 'Total Fractionalized Units', align: 'center' },
  { id: 'remaining_units', label: 'Remaining Fractionalized Units', align: 'center' },
  { id: 'irr', label: 'IRR', align: 'center' },
  { id: 'xirr', label: 'XIRR', align: 'center' },
  { id: 'interest', label: 'Interest Rate', align: 'center' },
  { id: 'from_date', label: 'Sale Start Date', align: 'center', width: 20 },
  { id: 'to_date', label: 'Sale End Date', align: 'center' },
  { id: 'actions', label: 'Actions', disableSort: true },
];
const TABLE_HEAD_NON_FRACTIONALIZED = [
  { id: 'primary_invoice_id', label: 'Invoice id', align: 'center' },
  { id: 'buyer_poc_name', label: 'Name', disableSort: true },
  { id: 'tenure_in_days', label: 'Loan Tenure (Days)', align: 'center' },
  { id: 'expiration_time', label: 'Expiration Date', align: 'center' },
  { id: 'principle_amt', label: 'Total Loan Amount', align: 'center' },
  { id: 'remaining_amt', label: 'Remaining Loan Amount', align: 'center' },
  { id: 'interest_rate', label: 'Interest Rate', align: 'center' },
  { id: 'irr', label: 'IRR', align: 'center' },
  { id: 'xirr', label: 'XIRR', align: 'center' },
  { id: 'actions', label: 'Actions', disableSort: true },
];

export default function ContractMgtView() {
  const settings = useSettingsContext();
  const table = useTable({ defaultOrderBy: 'timeLeft' });
  const denseHeight = table.dense ? 56 : 76;
  const { user: userId } = useAuthContext();
  const {
    data: AllInvoices,
    error: AllInvoicesError,
    isError: AllInvoiceIsError,
    isLoading: AllInvoicesIsLoading,
    status,
    isRefetching,
  } = useGetAllInvoices({ userId });
  console.log('AllInvoicesIsLoading: ', status, isRefetching);
  if (AllInvoicesIsLoading || isRefetching || AllInvoices?.data?.length === 0) {
    return (
      <>
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
          <Typography variant="h4"> Contracts </Typography>
          <Grid xs={12} marginTop={2}>
            {[...Array(table.rowsPerPage)].map((i, index) => (
              <TableSkeleton key={index} sx={{ height: denseHeight }} />
            ))}
          </Grid>
        </Container>
      </>
    );
  }
  if (AllInvoiceIsError || !AllInvoices.data) {
    console.log('in error!');

    return (
      <>
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
          <Typography variant="h4"> Contracts </Typography>
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
  console.log('AllInvoiceDataTest: ', AllInvoices);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> Contracts </Typography>
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
        <ContractTable
          tableData={AllInvoices?.data}
          TABLE_HEAD_FRACTIONALIZED={TABLE_HEAD_FRACTIONALIZED}
          TABLE_HEAD_NON_FRACTIONALIZED={TABLE_HEAD_NON_FRACTIONALIZED}
        />
      </Grid>
    </Container>
  );
}
