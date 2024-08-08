import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { useResponsive } from 'src/hooks/use-responsive';
import { useGetIndividualDetails, useSubmitProfile } from 'src/queries/profile';
import { getSession } from 'src/auth/context/jwt/utils';
import { LoadingScreen } from 'src/components/loading-screen';
import { InputAdornment, TextField } from '@mui/material';
import { useAuthContext } from 'src/auth/hooks';

export default function UserForm() {
  console.log('UserForm Entered');
  // const { userId } = getSession();
  const { initialize, user: userId } = useAuthContext();
  // console.log('userId: ', userId);

  const {
    data: fetchCurrentUser,
    error: IndividualError,
    isError: IndividualIsError,
    isSuccess: IndividualIsSuccess,
    isLoading: IndividualIsLoading,
  } = useGetIndividualDetails({ userId });

  const [isEditable, setIsEditable] = useState(false);
  const [lightEditable, setLightEditable] = useState(true);
  const [currentUser, setCurrentUser] = useState(fetchCurrentUser ?? null);
  const { enqueueSnackbar } = useSnackbar();

  const mdUp = useResponsive('up', 'md');
  const lgUp = useResponsive('up', 'lg');
  const ismdlgUP = mdUp || lgUp;
  const submitProfile = useSubmitProfile();

  const NewUserSchema = Yup.object().shape({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    addressOne: Yup.string().required('Address Line 1 is required'),
    addressTwo: Yup.string(),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    zipCode: Yup.string().required('Zip code is required'),
    // phoneNumber: Yup.string().required('Phone number is required'),

    alternatePhone: Yup.string()
      .required('Alternate Phone number is required')
      .matches(/^[0-9]{10}$/, 'Enter a Valid Mobile Number'),
    email: Yup.string().email().required('Email is required'),
    pan: Yup.string()
      .required('PAN Number is required')
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Enter a valid PAN Number'),
    // securityAns: Yup.string().required('Security answer is required'),
    // securityQue: Yup.string().required('Security question is required'),
  });

  const defaultValues = useMemo(
    () => ({
      first_name: currentUser?.prefillData?.firstName || '',
      last_name: currentUser?.prefillData?.lastName || '',
      addressOne: currentUser?.prefillData?.address1?.Address || '',
      addressTwo: '',
      state: currentUser?.prefillData?.address1?.state || '',
      city: currentUser?.prefillData?.city || '',
      zipCode: currentUser?.prefillData?.address1?.Postal || '',
      // phoneNumber: fetchCurrentUser?.phoneNumber || '',
      alternatePhone: currentUser?.prefillData?.alternatePhone || '',
      email: currentUser?.prefillData?.email || '',
      pan: currentUser?.prefillData?.panCardNumber || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();
  console.log('errors for submitssion: ', errors);
  useEffect(() => {
    if (!IndividualIsLoading) enqueueSnackbar('Successfully logged in');

    if (currentUser?.prefillData == null) {
      setIsEditable(true);
      setLightEditable(false);
    }
    if (currentUser?.prefillData != null) {
      setLightEditable(true);

      setIsEditable(false);
    }
  }, [enqueueSnackbar, IndividualIsLoading, currentUser]);

  if (IndividualIsLoading || submitProfile.isLoading) {
    return <LoadingScreen />;
  }
  if (IndividualIsError || submitProfile.isError) {
    console.log('Error: ', IndividualError, submitProfile.error);
  }
  const onSubmit = handleSubmit(async (data) => {
    console.log('data: ', data);
    try {
      const finalObj = {
        user: userId,
        alternatePhone: data.alternatePhone,
        email: data.email,
        address1: data.addressOne,
        address2: data.addressTwo,
        panCardNumber: data.pan,
        firstName: data.first_name,
        lastName: data.last_name,
        state: data.state,
        postalCode: data.zipCode,
        city: data.city,
      };
      console.log('Fina Obj: ', finalObj);
      const resData = await submitProfile.mutateAsync(finalObj);
      console.log('resData: ', resData);
      if (resData) {
        enqueueSnackbar(`Data Updated Successfully`, {
          variant: 'success',
          color: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
        window.location.reload();
      }

      console.info('DATA', data);
    } catch (error) {
      enqueueSnackbar(
        submitProfile?.failureReason?.response?.data?.message
          ? submitProfile?.failureReason?.response?.data?.message
          : "Can't Submit Profile at this time",
        {
          variant: 'error',
          color: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        }
      );
      console.error('error while submitingProfile: ', error);
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
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField name="first_name" label="First Name *" disabled={!isEditable} />
            <RHFTextField name="last_name" label="Last Name *" disabled={!isEditable} />
            <RHFTextField
              name="addressOne"
              label="Address Line 1 *"
              disabled={!isEditable || lightEditable}
            />
            <RHFTextField
              name="addressTwo"
              label="Address Line 2"
              disabled={!isEditable || lightEditable}
            />
            <RHFTextField name="city" label="City *" disabled={!isEditable || lightEditable} />
            <RHFTextField
              name="state"
              label="State/Region *"
              disabled={!isEditable || lightEditable}
            />
            <RHFTextField
              name="zipCode"
              label="Zip/Code *"
              disabled={!isEditable || lightEditable}
            />
            <RHFTextField name="pan" label="PAN Number *" disabled={!isEditable || lightEditable} />
            {/* <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  disabled
                  // disabled={!isEditable}
                  label="Phone Number"
                  type="number"
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                  }}
                  placeholder="Enter 10 digit mobile number"
                />
              )}
            /> */}
            <Controller
              name="alternatePhone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="number"
                  disabled={!isEditable || lightEditable}
                  label="Alternate Phone Number"
                  error={!!errors.alternatePhone}
                  helperText={errors.alternatePhone?.message}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                  }}
                  placeholder="Enter 10 digit mobile number"
                />
              )}
            />
            <RHFTextField name="email" label="Email *" disabled={!isEditable || lightEditable} />
          </Box>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            {isEditable ? (
              <Stack direction="row" spacing={2}>
                <LoadingButton
                  onClick={handleCancel}
                  variant="contained"
                  loading={submitProfile.isLoading}
                >
                  Cancel
                </LoadingButton>
                <LoadingButton type="submit" variant="contained" loading={submitProfile.isLoading}>
                  Submit
                </LoadingButton>
              </Stack>
            ) : null}
          </Stack>
        </Card>
      </Grid>
    </FormProvider>
  );
}
