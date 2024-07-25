import { Alert, Container, Grid, Typography, AlertTitle } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { TableSkeleton, useTable } from 'src/components/table';
import { useGetAllUsers } from 'src/queries/users';
import UserTable from './user-table';
//
const TABLE_HEAD = [
  { id: 'email', label: 'Email Id' },
  { id: 'first_name', label: 'First Name' },
  { id: 'last_name', label: 'Last Name' },
  { id: 'company_name', label: 'Company Name' },
  { id: 'doj', label: 'Date of Joining' },
  { id: 'role', label: 'Role' },
  { id: 'pan_no', label: 'Pan No.' },
  { id: 'impersonate_user', label: 'Impersonate User' },
];
export default function UserMgtView() {
  const settings = useSettingsContext();
  const table = useTable({ defaultOrderBy: 'timeLeft' });
  const denseHeight = table.dense ? 56 : 76;
  const {
    data: AllUsers,
    error: AllUsersError,
    isLoading: AllUserLoading,
    isSuccess: AllUsersSuccess,
    isError: AllUsersIsError,
  } = useGetAllUsers();
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
  if (AllUsersIsError || AllUsers === undefined) {
    console.log('in error!');

    return (
      <>
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
          <Typography variant="h4"> Users </Typography>
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
  console.log('AllInvoiceDataTest: ', AllUsers);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> Users </Typography>
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
        <UserTable tableData={AllUsers} TABLE_HEAD={TABLE_HEAD} />
      </Grid>
    </Container>
  );
}
