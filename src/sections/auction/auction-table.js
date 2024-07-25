// @mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';
import Iconify from 'src/components/iconify';

// components
import { useSettingsContext } from 'src/components/settings';
import { useRouter } from 'src/routes/hooks';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  emptyRows,
  getComparator,
  useTable,
} from 'src/components/table';
import {
  Card,
  Grid,
  Stack,
  Tab,
  Tabs,
  TextField,
  InputAdornment,
  Button,
  TableContainer,
  TableBody,
  Table,
  Divider,
} from '@mui/material';
import PropTypes from 'prop-types';
import { fDate } from 'src/utils/format-time';

import Scrollbar from 'src/components/scrollbar';
import Label from 'src/components/label';
import { useBoolean } from 'src/hooks/use-boolean';
import { useCallback, useState } from 'react';

import AuctionTableToolbar from './auction-table-toolbar';
import AuctionTableRow from './auction-table-row';

//

export default function AuctionTable({ TABLE_HEAD, tableData }) {
  function calculateIRRActual(invoiceData, salePrice) {
    try {
      const irr = invoiceData.Invoice_irr / 100;
      const purchasePrice = invoiceData.Total_Purchased_Amt;
      const purchaseDate = new Date(invoiceData.purchase_date);
      const saleDate = new Date(invoiceData.saleDate); // Assuming current date as sale date

      // Check for invalid or non-positive values
      if (
        typeof irr !== 'number' ||
        typeof purchasePrice !== 'number' ||
        typeof salePrice !== 'number' ||
        Number.NaN(purchaseDate.getTime())
      ) {
        return 'Error: Invalid data types in input data';
      }

      if (irr <= 0 || purchasePrice <= 0 || salePrice <= 0) {
        return 'Error: Non-positive values are not allowed';
      }

      // Calculate No of Days Held
      const noOfDaysHeld = (saleDate - purchaseDate) / (1000 * 60 * 60 * 24);

      // Check if noOfDaysHeld is a valid number
      if (Number.NaN(noOfDaysHeld) || noOfDaysHeld <= 0) {
        return 'Error: Invalid number of days held';
      }

      const fractionalUnitsValue =
        invoiceData.Invoice_PrincipleAmt / invoiceData.Invoice_No_of_Units;

      // Calculate Profit on Sale
      const profitOnSale = salePrice - purchasePrice;

      // Calculate Interest
      const interest = (noOfDaysHeld * irr * fractionalUnitsValue) / 365;

      // Calculate Total Earnings
      const totalEarnings = profitOnSale + interest;

      // Calculate IRR (Actual)
      const irrActual = (totalEarnings / purchasePrice) * (365 / noOfDaysHeld);
      console.log(
        'total Earning, purchasePrice, noDaysHeld, interest,profit ON Sale,fractionalUnitsValue,SaleDate,purchaseDate,: ',
        totalEarnings,
        purchasePrice,
        noOfDaysHeld,
        interest,
        profitOnSale,
        fractionalUnitsValue,
        saleDate,
        purchaseDate
      );
      return irrActual * 100;
    } catch (error) {
      console.log(error);
      return 'Woww';
    }
  }

  // Example Usage
  const invoiceData = {
    Buyer_id: 7,
    user_id: 2,
    no_of_puchased_partitions: 1,
    Total_Purchased_Amt: 500000,
    Interest_cut_off_time: '12:00:00',
    Invoice_id: 1,
    Invoice_interest: 20,
    Invoice_xirr: 18,
    Invoice_irr: 20,
    Invoice_PrincipleAmt: 10000000,
    Invoice_No_of_Units: 20,
    purchase_date: '2024-04-01',
    saleDate: '2024-04-18',
    purchase_time: '09:00:00.000',
    isAdmin: false,
    type: 'brought',
  };

  const salePrice = 510000; // Example sale price

  const irrActual = calculateIRRActual(invoiceData, salePrice);
  console.log(`IRR (Actual): ${irrActual}`);

  const defaultFilters = {
    uniqueId: '',
    type: 'CanBuy',
  };
  const settings = useSettingsContext();
  const theme = useTheme();
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'timeLeft' });
  const confirm = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);
  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });
  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );
  const denseHeight = table.dense ? 56 : 76;
  const canReset =
    !!filters.uniqueId || filters.type !== 'all' || (!!filters.startDate && !!filters.endDate);
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;
  const getInvoiceLength = (type) => tableData.filter((item) => item.type === type).length;
  const TABS = [
    // { value: 'all', label: 'All', color: 'default', count: tableData.length },
    {
      value: 'CanBuy',
      label: 'Buy',
      color: 'default',
      count: getInvoiceLength('CanBuy'),
    },
    {
      value: 'brought',
      label: 'Sell',
      color: 'default',
      count: getInvoiceLength('brought'),
    },
  ];

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );
  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('type', newValue);
    },
    [handleFilters]
  );
  const handleFilterName = useCallback(
    (event) => {
      handleFilters('uniqueId', event.target.value);
    },
    [handleFilters]
  );
  // const handleResetFilters = useCallback(() => {
  //   setFilters(defaultFilters);
  // }, [defaultFilters]);

  return (
    <Card
      sx={{
        mb: { xs: 3, md: 5 },
        justifyContent: 'flex-end',
      }}
    >
      {/* <InvoiceTableToolbar
          filters={filters}
          onFilters={handleFilters}
          //
          dateError={dateError}
          serviceOptions={INVOICE_SERVICE_OPTIONS.map((option) => option.name)}
        /> */}
      <Grid
        container
        alignItems="center"
        flexDirection="row"
        sx={{ paddingRight: 2, justifyContent: 'space-between' }}
      >
        <Tabs
          value={filters.type}
          onChange={handleFilterStatus}
          sx={{
            px: 2,
            boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              iconPosition="end"
              icon={
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === filters.type) && 'filled') || 'soft'
                  }
                  color={tab.color}
                >
                  {tab.count}
                </Label>
              }
            />
          ))}
        </Tabs>
        <TextField
          value={filters.name}
          onChange={handleFilterName}
          placeholder="Search Invoice id ..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
          sx={{ p: 2, maxWidth: 400, flexGrow: 1 }}
        />

        {/* <Button
          sx={{ p: 1, width: 120, justifyContent: 'flex-end', alignItems: 'center', ml: 2 }}
          size="medium"
          color="inherit"
          onClick={() => {
            // setAddTypes(true);
          }}
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
        >
          Add Invoice
        </Button> */}
      </Grid>
      <Grid>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          {/* <TableSelectedAction /> */}
          <Scrollbar>
            <Table>
              <TableHeadCustom
                headLabel={TABLE_HEAD}
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                // onSelectAllRows={(checked) => /**to show box */
                //   table.onSelectAllRows(
                //     checked,
                //     dataFiltered.map((row) => row.id)
                //   )
                // }
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <AuctionTableRow
                      key={row.id}
                      row={row}
                      table={table}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      confirm={confirm}
                    />
                  ))}
                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
        <Divider sx={{ borderStyle: 'dotted' }} />
        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          // dense={table.dense}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          // onChangeDense={table.onChangeDense}
        />
      </Grid>
    </Card>
  );
}

