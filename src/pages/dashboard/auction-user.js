import { Helmet } from 'react-helmet-async';
// sections
import AuctionView from 'src/sections/auction/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Auction</title>
      </Helmet>

      <AuctionView />
    </>
  );
}
