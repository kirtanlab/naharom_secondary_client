import PropTypes from 'prop-types';
import { Box, Card, IconButton, ListItemText, Stack, alpha } from '@mui/material';
import { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';

export default function BankAccount({ bank_account }) {
  const popover = usePopover();
  const { account_no, IFSC_code, acc_type } = bank_account;
  return (
    <>
      <Card sx={{ px: 2, py: 1, height: 120 }}>
        <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
        <Stack spacing={2}>
          <ListItemText
            primary={
              <>
                {`Account Number: ${account_no}`}
                <br />

                {`IFSC Code: ${IFSC_code}`}
              </>
            }
            secondary={`Account Type: ${acc_type}`}
            primaryTypographyProps={{
              typography: 'subtitle1',
              mt: 1,
            }}
            secondaryTypographyProps={{
              mt: 1,
              component: 'span',
              typography: 'subtitle2',
              color: 'text.disabled',
            }}
          />
        </Stack>
      </Card>
    </>
  );
}

BankAccount.propTypes = {
  bank_account: PropTypes.object,
};
