import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams, useRouter } from 'src/routes/hooks';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import {
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  RadioGroup,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { LoginButton } from 'src/layouts/_common';
import { useNavigate } from 'react-router';
import { LoadingScreen } from 'src/components/loading-screen';
import { useGenerateOTP } from 'src/queries/auth';
import { useSnackbar } from 'notistack';
//
import LoginForm from './login-form';

// ----------------------------------------------------------------------

export default function JwtOnboard() {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const loading = true;
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams, setSearchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/dashboard';
  const [selectedValue, setSelectedValue] = useState(searchParams.get('selected') || 'individual');
  const [errorMsg, setErrorMsg] = useState('');
  // const [selectedValue, setSelectedValue] = React.useState('individual');
  const generateOTP = useGenerateOTP();
  useEffect(() => {
    setSearchParams({
      returnTo,
      selected: selectedValue,
    });
  }, [setSearchParams, searchParams, selectedValue, returnTo]);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const LoginSchema = Yup.object().shape({
    userType: Yup.string(),
    mobileNumber: Yup.string()
      .required('Mobile Number is Required')
      .matches(/^[0-9]{10}$/, 'Must be exactly 10 digits'),
  });

  const defaultValues = {
    userType: 'individual',
    mobileNumber: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });
  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const onSubmit = handleSubmit(async (data) => {
  //   try {
  //     setSearchParams({ returnTo, selected: selectedValue });
  //     router.push(`${paths.auth.jwt.otp}?returnTo=${returnTo}&selectedValue=${selectedValue}`);
  //     console.log('Selected value:', selectedValue);
  //   } catch (error) {
  //     console.error(error);
  //     reset();
  //     setErrorMsg(typeof error === 'string' ? error : error.message);
  //   }
  // });
  if (generateOTP.status === 'loading') {
    return <LoadingScreen />;
  }

  const onSubmit = async (data) => {
    try {
      console.log('Form submitted:', data);
      const final_data = {
        countryCode: '91',
        mobileNumber: data.mobileNumber,
      };
      const res_data = await generateOTP.mutateAsync(final_data);
      // const res_data = {
      //   results: {
      //     refId: 'www',
      //   },
      // };
      console.log('data after generateOTP:', res_data);
      if (res_data) {
        enqueueSnackbar(`OTP sent on ${data.mobileNumber}!`, {
          variant: 'success',
          color: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
        navigate(`${paths.auth.jwt.otp}`, {
          state: {
            loginType: data.loginType,
            mobileNumber: data.mobileNumber,
            refId: res_data.result.referenceId,
          },
        });
      }
    } catch (err) {
      console.log('genereateOTP error; ', generateOTP?.failureReason?.response?.data?.message, err);
      const message = generateOTP?.failureReason?.response?.data?.message
        ? generateOTP?.failureReason?.response?.data?.message
        : "Can't generate OTP at this time";
      enqueueSnackbar("Can't generate OTP at this time", {
        variant: 'error',
        color: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
      // alert('Check your internet connectivity');
      console.log('error in handleSubmit of GenerateOTP');
      console.log('error: ', generateOTP.error);
    }

    // Here you can add logic to proceed to the next step or send data to your backend
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <LoginForm onSubmit={onSubmit} />
    </Box>
  );
}
