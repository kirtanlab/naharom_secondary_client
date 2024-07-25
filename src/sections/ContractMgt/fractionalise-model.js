import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Checkbox, FormControlLabel, Grid, Stack } from '@mui/material';
import { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { DatePicker } from '@mui/x-date-pickers';
import { fDate } from 'src/utils/format-time';
//
const { yupResolver } = require('@hookform/resolvers/yup');
const { useMemo } = require('react');
const { useForm, Controller } = require('react-hook-form');
//
function FractionalizeModel({ row }) {
  const buyIrrSchema = Yup.object().shape({});
  const defaultValues = useMemo(() => ({}), []);
  const methods = useForm({
    resolver: yupResolver(buyIrrSchema),
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
  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('data: ', data);
    } catch (e) {
      console.log('error while submmitting irr: ', e);
    }
  });
  console.log('row?.tenure_in_days: ', row?.tenure_in_days);
  const currentDate = new Date();
  const tenureInDays = row?.tenure_in_days ?? 1; // Default to 1 if undefined
  const default_to_date = new Date(currentDate.getTime() + tenureInDays * 24 * 60 * 60 * 1000);

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
            <RHFTextField name="loan_id" label="Loan Id" />
            <RHFTextField name="fractionalized_units" label="Total Fractions" />
            <RHFTextField name="fractionalized_amount" label="Fractional Value" />
            <RHFTextField name="sale_price" label="Sale Price" />
            <RHFAutocomplete
              name="type_of_sale"
              label="Type of sale"
              disabled
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
              render={({ field, fieldState: { error } }) => {
                console.log('field: ', field);
                return (
                  <DatePicker
                    label="From Date"
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                    defaultValue={new Date()}
                    minDate={new Date()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                );
              }}
            />
            <Controller
              name="to_date"
              control={control}
              render={({ field, fieldState: { error } }) => {
                console.log('field: ', field);
                return (
                  <DatePicker
                    label="To Date"
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                    defaultValue={default_to_date}
                    minDate={new Date()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                );
              }}
            />
            <Controller
              name="agree_to_terms"
              control={control}
              render={({ field, fieldState: { error } }) => {
                console.log('field: ', field);
                return (
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked={false}
                        checked={field.value}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    }
                    label="I agree to the terms and conditions"
                  />
                );
              }}
            />
          </Box>
          <Stack justifyContent="space-between" sx={{ mt: 3 }} direction="row">
            <LoadingButton variant="contained">Reset</LoadingButton>

            <LoadingButton type="submit" variant="contained">
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
};
export default FractionalizeModel;
