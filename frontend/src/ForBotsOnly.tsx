import React, { ReactNode, useEffect, useState } from 'react';


export const ForBotsOnly = ({ children }: { children: ReactNode; }) => {
  // const [isBot, setIsBot] = React.useState(false);
  // React.useEffect(() => {
  //   const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
  //   setIsBot(isBot);
  // }, []);
  // if (isBot) {
  //   return <>{children}</>;
  // }
  // return null;
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
