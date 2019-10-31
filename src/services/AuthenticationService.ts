class AuthenticationService {

  // TODO: Implement logout()

  TOKEN_REFRESH_RATE: number = 3000;
  API_ROOT: string = process.env.REACT_APP_SERVER_API_ROOT || '';

  static token: string|null = null;

  async login(username: string, password: string) {

    try {

      const response = await fetch(`${this.API_ROOT}/auth/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: username,
          password: password
        })
      });

      const result = await response.json();

      if (result && result.data && result.data.token) {
        AuthenticationService.token = result.data.token;
        this.refreshAuthToken();
      } else {
        throw new Error('Unable to login due to a token not being provided.');
      }

      if (result.error && result.error.code === 100) {
        throw new Error('Unable to login due to invalid user credentials');
      } else if (result.error) {
        throw new Error(result.error && result.error.message);
      }

    } catch (e) {
      console.log('A problem occurred while logging in.');
      throw e;
    }

  }

  private refreshAuthToken() {

    setTimeout(async () => {

      console.log('refreshing token: ' + AuthenticationService.token);

      const response = await fetch(`${this.API_ROOT}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: AuthenticationService.token,
        })
      });

      const result = await response.json();

      if (result && result.data && result.data.token) {
        AuthenticationService.token = result.data.token;
        this.refreshAuthToken();
      } else {
        throw new Error('Unable to refresh token.');
      }

    }, this.TOKEN_REFRESH_RATE * 1000)
  }

}

export default AuthenticationService;
