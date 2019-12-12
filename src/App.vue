<template>
	<v-app>
		<!-- Sidebar -->
		<v-navigation-drawer app dark v-model="drawer" color="grey darken-4">
			<v-list-item>
				<v-list-item-content>
					<v-list-item-title class="title orange--text text--lighten-1 font-weight-bold">Venntiboard</v-list-item-title>
					<v-list-item-subtitle>Issue tracker</v-list-item-subtitle>
				</v-list-item-content>
			</v-list-item>

			<v-list dense>
				<v-list-item link to="/">
					<v-list-item-action>
						<v-icon>mdi-home</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Home</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link to="/ideas" exact>
					<v-list-item-action>
						<v-icon>mdi-lightbulb-on</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Ideas</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link to="/ideas/new">
					<v-list-item-action>
						<v-icon>mdi-plus-thick</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Create</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>

			<template v-slot:append>
				<v-divider />

				<v-list dense class="my-2">
					<v-list-item link>
						<v-list-item-action>
							<v-icon>mdi-settings</v-icon>
						</v-list-item-action>
						<v-list-item-content>
							<v-list-item-title>Settings</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
					<v-list-item link>
						<v-list-item-action>
							<v-icon>mdi-code-tags</v-icon>
						</v-list-item-action>
						<v-list-item-content>
							<v-list-item-title>Version 🎃</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-list>
			</template>
		</v-navigation-drawer>

		<!-- Navbar -->
		<v-app-bar app flat color="#fafafa" class="app-bar px-2">
			<v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
			<v-toolbar-title class="text-capitalize font-weight-bold headline">{{ $route.name }}</v-toolbar-title>

			<v-spacer></v-spacer>

			<v-btn icon>
				<v-icon>mdi-magnify</v-icon>
			</v-btn>
		</v-app-bar>

		<!-- Content -->
		<v-content class="mx-8">
			<router-view />
		</v-content>
	</v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class App extends Vue {
	drawer = true;
}
</script>

<style lang="scss" scoped>
.app-bar {
	border-bottom: solid 2px;
	border-color: #fafafa;

	transition-duration: 0.2s;
	transition-property: border;
	transition-timing-function: ease-in-out;
}

.app-bar.v-app-bar--is-scrolled {
	border-color: #eaeaea !important;
}
</style>