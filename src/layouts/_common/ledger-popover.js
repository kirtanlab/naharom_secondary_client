import { m } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// routes
import { useRouter } from 'src/routes/hooks';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import { varHover } from 'src/components/animate';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { WalletOutlined, WalletRounded, WalletSharp, WalletTwoTone } from '@mui/icons-material';

// ----------------------------------------------------------------------

export default function LedgerPopover() {
  const router = useRouter();

  const { logout, user, phoneNumber, user_role, balance } = useAuthContext();
  console.log('phoneNumber: ', phoneNumber, user_role, user);
  const popover = usePopover();
  const ledgerPopover = usePopover();
  const handleLogout = async () => {
    try {
      await logout();
      popover.onClose();
      router.replace('/');
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickItem = (path) => {
    popover.onClose();
    router.push(path);
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={ledgerPopover.onOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          borderRadius: '50%', // Make the button fully round
          ...(ledgerPopover.open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 1px ${theme.palette.background.default}`,
          }}
        >
          <WalletTwoTone
            sx={{
              // background: 'gray',
              // backgroundColor: (theme) => theme.palette.grey[400],
              color: (theme) => 'white',

              width: 24,
              height: 24,
              borderRadius: '50%',
            }}
          />
        </Avatar>
      </IconButton>
      <CustomPopover
        open={ledgerPopover.open}
        onClose={ledgerPopover.onClose}
        sx={{ width: 140, p: 0 }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            Balance: {balance} &#x20b9;
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'solid ' }} />

        {/* <Stack sx={{ p: 1 }}>
          {OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo)}>
              {option.label}
            </MenuItem>
          ))}
        </Stack> */}

        {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}

        <MenuItem
          onClick={handleLogout}
          sx={{
            m: 1,
            fontWeight: 'fontWeightBold',
            color: 'error.main',
            textDecoration: 'underline',
          }}
        >
          Withdraw Money
        </MenuItem>
        <Divider sx={{ borderStyle: 'solid ' }} />
        <MenuItem
          onClick={handleLogout}
          sx={{
            m: 1,
            fontWeight: 'fontWeightBold',
            color: 'error.main',
            textDecoration: 'underline',
          }}
        >
          Credit Money
        </MenuItem>
      </CustomPopover>
    </>
  );
}
