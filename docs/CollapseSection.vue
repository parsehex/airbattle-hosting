<script setup>
import { ref, computed } from 'vue';
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from '../@/components/ui/collapsible';

const props = defineProps({
	title: {
		type: String,
		required: true
	}
});

const open = ref(false);

const icon = computed(() => (open.value ? '⬇️' : '➡️'));
</script>

<template>
	<Collapsible v-model:open="open">
		<CollapsibleTrigger>
			<span  class="text-lg font-bold">
			{{ title }} <span>{{ icon }}</span>
			</span>
		</CollapsibleTrigger>
		<CollapsibleContent>
			<slot></slot>
		</CollapsibleContent>
	</Collapsible>
</template>
