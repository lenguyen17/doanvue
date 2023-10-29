<template>
  <div class="container">
    <div class="row justify-content-start mt-4">
      <div class="col-lg-3 p-0">
        <div class="container cate-box">
          <h4 class="fw-bold">Thương hiệu</h4>
          <button
            class="btn btn-outline-dark btn-filter-cate"
            v-for="cate in getCategories"
            :key="cate"
            @click="filterBrand(cate)"
            :class="{ active: cate === activeBrand }"
          >
            {{ cate }}
          </button>
          <button
            class="btn btn-outline-dark btn-filter-cate"
            @click="filterBrand('all')"
            :class="{ active: activeBrand === 'all' }"
          >
            Tất cả
          </button>
        </div>
        <div class="d-flex mt-3">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
            v-model="searchText"
          />
          <button class="btn btn-outline-dark" @click="search()">
            Search
          </button>
        </div>
        <div class="container cate-box">
          <h4 class="fw-bold">Size</h4>
          <button
            class="btn btn-outline-dark btn-filter-cate"
            v-for="size in getAllSize"
            :key="size"
            @click="filterSize(size)"
            :class="{ active: size === activeSize }"
          >
            {{ size }}
          </button>
          <button
            class="btn btn-outline-dark btn-filter-cate"
            @click="filterSize('all')"
            :class="{ active: activeSize === 'all' }"
          >
            Tất cả
          </button>
        </div>
        <div class="container cate-box">
          <h4 class="fw-bold">Màu sắc</h4>
          <button
            class="btn btn-outline-dark btn-filter-color text-light position-relative"
            :style="`background-color: ${color.color};`"
            v-for="color in getAllColor"
            :key="color.idcolor"
            @click="filterColor(color.idcolor)"
            :class="{
              active: color.idcolor === activeColor,
              'text-dark': color.color === '#fff',
            }"
          >
            {{ color.colorname }}
            <span
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark text-light"
            >
              {{ color.count }}
            </span>
          </button>
          <button
            class="btn btn-outline-dark btn-filter-cate position-relative"
            @click="filterColor('all')"
            :class="{ active: activeColor === 'all' }"
            style="margin-top: -10px ;"
          >
            Tất cả 
            <span
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark text-light"
            >
            {{ getAllProducts.length }}
            </span>
          </button>
        </div>
      </div>
      <div class="col-lg-9 pt-2">
        <div class="my-2 d-flex">
          <div class="w-50">
            <div
              class="btn btn-outline-dark page-limit-btn"
              @click="setLimit(4)"
              :class="{ active: limit == 4 }"
            >
              4
            </div>
            <div
              class="btn btn-outline-dark page-limit-btn"
              @click="setLimit(8)"
              :class="{ active: limit == 8 }"
            >
              8
            </div>
          </div>
          <div class="w-50 pe-2">
            <select
              name=""
              id=""
              class="float-end select-filter-box"
              @change="orderBy()"
              v-model="selectedOrder"
            >
              <option value="" selected>-- Sắp xếp --</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
          </div>
        </div>
        <div class="row">
          <!-- LIMIT = 2 -->
          <div
            :class="{
              'd-block': index >= limit * (page - 1) && index < limit * page,
            }"
            v-for="(p, index) in products"
            :key="p.id"
            class="product-wrap"
          >
            <router-link :to="`/product/${p.id}`">
              <div>
                <img :src="p.mainimage" alt="" class="product-image" />
                <p class="name-product">{{ p.name }}</p>
                <!-- <p class="product-brand">{{ p.brand }}</p> -->
                <p class="price-product">{{ toCurrency(p.price) }}</p>
              </div>
              <div class="p-0">
                <button
                  class="product-btn-color"
                  v-for="color in p.variations"
                  :key="color.idcolor"
                  :style="'background-color: ' + color.color + ';'"
                ></button>
              </div>
            </router-link>
          </div>
        </div>
        <div class="w-25 mx-auto mt-4">
          <div class="d-flex">
            <button
              class="btn btn-outline-dark btn-filter-cate me-2"
              @click="previousPage"
            >
              Previous
            </button>
            <div v-for="pageNumber in listPage" :key="pageNumber">
              <button
                class="btn btn-outline-dark btn-filter-cate me-2 btn-page"
                @click="changePage(pageNumber)"
                :class="{
                  'd-block':
                    (pageNumber >= page - 1 &&
                      pageNumber < page + 2 &&
                      pageNumber <= totalPage) ||
                    (page == 1 && pageNumber == 3 && pageNumber <= totalPage),
                  active: pageNumber == page,
                }"
              >
                {{ pageNumber }}
              </button>
            </div>
            <button
              class="btn btn-outline-dark btn-filter-cate me-2"
              @click="nextPage"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
