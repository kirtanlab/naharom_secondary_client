import PropTypes from 'prop-types';
import { useTheme, alpha } from '@mui/material/styles';
import {
  useTable,
  getComparator,
  TableHeadCustom,
  TableEmptyRows,
  emptyRows,
  TableNoData,
  TablePaginationCustom,
} from 'src/components/table';
import { useBoolean } from 'src/hooks/use-boolean';
import { useCallback, useState } from 'react';
import {
  Card,
  Grid,
  Tab,
  Tabs,
  TextField,
  InputAdornment,
  TableContainer,
  Table,
  TableBody,
  Divider,
  TablePagination,
} from '@mui/material';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import ContractTableRow from './contract-table-row';
//
export default function ContractTable({ TABLE_HEAD, tableData }) {
  const defaultFilters = {
    search: '',
    type: 'all',
  };
  const theme = useTheme();
  const table = useTable({ defaultOrderBy: 'Invoice_id' });
  const confirm = useBoolean();
  const [filters, setFilters] = useState(defaultFilters);
  console.log('tableOrder: ', table.order, table.orderBy);
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });
  const denseHeight = table.dense ? 56 : 76;
  const canReset =
    !!filters.uniqueId || filters.type !== 'all' || (!!filters.startDate && !!filters.endDate);
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;
  const getInvoiceLength = (type) => tableData.filter((item) => item.type === type).length;
  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: tableData.length },
    {
      value: 'unfractionalized',
      label: 'UnFractionalized',
      color: 'default',
      count: getInvoiceLength('unfractionalized'),
    },
    {
      value: 'fractionalized',
      label: 'Fractionalized',
      color: 'default',
      count: getInvoiceLength('fractionalized'),
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
  const handleFilterType = useCallback(
    (event, newValue) => {
      handleFilters('type', newValue);
    },
    [handleFilters]
  );
  const handleFilterSearch = useCallback(
    (event) => {
      handleFilters('search', event.target.value);
    },
    [handleFilters]
  );
  console.log('rowsPerPage:', table.rowsPerPage);
  return (
    <Card
      sx={{
        mb: { xs: 3, md: 5 },
        justifyContent: 'flex-end',
      }}
    >
      <Grid
        container
        alignItems="center"
        flexDirection="row"
        sx={{ paddingRight: 2, justifyContent: 'space-between' }}
      >
        <Tabs
          value={filters.type}
          onChange={handleFilterType}
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
                    ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
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
          value={filters.search}
          onChange={handleFilterSearch}
          placeholder="Search Invoice id / name / Principle Amount ..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
          sx={{ p: 2, maxWidth: 400, flexGrow: 1 }}
        />
      </Grid>
      <Grid>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table>
              <TableHeadCustom
                headLabel={TABLE_HEAD}
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <ContractTableRow
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
          dense={table.dense}
          // onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          // onChangeDense={table.onChangeDense}
        />
      </Grid>
    </Card>
  );
}

ContractTable.propTypes = {
  TABLE_HEAD: PropTypes.array,
  tableData: PropTypes.array,
};
function applyFilter({ inputData, comparator, filters, dateError }) {
  const { search, type } = filters;
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
  if (search) {
    console.log('name: ', search, inputData);
    inputData = inputData.filter(
      (invoice) =>
        invoice?.name?.toLowerCase()?.indexOf(search.toLowerCase()) !== -1 ||
        invoice?.product_name?.toLowerCase()?.indexOf(search.toLowerCase()) !== -1 ||
        String(invoice?.Invoice_id || '')
          .toLowerCase()
          .indexOf(search.toLowerCase()) !== -1 ||
        String(invoice?.principle_amt || '').indexOf(search.toLowerCase()) !== -1
    );
  }
  console.log('after Apply Filer: ', inputData);
  return inputData;
}
