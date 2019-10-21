<template>
	<div id="app">
		<nav id="nav">
			<router-link class="mr-2" to="/">Home</router-link>
			<router-link to="/ideas">Ideas</router-link>
		</nav>
		<router-view />
	</div>
</template>

<style lang="postcss" scoped>
#app {
	@apply m-5;
}

#nav > a.router-link-exact-active {
	@apply text-blue-500 font-semibold;
}
</style>