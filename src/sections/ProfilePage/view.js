// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSearchParams } from 'src/routes/hooks';
import { useSettingsContext } from 'src/components/settings';
import { Button, Card, Divider, Grid, Stack, Tab, Tabs } from '@mui/material';
import { tabsClasses } from '@mui/material/Tabs';
import Iconify from 'src/components/iconify';
import { useCallback, useEffect, useState } from 'react';
import UserForm from '../profile-auth/user-profile';
import CompanyForm from '../profile-auth/company-profile';
import BankAccount from '../BankAccounts/bank-accounts-list';
import PANList from '../PAN/pan-list';
import Password from '../profile-auth/password';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'profile',
    label: 'Profile',
    icon: <Iconify icon="solar:user-id-outline" width={26} />,
    disabled: false,
  },
  {
    value: 'company',
    label: 'Company Profile',
    icon: <Iconify icon="octicon:organization-16" width={24} />,

    disabled: false,
  },
  {
    value: 'bank',
    label: 'Bank Account',
    icon: <Iconify icon="ant-design:bank-filled" width={27} />,
    disabled: false,
  },

  {
    value: 'pan',
    label: 'PAN Number',
    icon: <Iconify icon="solar:document-outline" width={24} />,
    disabled: false,
  },
  {
    value: 'password',
    label: 'Password',
    icon: <Iconify icon="teenyicons:password-outline" width={22} />,

    disabled: false,
  },
];

const BankAccounts = [
  {
    account_no: 239823892398,
    IFSC_code: 'SBIN000023',
    acc_type: 'savings',
  },
  {
    account_no: 578478489834,
    IFSC_code: 'HDFCN000023',
    acc_type: 'current',
  },
  {
    account_no: 344334533343,
    IFSC_code: 'CNR000023',
    acc_type: 'savings',
  },
  {
    account_no: 21313321312,
    IFSC_code: 'SBIN000023',
    acc_type: 'current',
  },
];
const PanDetail = [
  {
    PAN_Number: 'GTP123213121',
    Added_at: '21-2-2024',
  },
];

export default function ProfileView() {
  const settings = useSettingsContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState(searchParams.get('init') || 'profile');
  // useEffect(() => {
  //   if (searchParams.length === 0) {
  //     setSearchParams({ init: 'profile' });
  //   }
  // }, [setSearchParams, searchParams]);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> Profile </Typography>

      <Box
        sx={{
          mt: 2,
          width: 1,
          // height: 'auto',
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      >
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            bottom: 0,
            // zIndex: 9,
            // position: 'absolute',

            bgcolor: 'background.paper',
            [`& .${tabsClasses.flexContainer}`]: {
              paddingX: { sm: 1, md: 3 },
              justifyContent: {
                sm: 'flex-start',
                md: 'flex-start',
              },
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab
              sx={{ fontWeight: 'bold' }}
              key={tab.value}
              value={tab.value}
              icon={tab.icon}
              disabled={tab.disabled}
              label={tab.label}
            />
          ))}
        </Tabs>
        {currentTab === 'profile' && <UserForm />}
        {currentTab === 'company' && <CompanyForm />}
        {currentTab === 'bank' && (
          <Box
            sx={{
              mt: 2,
              padding: 2,
              // height: '100vh',
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {BankAccounts.map((bankAccount) => (
              <Box key={bankAccount.id} sx={{ height: '100%' }}>
                <BankAccount bank_account={bankAccount} />
              </Box>
            ))}

            <Button
              sx={{ px: 2, py: 1, height: 120 }}
              // component={}
              // href={paths.dashboard.invoice.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add New Bank Account
            </Button>
            <br />
            <Typography
              sx={{ ml: 1 }}
              variant="subtitle1"
              // fontWeight="bold"
              color="InactiveCaptionText"
            >
              {BankAccounts.length} Bank Accounts found
            </Typography>
          </Box>
        )}
        {currentTab === 'pan' && (
          <Box
            sx={{
              mt: 2,
              padding: 2,
              // height: '100vh',
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {PanDetail.map((pan) => (
              <Box key={pan?.id} sx={{ height: '100%' }}>
                <PANList PAN={pan} />
              </Box>
            ))}
            <Button
              sx={{ px: 2, py: 1, height: 90 }}
              // component={}
              // href={paths.dashboard.invoice.new}
              variant="contained"
              disabled={PanDetail.length > 0}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add New PAN Number
            </Button>

            <br />
            {PanDetail.length > 0 && (
              <Typography sx={{ ml: 1 }} variant="subtitle1" color="InactiveCaptionText">
                PAN details are already available
              </Typography>
            )}
          </Box>
        )}
        {currentTab === 'password' && <Password password="wow" />}
      </Box>
    </Container>
  );
}
