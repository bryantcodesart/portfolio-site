export const fontUrls = {
  bryantBold: '/fonts/bryant/bryantBold.woff',
  // robotoMono: '',
};

export const computerTextConfig = (fontSize:number = 0.27) => ({
  fontSize,
  font: fontUrls.bryantBold,
  letterSpacing: 0 * fontSize,
});
