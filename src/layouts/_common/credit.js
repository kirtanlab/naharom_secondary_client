import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { DatePicker } from '@mui/x-date-pickers';
import { fDate } from 'src/utils/format-time';
import { useResponsive } from 'src/hooks/use-responsive';
import { CheckBoxOutlined, CheckBoxRounded } from '@mui/icons-material';
import { usePostInvoice } from 'src/queries/invoices';
import { useSnackbar } from 'notistack';
import { addDays } from 'date-fns'; // Make sure to import this
import { useAuthContext } from 'src/auth/hooks';
import { useCreditFunds } from 'src/queries/ledger';
import { LoadingScreen, SplashScreen } from 'src/components/loading-screen';
//
const { yupResolver } = require('@hookform/resolvers/yup');
const { useMemo, useEffect, useState } = require('react');
const { useForm, Controller } = require('react-hook-form');
//

function CreditMModel({ onClose }) {
  const { enqueueSnackbar } = useSnackbar();
  const { balance, user: userId } = useAuthContext();
  const credit = useCreditFunds({ userId });
  const withdrawSchema = Yup.object().shape({
    credit_amount: Yup.number()
      .positive()

      .max(balance, `Withdraw amount can't exceed ${balance}`)
      .required('Withdrawal Amount is Required'),
  });

  const methods = useForm({
    resolver: yupResolver(withdrawSchema),
    // defaultValues,
  });
  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    getValues,
    formState: { isSubmitting, isDirty, dirtyFields, errors },
  } = methods;
  const onSubmit = handleSubmit(async (data) => {
    try {
      const final_obj = {
        user: userId,
        amount: data.credit_amount,
      };
      console.log('credit final_obj', final_obj);
      const resData = await credit.mutateAsync(final_obj);
      if (resData) {
        enqueueSnackbar(`${resData.message}`, {
          variant: 'success',
          color: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
        window.location.reload();
        onClose();
      }
    } catch (err) {
      if (credit.error) {
        console.log(err);
      }
      enqueueSnackbar(`Something went wrong!`, {
        variant: 'error',
        color: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
      console.log('error while submitting irr: ', err);
    }
  });
  if (credit.isLoading) {
    return <SplashScreen />;
  }
  // if (withdraw.isError) {
  //   enqueueSnackbar(`Something went wrong!`, {
  //     variant: 'error',
  //     color: 'error',
  //     anchorOrigin: { vertical: 'top', horizontal: 'center' },
  //   });
  // }
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid xs={12} md={10}>
        <Card sx={{ p: 3 }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField
              name="credit_amount"
              label="Total Credit Amount"
              type="number"
              rules={{
                pattern: {
                  value: /^\d+(\.\d{0,3})?$/,
                  message: 'Maximum 3 decimal places allowed',
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Total Credit Amount"
                  type="text"
                  error={!!error}
                  helperText={error?.message}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,3}$/.test(value) || value === '') {
                      field.onChange(value);
                    }
                  }}
                />
              )}
            />
          </Box>

          <Stack justifyContent="space-between" sx={{ mt: 3 }} direction="row">
            <Stack direction="row" spacing={2}>
              {/* <LoadingButton
                disabled={postInvoice.isLoading}
                variant="contained"
                onClick={() => reset(defaultValues)}
              >
                Reset
              </LoadingButton> */}
              <LoadingButton disabled={credit.isLoading} variant="contained" onClick={onClose}>
                Cancel
              </LoadingButton>
            </Stack>

            <LoadingButton
              loading={credit.isLoading}
              type="submit"
              variant="contained"
              color="primary"
            >
              Credit
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
    </FormProvider>
  );
}
CreditMModel.propTypes = {
  onClose: PropTypes.func,
};

export default CreditMModel;
