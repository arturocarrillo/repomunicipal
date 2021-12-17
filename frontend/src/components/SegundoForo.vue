<template>
  <v-layout align-start>
    <v-flex class="inicio">
      <v-toolbar v-if="formulariodocumentos == 0" text color="white">
        <v-toolbar-title>Segundo Foro</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          class="text-xs-center"
          v-model="search"
          append-icon="search"
          label="Búsqueda"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
      </v-toolbar>
        <!-- ....................Tabla de documentos.................... -->
      <v-data-table
        :headers="headerDocumentos"
        :items="documentos"
        :search="search"
        class="elevation-1"
       
      >
      <template v-slot:item.fecha="{item}">
                    <div>
                        <span>{{format_date(item.createdAt)}}</span>
                    </div>
                </template> 

        <template v-slot:item.opciones="{ item }">
          <v-btn small @click="descargar(item)">
            <v-icon > cloud_download </v-icon>
          </v-btn>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="listar()">Resetear</v-btn>
        </template>
      </v-data-table>

      

    </v-flex>
  </v-layout>
</template>



<script>
import axios from "axios";
import moment from "moment";
export default {
  data() {
    return {
      formulariodocumentos: 0,
      file: "",
      repositorios : ["Primer Foro", "Segundo Foro","Blindaje Electoral"],
      documentos: [],
      headerDocumentos: [
        { text: "Titulo", value: "titulo", sortable: true },
        { text: "Descripcion", value: "descripcion", sortable: true },
        { text: "Fecha", value: "fecha", sortable: true },
        { text: "Acciones", value: "opciones", sortable: false },
      ],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.listar();
  },
  methods: {
    
    obetenerImagen2(e) {
      let file = e.target.files[0];
      console.log(file);
      this.file = file;
    },
    format_date(value){
         if (value) {
           moment.locale('es');
           return moment(String(value)).format('LL')
          }
      },
      format_dateFull(value){
         if (value) {
           moment.locale('es');
           return moment(String(value)).format('LLLL');
          }
      },

    
    listar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("documentos/listDocumentosSegundoForo", configuracion)
        .then(function (response) {
          me.documentos = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

  },
};
</script>

<style>
</style>