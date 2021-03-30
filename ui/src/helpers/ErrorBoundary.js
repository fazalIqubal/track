import * as React from 'react';


export default class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
    message: ''
  };

  componentDidCatch(error) {
    this.setState({ hasError: true, message: error.message });
  }

  render() {
    return (
      <>
        {this.renderError()}
        {this.props.children}
      </>
    );
  }

  renderError = () => {
    const { hasError, message } = this.state;

    if (!hasError) {
      return null;
    }

    return this.props.renderError
      ? this.props.renderError(message)
      : (<div className='alert alert-error'>{console.log(this.state.message)}</div>);
  }
}
