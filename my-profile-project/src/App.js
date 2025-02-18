import React from 'react';
import { useQuery, gql } from '@apollo/client';
import './App.css';

// Define GraphQL query
const GET_USER_DATA = gql`
  query {
    user {
      id
      login
      xps {
        amount
      }
    }
  }
`;

function App() {
  // Execute query
  const { loading, error, data } = useQuery(GET_USER_DATA);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  const user = data.user[0];

  return (
    <div className="App">
      <header className="App-header">
        <h1>Your Profile</h1>
      </header>

      <section>
        <h2>User Information</h2>
        <div className="profile-info">
          <p>Username: {user.login}</p>
          <p>XP: {user.xps[0]?.amount || "No XP data"}</p>
        </div>
      </section>
    </div>
  );
}

export default App;
