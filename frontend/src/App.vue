<template>
  <v-app id="App">
    <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      v-model="drawer"
      v-if="logueado"
    >
      <v-list dense>
        <template v-if="esAdministrador || esSecretaria">
          <v-list-item>
            <v-list-item-action>
              <v-icon>account_box</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              <v-text-field readonly v-model="this.$store.state.usuario.email">
              </v-text-field>
            </v-list-item-title>
          </v-list-item>
        </template>

        <v-divider></v-divider>

        <template v-if="esAdministrador">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title> Archivos </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'cargadoc' }">
              <v-list-item-action>
                <v-icon>cloud_upload</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Cargar archivos </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>

        <template v-if="esAdministrador">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title> Repositorios </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'agregarepositorio' }">
              <v-list-item-action>
                <v-icon>add</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Agregar nuevo repositorio
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              :to="{
                name: 'repositoriosindex',
                params: { repositorio: item.repositorio },
              }"
              v-for="item in repositorios"
              :key="item.repositorio"
            >
              <v-list-item-action>
                <v-icon>folder_open</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item.repositorio }} </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>

        <template v-if="esAdministrador">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title> Usuarios </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'usuario' }">
              <v-list-item-action>
                <v-icon>supervisor_account</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title> Lista de usuarios </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>

        <template v-if="esSecretaria">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title> Repositorios </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              :to="{
                name: 'repositoriosindex',
                params: { repositorio: item.repositorio },
              }"
              v-for="item in repositorios"
              :key="item.repositorio"
            >
              <v-list-item-action>
                <v-icon>folder_open</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item.repositorio }} </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      dense
      color="#0E4146"
      dark
    >
      <v-toolbar-title style="" class="ml-0 pl-0">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <span class="hidden-sm-and-down">Repositorio Oficial - SESEAY</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn @click="salir()" icon v-if="logueado">
        <v-icon>exit_to_app</v-icon>
      </v-btn>
      <v-btn :to="{ name: 'login' }" icon v-else>
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in">
          <router-view />
        </v-slide-y-transition>
      </v-container>
    </v-content>
    <v-card height="150">
      <v-footer color="#0E4146" absolute class="font-weight-medium"> </v-footer>
    </v-card>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "App",
  data() {
    return {
      drawer: true,
      repositorios: [],
    };
  },
  computed: {
    logueado() {
      return this.$store.state.usuario;
    },
    esAdministrador() {
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "Administrador"
      );
    },
    esSecretaria() {
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "Secretaria"
      );
    },
  },
  watch: {
    $route: "listar",
  },
  created() {
    this.$store.dispatch("autoLogin");
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
    salir() {
      this.$store.dispatch("salir");
    },
  },
};
</script>
