import React, { ErrorInfo } from 'react';

import styled from 'styled-components';

const ErrorContainer = styled.div`
  position: absolute:
  top: 10px;
  right: 10px;
  height: 10px;
  text-align: right;
  color: red;
`;

interface ErrorBoundaryProps { }

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {

  state = {
    hasError: false,
    errorMessage: ''
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (error.name === 'AuthenticationError') {
      console.log('you shall be logged out');
    } else {
      this.setState({
        hasError: true,
        errorMessage: 'Oops, something went wrong! Please refresh your page and try again.'
      });
      console.log(error, info);
    }
  }

  render() {
    const { children } = this.props;
    const { hasError, errorMessage } = this.state;
    return (
      <React.Fragment>
        {children}
        {hasError &&
          <ErrorContainer>
            {errorMessage}
          </ErrorContainer>
        }
      </React.Fragment>
    )
  }

}

export default ErrorBoundary;
