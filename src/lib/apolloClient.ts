import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { PUBLIC_VENDURE_API_URL } from '$env/static/public';
const appoloClient = new ApolloClient({
    uri: PUBLIC_VENDURE_API_URL, // Replace with your GraphQL endpoint
    cache: new InMemoryCache(),
});

export default appoloClient;
