import PropTypes from 'prop-types';
import { useTheme, alpha } from '@mui/material/styles';
import {
  useTable,
  getComparator,
  TableHeadCustom,
  TableEmptyRows,
  TableNoData,
  TablePaginationCustom,
  emptyRows,
} from 'src/components/table';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { useCallback, useState } from 'react';
import {
  Card,
  Divider,
  Grid,
  InputAdornment,
  Table,
  TableBody,
  TableContainer,
  TextField,
} from '@mui/material';
import Scrollbar from 'src/components/scrollbar';
import UserTableRow from './user-table-row';

//
export default function UserTable({ TABLE_HEAD, tableData }) {
  const defaultFilters = {
    company_name: '',
    email: '',
    first_name: '',
    last_name: '',
    pan_no: false,
  };

  const theme = useTheme();
  const table = useTable({ defaultOrderBy: 'pan_no' });
  const confirm = useBoolean();
  const [filters, setFilters] = useState(defaultFilters);
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

  const handleFilterName = useCallback(
    (event) => {
      handleFilters('name', event.target.value);
    },
    [handleFilters]
  );
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
        <TextField
          value={filters.name}
          onChange={handleFilterName}
          placeholder="Search email / name / pan_no ..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{}} />
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
                    <UserTableRow
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

UserTable.propTypes = {
  TABLE_HEAD: PropTypes.array,
  tableData: PropTypes.array,
};

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);
  if (name) {
    inputData = inputData.filter(
      (user) =>
        user?.company_name?.toLowerCase()?.indexOf(name.toLowerCase()) !== -1 ||
        user?.email?.toLowerCase()?.indexOf(name.toLowerCase()) !== -1 ||
        user?.first_name?.toLowerCase()?.indexOf(name.toLowerCase()) !== -1 ||
        user?.last_name?.toLowerCase()?.indexOf(name.toLowerCase()) !== -1 ||
        user?.pan_no?.toLowerCase()?.indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
