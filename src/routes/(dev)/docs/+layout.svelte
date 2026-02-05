<script lang="ts">
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";

  onMount(async () => {
    const mermaid = (await import("mermaid")).default;
    mermaid.initialize({ startOnLoad: true });
    mermaid.run();
  });

  afterNavigate(async () => {
    const mermaid = (await import("mermaid")).default;
    await new Promise((r) => setTimeout(r, 50));
    mermaid.run();
  });
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<nav>
  <a href="/dev/docs">Главная</a>
  <a href="/docs/main">Новая</a>
  <a href="/">Игра</a>
</nav>
<!-- eslint-enable svelte/no-navigation-without-resolve -->

<slot />

<style>
  nav {
    padding: 1rem;
    background: #333;
    margin-bottom: 2rem;
  }

  nav a {
    color: white;
    margin-right: 1rem;
  }
</style>
