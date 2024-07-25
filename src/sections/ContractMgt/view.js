import { Alert, Container, Grid, Typography, AlertTitle } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useSettingsContext } from 'src/components/settings';
import { TableSkeleton, useTable } from 'src/components/table';
import { useGetAllInvoices } from 'src/queries/invoices';
import ContractTable from './contract-table';

const TABLE_HEAD = [
  { id: 'primary_invoice_id', label: 'Invoice id', align: 'center' },
  { id: 'product_name', label: 'Name' },
  { id: 'principle_amt', label: 'Loan Amount', align: 'center' },
  { id: 'tenure_in_days', label: 'Loan Period', align: 'center' },
  { id: 'no_of_partitions', label: 'Fractionalized Units', align: 'center' },
  { id: 'principle_amt', label: 'Fractionalized Amount', align: 'center' },
  // { id: 'timeLeft', label: 'Time Left' },
  // { id: 'interest_rate', label: 'Interest Rate' },
  // { id: 'interest', label: 'Interest fractional' },
  { id: 'actions', label: 'Actions' },
];

export default function ContractMgtView() {
  const settings = useSettingsContext();
  const table = useTable({ defaultOrderBy: 'timeLeft' });
  const denseHeight = table.dense ? 56 : 76;
  const {
    data: AllInvoices,
    error: AllInvoicesError,
    isError: AllInvoiceIsError,
    isLoading: AllInvoicesIsLoading,
  } = useGetAllInvoices();
  if (AllInvoicesIsLoading || AllInvoices?.data?.length === 0) {
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
  if (AllInvoiceIsError || AllInvoices === undefined) {
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
        <ContractTable tableData={AllInvoices} TABLE_HEAD={TABLE_HEAD} />
      </Grid>
    </Container>
  );
}
