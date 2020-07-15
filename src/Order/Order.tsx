import React, { useCallback, useMemo, useState } from "react";
import { useProduct } from "../ProductContext";
import "./Order.css";
import { useCreateOrder } from "./useOrder";
import { useHistory } from "react-router-dom";

const payments = [
  {
    id: 1,
    label: "MasterCard",
  },
  {
    id: 2,
    label: "Paypal",
  },
  {
    id: 3,
    label: "Bitcoin",
  },
];

// {"id":1797,"productId":76,"product":null,"amount":1,"orderId":1243}

export const Order: React.FC = () => {
  const {
    products,
    removeProduct,
    incrementProduct,
    decrementProduct,
    clearAllCartProduct,
  } = useProduct(true);
  const onCreateOrder = useCreateOrder();
  const history = useHistory();
  const [name, setName] = useState("Your Name");
  const [email, setEmail] = useState("Your Email");
  const [paymentTitle, setPaymentTitle] = useState("MasterCard");

  const totalPrice = useMemo(
    () =>
      products
        .map(({ price, quantity }) => price * quantity)
        .reduce((total, currentVal) => {
          return total + currentVal;
        }, 0),
    [products]
  );

  const submitOrder = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const order = {
        companyId: 64,
        createdBy: email,
        name,
        created: new Date().toDateString(),
        paymentMethod: paymentTitle,
        totalPrice,
        orderRows: products
          .filter(({ isAddedToCart }) => isAddedToCart)
          .map(({ quantity, id }) => ({ amount: quantity, productId: id })),
      };
      const isSucess = await onCreateOrder(order);
      if (isSucess) {
        clearAllCartProduct && clearAllCartProduct();

        history.push("/");
      }
    },
    [
      onCreateOrder,
      clearAllCartProduct,
      history,
      products,
      name,
      paymentTitle,
      email,
      totalPrice,
    ]
  );

  return (
    <div className="order-wrapper">
      <div className="name-filler">
        <form onSubmit={submitOrder}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </label>
          <label>
            Email:
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </label>
          <label>
            Payment Method:
            <select
              onChange={(e) => {
                setPaymentTitle(e.target.value);
              }}
            >
              {payments.map((payment) => (
                <option key={payment.id}>{payment.label}</option>
              ))}
            </select>
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
      <div className="title-product-wrapper">
        <div className="title">
          <div>Product Image</div>
          <div>Product Title</div>
          <div>Product Action</div>
          <div>Total Cost: {totalPrice}</div>
        </div>
        <div className="products-container-wrapper">
          <div className="products-container">
            <div className="absolute-container">
              <div className="height-scroll-wrapper">
                {products &&
                  products
                    .filter(({ isAddedToCart }) => isAddedToCart)
                    .map((prod) => (
                      <div key={prod.name} className="cart-product">
                        <div>
                          <img
                            src={prod.imageUrl}
                            alt=""
                            width="150px"
                            height="150px"
                          />
                        </div>
                        <div>{prod.name}</div>
                        <div className="action-product">
                          <h5>Quantity: {prod.quantity}</h5>
                          <button
                            className="action-btn"
                            onClick={() => incrementProduct(prod)}
                          >
                            +
                          </button>
                          <button
                            className="action-btn"
                            onClick={() => decrementProduct(prod)}
                          >
                            -
                          </button>
                          <button onClick={() => removeProduct(prod)}>
                            Remove
                          </button>
                        </div>
                        <div>{prod.price * prod.quantity}</div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
