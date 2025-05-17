<script lang="ts">
let { value = '', placeholder = 'Search products...', size = 'md', fullWidth = false, ariaExpanded = false, ariaControls = '', oninput, onfocus, onblur, onkeydown, onclear } = $props();
let isFocused = $state(false);
let inputElement: HTMLInputElement;

const sizes = {
  sm: 'py-1 px-3 text-sm',
  md: 'py-2 px-4',
  lg: 'py-3 px-5 text-lg'
};

function handleInput(event: Event) {
  value = (event.target as HTMLInputElement).value;
  oninput?.(event);
}
function handleFocus(event: FocusEvent) {
  isFocused = true;
  onfocus?.(event);
}
function handleBlur(event: FocusEvent) {
  setTimeout(() => {
    isFocused = false;
    onblur?.(event);
  }, 200);
}
function handleKeydown(event: KeyboardEvent) {
  onkeydown?.(event);
}
function handleClear() {
  value = '';
  inputElement?.focus();
  onclear?.();
}
function focus() { inputElement?.focus(); }
function blur() { inputElement?.blur(); }
</script>
<div class={`flex items-center border border-gray-300 rounded bg-white ${sizes[size]} ${fullWidth ? 'w-full' : ''} transition-all`}
  tabindex="-1"
  onclick={() => inputElement?.focus()}>
  <svg class="w-5 h-5 text-gray-400 ml-2 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
  <input
    class="flex-1 bg-transparent border-none focus:outline-none focus:border-none focus:ring-0 active:outline-none active:ring-0"
    bind:this={inputElement}
    type="text"
    {placeholder}
    {value}
    aria-expanded={ariaExpanded}
    aria-controls={ariaControls}
    oninput={handleInput}
    onfocus={handleFocus}
    onblur={handleBlur}
    onkeydown={handleKeydown}
    autocomplete="off"
  />
  {#if value}
    <button type="button" class="ml-2 text-gray-400 hover:text-gray-600" onclick={handleClear} tabindex="-1" aria-label="Clear">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
    </button>
  {/if}
</div>
<style>
:global(input::-webkit-search-cancel-button) { display: none; }
</style>
