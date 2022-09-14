import React, { ReactNode, useEffect, useState } from 'react';

export const ForBotsOnly = ({ children }: { children: ReactNode; }) => {
  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    setIsFirstRender(false);
  }, []);
  return isFirstRender ? (
    <div className="sr-only">
      {children}
    </div>
  ) : null;
};
