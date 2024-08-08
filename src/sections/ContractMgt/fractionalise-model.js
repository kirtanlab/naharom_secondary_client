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

//
const { yupResolver } = require('@hookform/resolvers/yup');
const { useMemo, useEffect, useState } = require('react');
const { useForm, Controller } = require('react-hook-form');
//
function FractionalizeModel({ row, onClose }) {
  const { user } = useAuthContext();
  console.log('user in fractionalize: ', user);
  const remaining_amt = row?.remaining_amt ?? row?.principle_amt;
  const [calculationError, setCalculationError] = useState(null);
  const postInvoice = usePostInvoice({ userId: user });
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

  const fractionaliseSchema = Yup.object().shape({
    primary_invoice_id: Yup.number().required('Invoice ID is required'),
    no_of_units: Yup.number().integer().positive().required('Number of units is required'),
    per_unit_price: Yup.number().positive().required('Per unit price is required'),
    sale_price: Yup.number()
      .positive()
      .max(remaining_amt, `Sale price cannot exceed ${remaining_amt}`)
      .required('Sale price is required'),
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
    agree_to_terms: Yup.boolean().oneOf([true], 'It is required to agree to terms'),
  });

  const defaultValues = useMemo(() => {
    const fromDate = new Date();
    const toDate = new Date(fromDate.getTime() + (row?.tenure_in_days ?? 1) * 24 * 60 * 60 * 1000);

    return {
      primary_invoice_id: row.primary_invoice_id || '',
      no_of_units: null,
      per_unit_price: null,
      sale_price: null,
      total_remaining: row?.remaining_amt ?? row?.principle_amt,
      agree_to_terms: false,
      from_date: fromDate,
      to_date: toDate,
    };
  }, [row]);
  const methods = useForm({
    resolver: yupResolver(fractionaliseSchema),
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
  const agreed = watch('agree_to_terms');
  console.log('agreed: ', agreed);
  const watchNoOfUnits = watch('no_of_units');
  const watchPerUnitPrice = watch('per_unit_price');
  const watchSalePrice = watch('sale_price');

  const handleCalculate = () => {
    const noOfUnits = parseFloat(watchNoOfUnits);
    const perUnitPrice = parseFloat(watchPerUnitPrice);
    const salePrice = parseFloat(watchSalePrice);

    setCalculationError('');

    if (!noOfUnits && !perUnitPrice) {
      setCalculationError('Please input Total Units or Price per Unit to calculate');
      return;
    }

    if (noOfUnits && perUnitPrice) {
      const calculatedSalePrice = noOfUnits * perUnitPrice;
      if (calculatedSalePrice <= remaining_amt) {
        setValue('sale_price', calculatedSalePrice.toFixed(2), { shouldValidate: true });
      } else {
        setCalculationError(
          `Calculated Sale Price (${calculatedSalePrice.toFixed(
            2
          )}) exceeds the remaining amount (${remaining_amt})`
        );
      }
    } else if (noOfUnits && salePrice) {
      const calculatedPerUnitPrice = salePrice / noOfUnits;
      setValue('per_unit_price', calculatedPerUnitPrice.toFixed(2), { shouldValidate: true });
    } else if (perUnitPrice && salePrice) {
      const calculatedNoOfUnits = Math.floor(salePrice / perUnitPrice);
      setValue('no_of_units', calculatedNoOfUnits, { shouldValidate: true });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('data on Submit: ', data);
      const finalObj = {
        from_date: formatDate(data.from_date),
        to_date: formatDate(data.to_date),
        total_price: data.sale_price,
        per_unit_price: data.per_unit_price,
        no_of_units: data.no_of_units,
        primary_invoice_id: Number(data.primary_invoice_id),
        user: Number(user),
      };
      console.log('finalObj', finalObj);
      const resData = await postInvoice.mutateAsync(finalObj);
      if (resData && !postInvoice.isLoading) {
        console.log('resData: ', resData);
        enqueueSnackbar(`Invoice Posted Successfully`, {
          variant: 'success',
          color: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
        onClose();
      }
      // Handle form submission
    } catch (e) {
      enqueueSnackbar(`Something went wrong!`, {
        variant: 'error',
        color: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
      console.log('error while submitting irr: ', e);
    }
  });

  const mdUp = useResponsive('up', 'md');
  const lgUp = useResponsive('up', 'lg');
  const ismdlgUP = mdUp || lgUp;
  if (postInvoice.isLoading) {
    console.log('loading...');
  }
  if (postInvoice.isError) {
    console.log('error');
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
            <RHFTextField disabled name="primary_invoice_id" label="Primary Invoice Id" />
            <RHFTextField
              name="no_of_units"
              label="Total Fractions"
              type="number"
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setValue('no_of_units', value > 0 ? value : null);
              }}
            />
            <RHFTextField
              name="per_unit_price"
              label="Fractional Value"
              type="number"
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setValue('per_unit_price', value > 0 ? value : null);
              }}
            />
            <RHFTextField
              name="sale_price"
              label="Total Sale Price"
              type="number"
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (value > remaining_amt) {
                  setCalculationError(`Sale price cannot exceed ${remaining_amt}`);
                } else {
                  setCalculationError('');
                  setValue('sale_price', value > 0 ? value : null);
                }
              }}
            />
            <RHFTextField disabled name="total_remaining" label="Total Remaining Loan Amount" />
            <RHFAutocomplete
              name="type_of_sale"
              label="Type of sale"
              disabled
              defaultValue="Fixed Price Sale"
              options={['fixed_price_sale', 'bid_based_auction']}
              getOptionLabel={(option) => option}
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(props, option) => {
                const label = ['Fixed Price Sale', 'Bid Based Auction'].filter(
                  (t) => t === option
                )[0];
                if (!label) {
                  return null;
                }
                return (
                  <li {...props} key={label}>
                    {label}
                  </li>
                );
              }}
            />
            <Controller
              name="from_date"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="From Date"
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
                  label="To Date"
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
            {ismdlgUP && <Box />}
          </Box>
          <Box sx={{ ml: 1 }}>
            <Controller
              name="agree_to_terms"
              control={control}
              render={({ field, fieldState: { error } }) => {
                console.log('terms error: ', error);
                return (
                  <FormControl error={!!error}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checkedIcon={<CheckBoxRounded sx={{ color: 'green', height: 25 }} />}
                          icon={
                            <CheckBoxOutlined
                              sx={{ color: error ? 'red' : 'undefined', height: 25 }}
                            />
                          }
                          defaultChecked={false}
                          checked={field.value}
                          onChange={(event) => {
                            console.log('agree field: ', event.target.checked);
                            field.onChange(event.target.checked);
                          }}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            color: error ? 'red' : undefined,
                          }}
                        >
                          I agree to terms and conditions
                        </Typography>
                      }
                    />
                    {/* {error && (
                      <FormHelperText sx={{ fontSize: 16, ml: 3, pb: 2 }}>
                        {error.message}
                      </FormHelperText>
                    )} */}
                  </FormControl>
                );
              }}
            />
          </Box>
          {calculationError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {calculationError}
            </Typography>
          )}

          <Stack justifyContent="space-between" sx={{ mt: 3 }} direction="row">
            <Stack direction="row" spacing={2}>
              {/* <LoadingButton
                disabled={postInvoice.isLoading}
                variant="contained"
                onClick={() => reset(defaultValues)}
              >
                Reset
              </LoadingButton> */}
              <LoadingButton
                disabled={postInvoice.isLoading}
                variant="contained"
                onClick={handleCalculate}
              >
                Calculate
              </LoadingButton>
            </Stack>

            <LoadingButton
              loading={postInvoice.isLoading}
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

FractionalizeModel.propTypes = {
  row: PropTypes.object,
  onClose: PropTypes.func,
};
export default FractionalizeModel;
