<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <router-link class="navbar-brand" to="/"><img src="https://minhshop.vn/assets/custom/logo.png" alt=""></router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/"
              ><b>Home</b></router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/cart"
              ><b>Cart</b></router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/checkout"
              ><b>Checkout</b></router-link>
          </li>
          
        </ul>
      </div>
      <div class="float-end">
            <router-link class="nav-link" to="/login" v-if="!getUser.id"
              ><b>Login</b></router-link
            >
            <button class="nav-link" @click="logout" v-if="getUser.id"
              ><b>Đăng xuất</b></button>
          </div>
    </div>
  </nav>
</template>
<style>
.navbar-brand img{
  width: 100px;
}
</style>
<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      user: {}
    }
  },
  computed: {
    ...mapGetters(['getUser'])
  },
  methods: {
    logout() {
      this.user =  Object.assign({}, {});
      this.$store.dispatch("setUser", this.user);
      this.$store.dispatch("setCart", this.user);
      this.$router.push("/login");
    }
  },
  beforeMount(){
    this.user = this.getUser;
    console.log(this.user);
  }
};
</script>
