import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

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
import { FormControlLabel, Radio, FormControl, FormLabel, RadioGroup, Button } from '@mui/material';
import { LoginButton } from 'src/layouts/_common';

// ----------------------------------------------------------------------

export default function JwtOnboard() {
  const { login } = useAuthContext();

  const router = useRouter();
  const [searchParams, setSearchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/dashboard';
  const [selectedValue, setSelectedValue] = useState(searchParams.get('selected') || 'individual');
  const [errorMsg, setErrorMsg] = useState('');
  // const [selectedValue, setSelectedValue] = React.useState('individual');

  useEffect(() => {
    setSearchParams({
      returnTo,
      selected: selectedValue,
    });
  }, [setSearchParams, searchParams, selectedValue, returnTo]);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: 'demo@minimals.cc',
    password: 'demo1234',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSearchParams({ returnTo, selected: selectedValue });
      router.push(`${paths.auth.jwt.login}?returnTo=${returnTo}&selectedValue=${selectedValue}`);
      console.log('Selected value:', selectedValue);
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h3">Welcome</Typography>

      {/* <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">New user?</Typography>

        <Link component={RouterLink} href={paths.auth.jwt.register} variant="subtitle2">
          Create an account
        </Link>
      </Stack> */}
    </Stack>
  );

  const renderSelection = (
    <Stack spacing={2.5}>
      <FormControl component="fieldset">
        <Typography
          sx={{
            fontSize: 18,
            marginBottom: '16px',
          }}
        >
          Login/ Register as
        </Typography>
        <RadioGroup name="radio-buttons" value={selectedValue} onChange={handleChange}>
          <FormControlLabel
            value="individual"
            control={<Radio size="medium" />}
            sx={{ marginTop: 2 }}
            label={<Typography sx={{ fontSize: 16 }}>Individual</Typography>}
          />
          <FormControlLabel
            value="company"
            control={<Radio size="medium" />}
            sx={{ marginTop: 2 }}
            label={<Typography sx={{ fontSize: 16 }}>Company</Typography>}
          />
        </RadioGroup>
        <Button
          variant="contained"
          color="inherit"
          type="submit"
          // onClick={handleSubmit}
          sx={{ marginTop: 5, width: '40%' }}
        >
          <Typography sx={{ fontSize: 16 }}>Next</Typography>
        </Button>
      </FormControl>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}
      {renderSelection}
    </FormProvider>
  );
}
