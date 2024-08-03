import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Container, Typography, TextField, Button, Grid, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useLocation, useNavigate } from 'react-router';
import { useGenerateOTP, useVerifyOTP } from 'src/queries/auth';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSnackbar } from 'notistack';
import { paths } from 'src/routes/paths';
import { setLocalSession } from 'src/auth/context/jwt/utils';
//
const schema = yup.object().shape({
  otp: yup
    .array()
    .of(yup.string().required('OTP is required').length(1, 'Must be exactly 1 digit'))
    .length(6, 'Must be exactly 6 digits'),
});

const OTPVerification = () => {
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const generateOTP = useGenerateOTP();
  const { loginType, mobileNumber, refId } = location.state || {};
  console.log('data from previous page: ', loginType, mobileNumber, refId);
  const [referenceId, setRefId] = useState(refId);
  const verifyOTP = useVerifyOTP();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      otp: ['', '', '', '', '', ''],
    },
  });

  useEffect(() => {
    let interval;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);
  if (verifyOTP.isLoading || generateOTP.isLoading) {
    return <LoadingScreen />;
  }
  const handleChange = (index, value) => {
    if (Number.isNaN(Number(value))) return;
    setValue(`otp[${index}]`, value);
    trigger(`otp[${index}]`);
    if (value !== '' && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const onSubmit = async (data) => {
    // Add your OTP verification logic here
    try {
      const otpString = data.otp.join('');
      console.log('Submitted OTP:', otpString);
      const final_data = {
        countryCode: '91',
        mobileNumber,
        user_role: loginType,
        referenceId,
        otp: otpString,
        extraFields: false,
      };
      const res_data = await verifyOTP.mutateAsync(final_data);
      console.log('Verified OTP:', res_data);
      if (res_data) {
        enqueueSnackbar(`Welcome, You're successfully logged in`, {
          variant: 'success',
          color: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
        setLocalSession({ userId: res_data.user });
        window.location.reload();
        // if (loginType === 'individual') {
        //   navigate(`${paths.profile.user}`, {
        //     state: {
        //       user_id: res_data.user_id,
        //     },
        //   });
        // } else {
        //   navigate(`${paths.profile.company}`, {
        //     state: {
        //       loginType: data.loginType,
        //       mobileNumber: data.mobileNumber,
        //     },
        //   });
        // }
      }
    } catch (err) {
      console.log('VerifyOTP error; ', verifyOTP?.failureReason?.response?.data?.message, err);
      enqueueSnackbar(
        verifyOTP?.failureReason?.response?.data?.message
          ? verifyOTP?.failureReason?.response?.data?.message
          : "Can't Verify OTP at this time",
        {
          variant: 'error',
          color: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        }
      );
      // alert('Check your internet connectivity');
      console.log('error in handleSubmit of VerifyOTP');
      console.log('error: ', verifyOTP.error);
    }
  };

  const handleResendOTP = async () => {
    try {
      const final_data = {
        countryCode: '91',
        mobileNumber,
      };
      const res_data = await generateOTP.mutateAsync(final_data);
      // const res_data = {
      //   results: {
      //     refId: 'www',
      //   },
      // };
      console.log('data after generateOTP:', res_data);
      if (res_data) {
        enqueueSnackbar(`OTP sent on ${mobileNumber}!`, {
          variant: 'success',
          color: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
        setRefId(res_data.result.referenceId);
        setCanResend(false);
        setTimer(60);
      }
    } catch (err) {
      console.log('genereateOTP error; ', generateOTP?.failureReason?.response?.data?.message, err);
      enqueueSnackbar(
        generateOTP?.failureReason?.response?.data?.message
          ? generateOTP?.failureReason?.response?.data?.message
          : "Can't generate OTP at this time",
        {
          variant: 'error',
          color: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        }
      );
      // alert('Check your internet connectivity');
      console.log('error in handleSubmit of GenerateOTP');
      console.log('error: ', generateOTP.error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          OTP Verification
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <Grid container spacing={2} justifyContent="center">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <Grid item key={index}>
                <Controller
                  name={`otp[${index}]`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id={`otp-${index}`}
                      variant="outlined"
                      onChange={(e) => handleChange(index, e.target.value)}
                      error={errors.otp && !!errors.otp[index]}
                      inputProps={{
                        maxLength: 1,
                        style: { textAlign: 'center', fontSize: '1.5rem' },
                      }}
                      sx={{ width: '3rem' }}
                    />
                  )}
                />
              </Grid>
            ))}
          </Grid>
          {errors.otp && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errors.otp.message}
            </Typography>
          )}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Verify OTP
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {canResend ? (
              <Button variant="text" onClick={handleResendOTP} startIcon={<RefreshIcon />}>
                Resend OTP
              </Button>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Resend OTP in {timer} seconds
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default OTPVerification;
