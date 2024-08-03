import PropTypes from 'prop-types';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Typography,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  InputAdornment,
  FormControl,
  FormLabel,
  FormHelperText,
  styled,
} from '@mui/material';
import { useAuthContext } from 'src/auth/hooks';

const schema = Yup.object().shape({
  loginType: Yup.string().required('Please select a login type'),
  mobileNumber: Yup.string()
    .required('Mobile number is required')
    .matches(/^[0-9]{10}$/, 'Enter a Valid Mobile Number'),
});

const StyledRadioGroup = styled(RadioGroup)(({ theme }) => ({
  border: `1.75px solid ${theme.palette.grey[300]}`,
  borderRadius: theme.shape.borderRadius,
  // padding: theme.spacing(1),
  '&:focus-within': {
    borderColor: theme.palette.text.primary,
    // boxShadow: `0 0 0 1px ${theme.palette.primary.light}`,
  },
  '&:hover': {
    borderColor: theme.palette.text.primary,
  },
}));

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  margin: 0,
  width: '50%',
  padding: theme.spacing(1),
  '& .MuiRadio-root': {
    padding: theme.spacing(1),
  },
  '&:has(.Mui-checked)': {
    backgroundColor: 'transparent',
    '& .MuiTypography-root': {
      fontWeight: 'bold',
    },
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function LoginForm({ onSubmit }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      loginType: 'Individual',
      mobileNumber: '',
    },
  });
  const { testDemo } = useAuthContext();
  const onSubmitForm = (data) => {
    onSubmit(data);
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', textAlign: 'left' }}>
      <Typography variant="h4" gutterBottom align="center">
        Welcome
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4 }} align="center">
        Please select your login type and enter your mobile number
      </Typography>

      <form onSubmit={handleSubmit(onSubmitForm)}>
        <FormControl component="fieldset" error={!!errors.loginType} fullWidth margin="normal">
          {/* <FormLabel component="legend">Login Type</FormLabel> */}
          <Controller
            name="loginType"
            control={control}
            render={({ field }) => (
              <StyledRadioGroup {...field} row>
                <StyledFormControlLabel
                  value="Individual"
                  control={<Radio size="medium" />}
                  label="Individual"
                />
                <StyledFormControlLabel
                  value="Company"
                  control={<Radio size="medium" />}
                  label="Company"
                />
              </StyledRadioGroup>
            )}
          />
          <FormHelperText>{errors.loginType?.message}</FormHelperText>
        </FormControl>

        <Controller
          name="mobileNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              margin="normal"
              label="Mobile Number"
              error={!!errors.mobileNumber}
              helperText={errors.mobileNumber?.message}
              InputProps={{
                startAdornment: <InputAdornment position="start">+91</InputAdornment>,
              }}
              placeholder="Enter 10 digit mobile number"
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          sx={{ mt: 3 }}
        >
          Continue
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={() => {
            testDemo(3);
            window.location.reload();
          }}
          sx={{ mt: 3 }}
        >
          Developer Entry
        </Button>
      </form>
    </Box>
  );
}
LoginForm.propTypes = {
  onSubmit: PropTypes.func,
};
