<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar text color="white">
        <v-toolbar-title>Lista de repositorios</v-toolbar-title>
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
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn dark class="teal darken-4 mb-2" v-on="on"
              >Agregar nuevo repositorio</v-btn
            >
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                    <v-text-field
                      v-model="nombre"
                      label="Nombre"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12 v-show="valida">
                    <div
                      class="red--text"
                      v-for="v in validaMensaje"
                      :key="v"
                      v-text="v"
                    ></div>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="teal" class="darken-4" outlined flat @click="close"
                >Cancelar</v-btn
              >
              <v-btn color="teal" dark class="darken-4" flat @click="guardar"
                >Guardar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="adModal" max-width="320">
          <v-card>
            <v-card-title class="headline" v-if="adAccion == 1">
              Activar Repositorio
            </v-card-title>
            <v-card-title class="headline" v-if="adAccion == 2">
              Eliminar Repositorio
            </v-card-title>
            <v-card-text>
              Estás a punto de <span v-if="adAccion == 1">activar </span>
              <span v-if="adAccion == 2">desactivar </span> el Repositorio
              <h3>{{ adNombre }}</h3>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                @click="activarDesactivarCerrar()"
                class="ma-2"
                tile
                outlined
                color="error"
              >
                Cancelar
              </v-btn>
              <v-btn
                v-if="adAccion == 1"
                @click="activar()"
                class="ma-2"
                tile
                outlined
                color="success"
              >
                Activar
              </v-btn>
              <v-btn
                v-if="adAccion == 2"
                @click="desactivar()"
                class="ma-2"
                tile
                color="warning"
              >
                Eliminar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="repositorios"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:item.opciones="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)"> edit </v-icon>
          <template v-if="item.estado">
            <v-icon small @click="activarDesactivarMostrar(2, item)">
              delete_forever
            </v-icon>
          </template>
          <template v-else>
            <v-icon small @click="activarDesactivarMostrar(1, item)">
              delete_forever
            </v-icon>
          </template>
        </template>

        <template v-slot:items="props">
          <td>{{ props.item.repositorio }}</td>
        </template>
        <template v-slot:item.fecha="{ item }">
          <div>
            <span>{{ format_date(item.createdAt) }}</span>
          </div>
        </template>

        <template v-slot:item.estado="{ item }">
          <div v-if="item.estado">
            <span class="blue--text">Activo</span>
          </div>
          <div v-else>
            <span class="red--text">Inactivo</span>
          </div>
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
      dialog: false,
      search: "",
      repositorios: [],
      headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Nombre", value: "repositorio", sortable: true },
        { text: "Fecha de creación", value: "fecha", sortable: true },
        { text: "Estado", value: "estado", sortable: false },
      ],
      editedIndex: -1,
      _id: "",
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: "",
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Nuevo Repositorio"
        : "Editar Repositorio";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  created() {
    this.listar();
  },
  methods: {
    listar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("repositorios/list", configuracion)
        .then(function (response) {
          me.repositorios = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
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
    limpiar() {
      this._id = "";
      this.nombre = "";
      this.direccion = "";
      this.telefono = "";
      this.email = "";
      this.password = "";
      this.valida = 0;
      this.validaMensaje = [];
      this.editedIndex = -1;
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];

      if (this.nombre.length < 1 || this.nombre.length > 50) {
        this.validaMensaje.push(
          "El nombre del repositorio debe tener entre 1-20 caracteres."
        );
      }

      if (this.validaMensaje.length) {
        this.valida = 1;
      }

      return this.valida;
    },
    guardar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      if (this.validar()) {
        return;
      }
      if (this.editedIndex > -1) {
        //Código para editar
        axios
          .put(
            "repositorios/update",
            {
              _id: this._id,
              repositorio: this.nombre,
            },
            configuracion
          )
          .then(function (response) {
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        //Código para guardar
        axios
          .post(
            "repositorios/add",
            {
              repositorio: this.nombre,
            },
            configuracion
          )
          .then(function (response) {
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    editItem(item) {
      this._id = item._id;
      this.nombre = item.repositorio;
      this.dialog = true;
      this.editedIndex = 1;
    },
    activarDesactivarMostrar(accion, item) {
      this.adModal = 1;
      this.adNombre = item.repositorio;
      this.adId = item._id;
      if (accion == 1) {
        this.adAccion = 1;
      } else if (accion == 2) {
        this.adAccion = 2;
      } else {
        this.adModal = 0;
      }
    },
    activarDesactivarCerrar() {
      this.adModal = 0;
    },
    activar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put("Repositorios/activate", { _id: this.adId }, configuracion)
        .then(function (response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    desactivar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put("repositorios/deactivate", { _id: this.adId }, configuracion)
        .then(function (response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    close() {
      this.dialog = false;
      this.limpiar();
    },
  },
};
</script>
