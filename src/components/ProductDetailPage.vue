<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-5 ">
        <img :src="currentImage" alt="" class="product-image" />
        <div class="d-flex mt-2">
          <img :src="product.mainimage" alt="" class="sub-image" @click="showImage(product.mainimage)"/>
          <img
            class="sub-image"
            v-on:click="showImage(color.subimage)"
            v-for="color in colors"
            :key="color.idcolor"
            :src="color.subimage"
          />
        </div>
      </div>
      <div class="col-lg-7 ">
        <h1 class="product-name product-info">{{ product.name }}</h1>
        <p class="product-price product-info">
          {{ toCurrency(price) }}
        </p>
        <p class="product-id product-info">
          <b>Mã sản phẩm: </b>{{ product.id }}{{ idColorSelected
          }}{{ idSizeSelected }}
        </p>
        <p class="product-brand product-info">
          <b>Thương hiệu: </b>{{ product.brand }}
        </p>
        <p class="product-description product-info">
          <b>Mổ tả: </b>{{ product.description }}
        </p>
        <div class="p-0">
          <p class="product-info" style="margin-bottom: -4px"><b>Màu: </b></p>
          <button
            class="product-btn-color"
            :id="`btn-color-${color.idcolor}`"
            v-on:click="selectedColor(color.idcolor)"
            v-for="color in colors"
            :key="color.idcolor"
            :style="'background-color: ' + color.color + ';'"
          ></button>
        </div>
        <div class="p-0">
          <p class="product-info" style="margin-bottom: 4px"><b>Size: </b></p>
          <button
            v-for="size in sizes"
            :key="size"
            v-on:click="selectedSize(size)"
            class="product-btn-size"
            :id="`btn-size-${size}`"
          >
            {{ size }}
          </button>
          <p class="product-info my-2"><b>Insock: </b> {{ instock }}</p>
        </div>
        <div class="d-flex">
          <p class="product-info" style="margin-bottom: 4px">
            <b>Số lượng: </b>
          </p>
          <span class="input-wrapper ms-3" style="margin-top: -4px">
            <button @click="decrementQuantity">-</button>
            <input type="number" v-model="quantity" min="1" />
            <button @click="incrementQuantity">+</button>
          </span>
        </div>
        <button class="btn btn-danger mt-3" @click="addToCart">
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  </div>
</template>
<style>
.sub-image {
  width: 20%;
  border: 1px solid transparent;
  cursor: pointer;
  margin-right: 8px;
}
.sub-image:hover,
.sub-image.active {
  border-color: red;
}
.product-name {
  font-size: 32px;
  font-weight: 600;
  text-align: left;
}
.product-price {
  font-size: 24px;
  color: #ff6073;
}
.product-info {
  margin: 4px 0;
  font-family: "Montserrat", "Helvetica" !important;
}
.color-btns-wrap {
  margin: -8px 0;
}
.product-btn-color {
  width: 25px;
  padding: 10px 20px;
  margin: 0 8px 0 0;
  border: 3px solid grey;
}
.product-btn-size {
  padding: 4px 20px;
  margin: 0 8px 0 0;
  border: 3px solid transparent;
  font-size: 12px;
}
.product-btn-color.active,
.product-btn-size.active {
  border: 3px solid #ff6073;
}
.input-wrapper {
  width: 150px;
  height: 35px;
  display: flex;
  border-radius: 50%;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

input[type="number"] {
  padding: 5px;
  text-align: center;
  border: 1px solid green;
}

.input-wrapper * {
  border: none;
  width: 50px;
  flex: 1;
}

.input-wrapper button {
  cursor: pointer;
}

.input-wrapper button:first-child {
  /* border-radius: 50% 0 0 50%; */
  border: 1px solid grey;
  background-color: white;
  color: red;
}

.input-wrapper button:last-child {
  /* border-radius: 0 50% 50% 0; */
  color: green;
  background-color: white;

  border: 1px solid grey;
}
</style>
  <script>
import axios from "axios";
import { APIURL } from "@/constraint";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      product: { mainimage: "" },
      colors: [],
      sizes: [],
      currentImage: "",
      idSizeSelected: "",
      idColorSelected: "",
      price: 0,
      instock: 0,
      quantity: 1,
    };
  },
  methods: {
    load() {
      return axios.get(`${APIURL}/products`).then((response) => {
        const data = response.data;
        this.$store.commit("setData", data);
        const { id } = this.$route.params;
        this.$store.commit("setIdSearch", id);
        this.product = this.$store.getters.getProductById;
        this.price = this.product.price;
        this.colors = this.product.variations; // gán color
        // gán size
        for (const color of this.colors) {
          for (const size of color.sizes) {
            if (!this.sizes.includes(size.size)) {
              this.sizes.push(size.size);
            }
          }
        }
        this.sizes.sort();
        this.$store.commit("setDefaultData");
        this.currentImage = this.product.mainimage;
      });
    },
    showImage(image){
      this.currentImage = image;
    }, 
    toCurrency(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
    selectedColor(idcolor) {
      let listBtn = document.querySelectorAll(".product-btn-color");
      listBtn.forEach((btn) => {
        btn.classList = "product-btn-color";
      });
      let selectedBtn = document.querySelector(`#btn-color-${idcolor}`);
      selectedBtn.classList.add("active");
      if (this.idColorSelected != idcolor) {
        this.kiemTraSize(idcolor);
        this.idSizeSelected = "";
        this.instock = 0;
        this.quantity = 1;
        this.updateGia();
      }
      this.idColorSelected = idcolor;
      this.showImage(this.product.variations.find(v => v.idcolor == idcolor).subimage);
    },
    selectedSize(size) {
      let listBtn = document.querySelectorAll(".product-btn-size");
      listBtn.forEach((btn) => {
        btn.classList = "product-btn-size";
      });
      let selectedBtn = document.querySelector(`#btn-size-${size}`);
      selectedBtn.classList.add("active");
      this.idSizeSelected = size;
      this.updateGia();
    },
    kiemTraSize(idcolor) {
      let listSize = [];
      for (let i = 0; i < this.colors.length; i++) {
        if (this.colors[i].idcolor == idcolor) {
          listSize = this.colors[i].sizes;
          break;
        }
      }
      let listBtn = document.querySelectorAll(".product-btn-size");
      listBtn.forEach((btn) => {
        btn.disabled = true;
        btn.classList.remove("active");
      });
      for (let i = 0; i < listSize.length; i++) {
        if (listSize[i].quantity > 0) {
          let inStockBtn = document.querySelector(
            `#btn-size-${listSize[i].size}`
          );
          inStockBtn.disabled = false;
        }
      }
    },
    updateGia() {
      for (let i = 0; i < this.colors.length; i++) {
        if (this.colors[i].idcolor == this.idColorSelected) {
          this.price = this.product.price + this.colors[i].bonuspriceColor;
          for (let j = 0; j < this.colors[i].sizes.length; j++) {
            if (this.colors[i].sizes[j].idsize == this.idSizeSelected) {
              this.instock = this.colors[i].sizes[j].quantity;
              if (this.quantity > this.instock) {
                this.quantity = this.instock;
              }
            }
          }
          break;
        }
      }
    },
    incrementQuantity() {
      if (this.instock > this.quantity) {
        this.quantity += 1;
      }
    },
    decrementQuantity() {
      if (this.quantity > 1) {
        this.quantity -= 1;
      }
    },
    addToCart() {
      if (typeof this.getUser.id == 'undefined') {
        if(window.confirm("Bạn chưa đăng nhập, đăng nhập ngay ?")){
          this.$router.push('/login');
        }
      } else {
        if (
          this.product &&
          this.idColorSelected &&
          this.idSizeSelected &&
          this.quantity
        ) {
          let temp = this.product.variations.find(v => v.idcolor == this.idColorSelected);
          let image = temp.subimage;
          this.$store.commit("addToCart", {
            id: this.product.id,
            idcolor: this.idColorSelected,
            idsize: this.idSizeSelected,
            quantity: this.quantity,
            instock: this.instock,
            image: image,
          });
          this.$router.push('/cart');
        } else {
          alert("Bạn chưa chọn sản phẩm hoặc số lượng.");
        }
      }
    },
  },
  computed: {
    ...mapGetters(["getProductById", "getUser"]),
  },

  beforeMount() {
    this.load();
  },
  create() {},
};
</script>
  
  <style>
</style>