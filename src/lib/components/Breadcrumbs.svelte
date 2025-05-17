<script lang="ts">
  export let segments: { label: string; href?: string }[] = [];
</script>

<nav class="text-sm mb-6" aria-label="Breadcrumb">
  <ol class="flex flex-wrap items-center space-x-2">
    {#each segments as segment, i}
      <li class="flex items-center">
        {#if segment.href && i < segments.length - 1}
          <a class="text-indigo-600 hover:underline" href={segment.href}>{segment.label}</a>
          <span class="mx-2 text-gray-400">/</span>
        {:else}
          <span class="text-gray-700 font-semibold">{segment.label}</span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>

<style>
  nav {
    user-select: none;
  }
</style>
