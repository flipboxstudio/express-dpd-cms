<template>
  <div class="action-spacing">
      <v-progress-circular indeterminate color="primary" v-if="loading"></v-progress-circular>
      <v-btn @click="submit" class="blue" v-if="showSubmit">Submit</v-btn>
      <v-btn @click="edit" class="blue" v-if="showEdit">Edit</v-btn>
      <v-btn @click="cancel" class="blue" outline v-if="showCancel">Cancel</v-btn>
      
      <v-dialog persistent lazy absolute v-if="showDelete" v-model="deleteDialog">
          <v-btn class="red" slot="activator">Delete</v-btn>
          <v-card>
            <v-card-title>
                <div class="headline">Are you sure?</div>
            </v-card-title>
            <v-card-text>Are you sure to delete this data?</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" flat @click.native="remove">YES</v-btn>
                <v-btn color="black darken-1" flat @click.native="deleteDialog = false">NO</v-btn>
            </v-card-actions>
          </v-card>
      </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['state', 'readonly', 'loading'],
  data () {
    return {
      deleteDialog: false
    }
  },
  watch: {
    state (val) {

    }
  },
  computed: {
    showSubmit () {
      return (this.state === 'create' || this.state === 'edit') && !this.loading
    },
    showEdit () {
      return (this.state === 'view') && !this.loading
    },
    showCancel () {
      return (this.state === 'create' || this.state === 'edit') && !this.loading
    },
    showDelete () {
      return (this.state === 'view') && !this.loading
    }
  },
  methods: {
    submit () {
      this.$emit('submit')
    },
    cancel () {
      this.$emit('cancel')
    },
    edit () {
      this.$emit('edit')
    },
    remove () {
      this.deleteDialog = false
      this.$emit('remove')
    }
  }
}
</script>

<style scoped>
.action-spacing {
  margin-bottom: 40px;
  margin-top: 10px;
}
</style>
