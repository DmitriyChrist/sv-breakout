<script lang="ts">
  import Game from "$lib/new_path/Game.svelte";

  let container: HTMLElement;
</script>

<div
  bind:this={container}
  style="width: 480px; height: 320px; position: relative; background: #000;"
>
  {#if container}
    <Game {container} />
  {/if}
</div>
