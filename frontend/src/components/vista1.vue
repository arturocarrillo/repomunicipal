<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar  text color="white">
        <v-toolbar-title>Opcion 1</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-if="verNuevo == 0"
          class="text-xs-center"
          v-model="search"
          append-icon="search"
          label="Búsqueda"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="info" @click="listar()"><v-icon>cached</v-icon></v-btn>
      </v-toolbar>


    </v-flex>
  </v-layout>
</template>
<script>

export default {
  data() {
    return {
      
    };
  },
  computed: {
    
  },
  watch: {
    
  },
  created() {
   
  },
  methods: {
    
  },
};
</script>

<style>

</style>