AuctionTable.propTypes = {
  TABLE_HEAD: PropTypes.array,
  tableData: PropTypes.array,
};

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { type, uniqueId } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);
  if (type !== 'all') {
    inputData = inputData.filter((invoice) => invoice?.type === type);
  }
  if (uniqueId) {
    // inputData = inputData.map(
    //   (invoice) => invoice?.Invoice_id?.toLowerCase().indexOf(uniqueId?.toLowerCase()) !== -1
    // );
    inputData = inputData.filter((invoice) => {
      if (invoice?.Invoice_id != null) {
        const invoiceIdString = String(invoice?.Invoice_id).toLowerCase();
        const due_date = fDate(invoice?.Invoice_expiration_time)
          ? String(fDate(invoice?.Invoice_expiration_time)).toLowerCase()
          : '';
        const units = invoice?.Invoice_remaining_partitions
          ? String(invoice?.Invoice_remaining_partitions)
          : '';
        const principle_amt = invoice?.Invoice_principle_amt
          ? String(invoice?.Invoice_principle_amt)
          : '';
        const interest = invoice?.Invoice_interest ? String(invoice?.Invoice_interest) : '';

        const uniqueIdString = uniqueId?.toLowerCase() || '';
        return (
          invoiceIdString.indexOf(uniqueIdString) !== -1 ||
          due_date.indexOf(uniqueIdString) !== -1 ||
          units.indexOf(uniqueIdString) !== -1 ||
          principle_amt.indexOf(uniqueIdString) !== -1 ||
          interest.indexOf(uniqueIdString) !== -1
        );
      }
      return false;
    });
  }

  return inputData;
}
