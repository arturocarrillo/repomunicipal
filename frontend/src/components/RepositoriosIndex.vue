<template>
  <v-layout align-start>
    <v-flex class="inicio">
      <v-toolbar v-if="formulariodocumentos == 0" text color="white">
        <v-toolbar-title>{{this.$route.params.repositorio}}</v-toolbar-title>
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
        <template v-slot:item.fecha="{ item }">
          <div>
            <span>{{ format_date(item.createdAt) }}</span>
          </div>
        </template>

        <template v-slot:item.opciones="{ item }">
          <v-btn @click="descarga(item.documento)">
            <v-icon> cloud_download </v-icon>
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
import FileDownload from "js-file-download";
export default {
  data() {
    return {
      search: "",
      formulariodocumentos: 0,
      file: "",
      repositorios: ["Primer Foro", "Segundo Foro", "Blindaje Electoral"],
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
  watch: {
    "$route":"listar"
  },
  created() {
    this.listar();
  },
  methods: {
    obetenerImagen2(e) {
      let file = e.target.files[0];
      console.log(file);
      this.file = file;
    },
    format_date(value) {
      if (value) {
        moment.locale("es");
        return moment(String(value)).format("LL");
      }
    },
    format_dateFull(value) {
      if (value) {
        moment.locale("es");
        return moment(String(value)).format("LLLL");
      }
    },
    listar() {
      let me = this;
      let repo = this.$route.params.repositorio;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("documentos/list?valor=" + repo, configuracion)
        .then(function (response) {
          me.documentos = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    descarga(id) {
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios

        .get("documentos/descargame/" + id, configuracion)
        .then(function (response) {
          FileDownload(response.data, "report.jpg");
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