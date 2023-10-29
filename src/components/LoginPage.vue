<template>
  <div class="container logincom">
    <div class="login">
      <div class="row">
        <h2 class="text-center">Login</h2>
        <div class="col-md-12">
          <label for="email">Email</label>
          <input type="text" class="form-control" id="email" v-model="email" />
          <br />
          <label for="password">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            v-model="password"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <input
            type="reset"
            id="reset"
            @click="reset"
            class="btn btn-outline-primary btn-form"
          />
        </div>
        <div class="col-md-6">
          <input
            @click="login"
            type="reset"
            id="signup"
            value="Login"
            class="btn btn-outline-success btn-form"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style>


.login {
  background-color: #eee;
  width: 40%;
  margin: 80px auto;
  border-radius: 10px;
  padding: 20px;
  border-left: 5px solid #009688;
  box-shadow: 0px 0px 0px 0px #3f51b5;
}

.login > .row > h2 {
  margin: auto;
}

.btn-form {
  width: 100%;
  margin-top: 20px;
}
</style>
<script>
import axios from "axios";
import { APIURL } from "@/constraint";
import md5 from "md5";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    login() {
      axios
        .get(`${APIURL}/user`)
        .then((response) => {
            let isChecked = false;
          for (let i = 0; i < response.data.length; i++) {
            if (
              this.email == response.data[i].email &&
              md5(this.password) == response.data[i].password
            ) {
              this.$store.commit("setUser", response.data[i]);
              isChecked = true;
              this.$router.push('/cart');
              break;
            }
          }
          if(!isChecked){
            alert("Sai email hoặc mật khẩu");
          }
        })
        .catch((error) => {
          console.error("Lỗi khi lấy dữ liệu:", error);
        });
    },
    reset() {
      this.email = "";
      this.password = "";
    },
  },
  computed: {
    ...mapGetters(['getUser'])
  },    
  mounted() {},
};
</script>