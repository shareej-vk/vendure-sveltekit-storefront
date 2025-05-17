<script lang="ts">
// You can add props for dynamic title/description if needed
</script>

<section class="relative w-full h-[400px] flex items-center justify-center overflow-hidden shadow-lg">
  <img
    src="/images/banner-1.webp"
    alt="Banner Background"
    class="absolute inset-0 w-full h-full object-cover object-center z-0"
    draggable="false"
  />
  <div class="relative z-20 flex flex-col items-center justify-center text-center px-6">
    <h1 class="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
      Vendure SvelteKit Starter
    </h1>
    <p class="text-lg md:text-2xl text-white/80 font-medium max-w-2xl mb-6">
  light weight, clean, super fast eCommerce Storefront with Vendure & SvelteKit
    </p>
    <button class="mt-2 px-8 py-3 bg-white text-black font-semibold rounded-full shadow hover:bg-gray-200 transition">
      Shop Now
    </button>
  </div>
</section>
