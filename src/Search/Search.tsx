import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Category } from "../useCategory";
import "./Search.css";

interface Props {
  categories: Category[];
  selectCategory: (category: Category) => void;
  totalItems: number;
  onSearch: (searchStr: string) => void;
}

export const Search: React.FC<Props> = ({
  categories,
  selectCategory,
  totalItems,
  onSearch,
  }) => {
  const [searchValue, setSearchValue] = useState<string>("");
  return (
    <div className="search-container">
      <div className="input-wrapper">
        <select
          onChange={(event) => {
            const category = categories.find(
              (cat) => cat.id === Number(event.target.value)
            );
            category && selectCategory(category);
          }}
        >
          {categories.map((category) => (
            <option value={category.id} key={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button
          onClick={() => {
            onSearch(searchValue);
          }}
        >
          Search
        </button>
      </div>
      <div className="cart-wrapper">
        <Link to="/order/">
          {" "}
          {`${totalItems ? totalItems : 0} items in the cart`}
        </Link>
      </div>
    </div>
  );
};
