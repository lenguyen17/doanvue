import axios from "axios";
import {
    APIURL
} from "@/constraint";
const mutation = {
    setDefaultData(state) {
        axios.get(`${APIURL}/cart`)
            .then((response) => {
                state.cart = response.data;
            })
            .catch((error) => {
                console.error("Lỗi khi lấy dữ liệu:", error);
            });
        axios.get(`${APIURL}/products`)
            .then((response) => {
                state.products = response.data;
            })
            .catch((error) => {
                console.error("Lỗi khi lấy dữ liệu:", error);
            });
    },
    setData(state, newData) {
        state.products = newData;
    },
    setCart(state, cart) {
        state.cart = cart;
    },
    setIdSearch(state, newIdSearch) {
        state.idSearch = newIdSearch;
    },
    // {id: this.product.id, idcolor: this.idColorSelected, idsize: this.idSizeSelected, quantity: this.quantity}
    addToCart(state, item) {
        let cart = state.cart.find(item => item.iduser === state.user.id);
        let id = cart.id;
        let products = cart.products;
        let isExist = null;
        for (let i = 0; i < products.length; i++) {
            if (products[i].idproduct == item.id && products[i].idcolor == item.idcolor && products[i].idsize == item.idsize) {
                products[i].quantity += item.quantity;
                isExist = true;
                break;
            }
        }
        let productsState = [...state.products];
        let productTemp = productsState.find((p) => p.id === item.id);
        // Cập nhật quantity trong cart
        if (isExist) {
            axios.patch(`${APIURL}/cart/${id}`, {
                    products
                })
                .then((response) => {
                    console.log("Dữ liệu đã được cập nhật:", response.data);
                })
                .catch((error) => {
                    console.error("Lỗi khi cập nhật dữ liệu:", error);
                });
        } else {
            // Thêm mới product vào cart
            let color = productTemp.variations.find((p) => p.idcolor === item.idcolor);
            let size = color.sizes.find((p) => p.idsize === item.idsize);
            let productItem = {
                idproduct: productTemp.id,
                name: productTemp.name,
                price: productTemp.price + color.bonuspriceColor,
                idsize: size.idsize,
                size: size.size,
                idcolor: color.idcolor,
                color: color.colorname,
                image: item.image,
                quantity: item.quantity
            }
            let rs = [...products, productItem];
            axios.patch(`${APIURL}/cart/${id}`, {
                    products: rs
                })
                .then((response) => {
                    console.log("Thêm mới: " + response)
                })
                .catch((error) => {
                    console.log("ERROR: " + error)
                });
        }
        // Cập nhật lại quantity trong product
        for (let i = 0; i < productTemp.variations.length; i++) {
            if (productTemp.variations[i].idcolor === item.idcolor) {
                for (let j = 0; j < productTemp.variations[i].sizes.length; j++) {
                    if (productTemp.variations[i].sizes[j].idsize === item.idsize) {
                        productTemp.variations[i].sizes[j].quantity -= item.quantity;
                    }
                }
            }
        }
        axios.patch(`${APIURL}/products/${productTemp.id}`, productTemp)
            .then((response) => {
                console.log("CẬP NHẬT QUANTITY: " + response)
            })
            .catch((error) => {
                console.log("ERROR: " + error)
            });
    },

    updateCart(state, {id ,products}){

        axios.patch(`${APIURL}/cart/${id}`, {products})
            .then((response) => {
                state.cart.products = products;
                console.log("success " + response);
            })
            .catch((error) => {
                console.log("ERROR: " + error)
            });
    },
    setUser(state, user) {
        state.user = user;
    },
    // {id, idproduct, idcolor, idize}
    deleteProductInCart(state,product) {
        //Set lại cart ở state
        let products = [...state.cart.products];
        for(let i = 0; i < products.length; i++){
            if(state.cart.id == product.id && products[i].idproduct == product.idproduct 
                && products[i].idcolor == product.idcolor && products[i].idsize == product.idsize){
                    products.splice(i, 1);
                    break;
            }
          }
        // update cart trên json server
        axios.patch(`${APIURL}/cart/${product.id}`, {products})
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error("Lỗi khi lấy dữ liệu:", error);
            });
    },
    // {idproduct , idcolor, idsize, quantity} Số lượng thêm vào
    addQuantityInProduct(state, item){
        // Cập nhật lại quantity trong product
        let productsState = [...state.products];
        let productTemp = productsState.find((p) => p.id === item.idproduct);
        for (let i = 0; i < productTemp.variations.length; i++) {
            if (productTemp.variations[i].idcolor === item.idcolor) {
                for (let j = 0; j < productTemp.variations[i].sizes.length; j++) {
                    if (productTemp.variations[i].sizes[j].idsize === item.idsize) {
                        productTemp.variations[i].sizes[j].quantity += item.quantity;
                    }
                }
            }
        }
        axios.patch(`${APIURL}/products/${productTemp.id}`, productTemp)
            .then((response) => {
                console.log("CẬP NHẬT QUANTITY: " + response)
            })
            .catch((error) => {
                console.log("ERROR: " + error)
            });
    },
    setSearchText(state, text){
        state.searchText = text;
    },
    updateUser(state, user){
        axios.patch(`${APIURL}/user/${user.id}`, {...user})
            .then((response) => {
                console.log("update user successfully" + response.data);
            })
            .catch((error) => {
                console.log("ERROR: " + error)
            });
    }

}

export default mutation;