import axios from "axios";
import { APIURL } from "@/constraint";
const action = {
    fetchDataFromApi({ commit }) {
        // Gọi API ở đây, sau đó cập nhật trạng thái bằng mutation
        axios.get(`${APIURL}/products`).then(response => {
          commit('setData', response.data);
        });
      },
    setData(context){
        context.commit('setData');
    },
    setIdSearch(context){
        context.commit('setIdSearch');
    },
    addToCart(context){
        context.commit('addToCart');
    },
    setUser(context){
        context.commit('setUser');
    },
    setCart(context){
        context.commit('setCart');
    },
    addQuantityInProduct(context){
        context.commit('addQuantityInProduct');
    },
    updateCart(context){
        context.commit('updateCart');
    },
    searchText(context){
        context.commit('searchText');
    }

}

export default action;