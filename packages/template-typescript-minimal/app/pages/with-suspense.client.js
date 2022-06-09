import React, { Suspense } from "react";

export const withSuspense = (WrappedComponent) => {
    return class extends React.Component {
      
      render() {
        // ... and renders the wrapped component with the fresh data!
        // Notice that we pass through any additional props
        return (
          <Suspense fallback={<h1>Loading page...</h1>}>
            <WrappedComponent {...this.props} />
          </Suspense>
        );
      }
    };
  }
