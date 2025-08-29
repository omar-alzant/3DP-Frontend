import React, { useState } from "react";
import { useCart } from "../context/CartContext";
// import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { jwtDecode } from 'jwt-decode';
import "../Style/CartPage.css";

const CheckoutForm = () => {
  const { cart, clearCart } = useCart();
  // const stripe = useStripe();
  // const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const token  = sessionStorage.getItem("token"); // Assume user object has isAdmin boolean
  let decoded = "";
  let id = "";
  if(token){
    decoded = jwtDecode(token);
    id = decoded.id
  }

  // const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleSubmitWithCard = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage("");
      const orderData = {
        customer: form,
        cartItems: cart
      };
      const token = sessionStorage.getItem('token');

      const res = await fetch(`${process.env.REACT_APP_API_URL}/mail/send-order`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
      },
        body: JSON.stringify(orderData) // cart هو اللي عندك في Context
      });

      const data = await res.json();
      setLoading(false);
      
      if (!data.success) {        
        setMessage(data?.error);
      } else {
        setMessage(data?.message);
        setForm({ name: "", phone: "", address: "" }); // تفريغ الفورم
        clearCart(); // مسح الكارت بعد الدفع
        const saveStlToCloud = await fetch(`${process.env.REACT_APP_API_URL}/supabase/UploadedSTL`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(orderData) // cart هو اللي عندك في Context  
        });          
          if(!saveStlToCloud.success){
          setMessage("فشل في تحفيظ البيانات في السحابة")
        }
      }
      
    } catch (err) {
      setLoading(false); 
      console.error(err);
      setMessage("فشل في إرسال الطلب")
    }finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="checkout-form">
      <h2>إدخال بيانات العميل</h2>

      <form onSubmit={handleSubmitWithCard}>
      <input
          type="text"
          name="name"
          placeholder="الاسم الكامل"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="رقم الهاتف"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <textarea
          name="address"
          placeholder="العنوان"
          value={form.address}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "جار الارسال..." : "أرسل" }
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

//   const handleSubmitWithCard = async (e) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;
//     setLoading(true);

//     try {
//       const res = await fetch(``${process.env.REACT_APP_API_URL}/Stripe/create-payment-intent`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id, amount: Math.round(total * 100) }),
//       });
//       const { clientSecret } = await res.json();

//       const result = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: { card: elements.getElement(CardElement) },
//       });

//       if (result.error) {
//         setMessage(result.error.message);
//       } else if (result.paymentIntent.status === "succeeded") {
//         setMessage("✅ تم الدفع بنجاح!");
//         clearCart(); // مسح الكارت بعد الدفع
//       }
//     } catch (err) {
//       setMessage("حدث خطأ أثناء الدفع.");
//       console.error(err);
//     }

//     setLoading(false);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <CardElement />
//       <button type="submit" disabled={!stripe || loading}>
//         {loading ? "جارٍ الدفع..." : `ادفع $${total.toFixed(2)}`}
//       </button>
//       {message && <p>{message}</p>}
//     </form>
//   );
// };

export default CheckoutForm;
