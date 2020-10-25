import { useEffect, useCallback, useState } from 'react';

interface Breakpoints {
  breakpoint: number;
  getValueForBreakpoint: (values: string[]) => string;
}

const breakpoints = ['0', '40em', '52em'];

const useBreakpoints = (): Breakpoints => {
  const [breakpoint, setBreakpoint] = useState(0);

  const getBreakpoint = useCallback(() => {
    const nextBreakpoint =
      breakpoints
        .map((bp) => window.matchMedia(`(min-width: ${bp})`))
        .filter((v) => v.matches).length - 1;

    setBreakpoint(nextBreakpoint);
  }, []);

  const getValueForBreakpoint = (values: string[]) => values[breakpoint];

  useEffect(() => {
    getBreakpoint();

    window.addEventListener('resize', getBreakpoint);

    return () => window.removeEventListener('resize', getBreakpoint);
  }, [getBreakpoint]);

  return { breakpoint, getValueForBreakpoint };
};

export default useBreakpoints;
