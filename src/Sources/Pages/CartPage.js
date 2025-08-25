import React from "react";
import { useCart } from "../context/CartContext";
import Viewer from "../components/preview";
import { FaFolder, FaCube, FaCoins, FaTrash, FaCheck, FaTimes, FaQuora } from "react-icons/fa";
import CheckoutForm from "../components/CheckoutForm";
import "../Style/CartPage.css";

// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";

// const publishabelStripKey = "pk_test_51Ry79OLYuHqr0vcbqNjsCgNT3agG3ygud5XuWZztvuW15VfEGV14TzKr5PlftMFgHHay6d0rSXMtTYmoIlQoQUHC00Q75V4oH3";
// const stripePromise = loadStripe(publishabelStripKey); // مفتاح Stripe العام

function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-cont">
      <h2>🛒 الصندوق</h2>

      {cart.length === 0 ? (
        <p>الصندوق فارغ</p>
      ) : (
        <>
          <button className="clear-cart-btn" onClick={clearCart}>
            <FaTimes /> تفريغ الصندوق
          </button>

          {cart.map((item, index) => (
            <div key={index} className="cart-style">
              <div className="cart-details">
                <p><FaFolder /> {item.name}</p>
                <p><FaCube /> الحجم: {item.volume} سم³</p>
                <p><FaCoins /> السعر: ${item.price}</p>
                <p><FaQuora /> الكمية: {item.quantity}</p>
              </div>
              <div className="cart-preview">
                <Viewer fileUrl={item.fileUrl} wireframe={false} />
              </div>
              <button className="delete-btn" onClick={() => {
                total = total - (item.price * item.quantity);
                removeFromCart(index)}}>
                <FaTrash /> حذف
              </button>
            </div>
          ))}

          <h3 className="cart-total">💵 المجموع: {total.toFixed(2)} $</h3>

          <CheckoutForm />

        {/* FOR CREDIT CARD PAY */}
          {/* <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements> */}
        {/* ************************************ */}
        </>
      )}
    </div>
  );
}

export default CartPage;
