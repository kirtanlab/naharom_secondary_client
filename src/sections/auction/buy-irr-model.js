import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
//
const { yupResolver } = require('@hookform/resolvers/yup');
const { useMemo } = require('react');
const { useForm } = require('react-hook-form');

function BuyIrrModel({ row }) {
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
            <RHFTextField name="buy_price" label="Buy Price" />
            <RHFTextField name="no_days_held" label="Enter Number of Days Held" />
            <RHFTextField name="expected_profit" label="Enter the Expected Profit" />
            <RHFTextField name="total_earnings" label="Total Earnings" />
            <RHFTextField name="interest" label="Interest" />
            <RHFTextField name="xirr" label="Enter the XIRR" />
          </Box>
          <Stack justifyContent="space-between" sx={{ mt: 3 }} direction="row">
            <Stack spacing={2} direction="row">
              <LoadingButton type="submit" variant="contained">
                Calculate
              </LoadingButton>
              <LoadingButton type="submit" variant="contained">
                Reset
              </LoadingButton>
            </Stack>

            <LoadingButton type="submit" variant="contained">
              Buy
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
    </FormProvider>
  );
}

BuyIrrModel.propTypes = {
  row: PropTypes.object,
};
export default BuyIrrModel;
