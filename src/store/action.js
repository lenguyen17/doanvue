
const action = {
    setDefaultData(context){
        context.commit('setDefaultData');
    },
    setData(context, data){
        context.commit('setData', data);
    },
    setCart(context, cart){
        context.commit('setCart', cart);
    },
    setIdSearch(context, id){
        context.commit('setIdSearch', id);
    },
    addToCart(context,data){
        context.commit('addToCart', data);
    },
    updateCart(context, cart){
        context.commit('updateCart', cart);
    },
    setUser(context, user){
        context.commit('setUser', user);
    },
    deleteProductInCart(context, product){
        context.commit('deleteProductInCart', product);
    },
    addQuantityInProduct(context, item){
        context.commit('addQuantityInProduct',item);
    },
    
    setSearchText(context, text){
        context.commit('setSearchText', text);
    },
    updateUser(context, user){
        context.commit('updateUser', user);
    }
    

}

export default action;