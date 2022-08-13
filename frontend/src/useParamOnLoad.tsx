import {
  useEffect, useState,
} from 'react';

export const useParamOnLoad = (paramName: string, ssrDefault:string = 'false') => {
  // const wasRenderedBySsr = useRef(typeof window === 'undefined');
  const [param, setParam] = useState<string|null>(ssrDefault);
  // const firstAttempt = useMemo(
  //   () => (typeof window === 'undefined'
  //     ? ssrDefault
  //     : new URLSearchParams(window.location.search).get(paramName)),
  //   [paramName],
  // );
  useEffect(() => {
    setParam(new URLSearchParams(window.location.search).get(paramName));
  }, [param, paramName]);
  return param;
};
