import React from 'react';

class Loader extends React.Component {
  render() {
    return (
      <div id='LoaderWrapper'>
        <div />
        <div>LOADING</div>
      </div>
    );
  }
}
const Layout = ({ children, location }) => (
  <div id='MainLayout'>
    <Loader />
    {children}
  </div>
);

export default Layout;
