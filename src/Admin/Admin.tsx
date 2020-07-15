import React from "react";
import { useLoadOrders } from "../Order";

export const Admin: React.FC = () => {
  const { orders } = useLoadOrders();

  return (
    <div className="title-product-wrapper">
      <div className="title">
        <div>Date of Order</div>
        <div>Order By</div>
        <div>Order Cost</div>
        <div>Total Ordered Items</div>
      </div>
      <div className="products-container-wrapper">
        <div className="products-container">
          <div className="absolute-container">
            <div className="height-scroll-wrapper">
              {orders.map((order, i) => (
                <div key={i} className="cart-product">
                  <div>{new Date(order.created).toDateString()}</div>
                  <div>{order.createdBy}</div>
                  <div>{order.totalPrice}</div>
                  <div>{order.orderRows.length}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
