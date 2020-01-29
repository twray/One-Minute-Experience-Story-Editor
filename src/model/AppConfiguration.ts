interface AppConfiguration {
  serverDBTable: string;
  serverAPIRoot: string;
  autoLoginPassword: boolean|string;
  branding: {
    loginScreenImageSrc: string;
    loginScreenImageSize: "normal"|"large";
    loginScreenBackground: string;
    loginScreenTheme: "dark"|"light";
  };
  dialog: {
    introScreenDesktop: {
      welcomeMessage: string;
      introHTML: JSX.Element;
    };
    introScreenMobile: {
      welcomeMessage: string;
      introHTML: JSX.Element;
    }
  }
};

export default AppConfiguration;
