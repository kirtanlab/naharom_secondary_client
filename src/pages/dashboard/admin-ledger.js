import { Helmet } from 'react-helmet-async';
import AdminLedgerView from 'src/sections/AdminLedger/view';
// import ProfileView fr/om 'src/sections/ProfilePage/view';
// sections

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title>Admin Ledger</title>
            </Helmet>

            <AdminLedgerView />
        </>
    );
}