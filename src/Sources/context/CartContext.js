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
  
  const modifyCartQuantity = (item) => {
    setCart((prev) => {
      // find the item index
      const index = item.isStl
        ? prev.findIndex((i) => i.fileName === item.fileName && i.type === item.type)
        : prev.findIndex((i) => i.id === item.id);
  
      if (index === -1) return prev; // item not found, no change
  
      // create a copy of the cart
      const updated = [...prev];
      let prevPrice = prev[index].price / prev[index].quantity 
      updated[index] = { ...updated[index], quantity: item.quantity, price: Number(prevPrice * item.quantity) };
  
      return updated;
    });
  };


  const modifySTLType = (item) => {
    const materials = JSON.parse(localStorage.getItem("materials") || "[]");
    if (!materials.length) return;
  
    // extract materialType and name from Dropdown value (ex: "PLA-Black")
    const [materialType, name] = item.type.split("-");
    
    // find the matching material
    const matchedMaterial = materials.find(
      (m) => m.materialType === materialType && m.name === name
    );


    // compute new price
    setCart((prev) => {
      const oldIndex = prev.findIndex(
        (i) => i.fileName === item.fileName && i.type === item.oldType
      );
      if (oldIndex === -1) return prev;
      console.log(matchedMaterial, prev[oldIndex], item)



      const newPrice = matchedMaterial
      ? Number(item.volume * (matchedMaterial.basePrice + matchedMaterial.pricePerCm3)).toFixed(2)
      : Number(item.price);
  
      console.log(newPrice)

      // if another item with new type already exists, merge them
      const duplicateIndex = prev.findIndex(
        (i) => i.fileName === item.fileName && i.type === item.type
      );
  
      const updated = [...prev];
      if (duplicateIndex !== -1) {

        updated[duplicateIndex] = {
          ...updated[duplicateIndex],
          quantity: updated[duplicateIndex].quantity + updated[oldIndex].quantity,
          price: newPrice,
        };
        updated.splice(oldIndex, 1);
        return updated;
      }
  
      // otherwise just update the type + price
      updated[oldIndex] = {
        ...updated[oldIndex],
        type: item.type,
        price: newPrice,
      };
      return updated;
    });
  };
  
  


  
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
        console.log("updatedCart")
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
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, deleteFileFromCache , addToCartForSTL, modifySTLType, modifyCartQuantity}}
    >
      {children}
    </CartContext.Provider>
  );
};
