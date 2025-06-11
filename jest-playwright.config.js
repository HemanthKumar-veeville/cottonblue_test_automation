module.exports = {
  browsers: ["chromium"],
  launchOptions: {
    headless: true,
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
