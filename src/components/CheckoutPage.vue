<template>
  <div class="container w-50 mb-5" >
    <h3 class="text-center my-3">ĐƠN ĐẶT HÀNG</h3>
    <p class="text-end">Ngày lập phiếu: {{ getCurrentDate }}</p>
    <div class="row">
      <div class="col-lg-6">
        <table>
          <tr>
            <th width="150px">Họ và tên:</th>
            <td>{{ user.name }}</td>
          </tr>
          <tr>
            <th>Số điện thoại:</th>
            <td>{{ user.phone }}</td>
          </tr>
          <tr>
            <th>Email:</th>
            <td>{{ user.email }}</td>
          </tr>
          <tr>
            <th>Địa chỉ:</th>
            <td>{{ user.address }}</td>
          </tr>
        </table>
      </div>
      <div class="col-lg-6">
        <table>
          <tr>
            <th width="150px">H.T thanh toán:</th>
            <td>Tiền mặt</td>
          </tr>
          <tr>
            <th>P.thức vận chuyển:</th>
            <td>Giao hàng nhanh</td>
          </tr>
          <tr>
            <th>Đơn vị tiền tệ:</th>
            <td>VNĐ</td>
          </tr>
        </table>
      </div>
      <div class="col-lg-12 mt-3">
        <table class="table table-bordered m-0">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã hàng</th>
              <th>Tên hàng</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in cart.products" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ `${item.idproduct}${item.idcolor}${item.idsize}` }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.price.toLocaleString() }}</td>
              <td class="text-end">{{ (item.price * item.quantity).toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
            <div class="d-flex">
                <div class="w-75 text-center" ><b>Tổng tiền hàng</b></div>
              <div class="w-25 text-end pe-2"><b>{{ total.toLocaleString() }}</b></div>
            </div>
      </div>
      <div class="col-lg-6 text-center my-5">
        <b >Người lập</b>
      </div>
      <div class="col-lg-6 text-center my-5">
        <b >Trưởng bộ phận</b>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      user: {},
      cart: {},
      total: 0,
    };
  },
  computed: {
    ...mapGetters(["getUser", "getCart"]),
    getCurrentDate() {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
      const year = today.getFullYear();
      return `${day}/${month}/${year}`;
    }
  },
  beforeMount() {
    if(this.getUser.id){
      this.user = this.getUser;
      this.cart = this.getCart;
      this.total = this.cart.products.reduce((acc, cur) => acc+ cur.price * cur.quantity, 0);
    }else {
      this.$router.push("/login");
    }
  },
};
</script>