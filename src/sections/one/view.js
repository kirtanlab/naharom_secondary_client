// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import useMediaQuery from '@mui/material/useMediaQuery';
// components
import { useSettingsContext } from 'src/components/settings';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Button } from '@mui/material';
// ----------------------------------------------------------------------

export default function OneView() {
  const settings = useSettingsContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const COLORS = ['inherit', 'primary', 'secondary', 'info', 'success', 'warning', 'error'];
  const completionBooleans = [
    {
      label: 'Complete the registration',
      value: true,
      continue: false,
    },
    {
      label: 'Complete the user profile',
      value: true,
      continue: false,
    },
    {
      label: 'Bank account',
      value: false,
      continue: true,
      warning: 'Please fill your user profile',
    },
    {
      label: 'PAN No.',
      value: false,
      continue: true,
      warning: 'Please fill your user profile',
    },
    {
      label: 'Add Funds',
      value: false,
      continue: false,
      warning: 'Please fill your bank account details',
    },
  ];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Box
        sx={{
          mt: 5,
          width: 1,
          height: 'auto',
          padding: 2,
          borderRadius: 2,
          textAlign: 'center',
          boxShadow: theme.customShadows.z8,
          bgcolor: alpha(theme.palette.grey[500], 0.04),
          border: `dashed 1px ${theme.palette.divider}`,
        }}
      >
        <Stack spacing={1}>
          <Typography variant="h4" sx={{ alignSelf: 'start' }}>
            Complete Your Profile
          </Typography>
          <LinearProgress
            key="primary"
            value={50}
            variant="determinate"
            color="primary"
            sx={{ mb: 1, width: 1, height: 8, borderRadius: 20 }}
          />
          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={isMobile ? 2 : 5}
            alignItems="center"
            justifyContent="center"
          >
            {completionBooleans.map((card, index) => (
              <Card
                key={index}
                sx={{
                  height: 180,
                  width: 200,
                  position: 'relative', // Added for absolute positioning of "Continue" text
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 1.5,
                  padding: 1,
                }}
              >
                <Stack
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                  spacing={2}
                  sx={{ paddingTop: 2 }}
                >
                  <CheckOutlinedIcon
                    sx={{
                      borderRadius: 10,
                      height: 40,
                      width: 40,
                      padding: 1,
                      backgroundColor: card.value
                        ? theme.palette.success.main
                        : theme.palette.grey.A100,
                      color: card.value ? theme.palette.common.white : theme.palette.text.disabled,
                    }}
                  />
                  <Typography variant="h7" fontWeight="bold">
                    {card.label}
                  </Typography>
                </Stack>
                {card.continue && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 5,
                    }}
                  >
                    <Stack direction="row">
                      <Button
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          // gap: 0.,
                          color: theme.palette.primary.main,
                          '&:hover': {
                            color: theme.palette.primary.dark,
                          },
                          '&:active': {
                            color: theme.palette.primary.light,
                          },
                          '&:focus': {
                            color: theme.palette.primary.main,
                          },
                        }}
                        onClick={() => alert('Woww')}
                      >
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color={theme.palette.primary.main}
                        >
                          Continue
                        </Typography>
                        <KeyboardDoubleArrowRightIcon color="primary" />
                      </Button>
                    </Stack>
                  </Box>
                )}
                {!card.continue && !card.value && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 5,
                    }}
                  >
                    <Stack direction="row">
                      <Button
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          // gap: 0.2,
                          color: theme.palette.action.disabled,
                          '&:hover': {
                            color: theme.palette.action.disabledBackground,
                          },
                          '&:active': {
                            color: theme.palette.action.disabled,
                          },
                          '&:focus': {
                            color: theme.palette.action.disabled,
                          },
                        }}
                        onClick={() => alert(card?.warning)}
                      >
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color={theme.palette.action.disabled}
                        >
                          Continue
                        </Typography>
                        <KeyboardDoubleArrowRightIcon color="disabled" />
                      </Button>
                    </Stack>
                  </Box>
                )}
              </Card>
            ))}
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}
