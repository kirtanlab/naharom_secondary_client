import { useMemo } from 'react';
import { useSearchParams as _useSearchParams } from 'react-router-dom';

// ----------------------------------------------------------------------

export function useSearchParams() {
  const [searchParams, setSearchParams] = _useSearchParams();

  const memoizedSearchParams = useMemo(() => new URLSearchParams(searchParams), [searchParams]);

  return [memoizedSearchParams, setSearchParams];
}
