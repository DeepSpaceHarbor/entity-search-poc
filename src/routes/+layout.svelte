<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import { afterNavigate } from '$app/navigation';
	import { HSStaticMethods } from 'flyonui/flyonui';
	import github from 'svelte-highlight/styles/github';

	let { children } = $props();

	afterNavigate(() => {
		// Runs after navigating between pages
		HSStaticMethods.autoInit();
	});
</script>

<svelte:head
	><link rel="icon" href={favicon} />
	<title>People & Company Search Query Builder</title>
	{@html github}
</svelte:head>
{@render children()}
