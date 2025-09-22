import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext.js";

import "../Style/Shop.css"; // optional styling file

function Shop() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart, updateQuantity, removeFromCart, cart } = useCart();
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem('token');
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('shop');
    return saved ? JSON.parse(saved) : null; // ✅ parse JSON
  });

  // ✅ Load products (could be from API, here we mock)
  useEffect(() => {
    // const demoProducts = [
    //   { id: 1, name: "منتج A", price: 10, fileUrl: "", description: "وصف المنتج A", isStl: false },
    //   { id: 2, name: "منتج B", price: 20, fileUrl: "/images/bambu.jpg", description: "The Bambu Lab X1-Carbon Combo is a flagship high-performance 3D printer engineered for speed, strength, and smart automation. Designed with a durable steel chassis and glass-aluminum shell, it combines professional-grade hardware with intelligent features like LiDAR-assisted first layer inspection, active vibration compensation, and multi-material printing via the AMS (Automatic Material System). With a 256 mm³ build volume, hardened steel extruder, and compatibility with engineering-grade filaments (including carbon and glass fiber composites), the X1C is ideal for functional prototyping, production parts, and detail-rich multi-color prints — all at speeds up to 500 mm/s.", isStl: false },
    //   { id: 3, name: "منتج C", price: 30, fileUrl: "/images/prodC.jpg", description: "وصف المنتج C" },
    //   { id: 4, name: "منتج C", price: 30, fileUrl: "/images/prodC.jpg", description: "وصف المنتج C" },
    //   { id: 5, name: "منتج C", price: 30, fileUrl: "/images/prodC.jpg", description: "وصف المنتج C" },
    //   { id: 6, name: "منتج C", price: 30, fileUrl: "/images/prodC.jpg", description: "وصف المنتج C" },
    //   { id: 7, name: "منتج C", price: 30, fileUrl: "/images/prodC.jpg", description: "وصف المنتج C" },
    //   { id: 8, name: "منتج C", price: 30, fileUrl: "/images/prodC.jpg", description: "وصف المنتج C" },
    //   { id: 9, name: "منتج C", price: 30, fileUrl: "/images/prodC.jpg", description: "وصف المنتج C" },
    //   { id: 10, name: "منتج C", price: 30, fileUrl: "/images/prodC.jpg", description: "وصف المنتج C" },
    //   { id: 11, name: "منتج C", price: 30, fileUrl: "/images/prodC.jpg", description: "وصف المنتج C" },
    // ];
    // setProducts(demoProducts);
    const fetchShops = async () => {
      console.log("fetching product...");
      setLoading(true);

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/shop`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProducts(data);
        localStorage.setItem("shop", JSON.stringify(data));
      } catch (err) {
        console.error("Error fetching shop:", err);
      }finally {
        setLoading(false);
      }
    };
  
    // ✅ Load from storage or fetch
    const stored = localStorage.getItem("shop");
    if (stored) {
      setProducts(JSON.parse(stored));
    } else if (token) {
      fetchShops();
    }
  }, [token]);
  
  const handleAdd = (product) => {
    addToCart({ ...product, quantity: 1 });
  };

  const handleRemove = (product) => {
    const currentQty = cart.find((p) => p.id === product.id)?.quantity || 0;
    if (currentQty <= 1) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, currentQty - 1);
    }
  };

  const getQuantity = (id) => {
    return cart.find((p) => p.id === id)?.quantity || 0;
  };

  return (
    <div className="shop-container">
      <h2>🛍️ متجر المنتجات</h2>
      <div className="product-grid">
    {loading 
    ?
    <p>⏳ جارٍ التحميل...</p>
    :
    (
      <>

        {Array.isArray(products) && products.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => setSelectedProduct(product)} // open popup
          >
            {
            product.fileUrl ? 
                <img 
                src={`data:image/png;base64,${product.fileUrl}`} 

                alt={product.name} className="product-image" />
                :
                <img src={"/favicon.jpg"} alt={product.name} className="product-image" />
            }
            <div className="shop-part2">
                <h3>{product.name}</h3>
                <p>💰 ${product.price}</p>

                {/* Quantity Controls */}
                <div
                className="quantity-controls"
                onClick={(e) => e.stopPropagation()} // stop card click
                >
                <button onClick={() => handleRemove(product)}>-</button>
                <span>{getQuantity(product.id)}</span>
                <button onClick={() => handleAdd(product)}>+</button>
            </div>
        </div>
          </div>
        ))}
      </>
    )
    }
      </div>

      {/* ✅ Popup Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedProduct.name}</h2>
            {
            selectedProduct.fileUrl ? 
                <img 
                src={`data:image/png;base64,${selectedProduct.fileUrl}`} 
                 alt={selectedProduct.name} className="modal-image" />
                :
                <img src={"/favicon.jpg"} alt={selectedProduct.name} className="modal-image" />
            }
            <p>{selectedProduct.description}</p>
            <p><strong>💰 السعر:</strong> ${selectedProduct.price}</p>
            <div className="quantity-controls">
              <button onClick={() => handleRemove(selectedProduct)}>-</button>
              <span>{getQuantity(selectedProduct.id)}</span>
              <button onClick={() => handleAdd(selectedProduct)}>+</button>
            </div>
            <button className="close-btn" onClick={() => setSelectedProduct(null)}>إغلاق</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Shop;
