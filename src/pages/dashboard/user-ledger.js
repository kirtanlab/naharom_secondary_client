import { Helmet } from 'react-helmet-async';
import LedgerView from 'src/sections/Ledger/view';
// import ProfileView fr/om 'src/sections/ProfilePage/view';
// sections

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Ledger</title>
      </Helmet>

      <LedgerView />
    </>
  );
}
