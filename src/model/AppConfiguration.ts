interface AppConfiguration {
  serverAPIRoot: string;
  serverDBTable: string;
  autoLoginPassword: boolean|string;
  branding: {
    loginScreenImageSrc: string;
    loginScreenImageSize: "normal"|"large";
    loginScreenBackground: string;
    loginScreenTheme: "dark"|"light";
  };
  dialog: {
    storyPrompts: {
      1: string,
      2: string,
      3: string,
      4: string,
      5: string
    }
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
