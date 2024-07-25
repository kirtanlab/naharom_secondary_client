import PropTypes from 'prop-types';
import { Box, Card, IconButton, ListItemText, Stack, alpha } from '@mui/material';
import { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';

export default function PANList({ PAN }) {
  const popover = usePopover();
  const { PAN_Number, Added_at } = PAN;
  return (
    <>
      <Card sx={{ px: 2, py: 1, height: 90 }}>
        <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
        <Stack spacing={2}>
          <ListItemText
            primary={
              <>
                {`PAN Number: ${PAN_Number}`}
                {/* <br /> */}

                {/* {`IFSC Code: ${IFSC_code}`} */}
              </>
            }
            secondary={`Details added at: ${Added_at}`}
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

PANList.propTypes = {
  PAN: PropTypes.object,
};
