import { Helmet } from 'react-helmet-async';
import ContractMgtView from 'src/sections/ContractMgt/view';
// sections

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Contracts</title>
      </Helmet>

      <ContractMgtView />
    </>
  );
}
