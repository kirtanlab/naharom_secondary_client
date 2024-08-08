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
import { useSellInvoice } from 'src/queries/auction';

//
const { yupResolver } = require('@hookform/resolvers/yup');
const { useMemo, useEffect, useState } = require('react');
const { useForm, Controller } = require('react-hook-form');
//

function SellModel({ row, onClose, setIsSubmitting }) {
  const { user } = useAuthContext();
  const currentDate = new Date();
  const { enqueueSnackbar } = useSnackbar();
  const tenureInDays = row?.tenure_in_days ?? 1; // Default to 1 if undefined
  const default_to_date = new Date(currentDate.getTime() + tenureInDays * 24 * 60 * 60 * 1000);
  const incremented_to_date = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  const formatDate = (date) => {
    const d = new Date(date);
    let month = ''.concat(d.getMonth() + 1);
    let day = ''.concat(d.getDate());
    const year = d.getFullYear();

    if (month.length < 2) month = '0'.concat(month);
    if (day.length < 2) day = '0'.concat(day);

    return [year, month, day].join('-');
  };
  console.log('row of Sale: ', row);
  const sellInvoice = useSellInvoice({ userId: user });

  const sellSchema = Yup.object().shape({
    deal_id: Yup.string().required('Deal ID is required!'),
    bill_type: Yup.string().required('Bill type is required'),
    no_of_units_available: Yup.number().required('Number of units is required!'),
    sell_no_of_units: Yup.number().required('Total number of units is required!'),
    fractional_unit_value: Yup.number().required('Fractional Price is required!'),
    sell_price_per_unit: Yup.number().required('Sell price per unit is required!'),
    sell_total_price: Yup.number().required('Sell total price is required!'),
    payment_frequency: Yup.string()
      .oneOf(['Monthly', 'Annual', 'Semi-annual', 'Quarterly', 'Weekly'])
      .required('Payment Frequency is required'),
    interest_cut_off_time: Yup.string().required('Interest cut off time is required'),
    tenure_months: Yup.number().required('Tenure months is required'),
    xirr: Yup.number().required('Xirr is required'),
    from_date: Yup.date().required('Sale Start Date is required'),
    to_date: Yup.date()
      .required('Sale End Date is required')
      .test('is-after-from-date', 'End date must be after start date', (to_date, context) => {
        const { from_date } = context.parent;
        if (from_date && to_date) {
          return to_date > from_date;
        }
        return true;
      })
      .test(
        'is-at-least-one-day-after',
        'End date must be at least one day after the start date',
        (to_date, context) => {
          const { from_date } = context.parent;
          if (from_date && to_date) {
            const oneDayLater = new Date(from_date.getTime() + 24 * 60 * 60 * 1000);
            return to_date >= oneDayLater;
          }
          return true;
        }
      ),
  });
  const defaultValues = useMemo(() => {
    const fromDate = new Date();
    const toDate = new Date(fromDate.getTime() + (row?.tenure_in_days ?? 1) * 24 * 60 * 60 * 1000);

    return {
      deal_id: row?.Buyer_id || '',
      bill_type: 'Sell Options',
      no_of_units_available: row?.Purchased_remaining_units || null,
      sell_no_of_units: 1,
      fractional_unit_value: row?.Purchased_per_unit_price || null,
      sell_price_per_unit: row?.fractional_unit_value || null,
      payment_frequency: row?.payment_frequency || 'Monthly',
      sell_total_price: row?.sell_price_per_unit || null,
      interest_cut_off_time: row?.interest_cut_off_time || '12:00 PM',
      tenure_months: Math.round(
        (row?.Invoice_tenure_in_days ?? 0) / 30.4166666667
      ) /** 30.4166666667 = 365/12 */,
      xirr: row?.Invoice_xirr || null,
      from_date: fromDate,
      to_date: toDate,
    };
  }, [row]);

  const methods = useForm({
    resolver: yupResolver(sellSchema),
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
  const sell_no_of_units = watch('sell_no_of_units');
  const sell_price_per_unit = watch('sell_price_per_unit');

  useEffect(() => {
    if (sell_price_per_unit && sell_no_of_units) {
      const sell_total_price = sell_no_of_units * sell_price_per_unit;
      setValue('sell_total_price', sell_total_price);
    }
  }, [sell_price_per_unit, sell_no_of_units, setValue]);
  console.log('error: ', errors);
  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      console.log('data onSubmit: ', data);
      const final_obj = {
        user,
        buyerID: data.deal_id,
        no_of_units: data.sell_no_of_units,
        per_unit_price: data.sell_price_per_unit,
        total_price: data.sell_total_price,

        from_date: new Date(data.from_date).toISOString().split('T')[0],
        to_date: new Date(data.to_date).toISOString().split('T')[0],
      };
      console.log('final_obj: ', final_obj);
      const res_data = sellInvoice.mutateAsync(final_obj);
      console.log('res data Sellmodel: ', res_data);
      if (res_data) {
        enqueueSnackbar(`Deal posted for sale successfully`, {
          variant: 'success',
          color: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
      }
    } catch (err) {
      console.error('error in sell mode: ', err);
      enqueueSnackbar(`Something went wrong!`, {
        variant: 'error',
        color: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  if (sellInvoice.isLoading) {
    console.log('sellInvoice isLoading');
  }

  if (sellInvoice.isError) {
    console.log('sellInvoice isError');
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
            <RHFTextField disabled name="buyerID" label="Deal ID" />
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
              name="sell_no_of_units"
              label="Units to Sell"
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
            <RHFTextField name="sell_price_per_unit" label="Enter your fractional sell price" />
            <RHFTextField disabled name="sell_total_price" label="Enter your total sell price" />
            <RHFTextField disabled name="payment_frequency" label="Enter Payment Frequency" />
            <RHFTextField
              disabled
              name="interest_cut_off_time"
              label="Enter Interest Cut-Off time"
            />
            <RHFTextField disabled name="tenure_months" label="Tenure in months" />
            <RHFTextField disabled name="xirr" label="XIRR" />
            <Controller
              name="from_date"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="Sale Start Date"
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                    // Update to_date if it's before the new from_date
                    const currentToDate = getValues('to_date');
                    if (currentToDate && newValue && currentToDate <= newValue) {
                      setValue('to_date', new Date(newValue.getTime() + 24 * 60 * 60 * 1000), {
                        shouldValidate: true,
                      });
                    }
                  }}
                  minDate={new Date()}
                  maxDate={new Date(default_to_date.getTime() - 24 * 60 * 60 * 1000)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!error,
                      helperText: error?.message,
                    },
                  }}
                />
              )}
            />

            <Controller
              name="to_date"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="Sale End Date"
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                  }}
                  minDate={new Date(watch('from_date').getTime() + 24 * 60 * 60 * 1000)}
                  maxDate={default_to_date}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!error,
                      helperText: error?.message,
                    },
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
              {/* <LoadingButton
                disabled={postInvoice.isLoading}
                variant="contained"
                onClick={handleCalculate}
              >
                Calculate
              </LoadingButton> */}
            </Stack>

            <LoadingButton
              loading={sellInvoice.isLoading}
              type="submit"
              variant="contained"
              color="primary"
            >
              Proceed To Sell
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
    </FormProvider>
  );
}

SellModel.propTypes = {
  row: PropTypes.object,
  onClose: PropTypes.func,
  setIsSubmitting: PropTypes.func,
};
export default SellModel;
