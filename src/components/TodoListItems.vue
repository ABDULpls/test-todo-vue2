<template>
    <v-list>
        <draggable v-model="localTodos" handle=".drag-handle" animation="200" @end="onDragEnd">
            <transition-group type="transition" name="fade">
                <v-list-item
                    v-for="todo in localTodos"
                    :key="todo.id"
                    :class="{ completed: todo.completed }"
                    class="todo-item"
                >
                    <v-list-item-action>
                        <v-checkbox v-model="todo.completed" @change="$emit('update', todo)" />
                    </v-list-item-action>

                    <v-list-item-content>
                        <v-list-item-title
                            :class="{ 'text-decoration-line-through': todo.completed }"
                        >
                            {{ todo.title }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            Created: {{ formatDate(todo.createdAt) }}
                        </v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                        <v-btn icon class="drag-handle">
                            <v-icon>mdi-drag</v-icon>
                        </v-btn>
                        <v-btn icon @click="$emit('edit', todo)">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon @click="$emit('delete', todo.id)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </transition-group>
        </draggable>
    </v-list>
</template>

<script>
    import draggable from 'vuedraggable';

    export default {
        name: 'TodoListItems',
        components: { draggable },
        props: {
            todos: {
                type: Array,
                required: true,
            },
        },
        computed: {
            localTodos: {
                get() {
                    return this.todos;
                },
            },
        },
        methods: {
            formatDate(date) {
                return new Date(date).toLocaleString();
            },
            onDragEnd(evt) {
                this.$emit('reorder', {
                    oldIndex: evt.oldIndex,
                    newIndex: evt.newIndex,
                });
            },
        },
    };
</script>

<style lang="scss" scoped>
    .todo-item {
        transition: all 0.3s ease;
        &.completed {
            opacity: 0.7;
        }
        .drag-handle {
            cursor: move;
        }
    }
    .v-list-item {
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        &:last-child {
            border-bottom: none;
        }
    }
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s;
    }
    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }
</style>
