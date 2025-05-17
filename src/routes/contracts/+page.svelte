<!-- Contract Management Dashboard -->
<script lang="ts">
  // Mock data for contracts
  const contracts = [
    {
      title: "Social Media Policy",
      status: "signed",
      location: "Agency Agreements",
      parties: [
        { name: "SLMobbin", type: "entity" },
        { name: "Jane Doe", avatar: "JD" }
      ],
      owner: { name: "Sam Lee", avatar: "S" },
      tasks: "No tasks"
    },
    {
      title: "Employee Handbook",
      status: "pending",
      location: "Private",
      parties: [
        { name: "SLMobbin", type: "entity" }
      ],
      owner: { name: "Sam Lee", avatar: "S" },
      tasks: "1/2"
    },
    {
      title: "NDA Agreement",
      status: "draft",
      location: "Private",
      parties: [
        { name: "SLMobbin", type: "entity" }
      ],
      owner: { name: "Sam Lee", avatar: "S" },
      tasks: "No tasks"
    }
  ];
</script>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }
</style>

<!-- Root Container -->
<div class="min-h-screen bg-gray-50 flex flex-col">
  <!-- Top Navigation Bar -->
  <div class="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm flex items-center px-6 z-50">
    <!-- Logo -->
    <div class="w-8 h-8 bg-black rounded flex items-center justify-center">
      <span class="text-white font-bold text-lg">SL</span>
    </div>
    
    <!-- Navigation Links -->
    <nav class="ml-8 flex items-center space-x-8">
      <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors duration-200">Home</a>
      <a href="#" class="text-blue-600 font-medium border-b-2 border-blue-600">Contracts</a>
      <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors duration-200">Templates</a>
      <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors duration-200">Automations</a>
      <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors duration-200">Tasks</a>
      <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors duration-200">Team</a>
    </nav>
    
    <!-- Right Controls -->
    <div class="ml-auto flex items-center space-x-6">
      <button class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200" aria-label="Notifications">
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
      </button>
      <button class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200" aria-label="Help">
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4.043 1.343 4.5 3 .353 1.263.52 2.437.52 3.597v1.288c-.851.38-1.84.688-2.97.87-.549.092-.92.307-.92.619v2.084h3c-.004-2.414-1.342-3.473-2.9-3.473-1.452 0-1.84.7-2.165 1.193v2.38h-.027c.071-.403.178-.795.381-1.174A4.016 4.016 0 0112 15c-2.21 0-4 1.343-4 3s1.79 3 4 3 4-1.343 4-3V9z"></path>
        </svg>
      </button>
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
          <span class="text-white">S</span>
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-medium text-gray-700">Sam Lee</span>
          <span class="text-xs text-gray-500">Admin</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Left Sidebar -->
  <div class="fixed top-16 left-0 w-64 bg-white h-screen shadow-lg overflow-y-auto">
    <!-- Search -->
    <div class="p-4">
      <div class="relative">
        <input type="text" placeholder="Search by title, content..." class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
      </div>
    </div>

    <!-- Views Section -->
    <div class="px-4">
      <h3 class="text-sm font-medium text-gray-500 mb-4 pt-4 border-t">Views</h3>
      <div class="space-y-1">
        <a href="/contracts" class="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200" aria-label="All Contracts">All contracts</a>
        <a href="/contracts/my" class="block px-3 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg" aria-current="page">My contracts</a>
        <a href="/contracts/rejected" class="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200" aria-label="Rejected Contracts">Rejected</a>
        <a href="/contracts/new-view" class="block px-3 py-2.5 text-sm text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200" aria-label="Add a new view">+ Add a view</a>
      </div>
    </div>

    <!-- Contract Spaces Section -->
    <div class="px-4 mt-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-gray-500 flex items-center">
          Contract Spaces
          <span class="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">New</span>
        </h3>
        <button class="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200" aria-label="View all contract spaces">View all</button>
      </div>
      <div class="space-y-1 mt-2">
        <a href="/contracts/spaces/agency" class="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200" aria-label="Agency Agreements">Agency Agreements</a>
        <a href="/contracts/spaces/new" class="block px-3 py-2.5 text-sm text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200" aria-label="Add a new contract space">+ Add a contract space</a>
      </div>
    </div>

    <!-- Imports Section -->
    <div class="px-4 mt-4">
      <h3 class="text-sm font-medium text-gray-500 mb-4 pt-4 border-t">Imports</h3>
      <div class="space-y-1">
        <div class="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
          <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Import (Mar 12, 2025 20:02)</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content Area -->
  <div class="ml-64 pt-16 flex-1">
    <!-- Header -->
    <div class="px-6 py-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">My contracts</h1>
        
        <div class="flex items-center space-x-4">
          <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
            </svg>
          </button>
          
          <div class="relative">
            <input type="text" placeholder="Search..." class="w-64 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          
          <button class="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200" aria-label="Upload contracts">
            Upload contracts
          </button>
          <button class="px-5 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 transition-colors duration-200" aria-label="Create and sign new contract">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Create and sign
          </button>
        </div>
      </div>
    </div>

    <!-- Contracts Table -->
    <div class="px-6">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="text-left text-xs font-medium text-gray-500 bg-gray-50">
              <th class="py-3.5">Title</th>
              <th class="py-3.5">Status</th>
              <th class="py-3.5">Location</th>
              <th class="py-3.5">Parties</th>
              <th class="py-3.5">Owner</th>
              <th class="py-3.5">Tasks</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#each contracts as contract}
              <tr class="hover:bg-gray-50 transition-colors duration-200">
                <td class="py-4">
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <span class="font-medium text-gray-900">{contract.title}</span>
                  </div>
                </td>
                <td class="py-4">
                  {#if contract.status === 'signed'}
                    <span class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700">Signed</span>
                  {:else if contract.status === 'pending'}
                    <div class="flex items-center space-x-2">
                      <span class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-orange-50 text-orange-700">Pending</span>
                      <span class="text-xs text-gray-500">1/2</span>
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  {:else if contract.status === 'draft'}
                    <span class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-gray-50 text-gray-700">Draft</span>
                  {:else}
                    <span class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border border-red-200 text-red-700">Rejected</span>
                  {/if}
                </td>
                <td class="py-4">{contract.location}</td>
                <td class="py-4">
                  <div class="flex items-center space-x-2">
                    {#each contract.parties as party}
                      {#if party.type === 'entity'}
                        <span class="text-sm font-medium text-gray-900">{party.name}</span>
                      {:else}
                        <div class="flex items-center space-x-1">
                          <div class="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <span class="text-gray-700">{party.avatar}</span>
                          </div>
                          <span class="text-sm text-gray-700">{party.name}</span>
                        </div>
                      {/if}
                    {/each}
                  </div>
                </td>
                <td class="py-4">
                  <div class="flex items-center space-x-2">
                    <div class="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <span class="text-white">{contract.owner.avatar}</span>
                    </div>
                    <span class="text-sm text-gray-700">{contract.owner.name}</span>
                  </div>
                </td>
                <td class="py-4">{contract.tasks}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="mt-6 text-sm text-gray-500">
        6 contracts in this view.
      </div>
    </div>
  </div>

  <!-- Bottom Branding -->
  <div class="fixed bottom-0 left-0 right-0 h-16 bg-white flex items-center justify-between px-6 border-t">
    <span class="text-gray-600">Contractbook</span>
    <span class="text-gray-500">Curated by Mobbin</span>
  </div>

  <!-- Navigation Links -->
  <nav class="ml-8 flex items-center space-x-8">
    <a href="/" class="text-gray-600 hover:text-blue-600 transition-colors duration-200" aria-label="Home">Home</a>
    <a href="/contracts" class="text-blue-600 font-medium border-b-2 border-blue-600" aria-current="page">Contracts</a>
    <a href="/templates" class="text-gray-600 hover:text-blue-600 transition-colors duration-200" aria-label="Templates">Templates</a>
    <a href="/automations" class="text-gray-600 hover:text-blue-600 transition-colors duration-200" aria-label="Automations">Automations</a>
    <a href="/tasks" class="text-gray-600 hover:text-blue-600 transition-colors duration-200" aria-label="Tasks">Tasks</a>
    <a href="/team" class="text-gray-600 hover:text-blue-600 transition-colors duration-200" aria-label="Team">Team</a>
  </nav>
  
  <!-- Right Controls -->
  <div class="ml-auto flex items-center space-x-4">
    <button class="p-2 hover:bg-gray-100 rounded-full">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
      </svg>
    </button>
    <button class="p-2 hover:bg-gray-100 rounded-full">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4.043 1.343 4.5 3 .353 1.263.52 2.437.52 3.597v1.288c-.851.38-1.84.688-2.97.87-.549.092-.92.307-.92.619v2.084h3c-.004-2.414-1.342-3.473-2.9-3.473-1.452 0-1.84.7-2.165 1.193v2.38h-.027c.071-.403.178-.795.381-1.174A4.016 4.016 0 0112 15c-2.21 0-4 1.343-4 3s1.79 3 4 3 4-1.343 4-3V9z"></path>
      </svg>
    </button>
    <div class="flex items-center space-x-2">
      <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
        <span class="text-white">S</span>
      </div>
      <span class="text-gray-700">Sam Lee</span>
    </div>
  </div>
</div>

<!-- Left Sidebar -->
<div class="fixed top-16 left-0 w-64 bg-white h-screen shadow-lg overflow-y-auto">
  <!-- Search -->
  <div class="p-4">
    <div class="relative">
      <input type="text" placeholder="Search by title, content..." class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
    </div>
  </div>

  <!-- Views Section -->
  <div class="px-4">
    <h3 class="text-sm font-medium text-gray-500 mb-2">Views</h3>
    <div class="space-y-1">
      <a href="#" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">All contracts</a>
      <a href="#" class="block px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">My contracts</a>
      <a href="#" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Rejected</a>
      <a href="#" class="block px-3 py-2 text-sm text-blue-600 hover:bg-gray-100 rounded-lg">+ Add a view</a>
    </div>
  </div>

  <!-- Contract Spaces Section -->
  <div class="px-4 mt-4">
    <h3 class="text-sm font-medium text-gray-500 flex items-center">
      Contract Spaces
      <span class="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">New</span>
    </h3>
    <div class="space-y-1">
      <a href="#" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Agency Agreements</a>
      <a href="#" class="block px-3 py-2 text-sm text-blue-600 hover:bg-gray-100 rounded-lg">+ Add a contract space</a>
    </div>
  </div>

  <!-- Imports Section -->
  <div class="px-4 mt-4">
    <h3 class="text-sm font-medium text-gray-500 mb-2">Imports</h3>
    <div class="space-y-1">
      <div class="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
        <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Import (Mar 12, 2025 20:02)
      </div>
    </div>
  </div>
</div>

<!-- Main Content Area -->
<div class="ml-60 pt-16">
  <!-- Header -->
  <div class="px-6 py-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">My contracts</h1>
      
      <div class="flex items-center space-x-4">
        <button class="p-2 hover:bg-gray-100 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
          </svg>
        </button>
        
        <div class="relative">
          <input type="text" placeholder="Search..." class="w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        
        <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Upload contracts</button>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Create and sign
        </button>
      </div>
    </div>
  </div>

  <!-- Contracts Table -->
  <div class="px-6">
    <div class="overflow-x-auto">
      <table class="min-w-full">
        <thead>
          <tr class="text-left text-xs font-medium text-gray-500">
            <th class="py-3">Title</th>
            <th class="py-3">Status</th>
            <th class="py-3">Location</th>
            <th class="py-3">Parties</th>
            <th class="py-3">Owner</th>
            <th class="py-3">Tasks</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          {#each contracts as contract}
            <tr class="hover:bg-gray-50">
              <td class="py-4">
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  <span class="font-medium">{contract.title}</span>
                </div>
              </td>
              <td class="py-4">
                {#if contract.status === 'signed'}
                  <span class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Signed</span>
                {:else if contract.status === 'pending'}
                  <div class="flex items-center space-x-2">
                    <span class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">Pending</span>
                    <span class="text-xs text-gray-500">1/2</span>
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                {:else if contract.status === 'draft'}
                  <span class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Draft</span>
                {:else}
                  <span class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border border-red-300 text-red-700">Rejected</span>
                {/if}
              </td>
              <td class="py-4">{contract.location}</td>
              <td class="py-4">
                <div class="flex items-center space-x-2">
                  {#each contract.parties as party}
                    {#if party.type === 'entity'}
                      <span class="text-sm font-medium">{party.name}</span>
                    {:else}
                      <div class="flex items-center space-x-1">
                        <div class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <span class="text-gray-700">{party.avatar}</span>
                        </div>
                        <span class="text-sm">{party.name}</span>
                      </div>
                    {/if}
                  {/each}
                </div>
              </td>
              <td class="py-4">
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <span class="text-white">{contract.owner.avatar}</span>
                  </div>
                  <span class="text-sm">{contract.owner.name}</span>
                </div>
              </td>
              <td class="py-4">{contract.tasks}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div class="mt-4 text-sm text-gray-500">
      6 contracts in this view.
    </div>
  </div>
</div>

<!-- Bottom Branding -->
<div class="fixed bottom-0 left-0 right-0 h-16 bg-white flex items-center justify-between px-6">
  <span class="text-gray-600">Contractbook</span>
  <span class="text-gray-500">Curated by Mobbin</span>
</div>