body {
  font-family: Montserrat;
}
.cate-box {
  background: #f6f7f8;
  padding: 20px 15px;
  margin-top: 15px;
  border-radius: 4px;
}
.select-filter-box {
  background: #fff;
  padding: 6px 12px;
  border-radius: 4px;
}
.btn-filter-cate {
  margin-right: 5px;
  margin-bottom: 5px;
  font-size: 0.75rem !;
  font-weight: bold !important;
  color: #212529 !important;
  border-color: #212529 !important;
}
.btn-filter-color {
  margin-right: 15px;
  margin-bottom: 15px;
  font-size: 0.75rem !;
  font-weight: bold !important;
}
.btn-filter-color:hover {
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
}
.btn-filter-cate.active,
.btn-filter-cate:hover {
  color: #fff !important;
}
.product-wrap {
  padding: 8px 4px;
  width: 24% !important;
  margin: 0 8px 0 0;
  display: none !important;
}
@media screen and (min-width: 480px) {
  .product-wrap {
    width: 99% !important;
  }
}
@media screen and (min-width: 768px) {
  .product-wrap {
    width: 24% !important;
  }
}
@screen and (min-width: 992px){

}

.product-wrap a {
  color: black;
  text-decoration: none;
}

.product-wrap:hover {
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px,
    rgba(0, 0, 0, 0.22) 0px 10px 10px;
}
.product-image {
  width: 100%;
  height: auto;
  max-width: 100%;
}
.name-product {
  font-size: 18px;
  font-weight: 600;
  margin: 4px 0;
}
.price-product {
  color: #ff6073;
}
.page-limit-btn {
  width: 48px !important;
  text-align: center;
  margin-right: 12px;
}
.page-item.page-item-btn {
  color: #212529 !important;
}
.btn-page {
  display: none !important;
}
</style>
<script>
import axios from "axios";
import { APIURL } from "@/constraint";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      products: [],
      selectedOrder: "",
      searchText: "",
      activeSize: null,
      activeBrand: null,
      activeColor: null,
      page: 1,
      limit: 4,
      totalPage: 1,
      listPage: [],
    };
  },
  computed: {
    ...mapGetters([
      "getUser",
      "getCategories",
      "getAllSize",
      "filterBySize",
      "getAllProducts",
      "getAllColor",
      "filterByColor",
    ]),
  },
  methods: {
    async load() {
      const { data } = await axios.get(`${APIURL}/products`);
      this.products = data;
      this.$store.dispatch("setData", this.products);
      this.totalPage = Math.ceil(this.products.length / this.limit);
      for (let i = 0; i < this.totalPage; i++) {
        this.listPage.push(i + 1);
      }
    },
    async filterBrand(brand) {
      if (brand === "all") {
        const { data } = await axios.get(`${APIURL}/products`);
        this.products = data;
      } else {
        await axios
          .get(`${APIURL}/products?brand=${brand}`)
          .then((res) => (this.products = res.data));
      }
      this.resetFilter();
      this.activeBrand = brand;
      this.totalPage = Math.ceil(this.products.length / this.limit);
    },
    orderBy() {
      let [nameOrder, type] = this.selectedOrder.split("-");
      switch (type) {
        case "asc":
          this.products.sort((a, b) => a[nameOrder] - b[nameOrder]);
          break;
        case "desc":
          this.products.sort((b, a) => a[nameOrder] - b[nameOrder]);
          break;
      }
    },
    filterSize(size) {
      if (size != "all") {
        this.products = this.filterBySize(size);
      } else {
        this.products = this.getAllProducts;
      }
      this.resetFilter();
      this.activeSize = size;
      this.totalPage = Math.ceil(this.products.length / this.limit);
    },
    filterColor(idcolor) {
      if (idcolor != "all") {
        this.products = this.filterByColor(idcolor);
      } else {
        this.products = this.getAllProducts;
      }
      this.resetFilter();
      this.activeColor = idcolor;
      this.totalPage = Math.ceil(this.products.length / this.limit);
    },
    async search() {
      this.$store.dispatch("setSearchText", this.searchText);
      const { data } = await axios.get(`${APIURL}/products`, {
        params: { q: this.searchText },
      });
      this.products = data;
      this.activeSize = "";
      this.activeBrand = "";
      this.searchText = "";
    },
    edit(id) {
      this.$router.push({ path: `/edit-photo-form/${id}` });
    },
    async deleteId(id) {
      await axios.delete(`${APIURL}/products/${id}`);
      this.products = [];
      this.load();
    },
    toCurrency(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
    setLimit(limit) {
      this.limit = limit;
      this.totalPage = Math.ceil(this.products.length / this.limit);
    },
    changePage(number) {
      this.page = number;
    },
    previousPage() {
      if (this.page > 1) {
        this.page--;
      } else {
        alert("Bạn đang ở trang đầu");
      }
    },
    nextPage() {
      if (this.page < this.totalPage) {
        this.page++;
      } else {
        alert("Đã hết sản phẩm để hiển thị");
      }
    },
    resetFilter() {
      this.activeColor = "";
      this.activeBrand = "";
      this.searchText = "";
      this.activeSize = "";
      this.page = 1;
    },
  },
  beforeCreate() {
    if (this.getUser) {
      console.log("Đã đăng nhập");
    } else {
      console.log("Chưa đăng nhập");
    }
  },
  beforeMount() {
    this.load();
  },
};
</script>
