<script lang="ts">
import Banner from '$lib/components/Banner.svelte';
import FeaturedProducts from '$lib/components/landing/FeaturedProducts.svelte';

let {data} = $props();

</script>
<Banner />
<section class="max-w-5xl mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold mb-6">Categories</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {#each data.collections as collection}
        <a class="block p-6 bg-white rounded-lg shadow hover:shadow-lg border border-gray-100 transition" href="/categories/{collection.slug}">
          {#if collection.featuredAsset?.preview}
            <img src={collection.featuredAsset.preview} alt={collection.name} class="w-full h-32 object-cover rounded mb-4" />
          {/if}
          <div class="text-xl font-semibold mb-2">{collection.name}</div>
          <div class="text-gray-500 text-sm">Slug: {collection.slug}</div>
        </a>
      {/each}
    </div>
  </section>
<FeaturedProducts products={data.products} />
