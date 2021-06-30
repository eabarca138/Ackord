export default {
    state: {
        email: "",
        password: "",
        googleAuth: false,
    },
    mutations: {
        actualizarEmail(state, email) {
          state.email = email;
        },
        actualizarPassword(state, password) {
          state.password = password;
        },
        loginGoogleauth(state) {
          state.googleAuth = true
        },
        logoutGoogleauth(state) {
          state.googleAuth = false
        },
}
}