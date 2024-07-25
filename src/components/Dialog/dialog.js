import React from 'react';
import { Box, InputBase, Stack, Typography } from '@mui/material';
import Dialog, { dialogClasses } from '@mui/material/Dialog';
import PropTypes from 'prop-types';
import { useTheme } from '@emotion/react';
import Label from '../label';

function CustomDialog({ openFlag, setonClose, placeHolder, component }) {
  const theme = useTheme();

  const handleClose = () => {
    // Your close logic here
    setonClose();
  };

  return (
    <Dialog
      fullWidth
      open={openFlag}
      onClose={handleClose}
      transitionDuration={{
        enter: theme.transitions.duration.shortest,
        exit: 0,
      }}
      PaperProps={{
        sx: {
          mt: 3,
          overflow: 'unset',
        },
      }}
      sx={{
        [`& .${dialogClasses.container}`]: {
          alignItems: 'flex-start',
        },
      }}
    >
      <Box sx={{ p: 1, borderBottom: `solid 1px ${theme.palette.divider}` }}>
        <Stack padding={1} justifyContent="space-between" direction="row">
          <Typography sx={{ letterSpacing: 1, color: 'text.primary', fontWeight: 'bold' }}>
            {placeHolder}
          </Typography>
          {/* Close icon */}
          <Label onClick={handleClose} sx={{ cursor: 'pointer', fontSize: 20 }}>
            &#10005;
          </Label>
        </Stack>
      </Box>
      <Stack sx={{ p: 3, pt: 2, height: 'auto', width: '100%' }}>{component}</Stack>
    </Dialog>
  );
}

CustomDialog.propTypes = {
  openFlag: PropTypes.bool,
  setonClose: PropTypes.func,
  placeHolder: PropTypes.string,
  component: PropTypes.any,
};
export default CustomDialog;
