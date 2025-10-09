import React, { createContext, useState, useContext, useEffect } from "react";
import { openDB } from 'idb';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });


  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const restoreBlobs = async () => {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      const db = await openDB('stl-cache', 1);
  
      // We rebuild URLs fresh from IndexedDB
      const updatedCart = await Promise.all(
        storedCart.map(async (item) => {
          if (item.isStl && item.fileName) {
            try {
              const file = await db.get('files', item.fileName);
              if (file) {
                // Create new fresh blob URL
                const newUrl = URL.createObjectURL(file);
                return { ...item, fileUrl: newUrl };
              }
            } catch (e) {
              console.warn(`⚠️ Failed to restore file ${item.fileName}:`, e);
            }
          }
          // Return item as-is (non-STL)
          return item;
        })
      );
  
      setCart(updatedCart);
  
      // 🧹 Clean up URLs when unmounting
      return () => {
        updatedCart.forEach((item) => {
          if (item.fileUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(item.fileUrl);
          }
        });
      };
    };
  
    restoreBlobs();
  }, []);
  

  
  // ✅ Add item (or update quantity if it exists)
  const addToCart = (item) => {
    setCart((prev) => {
      console.log("ADD", item)
      const exists = prev.find((_, index) => index === item.id);
      if (exists) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + (item.quantity || 1) } : p
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  };

  async function deleteFileFromCache(fileName) {
    const db = await openDB('stl-cache', 1);
    await db.delete('files', fileName);
    localStorage.removeItem(`stlMeta_${fileName}`);
  }
  
  const addToCartForSTL = (item) => {
    setCart((prev) => {
      // Remove any temporary blob URLs before saving
      const cleanItem = { ...item };
      delete cleanItem.fileUrl;
  
      const existingIndex = prev.findIndex((i) => i.fileName === item.fileName && i.type === item.type);
  
      if (existingIndex !== -1) {
        // If same file already exists → update quantity
        const updatedCart = [...prev];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + (item.quantity || 1),
        };
        return updatedCart;
      } else {
        // Add new item
        return [...prev, { ...cleanItem, quantity: item.quantity || 1 }];
      }
    });
  };
  

  // ✅ Remove completely by product id
  const removeFromCart = (id) => {
    setCart((prev) => {
      const updated = prev.filter((_, index) => index !== id);
      return updated;
    });
  };
  
  // ✅ Update quantity
  const updateQuantity = (id, qty) => {
    setCart((prev) => {
      console.log("🗑️ Updated cart:", prev, qty);
      if (qty <= 0) {
        // remove if 0
        return prev.filter((item) => item.id !== id);
      }
      return prev.map((item) =>
        item.id === id ? { ...item, quantity: qty } : item
      );
    });
  };

  // ✅ Clear all
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, deleteFileFromCache , addToCartForSTL}}
    >
      {children}
    </CartContext.Provider>
  );
};
