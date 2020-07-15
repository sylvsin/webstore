import { useContext, useState, useEffect, useMemo } from "react";
import { AppContext } from "./AppContext"

export interface Category {
  id: number;
  name: string;
}

export const allCategory: Category = {
  id: -1,
  name: "All",
};

export const useCategory = () => {
  const { api } = useContext(AppContext);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category>(allCategory);

  useEffect(() => {
    if (api) {
      api
        .get<Category[]>("categories")
        .then((response) => response.data)
        .then((values) => {
          setCategories(values);
        });
    }
  }, [api] );

  const newCategories = useMemo(() => [allCategory, ...categories], [
    categories,
  ]);

  return {
    currentCategory,
    categories: newCategories,
    selectCategory: setCurrentCategory,
  };
};
