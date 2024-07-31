import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, TextField, Button, Grid, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);

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

  const handleChange = (index, value) => {
    if (Number.isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    console.log('Submitted OTP:', otpString);
    // Add your OTP verification logic here
  };

  const handleResendOTP = () => {
    console.log('Resending OTP...');
    // Add your resend OTP logic here
    setCanResend(false);
    setTimer(60);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          OTP Verification
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2} justifyContent="center">
            {otp.map((digit, index) => (
              <Grid item key={index}>
                <TextField
                  id={`otp-${index}`}
                  variant="outlined"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: 'center', fontSize: '1.5rem' },
                  }}
                  sx={{ width: '3rem' }}
                />
              </Grid>
            ))}
          </Grid>
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
