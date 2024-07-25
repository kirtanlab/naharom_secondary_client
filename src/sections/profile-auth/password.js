import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, Grid, IconButton, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import * as Yup from 'yup';
import { useSnackbar } from 'src/components/snackbar';
import { RHFTextField } from 'src/components/hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import Iconify from 'src/components/iconify';
//
export default function Password({ password }) {
  const { enqueueSnackbar } = useSnackbar();
  const [isEditable, setIsEditable] = useState(false);

  const UpdatePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current password is required'),
    NewPassword: Yup.string().required('New password is required'),
    ConfirmNewPassword: Yup.string()
      .oneOf([Yup.ref('NewPassword'), null], 'New password and confirm password must match')
      .required('Confirm new password is required'),
  });
  const defaultValues = useMemo(
    () => ({
      currentPassword: password || '',
      ConfirmNewPassword: '',
      NewPassword: '',
    }),
    [password]
  );
  const methods = useForm({
    resolver: yupResolver(UpdatePasswordSchema),
    defaultValues,
  });
  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      // enqueueSnackbar(currentUser ? 'Update success!' : 'Create success!');
      // router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleEditToggle = () => {
    setIsEditable(!isEditable);
  };

  const handleCancel = () => {
    reset(defaultValues);
    setIsEditable(false);
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid xs={12} md={8}>
        <Card sx={{ pb: 2, px: 3, borderRadius: 0 }}>
          <Stack sx={{ mt: 1, mb: 1 }} alignItems="flex-end">
            <IconButton onClick={handleEditToggle}>
              <Iconify icon={!isEditable && 'ep:edit'} width={28} />
            </IconButton>
          </Stack>
          <Box
            rowGap={4}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField
              disabled={!isEditable}
              name="currentPassword"
              label="Current Password *"
            />
            <RHFTextField disabled={!isEditable} name="NewPassword" label="New Password *" />
            <RHFTextField
              disabled={!isEditable}
              name="ConfirmNewPassword"
              label="Confirm New Password *"
            />
          </Box>
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            {isEditable ? (
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" onClick={handleCancel}>
                  Cancel
                </Button>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {password ? 'Save Changes' : 'Submit'}
                </LoadingButton>
              </Stack>
            ) : null}
          </Stack>
        </Card>
      </Grid>
    </FormProvider>
  );
}

Password.propTypes = {
  password: PropTypes.string,
};
