<script lang="ts">
// Props: steps (string[]), currentStep (number, 0-based)
let { steps = ["Address", "Shipping", "Payment", "Review"], currentStep = 0 } = $props();
</script>

<div class="w-full max-w-3xl flex justify-center mb-8 relative">
  <!-- Full connecting line behind all steps -->
  <div class="absolute left-0 right-0 top-5 h-1 w-full z-0 flex">
    <div class="h-1" style="width:calc({steps.length > 1 ? (100/(steps.length-1))*currentStep : 0}%);background-color:#22c55e"></div>
    <div class="h-1 flex-1 bg-gray-300"></div>
  </div>
  <ol class="relative flex w-full items-center justify-between z-10">
    {#each steps as step, i}
      <li class="flex-1 flex flex-col items-center">
        <div class="w-10 h-10 flex items-center justify-center rounded-full border-2
          {i < currentStep ? 'border-green-500 bg-green-500 text-white' : ''}
          {i === currentStep ? 'border-orange-500 bg-orange-500 text-white shadow-lg' : ''}
          {i > currentStep ? 'border-gray-300 bg-white text-gray-400' : ''}
          font-bold text-lg transition-all">
          {i + 1}
        </div>
        <span class="mt-2 {i === currentStep ? 'text-green-700 font-semibold' : 'text-gray-500'}">{step}</span>
      </li>
    {/each}
  </ol>
</div>
