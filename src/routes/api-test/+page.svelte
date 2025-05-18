<script lang="ts">
  import { gql } from '@apollo/client/core';
  import appoloClient from '$lib/apolloClient';
  import { toast } from 'svelte-sonner';
  // Client-side API URL
  const VENDURE_API_URL = 'http://localhost:3000/shop-api'; // Replace with your actual API URL

  interface QueryVariables {
    [key: string]: any;
  }

  interface ApiResponse {
    data?: any;
    errors?: readonly any[];
  }

  interface QueryMode {
    mode: 'apollo' | 'normal';
    client: any;
  }

  // Create createHttpLink with credentials
 

  // Types
  interface QueryObject {
    query: string;
    variables?: Record<string, any>;
  }

  interface QueryMode {
    mode: 'apollo' | 'normal';
    client: any;
  }

  // Initialize queryMode
  let queryMode: QueryMode = $state({
    mode: 'apollo',
    client: 'appoloClient'
  });

  // Initialize query
  let initialQuery = $state<string>(`query { activeCustomer { id firstName lastName } }`);

  // Query parsing
  function parseQuery(queryStr: string): QueryObject | null {
    try {
      const parsed = JSON.parse(queryStr);
      if (typeof parsed === 'object' && parsed !== null && 'query' in parsed) {
        return parsed;
      }
      throw new Error('Invalid query format');
    } catch (e) {
      console.error('Invalid JSON:', e instanceof Error ? e.message : 'Unknown error');
      return null;
    }
  }

  function formatVendureQuery(jsonStr: string) {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.query) {
        return parsed.query.replace(/\\n/g, '\n').replace(/\\t/g, '  ');
      } else {
        throw new Error("No 'query' field found in JSON");
      }
    } catch (e) {
      console.error('Invalid JSON:', e.message);
      return null;
    }
  }

  function toggleQueryMode() {
    queryMode.mode = queryMode.mode === 'apollo' ? 'normal' : 'apollo';
  }

  let variables: QueryVariables = $state({}); // declare variables with type
  let response: ApiResponse | null = $state(null); // declare response with type
  let error: string | null = $state(null); // declare error with type
  let loading: boolean = $state(false); // declare loading with type

  async function executeQuery() {
    const apollo = await import('@apollo/client/core'); 
  const { ApolloClient, InMemoryCache, createHttpLink } = apollo;
    const httpLink  =  createHttpLink({
    uri: VENDURE_API_URL,
    credentials: 'include'
  });

  // Initialize Apollo client with proper cookie handling
  const appoloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()   
  });




    loading = true;
    error = null;
    
    try {
      if (!queryMode) {
        throw new Error('Query mode not initialized');
      }

      // Get cookies from document
      const cookies = {
        session: document.cookie.split('; ').find(c => c.trim().startsWith('session='))?.split('=')[1],
        sessionSig: document.cookie.split('; ').find(c => c.trim().startsWith('session.sig='))?.split('=')[1]
      };
      console.log('Cookies:', cookies); // Log cookies for debugging

      // Try to parse as JSON first
      let gqlQuery: any;
      try {
        const parsed = JSON.parse(initialQuery);
        gqlQuery = gql`${parsed.query}`;
        variables = parsed.variables || variables;
      } catch (e) {
        // If not JSON, treat as direct GraphQL query
        gqlQuery = gql`${initialQuery}`;
      }

      // Execute query using Apollo Client
      const result = await appoloClient.query({
        query: gqlQuery,
        variables
      });
      response = result;

      // Log the request details
      console.log('Sending query:', initialQuery);

      // Log the full request details for debugging
      console.log('Full request:', {
        url: VENDURE_API_URL,
        query: initialQuery,
        variables
      });
      
      // Log the response
      console.log('Response:', result);
    } catch (err) {
      error = err instanceof Error ? err.message : 'API Request Failed';
      console.error('Error executing query:', err);
    } finally {
      loading = false;
    }
  }

  function updateQuery(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    if (!target) return;
    initialQuery = target.value;
    console.log('Query updated:', initialQuery);
  }

  function updateVariables(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    if (!target) return;
    try {
      variables = JSON.parse(target.value);
    } catch (err) {
      toast.error('Invalid JSON');
    }
  }






  const url = 'https://vendure-backend-xvqg.onrender.com/admin-api?languageCode=en';  // Use the correct API path (shop-api or admin-api)

const query = `mutation AttemptLogin($username: String!, $password: String!, $rememberMe: Boolean!) {
  login(username: $username, password: $password, rememberMe: $rememberMe) {
    ...CurrentUser
    ...ErrorResult
    __typename
  }
}

fragment CurrentUser on CurrentUser {
  id
  identifier
  channels {
    id
    code
    token
    permissions
    __typename
  }
  __typename
}

fragment ErrorResult on ErrorResult {
  errorCode
  message
  __typename
}
`;

const variables2 = {
    "username": "superadmin",
    "password": "adminaadi",
    "rememberMe": false
}


async function login() {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add authorization headers if needed, for login usually not needed
    },
    body: JSON.stringify({
      operationName: 'AttemptLogin',
      query,
      variables: variables2
    }),
  });

  const result = await response.json();
  console.log(result);
}

















</script>

<div class="p-6">
  <h1 class="text-2xl font-bold mb-4">API Test Page</h1>
  <div class="mb-4">
    <button 
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      onclick={login}
    >
     RUN
    </button>
  
  <!-- <div class="mb-4">
    <button 
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      onclick={toggleQueryMode}
    >
      {queryMode.mode === 'apollo' ? 'Switch to Normal Mode' : 'Switch to Apollo Mode'}
    </button> -->
  </div>

  <div class="space-y-4">
    <div>
      <label for="graphql-query" class="block text-sm font-medium text-gray-700 mb-1">GraphQL Query</label>
      <textarea
        id="graphql-query"
        onchange={updateQuery}
        class="w-full h-48 p-2 border rounded-md"
        placeholder="Enter your GraphQL query here..."
        value={initialQuery}
      ></textarea>
    </div>

    <div>
      <label for="graphql-variables" class="block text-sm font-medium text-gray-700 mb-1">Variables (JSON)</label>
      <pre id="graphql-variables" class="w-full p-2 border rounded-md bg-gray-50 overflow-auto">
        {JSON.stringify(variables, null, 2)}
      </pre>
    </div>

    <div>
      <button
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        onclick={executeQuery}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Execute Query'}
      </button>
    </div>

    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    {/if}

    {#if response}
      <div class="mt-4">
        <h2 class="text-lg font-semibold mb-2">Response:</h2>
        <pre class="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(response, null, 2)}
        </pre>
      </div>
    {/if}
  </div>
</div>
