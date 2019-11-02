export class AuthenticationError extends Error {
  name: string = 'AuthenticationError';
}

class AuthenticationService {

  // TODO: Implement logout()

  static TOKEN_REFRESH_RATE: number = 2400;
  static API_ROOT: string = process.env.REACT_APP_SERVER_API_ROOT || '';

  static token: string|null = null;
  static refreshAuthTokenTimeout: number = 0;

  async login(username: string, password: string) {

    try {

      const response = await fetch(`${AuthenticationService.API_ROOT}/auth/authenticate`, {
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
        setTimeout(() => AuthenticationService.refreshAuthToken(), AuthenticationService.TOKEN_REFRESH_RATE * 1000);
        console.log('logged in with token: ' + AuthenticationService.token);
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

  static async refreshAuthToken() {

    console.log('refreshing token: ' + AuthenticationService.token);

    const response = await fetch(`${AuthenticationService.API_ROOT}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: AuthenticationService.token,
      })
    });

    if (response.status === 401) {
      throw new AuthenticationError('Token no longer valid');
    }

    const result = await response.json();

    if (result && result.data && result.data.token) {
      AuthenticationService.token = result.data.token;
      clearTimeout(AuthenticationService.refreshAuthTokenTimeout);
      AuthenticationService.refreshAuthTokenTimeout = setTimeout(() => this.refreshAuthToken(), this.TOKEN_REFRESH_RATE * 1000);
    } else {
      console.log('An unknown error occurred while accessing the token');
    }

  }

}

export default AuthenticationService;
