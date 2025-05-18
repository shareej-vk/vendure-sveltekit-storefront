<script lang="ts">
// No props needed for basic footer
</script>

<footer class="w-full bg-gray-900 text-gray-200 py-8 mt-10 border-t border-gray-800">
  <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
    <div class="text-lg font-semibold tracking-tight">Vendure SvelteKit Storefront</div>
    <div class="flex gap-6 text-sm">
      <a href="/" class="hover:text-white transition">Home</a>
      <a href="/shop" class="hover:text-white transition">Shop</a>
      <a href="/features" class="hover:text-white transition">Features</a>
      <a href="/contact" class="hover:text-white transition">Contact</a>
    </div>
    <div class="text-xs text-gray-400">&copy; {new Date().getFullYear()} Vendure SvelteKit Storefront. All rights reserved.</div>
  </div>
</footer>

<style>
  /* No custom CSS, all Tailwind */
</style>
