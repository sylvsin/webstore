import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { AppContext } from "./AppContext";
import { Product } from "./types";
import { allCategory, Category } from "./useCategory";

interface ProductContext {
  products?: Product[];
  addToCart?: (product: Product) => void;
  removeFromCart?: (product: Product) => void;
  onSearchProduct?: (searchStr: string) => void;
  clearAllCartProduct?: () => void;
}

const ProductContext = React.createContext<ProductContext>({});

export const ProductContextProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const { api } = useContext(AppContext);

  const addToCart = useCallback((product) => {
    const newProducts = products.map((prod) => {
      if (prod.id === product.id) {
        return { ...product, isAddedToCart: true };
      }
      return prod;
    });
    setProducts([...newProducts]);
  }, [products] );

  const removeFromCart = useCallback((product) => {
    const newProducts = products.map((prod) => {
      if (prod.id === product.id) {
        return { ...product, isAddedToCart: false };
      }
      return prod;
    });
    setProducts([...newProducts]);
  }, [products] );

  const fetchProduct = useCallback(() => {
    if (api) {
      api
        .get("products")
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          setProducts(data);
        });
    }
  }, [api] );

  const onSearchProduct = useCallback((searchString: string) => {
    if (api) {
      if (searchString.length > 0) {
        api
          .get(`search?searchText=${searchString}`)
          .then((response) => {
            return response.data;
          })
          .then((data: Product[]) => {
            const newProducts: Product[] = products.filter((prod) => {
              const doesExist = data.find(
                (product) => product.id === prod.id
              );
              return !!doesExist;
            });
            setProducts(newProducts);
          });
      } else {
        fetchProduct();
      }
    }
  }, [api, products, fetchProduct] );

  const clearAllCartProduct = useCallback(() => {
    const productUpdated = products.map(({ isAddedToCart, ...product }) => ({
      ...product,
      isAddedToCart: isAddedToCart ? false : isAddedToCart,
    }));
    setProducts(productUpdated);
  }, [products]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return (
    <ProductContext.Provider
      value={{
        addToCart,
        removeFromCart,
        products,
        onSearchProduct,
        clearAllCartProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

interface CartProduct extends Product {
  quantity: number;
}

export const useProduct = (isCartProduct: boolean = false, currentCategory: Category = allCategory) => {
  const [newProducts, setNewProduct] = useState<CartProduct[]>([]);
  const {
    products,
    removeFromCart,
    addToCart,
    onSearchProduct,
    clearAllCartProduct,
  } = useContext(ProductContext);

  useEffect(() => {
    let newProducts: CartProduct[] = [];

    if (products) {
      if (isCartProduct) {
        products
          .filter(({ isAddedToCart }) => isAddedToCart)
          .forEach((product) => {
            newProducts.push({ ...product, quantity: 1 });
          });
      } else {
        products
          .filter((prod) => {
            const isFilter = prod.productCategory.some(
              (prodCategory) => prodCategory.categoryId === currentCategory.id
            );
            return isFilter || currentCategory.id === -1;
          })
          .forEach((product) => {
            newProducts.push({ ...product, quantity: 1 });
          });
      }
      setNewProduct([...newProducts]);
    }
  }, [products, isCartProduct, currentCategory]);

  const deleteProductFromCart = useCallback((product: CartProduct) => {
    const prod = products?.find((prod) => prod.id === product.id);
    if (prod) {
      removeFromCart && removeFromCart(prod);
    }
  }, [products, removeFromCart] );

  const incrementQuantity = useCallback((product: CartProduct) => {
    const prodIndex = newProducts.findIndex((prod) => prod.id === product.id);

    const products = [...newProducts];
    if (prodIndex >= 0) {
      products[prodIndex].quantity += 1;
    }
    setNewProduct(products);
  }, [newProducts] );

  const decrementQuantity = useCallback((product: CartProduct) => {
    const prodIndex = newProducts.findIndex((prod) => prod.id === product.id);

    const products = [...newProducts];
    if (prodIndex >= 0 && product.quantity > 1) {
      products[prodIndex].quantity -= 1;
    }
    setNewProduct(products);
  }, [newProducts] );

  const addProductToCart = useCallback(({ quantity, ...product }: CartProduct) => {
      addToCart && addToCart(product);
    }, [addToCart] );

  const totalCartItems = useMemo(() =>
      products
        ? products.filter(({ isAddedToCart }) => isAddedToCart).length
        : 0,
    [products]
  );

  const onSearch = useCallback((searchStr: string) => {
    if (onSearchProduct) {
      onSearchProduct(searchStr);
    }
  }, [onSearchProduct] );

  return {
    products: newProducts,
    removeProduct: deleteProductFromCart,
    incrementProduct: incrementQuantity,
    decrementProduct: decrementQuantity,
    addToCart: addProductToCart,
    clearAllCartProduct,
    totalCartItems,
    onSearch,
  };
};
