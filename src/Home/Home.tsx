import React from "react";
import { useProduct } from "../ProductContext";
import { Search } from "../Search";
import { useCategory } from "../useCategory";
import "./Home.css";

export const Home: React.FC = () => {
  const { currentCategory, selectCategory, categories } = useCategory();
  const { products, addToCart, totalCartItems, onSearch } = useProduct(
    false,
    currentCategory
  );

  return (
    <div className="container">
      <div className="product-search-wrapper">
        <div className="search-wrapper">
          <Search
            categories={categories}
            selectCategory={selectCategory}
            totalItems={totalCartItems}
            onSearch= {onSearch}
          />
        </div>
        <div className="relative-wrapper">
          <div className="absolute-wrapper">
            <div className="height-wrapper">
              <div className="product-wrapper">
                {products &&
                  products.map((product) => {
                    return (
                      <div key={product.id} className="product">
                        <div className="product-name">{product.name}</div>
                        <div>
                          <img
                            src={product.imageUrl}
                            alt=""
                            width="150px"
                            height="150px"
                          />
                        </div>
                        <ul className="product-action">
                          <li>Price: {product.price}</li>
                          <li>
                            {!product.isAddedToCart && (
                              <button
                                onClick={() => {
                                  addToCart && addToCart(product);
                                }}
                              >
                                Add to cart
                              </button>
                            )}
                          </li>
                        </ul>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
