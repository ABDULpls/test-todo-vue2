import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        todos: [],
        filter: 'all', // 'all', 'active', 'completed'
    },
    getters: {
        filteredTodos:
            state =>
            (searchQuery = '') => {
                let todos = state.todos;
                // Apply search filter
                if (searchQuery) {
                    todos = todos.filter(todo =>
                        todo.title.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                }
                // Apply status filter
                switch (state.filter) {
                    case 'active':
                        return todos.filter(todo => !todo.completed);
                    case 'completed':
                        return todos.filter(todo => todo.completed);
                    default:
                        return todos;
                }
            },
        activeTodosCount: state => state.todos.filter(todo => !todo.completed).length,
        completedTodosCount: state => state.todos.filter(todo => todo.completed).length,
    },
    mutations: {
        SET_TODOS(state, todos) {
            state.todos = todos;
        },
        ADD_TODO(state, todo) {
            state.todos.push(todo);
        },
        UPDATE_TODO(state, updatedTodo) {
            const index = state.todos.findIndex(todo => todo.id === updatedTodo.id);
            if (index !== -1) {
                state.todos.splice(index, 1, updatedTodo);
            }
        },
        DELETE_TODO(state, todoId) {
            state.todos = state.todos.filter(todo => todo.id !== todoId);
        },
        CLEAR_COMPLETED(state) {
            state.todos = state.todos.filter(todo => !todo.completed);
        },
        SET_FILTER(state, filter) {
            state.filter = filter;
        },
        REORDER_TODOS(state, { oldIndex, newIndex }) {
            const todo = state.todos.splice(oldIndex, 1)[0];
            state.todos.splice(newIndex, 0, todo);
        },
    },
    actions: {
        async fetchTodos({ commit }) {
            const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
            const todos = response.data.map(todo => ({
                ...todo,
                createdAt: new Date().toISOString(),
            }));
            commit('SET_TODOS', todos);
        },
        async addTodo({ commit }, todo) {
            const response = await axios.post('https://jsonplaceholder.typicode.com/todos', todo);
            commit('ADD_TODO', {
                ...response.data,
                createdAt: new Date().toISOString(),
            });
        },
        async updateTodo({ commit }, todo) {
            const response = await axios.put(
                `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
                todo
            );
            commit('UPDATE_TODO', response.data);
        },
        async deleteTodo({ commit }, todoId) {
            await axios.delete(`https://jsonplaceholder.typicode.com/todos/${todoId}`);
            commit('DELETE_TODO', todoId);
        },
    },
});
