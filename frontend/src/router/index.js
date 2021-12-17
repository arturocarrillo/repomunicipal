import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'
import Home from '../views/Home.vue'
import Login from '../components/Login.vue'
import Usuario from '../components/Usuario.vue'
import Vista1 from '../components/vista1.vue'
import CargaDoc from '../components/carga_doc.vue'
import PrimerForo from '../components/PrimerForo.vue'
import SegundoForo from '../components/SegundoForo.vue'
import BlindajeElectoral from '../components/BlindajeElectoral.vue'
import AgregaRepositorio from '../components/AgregaRepositorio.vue'
import RepositoriosIndex from '../components/RepositoriosIndex.vue'



Vue.use(Router)
var router = new Router({
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            name: 'home',
            component: Home,
            meta: {
                administrador: true,
                secretaria: true,
            }
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: {
                libre: true
            }
        },
        {
            path: '/cargadoc',
            name: 'cargadoc',
            component: CargaDoc,
            meta: {
                administrador: true,
            }
        },
        {
            path: '/vista1',
            name: 'vista1',
            component: Vista1,
            meta: {
                administrador: true,
                secretaria: true,
            }
        },
        {
            path: '/usuario',
            name: 'usuario',
            component: Usuario,
            meta: {
                administrador: true,
            }
        },
        {
            path: '/primerforo',
            name: 'primerforo',
            component: PrimerForo,
            meta: {
                administrador: true,
            }
        },
        {
            path: '/segundoforo',
            name: 'segundoforo',
            component: SegundoForo,
            meta: {
                administrador: true,
            }
        },
        {
            path: '/blindaje',
            name: 'blindaje',
            component: BlindajeElectoral,
            meta: {
                administrador: true,
            }
        },
        {
            path: '/agregarepositorio',
            name: 'agregarepositorio',
            component: AgregaRepositorio,
            meta: {
                administrador: true,
                secretaria: true,
            }
        },
        {
            path: '/repositoriosindex/:repositorio',
            name: 'repositoriosindex',
            component: RepositoriosIndex,
            meta: {
                administrador: true,
                secretaria: true,
            }
        },

    ]
})
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.libre)) {
        next();
    } else if (store.state.usuario && store.state.usuario.rol == 'Administrador') {
        if (to.matched.some(record => record.meta.administrador)) {
            next();
        }
    } else if (store.state.usuario && store.state.usuario.rol == 'Secretaria') {
        if (to.matched.some(record => record.meta.secretaria)) {
            next();
        }
    } else {
        next({ name: 'login' });
    }
})
export default router