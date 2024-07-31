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
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import StorefrontIcon from '@mui/icons-material/Storefront';
import WalletIcon from '@mui/icons-material/Wallet';
import { Button } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { useLocation } from 'react-router';
import { getSession, setSession } from 'src/auth/context/jwt/utils';
// ----------------------------------------------------------------------

export default function OneView() {
  const settings = useSettingsContext();
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const { accessToken, userId } = getSession();
  console.log('userId', userId);
  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   const userId = sessionStorage.getItem('userId');
  //   const isImpersonation = params.get('impersonation');

  //   if (isImpersonation === 'true') {
  //     setSession({accessToken:  })
  //   }
  // }, [location]);

  // console.log('userId:', userId);
  const completionBooleans = [
    {
      label: 'Complete the registration',
      value: true,
      continue: false,
      name: 'register',
    },
    {
      label: 'Complete the user profile',
      value: false /** whether the filled or not */,
      continue: true /** whether to show continue button */,
      name: 'profile',
    },
    {
      label: 'Bank account',
      value: false,
      continue: true,
      warning: 'Please fill your user profile',
      name: 'bank',
    },
    {
      label: 'PAN No.',
      value: false,
      continue: true,
      warning: 'Please fill your user profile',
      name: 'pan',
    },
    {
      label: 'Add Funds',
      value: false,
      continue: false,
      warning: 'Please fill your bank account details',
      name: 'fund',
    },
  ];

  const routes = {
    profile: 'profile',
    company: 'company',
    bank: 'bank',
    pan: 'pan',
    password: 'password',
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Box
        sx={{
          mt: 5,
          width: 1,
          height: 'auto',
          padding: 3,
          borderRadius: 2,
          textAlign: 'center',
          boxShadow: theme.customShadows.z8,
          bgcolor: alpha(theme.palette.grey[500], 0.04),
          border: `dashed 1px ${theme.palette.divider}`,
        }}
      >
        <Stack spacing={1}>
          <Typography variant="h5" sx={{ alignSelf: 'start' }}>
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
                        onClick={() =>
                          router.push(`${paths.dashboard.three}?init=${routes[card.name]}`)
                        }
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
      <Box
        sx={{
          mt: 10,
          width: 1,
          height: 'auto',
          // padding: 1,
          borderRadius: 2,
          textAlign: 'center',
          // boxShadow: theme.customShadows.z8,
          // bgcolor: alpha(theme.palette.grey[500], 0.04),
          // border: `dashed 1px ${theme.palette.divider}`,
        }}
      >
        <Stack
          direction={isMobile ? 'column' : 'row'}
          spacing={isMobile ? 2 : 5}
          alignItems="center"
          justifyContent="space-between"
        >
          <Card
            // key={index}
            sx={{
              height: 180,
              width: '100%',
              position: 'relative', // Added for absolute positioning of "Continue" text
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 1.5,
              padding: 1,
            }}
          >
            <WalletIcon
              sx={{
                borderRadius: 10,
                height: 40,
                width: 40,
                padding: 1,
                // backgroundColor: card.value
                //   ? theme.palette.success.main
                //   : theme.palette.grey.A100,
                // color: card.value ? theme.palette.common.white : theme.palette.text.disabled,
              }}
            />
          </Card>
          <Card
            // key={index}
            sx={{
              height: 180,
              width: '100%',
              position: 'relative', // Added for absolute positioning of "Continue" text
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 1.5,
              padding: 1,
            }}
          >
            <WalletIcon
              sx={{
                borderRadius: 10,
                height: 40,
                width: 40,
                padding: 1,
                // backgroundColor: card.value
                //   ? theme.palette.success.main
                //   : theme.palette.grey.A100,
                // color: card.value ? theme.palette.common.white : theme.palette.text.disabled,
              }}
            />
          </Card>
          <Card
            // key={index}
            sx={{
              height: 180,
              width: '100%',
              position: 'relative', // Added for absolute positioning of "Continue" text
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 1.5,
              padding: 1,
            }}
          >
            <WalletIcon
              sx={{
                borderRadius: 10,
                height: 40,
                width: 40,
                padding: 1,
                // backgroundColor: card.value
                //   ? theme.palette.success.main
                //   : theme.palette.grey.A100,
                // color: card.value ? theme.palette.common.white : theme.palette.text.disabled,
              }}
            />
          </Card>
        </Stack>
      </Box>
    </Container>
  );
}
