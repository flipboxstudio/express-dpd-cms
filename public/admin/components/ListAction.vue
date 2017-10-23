<template>
  <div>
    <v-btn small fab class="blue white--text" @click="edit(id)">
        <v-icon dark>edit</v-icon>
    </v-btn>
    <v-dialog persistent lazy absolute v-model="deleteDialog">
        <v-btn small fab class="red white--text" slot="activator">
            <v-icon dark>delete</v-icon>
        </v-btn>
        <v-card>
        <v-card-title>
            <div class="headline">Are you sure?</div>
        </v-card-title>
        <v-card-text>Are you sure to delete this data?</v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" flat @click.native="remove(id)">YES</v-btn>
            <v-btn color="black darken-1" flat @click.native="deleteDialog = false">NO</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data () {
    return {
      deleteDialog: false
    }
  },
  methods: {
    edit (id) {
      this.$emit('edit', id)
    },
    remove (id) {
      this.deleteDialog = false
      this.$emit('remove', id)
    }
  }
}
</script>
