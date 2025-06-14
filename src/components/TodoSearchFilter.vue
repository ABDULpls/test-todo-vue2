<template>
    <div>
        <v-text-field
            v-model="searchQuery"
            prepend-icon="mdi-magnify"
            label="Search"
            hide-details
            clearable
            @input="$emit('search', $event)"
        />

        <v-btn-toggle class="mb-4 mt-4" :value="currentFilter" mandatory>
            <v-btn value="all" @click="$emit('filter', 'all')">All ({{ totalCount }})</v-btn>
            <v-btn value="active" @click="$emit('filter', 'active')">
                Active ({{ activeCount }})
            </v-btn>
            <v-btn value="completed" @click="$emit('filter', 'completed')">
                Completed ({{ completedCount }})
            </v-btn>
        </v-btn-toggle>

        <div class="mt-4">
            <v-btn color="primary" @click="$emit('add')">Add Todo</v-btn>
            <v-btn
                v-if="completedCount > 0"
                color="error"
                class="ml-2"
                @click="$emit('clear-completed')"
            >
                Clear Completed
            </v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'TodoSearchFilter',
        props: {
            currentFilter: {
                type: String,
                required: true,
            },
            totalCount: {
                type: Number,
                required: true,
            },
            activeCount: {
                type: Number,
                required: true,
            },
            completedCount: {
                type: Number,
                required: true,
            },
        },
        data: () => ({
            searchQuery: '',
        }),
    };
</script>
