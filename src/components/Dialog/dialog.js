import React, { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import Dialog, { dialogClasses } from '@mui/material/Dialog';
import PropTypes from 'prop-types';
import { useTheme } from '@emotion/react';
import Label from '../label';

function CustomDialog({ openFlag, setonClose, placeHolder, component, maxWidth, mt }) {
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (!isSubmitting) {
      setonClose();
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth={maxWidth ?? 'md'}
      open={openFlag}
      onClose={handleClose}
      transitionDuration={{
        enter: theme.transitions.duration.shortest,
        exit: 0,
      }}
      PaperProps={{
        sx: {
          mt: mt ?? 3,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
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
          <Label
            onClick={handleClose}
            sx={{
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: 20,
              opacity: isSubmitting ? 0.5 : 1,
            }}
          >
            &#10005;
          </Label>
        </Stack>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          p: 3,
          pt: 2,
        }}
      >
        {React.cloneElement(component, { onClose: setonClose, setIsSubmitting })}
      </Box>
    </Dialog>
  );
}

CustomDialog.propTypes = {
  openFlag: PropTypes.bool,
  setonClose: PropTypes.func,
  placeHolder: PropTypes.string,
  component: PropTypes.element,
  mt: PropTypes.number,
  maxWidth: PropTypes.oneOf(['xl', 'xs', 'lg', 'md', 'sm']),
};

export default CustomDialog;
