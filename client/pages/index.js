import buildClient from '../api/build-client';

// exceuted on the server
const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>You are signed in</h1> : <h1>You are not signed in</h1>;
};
 
// any data needed server side needs to be fetched here
LandingPage.getInitialProps = async (context) => {

  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');

  return data;

};

export default LandingPage;