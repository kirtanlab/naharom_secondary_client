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
import { useBuyInvoice } from 'src/queries/auction';
import { calculateInvestmentDetails } from 'src/utils/calc_xirr';
import moment from 'moment';

//
const { yupResolver } = require('@hookform/resolvers/yup');
const { useMemo, useEffect, useState } = require('react');
const { useForm, Controller } = require('react-hook-form');
//

function BuyModel({ row, onClose }) {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  // console.log('row BuyMmode: ', BuyModel);
  const buyInvoice = useBuyInvoice({ userId: user });

  const buySchema = Yup.object().shape({
    post_for_sellID: Yup.number().required('Deal ID is required!'),
    bill_type: Yup.string().required('Bill type is required'),
    no_of_units_available: Yup.number().required('Number of units is required!'),
    buy_no_of_units: Yup.number().required('Total number of units is required!'),
    fractional_unit_value: Yup.number().required('Fractional Price is required!'),
    buy_price_per_unit: Yup.number().required('Buy price per unit is required!'),
    payment_frequency: Yup.string()
      .oneOf(['Monthly', 'Annual', 'Semi-annual', 'Quarterly', 'Weekly'])
      .required('Payment Frequency is required'),
    interest_cut_off_time: Yup.string().required('Interest cut off time is required'),
    tenure_months: Yup.number().required('Tenure months is required'),
    xirr: Yup.number().required('Xirr is required'),
  });
  const defaultValues = useMemo(
    () => ({
      post_for_sellID: row?.post_for_sellID || '',
      bill_type: 'Buy options',
      no_of_units_available: row?.Invoice_remaining_units || null,
      buy_no_of_units: 1,
      fractional_unit_value: row?.Invoice_per_unit_price || null,
      buy_price_per_unit: row?.Invoice_per_unit_price || null,
      payment_frequency: row?.payment_frequency || 'Monthly',
      interest_cut_off_time: row?.interest_cut_off_time || '12:00 PM',
      tenure_months: Math.round(
        (row?.Invoice_tenure_in_days ?? 0) / 30.4166666667
      ) /** 30.4166666667 = 365/12 */,
      xirr: row?.Invoice_xirr || null,
    }),
    [row]
  );

  const methods = useForm({
    resolver: yupResolver(buySchema),
    defaultValues,
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

  const buyNoOfUnits = watch('buy_no_of_units');
  useEffect(() => {
    console.log('row: ', row);
    const disbursedDate = moment('2024-06-01', 'YYYY-MM-DD');
    const firstPaymentDate = moment('2024-07-01', 'YYYY-MM-DD');
    const paymentFrequency = 'MONTHLY';
    console.log(
      ' row.buy_price_per_unit * buyNoOfUnits,',
      row.Invoice_per_unit_price,
      buyNoOfUnits
    );
    if (buyNoOfUnits) {
      // Call the calculateInvestmentDetails function
      const result = calculateInvestmentDetails(
        row.Invoice_total_price, // loanAmount
        row.Invoice_no_of_units, // numFractions
        row.Invoice_interest / 100, // annualInterestRate (convert percentage to decimal)
        row.Invoice_tenure_in_days / 365, // loanPeriodYears
        buyNoOfUnits, // unitsBought
        moment(row?.Invoice_disbursement_date || disbursedDate), // disbursedDate
        moment(row?.Invoice_first_payment_date || firstPaymentDate), // firstPaymentDate
        row?.payment_frequency?.toUpperCase() || paymentFrequency // paymentFrequency
      );

      // Set the calculated XIRR value
      setValue('xirr', result.xirr.toFixed(2));
    }
  }, [buyNoOfUnits, row, setValue]);
  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('data onSubmit: ', data);
      const final_obj = {
        user,
        postForSaleID: data.post_for_sellID,
        no_of_units: data.buy_no_of_units,
      };
      console.log('final_obj: ', final_obj);
      const res_data = await buyInvoice.mutateAsync(final_obj);
      console.log('res data BuyMode: ', res_data);
      if (res_data) {
        enqueueSnackbar(`Deal Purchased Successfully`, {
          variant: 'success',
          color: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
      }
    } catch (err) {
      console.error('error in buy mode: ', err);
      enqueueSnackbar(`Something went wrong!`, {
        variant: 'error',
        color: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
    }
  });

  if (buyInvoice.isLoading) {
    console.log('buyInvoice isLoading');
  }

  if (buyInvoice.isError) {
    console.log('buyInvoice isError');
  }

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
            <RHFTextField disabled name="bill_type" label="Bill Type" />
            <RHFTextField disabled name="post_for_sellID" label="Deal ID" />
            <RHFTextField
              name="no_of_units_available"
              label="Total Number of Units Available"
              type="number"
              disabled
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setValue('no_of_units_available', value > 0 ? value : null);
              }}
            />
            <RHFAutocomplete
              name="buy_no_of_units"
              label="Units to buy"
              options={Array.from(
                { length: parseInt(watch('no_of_units_available') || '0', 10) },
                (_, i) => i + 1
              )}
              getOptionLabel={(option) => option.toString()}
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
            />
            <RHFTextField disabled name="fractional_unit_value" label="fractional Value" />
            <RHFTextField disabled name="buy_price_per_unit" label="Enter your buy price" />
            <RHFTextField disabled name="payment_frequency" label="Enter Payment Frequency" />
            <RHFTextField
              disabled
              name="interest_cut_off_time"
              label="Enter Interest Cut-Off time"
            />
            <RHFTextField disabled name="tenure_months" label="Tenure in months" />
            <RHFTextField disabled name="xirr" label="XIRR" />
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
              {/* <LoadingButton
                disabled={postInvoice.isLoading}
                variant="contained"
                onClick={handleCalculate}
              >
                Calculate
              </LoadingButton> */}
            </Stack>

            <LoadingButton
              loading={buyInvoice.isLoading}
              type="submit"
              variant="contained"
              color="primary"
            >
              Proceed To Buy
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
    </FormProvider>
  );
}

BuyModel.propTypes = {
  row: PropTypes.object,
  onClose: PropTypes.func,
};
export default BuyModel;
