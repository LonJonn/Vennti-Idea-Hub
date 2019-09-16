<template>
	<div id="app">
		<div id="nav">
			<router-link class="mr-2" to="/">Home</router-link>
			<router-link to="/about">About</router-link>
		</div>
		<router-view />
	</div>
</template>

<style lang="postcss" scoped>
#app {
	@apply m-5;
}

#nav > a.router-link-exact-active {
	@apply text-green-500 font-semibold;
}
</style>