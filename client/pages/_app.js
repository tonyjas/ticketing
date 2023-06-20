// wrapping our app component to be able to add global css to all pages
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
  <div>
    <Header currentUser={currentUser} />
    <Component {...pageProps} />
  </div>
  );
};

AppComponent.getInitialProps = async appContext => { 
  // get initial props from app component.cts as we are not inside a page
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  // call getIn initial props on child components
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  // return data and pageProps
  return {
    pageProps,
    ...data
  };
};

export default AppComponent;