<template>
	<div>
		<div class="flex justify-center">
			<span class="alert" :class="type">
				<slot></slot>
			</span>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Alert extends Vue {
	//Props
	@Prop({ default: "info" }) type: "danger" | "warn" | "info" | "success";
}
</script>

<style lang="postcss" scoped>
.alert {
	@apply py-3 px-12;
	@apply rounded-md border;
}

.danger {
	@apply bg-red-200 text-red-600 border-red-500;
}

.warn {
	@apply bg-orange-200 text-orange-600 border-orange-500;
}

.info {
	@apply bg-blue-200 text-blue-600 border-blue-500;
}

.success {
	@apply bg-green-200 text-green-600 border-green-500;
}
</style>