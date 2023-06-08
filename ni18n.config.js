const supportedLngs = ["en", "ko"];

export const ni18nConfig = {
  /**
   * Set `fallbackLng` to the `supportedLngs` array in order for them all to be loaded
   */
  fallbackLng: supportedLngs,
  supportedLngs,
  ns: ["common"],
  react: {
    useSuspense: false,
  },
};
