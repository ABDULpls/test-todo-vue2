<template>
    <v-dialog :value="dialog" max-width="500px" @input="$emit('update:dialog', $event)">
        <v-card>
            <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="valid">
                    <v-text-field
                        v-model="localEditedItem.title"
                        label="Title"
                        :rules="[v => !!v || 'Title is required']"
                        required
                    />
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="error" text @click="closeDialog">Cancel</v-btn>
                <v-btn color="primary" text :disabled="!valid" @click="saveTodo">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: 'TodoModal',
        props: {
            dialog: {
                type: Boolean,
                required: true,
            },
            editedItem: {
                type: Object,
                required: true,
            },
        },
        data: () => ({
            valid: false,
            localEditedItem: {},
        }),
        computed: {
            formTitle() {
                return this.localEditedItem.id === null ? 'New Todo' : 'Edit Todo';
            },
        },
        watch: {
            editedItem: {
                immediate: true,
                handler(val) {
                    this.localEditedItem = { ...val };
                },
            },
        },
        methods: {
            closeDialog() {
                this.$emit('close');
            },
            async saveTodo() {
                if (this.$refs.form.validate()) {
                    this.$emit('save', this.localEditedItem);
                }
            },
        },
    };
</script>
