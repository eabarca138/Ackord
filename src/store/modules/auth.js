export default {
    state: {
        email: "",
        password: ""
    },
    mutations: {
        actualizarEmail(state, email) {
          state.email = email;
        },
        actualizarPassword(state, password) {
          state.password = password;
        },
}
}