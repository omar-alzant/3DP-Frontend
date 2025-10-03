import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext.js";
import "../Style/Shop.css"; // optional styling file

function ShopDet({ nbrOfView, short = false}) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { addToCart, updateQuantity, removeFromCart, cart } = useCart();
    const [loading, setLoading] = useState(false);
    const token = sessionStorage.getItem('token');
    const [products, setProducts] = useState(() => {
      const saved = localStorage.getItem('shop');
      return saved ? JSON.parse(saved) : null; // ✅ parse JSON
    });

    let stored = localStorage.getItem("shop");

    useEffect(() => {
        const fetchShops = async () => {
          setLoading(true);
    
          try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/shop`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            console.log(data)
            setProducts(data);
            localStorage.setItem("shop", JSON.stringify(data));
          } catch (err) {
            console.error("Error fetching shop:", err);
          }finally {
            setLoading(false);
          }
        };
      
        stored = localStorage.getItem("shop");
        if (stored) {
          setProducts(JSON.parse(stored));
        } else {
          fetchShops();
        }
      }, [stored]);
      
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

      // Filter products based on nbrOfView prop
      const getDisplayedProducts = () => {
        if (!Array.isArray(products)) return [];
        
        // If nbrOfView is "*", return all products
        if (nbrOfView === "*") {
          return products;
        }
        
        // If nbrOfView is a number, return only that many products
        const limit = parseInt(nbrOfView);
        if (!isNaN(limit) && limit > 0) {
          return products.slice(0, limit);
        }
        
        // Default: return all products
        return products;
      };

      const displayedProducts = getDisplayedProducts();

      return (
        <div className="product-grid">
        {loading 
        ?
        <p>⏳ جارٍ التحميل...</p>
        :
        (
        <>
    
        {Array.isArray(displayedProducts) && displayedProducts.map((product) => (
        <div
            key={product.id}
            className="product-card"
            onClick={() => setSelectedProduct(product)} // open popup
        >

            
            {product.fileUrl ? 
                <img 
                src={`data:image/png;base64,${product.fileUrl}`} 

                alt={product.name} className="product-image" />
                :
                <img src={"/favicon.jpg"} alt={product.name} className="product-image" />
            }

            <div className="shop-part2">
            { !short && <h3>{product.name}</h3>}
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
    
    export default ShopDet;
    