<template>
  <div class="container">
    <h3 class="text-center my-3">GIỎ HÀNG</h3>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Ảnh</th>
          <th scope="col">Tên</th>
          <th scope="col">Màu</th>
          <th scope="col">Size</th>
          <th scope="col">Giá</th>
          <th scope="col">Số lượng</th>
          <th scope="col">Tổng tiền</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="typeof this.user.id == 'undefined'">
          <td colspan="9" class="text-center">Bạn chưa đăng nhập, đăng nhập  
            <router-link class="" to="/login">ngay</router-link>
            </td>
        </tr>
        <tr v-for="(item, index) in cart.products" :key="item.id">
          <th scope="justify-content-center">{{ index + 1 }}</th>
          <th style="width: 70px">
            <img :src="item.image" width="100" alt="" />
          </th>
          <td>{{ item.name }}</td>
          <td>{{ item.color }}</td>
          <td>{{ item.size }}</td>
          <td>{{ item.price.toLocaleString() }}</td>
          <td>
            <span class="input-wrapper ms-3" style="margin-top: -4px">
              <button @click="decrementQuantity(index)">-</button>
              <input type="number" v-model="item.quantity" min="1" />
              <button @click="incrementQuantity(index)">+</button>
            </span>
          </td>
          <td>{{ (item.price * item.quantity).toLocaleString() }}</td>
          <td>
            <button
              class="delete-btn"
              @click="
                deleteItem(
                  cart.id,
                  item.idproduct,
                  item.idcolor,
                  item.idsize,
                  item.quantity
                )
              "
            >
              X
            </button>
          </td>
        </tr>
      </tbody>
    </table>
        <div class="d-flex pe-5">
                <div class="w-75 text-center" ><b>Tổng tiền hàng</b></div>
              <div class="w-25 text-end pe-5"><b class="pe-4">{{ getTotal.toLocaleString() }}</b></div>
          </div>
    <h3 class="text-center mt-5">THÔNG TIN KHÁCH HÀNG</h3>
    <div class="container-fluid p-0">
      <div class="my-2">
        <label for="">Họ và tên: </label>
        <input type="text" v-model="user.name" class="form-control" />
      </div>
      <div class="my-2">
        <label for="">Email:</label>
        <input type="text" v-model="user.email" class="form-control" readonly/>
      </div>
      <div class="my-2">
        <label for="">Địa chỉ:</label>
        <input type="text" v-model="user.address" class="form-control" />
      </div>
      <div class="my-2">
        <label for="">Số điện thoại:</label>
        <input type="text" v-model="user.phone" class="form-control" />
      </div>
    </div>
    <button class="btn btn-danger float-end mb-5" @click="checkout">
      ĐẶT HÀNG
    </button>
  </div>
</template>
<style>
.delete-btn {
  font-size: 14px;
  font-weight: 700;
  padding: 0px 8px;
  background: none;
  color: red;
  border: none;
}
</style>
<script>
import axios from "axios";
import { APIURL } from "@/constraint";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      cart: { products: []},
      user: {},
      // idproduct: "",
      // idcolor: "",
      // idsize: "",
      // quantity: 0,
    };
  },
  methods: {
    load() {
      axios
        .get(`${APIURL}/cart`)
        .then((response) => {
          let userCart = response.data.find((i) => i.iduser == this.user.id);
          if(userCart){
            this.cart = userCart;
            this.$store.dispatch("setCart", this.cart);
          }else {
            this.cart =  Object.assign({}, {});
            this.cart.products = [];
            this.$store.dispatch("setCart", this.cart);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi lấy dữ liệu:", error);
        });
      // Load user
      this.user = {...this.getUser};
    },
    deleteItem(id, idproduct, idcolor, idsize, quantity) {
      if (window.confirm("Are you sure you want to delete")) {
        this.$store.dispatch("deleteProductInCart", {
          id,
          idproduct,
          idcolor,
          idsize,
        });
        this.$store.dispatch("addQuantityInProduct", {
          idproduct,
          idcolor,
          idsize,
          quantity,
        });
        for (let i = 0; i < this.cart.products.length; i++) {
          if (
            this.cart.products[i].idproduct == idproduct &&
            this.cart.products[i].idcolor == idcolor &&
            this.cart.products[i].idsize == idsize
          ) {
            this.cart.products.splice(i, 1);
            break;
          }
        }
      }
    },
    checkout() {
      // Lưu lại user
      if(this.user.name != this.getUser.name || this.user.phone != this.getUser.phone || this.user.address != this.getUser.address){
        this.$store.dispatch("setUser", this.user);
        this.$store.dispatch("updateUser", this.user);
      }else {
        console.log("Vẫn giữ nguyêng");
      }
      this.$router.push('/checkout');
    },
    decrementQuantity(index) {
      let p = { ...this.cart.products[index] };
      if (this.cart.products[index].quantity > 1) {
        this.cart.products[index].quantity--;
        // {idproduct , idcolor, idsize, quantity} Số lượng thêm vào
        this.$store.dispatch("addQuantityInProduct", {
          idproduct: p.idproduct,
          idcolor: p.idcolor,
          idsize: p.idsize,
          quantity: 1,
        });
        this.$store.dispatch("updateCart", { "id" : this.cart.id, "products": this.cart.products});
      } else {
        this.deleteItem(
          this.cart.id,
          p.idproduct,
          p.idcolor,
          p.idsize,
          p.quantity
        );
      }
    },
    incrementQuantity(index) {
      let p = { ...this.cart.products[index] };
      let availableQuantity = this.getProductQuantity(
        p.idproduct,
        p.idcolor,
        p.idsize
      );
      if (availableQuantity >= 1) {
        this.cart.products[index].quantity++;
        // {idproduct , idcolor, idsize, quantity} Số lượng thêm vào
        this.$store.dispatch("addQuantityInProduct", {
          idproduct: p.idproduct,
          idcolor: p.idcolor,
          idsize: p.idsize,
          quantity: -1,
        });
        this.$store.dispatch("updateCart", { "id" : this.cart.id, "products": this.cart.products});
        
      } else {
        alert("Sản phẩm đã hết hàng");
      }
    },
  },
  computed: {
    ...mapGetters(["getCart", "getUser", "getProductQuantity"]),
    getTotal(){
      return this.cart.products.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
    }
  },
  beforeMount() {
    this.load();
  },
};
</script>