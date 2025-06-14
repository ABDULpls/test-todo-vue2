<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        <TodoSearchFilter
                            :current-filter="filter"
                            :total-count="todos.length"
                            :active-count="activeTodosCount"
                            :completed-count="completedTodosCount"
                            @search="searchQuery = $event"
                            @filter="setFilter"
                            @add="openTodoDialog"
                            @clear-completed="clearCompleted"
                        />
                    </v-card-title>

                    <v-card-text>
                        <TodoListItems
                            :todos="todos"
                            @update="updateTodo"
                            @edit="openTodoDialog"
                            @delete="deleteTodo"
                            @reorder="onDragEnd"
                        />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <TodoModal
            :dialog.sync="dialog"
            :edited-item="editedItem"
            @close="closeDialog"
            @save="saveTodo"
        />
    </v-container>
</template>

<script>
    import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
    import TodoModal from './TodoModal.vue';
    import TodoSearchFilter from './TodoSearchFilter.vue';
    import TodoListItems from './TodoListItems.vue';

    export default {
        name: 'TodoList',
        components: {
            TodoModal,
            TodoSearchFilter,
            TodoListItems,
        },
        data: () => ({
            dialog: false,
            searchQuery: '',
            editedItem: {
                id: null,
                title: '',
                completed: false,
            },
            defaultItem: {
                id: null,
                title: '',
                completed: false,
            },
        }),
        computed: {
            ...mapState(['filter']),
            ...mapGetters(['activeTodosCount', 'completedTodosCount']),
            todos() {
                return this.$store.getters.filteredTodos(this.searchQuery);
            },
        },
        created() {
            this.fetchTodos();
        },
        methods: {
            ...mapActions(['fetchTodos', 'addTodo', 'updateTodo', 'deleteTodo', 'clearCompleted']),
            ...mapMutations({
                setFilter: 'SET_FILTER',
            }),
            openTodoDialog(item) {
                this.editedItem = item ? { ...item } : { ...this.defaultItem };
                this.dialog = true;
            },
            closeDialog() {
                this.dialog = false;
                this.$nextTick(() => {
                    this.editedItem = { ...this.defaultItem };
                });
            },
            async saveTodo(item) {
                if (item.id) {
                    await this.updateTodo(item);
                } else {
                    await this.addTodo(item);
                }
                this.closeDialog();
            },
            onDragEnd({ oldIndex, newIndex }) {
                this.$store.commit('REORDER_TODOS', {
                    oldIndex,
                    newIndex,
                });
            },
        },
    };
</script>

<style lang="scss">
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
