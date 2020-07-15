import { useCallback, useContext, useState, useEffect } from "react";
import { AppContext } from "../AppContext";

interface OrderRow {
  productId: number;
  amount: number;
}

export interface OrderData {
  companyId: number;
  createdBy: string;
  name: string;
  created: string;
  paymentMethod: string;
  totalPrice: number;
  orderRows: OrderRow[];
}

export const useCreateOrder = () => {
  const { api } = useContext(AppContext);

  const onCreate = useCallback(
    (order: OrderData) => {
      if (api) {
        return api
          .post("orders", JSON.stringify(order), {
            headers: { "Content-Type": "application/json" },
          })
          .then<OrderData>((response) => response.data)
          .then((value) => value)
          .catch((_) => true);
      }
    },
    [api]
  );
  return onCreate;
};

export const useLoadOrders = () => {
  const { api } = useContext(AppContext);
  const [orders, setOrders] = useState<OrderData[]>([]);

  const loadOrders = useCallback(() => {
    if (api) {
      api
        .get("orders?companyId=64")
        .then<OrderData[]>((response) => response.data)
        .then((value) => setOrders(value))
        .catch((_) => setOrders([]));
    }
  }, [api]);
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);
  return {
    orders,
  };
};
