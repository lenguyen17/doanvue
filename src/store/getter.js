const getter = {
    getProductById(state){
        let id = state.idSearch;
        let list = [...state.products];
        for(let i = 0; i < list.length; i++) {
            if(list[i].id === id) {
                return list[i];
            }
        }
        return null;
    },
    getCart(state){
        return state.cart;
    },
    getAllProducts(state){
        return state.products;
    },
    getUser(state){
        return state.user;
    },
    getProductQuantity: (state) => (idproduct, idcolor, idsize ) =>{
        let list = state.products;
        let product = list.find((p) => p.id === idproduct);
        console.log(product);
        let color = product.variations.find((p) => p.idcolor === idcolor);
        let size = color.sizes.find((p) => p.idsize === idsize);
        return size.quantity;
    },
    getCategories(state) {
        let products = [...state.products];
        let categories = [];
        products.forEach((p) => {
            if(!categories.includes(p.brand)){
                categories.push(p.brand);
            }
        });
        return categories;
    },
    getAllSize(state){
        let products = [...state.products];
        let sizes = [];
        products.forEach((p) => {
            p.variations.forEach((i) => {
                i.sizes.forEach((j) => {
                    if(!sizes.includes(j.size)){
                        sizes.push(j.size);
                    }
                });
            })
        });
        return sizes.sort();
    },
    getAllColor(state){
        let products = [...state.products];
        let colors = [];
        products.forEach((p) => {
            p.variations.forEach((i) => {
                if(!colors.find((j)=> j.idcolor == i.idcolor)){
                    colors.push({
                        idcolor: i.idcolor,
                        colorname: i.colorname,
                        color: i.color,
                        count: 1
                    });
                }else {
                    colors.find((j)=> j.idcolor == i.idcolor).count++;
                }
            })
        });
        return colors;
    },
    filterBySize: (state) => (size) => {
        let products = [...state.products];
        let rs = [];
        products.forEach((p) => {
            p.variations.forEach((i) => {
                i.sizes.forEach((j) => {
                    if(j.size == size){
                        if(!rs.find((r) => r.id == p.id)){
                            rs.push(p);
                        }
                    }
                });
            })
        });
        return rs;
    },
    filterByColor: (state) => (idcolor) => {
        let products = [...state.products];
        let rs = [];
        products.forEach((p) => {
            p.variations.forEach((i) => {
                if(i.idcolor == idcolor){
                    if(!rs.find((r) => r.id == p.id)){
                        rs.push(p);
                    }
                }
            })
        });
        return rs;
    }

}

export default getter;