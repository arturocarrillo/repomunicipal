<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md6 lg5 x14>
      <v-card>
        <v-toolbar dark color="#0E4146">
          <div class="d-flex justify-center align-center">
            <h3 class="text-center text-sm font-weight-regular text-uppercase">
              Repositorio de información
            </h3>
          </div>
        </v-toolbar>
        <v-card-text>
          <v-text-field
            v-model="email"
            autofocus
            color="accent"
            label="Correo electronico"
            required
          >
          </v-text-field>
          <v-text-field
            v-model="password"
            type="password"
            color="accent"
            label="Contraseña"
            required
          >
          </v-text-field>
          <v-flex class="red--text" v-if="errorM">
            {{ errorM }}
          </v-flex>
          <v-flex class="red--text" v-if="errors.length">
            <ul>
              <li v-for="error in errors" :key="error">{{ error }}</li>
            </ul>
          </v-flex>
        </v-card-text>
        <v-card-actions class="px-3 pb-3">
          <v-flex text-xs-right>
            <v-btn
              @click="
                ingresar();
                validar();
              "
              color="primary"
              >Ingresar</v-btn
            >
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>



<script>
import axios from "axios";
export default {
  data() {
    return {
      errorM: null,
      errors: [],
      email: null,
      password: null,
    };
  },
  methods: {
    validar() {
      this.errors = [];

      if (!this.email) {
        this.errors.push("El correo electrónico es obligatorio.");
      } else if (!this.validEmail(this.email)) {
        this.errors.push("El correo electrónico debe ser válido.");
      }
      if (!this.password) {
        this.errors.push("El password es obligatorio");
      }
    },
    validEmail: function (email) {
      var re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    ingresar() {
      axios
        .post("usuario/login", { email: this.email, password: this.password })
        .then((respuesta) => {
          return respuesta.data;
        })
        .then((data) => {
          this.$store.dispatch("guardarToken", data.tokenReturn);
          this.$router.push({ name: "home" });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

