module.exports = {
  browsers: ["chromium"],
  launchOptions: {
    headless: false,
  },
  contextOptions: {
    ignoreHTTPSErrors: true,
    viewport: {
      width: 1280,
      height: 720,
    },
  },
  exitOnPageError: false,
};
