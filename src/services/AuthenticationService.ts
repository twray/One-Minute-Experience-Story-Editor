export class AuthenticationError extends Error {

  name: string = 'AuthenticationError';
  httpStatus?: number;

  constructor(httpStatus?: number) {
    super();
    this.httpStatus = httpStatus;
  }

}

class AuthenticationService {

  static TOKEN_REFRESH_RATE: number = 2400;
  static API_ROOT: string = process.env.REACT_APP_SERVER_API_ROOT || '';

  static token: string|null;
  static loggedInUsername: string|null;
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

      if (
        response.status === 401 ||
        response.status === 404 ||
        response.status === 422
      ) {
        throw new AuthenticationError(response.status);
      } else if (result.error) {
        throw new Error(result.error && result.error.message);
      }

      if (result && result.data && result.data.token) {
        AuthenticationService.token = result.data.token;
        AuthenticationService.loggedInUsername = username;
        setTimeout(() => AuthenticationService.refreshAuthToken(), AuthenticationService.TOKEN_REFRESH_RATE * 1000);
        console.log('logged in with token: ' + AuthenticationService.token);
      } else {
        throw new Error('Unable to login due to a token not being provided.');
      }

    } catch (e) {
      console.log('A problem occurred while logging in.');
      throw e;
    }

  }

  async logout() {

    AuthenticationService.token = null;
    AuthenticationService.loggedInUsername = null;
    
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
      console.log('token expired: the user would need to login again');
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
