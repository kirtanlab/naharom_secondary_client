import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
// utils
import { fData } from 'src/utils/format-number';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// assets
import { countries } from 'src/assets/data';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';
import { useResponsive } from 'src/hooks/use-responsive';

// ----------------------------------------------------------------------

export default function UserForm({ currentUser }) {
  const securityQuestions = [
    {
      id: 1,
      label: "Please enter your father's middle name",
    },
    {
      id: 2,
      label: 'Please enter your first pet name',
    },

    {
      id: 3,
      label: 'Please enter your favorite sportsman',
    },
    {
      id: 4,
      label: 'Please enter your birth date',
    },
  ];

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const mdUp = useResponsive('up', 'md');
  const lgUp = useResponsive('up', 'lg');
  const ismdlgUP = mdUp || lgUp;

  const NewUserSchema = Yup.object().shape({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    addressOne: Yup.string().required('Address Line 1 is required'),
    addressTwo: Yup.string(), // Optional field
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    zipCode: Yup.string().required('Zip code is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    // panNo: Yup.string().required('PAN number is required'),
    // publicUrl: Yup.string().url('Must be a valid URL'),
    securityAns: Yup.string().required('Security answer is required'),
    securityQue: Yup.string().required('Security question is required'),
  });

  const defaultValues = useMemo(
    () => ({
      first_name: currentUser?.first_name || '',
      last_name: currentUser?.last_name || '',
      addressOne: currentUser?.addressOne || '',
      addressTwo: currentUser?.addressTwo || '',
      state: currentUser?.state || '',
      city: currentUser?.city || '',
      zipCode: currentUser?.zipCode || '',
      phoneNumber: currentUser?.phoneNumber || '',
      // panNo: currentUser?.panNo || '',
      // publicUrl: currentUser?.publicUrl || '',
      securityAns: currentUser?.securityAns || '',
      securityQue: currentUser?.securityQue || '',
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
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    enqueueSnackbar('Successfully logged in');
  }, [enqueueSnackbar]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(currentUser ? 'Update success!' : 'Create success!');
      // router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={4} sx={{ justifyContent: 'center' }}>
        <Stack direction="column">
          <Typography variant="h4">User Profile</Typography>
          <Typography variant="body2" color="GrayText">
            Please fill the user details to continue
          </Typography>
        </Stack>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 4 }}>
            <Box
              rowGap={4}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="first_name" label="First Name *" />
              <RHFTextField name="last_name" label="Last Name *" />
              {/* Blank Field to skip place */}
              {/* {ismdlgUP && <Box />} */}
              <RHFTextField name="addressOne" label="Company Address 1 *" />
              <RHFTextField name="addressTwo" label="Company Address 2 " />
              <RHFTextField name="city" label="City *" />
              <RHFTextField name="state" label="State/Region *" />
              <RHFTextField name="zipCode" label="Zip/Code *" />
              <RHFTextField name="phoneNumber" label="Phone Number *" />
              {/* <RHFTextField name="publicUrl" label="Public URL of company" /> */}
              <RHFAutocomplete
                name="securityQue"
                label="Security Question *"
                options={securityQuestions.map((question) => question.label)}
                getOptionLabel={(option) => option}
                isOptionEqualToValue={(option, value) => option === value}
                renderOption={(props, option) => {
                  const { label } = securityQuestions.filter(
                    (question) => question.label === option
                  )[0];

                  if (!label) {
                    return null;
                  }

                  return (
                    <li {...props} key={label}>
                      <Iconify
                        key={label}
                        // icon={`circle-flags:${code.toLowerCase()}`}
                        width={28}
                        sx={{ mr: 1 }}
                      />
                      {label}
                    </li>
                  );
                }}
              />
              <RHFTextField name="securityAns" label="Answer of Security Question *" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Submit' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Stack>
    </FormProvider>
  );
}

UserForm.propTypes = {
  currentUser: PropTypes.object,
};
