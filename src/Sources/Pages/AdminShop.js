import React, { useState, useEffect } from "react";
import "../Style/Benefits.css";

export default function AdminShop() {
  const [shop, setShop] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("token");
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    fileUrl: "",
    price: 0,
    description: "",
    isStl: false,
    display: true
  });

  // 🔹 Fetch all shop
  useEffect(() => {
    const fetchShop = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/shop`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setShop(Array.isArray(data) ? data : []);
        localStorage.setItem("shop", JSON.stringify(data));
      } catch (err) {
        console.error("Error fetching shop:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchShop();
  }, [token]);

  // 🔹 Start editing
  const startEditing = (shop) => {
    setEditingId(shop.id);
    setForm({
      name: shop.name,
      price: shop.price,
      description: shop.description,
      fileUrl: shop.fileUrl, // backend should return base64 or URL
      imgPreview: shop.fileUrl
        ? shop.fileUrl.startsWith("data:")
          ? shop.fileUrl
          : `data:image/png;base64,${shop.fileUrl}`
        : "",
      display: shop.display
    });
  };

  // 🔹 Handle file upload
  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result; // e.g. data:image/png;base64,AAAA
        const base64Only = typeof dataUrl === 'string' ? dataUrl.split(',')[1] : '';
        setForm((prev) => ({
          ...prev,
          fileUrl: base64Only,
          imgPreview: dataUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔹 Add new benefit
  const addBenefit = async (e) => {
    e.preventDefault(); // stops page refresh

    try {
      await fetch(`${process.env.REACT_APP_API_URL}/admin/shop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      refreshshop();
      resetForm();
    } catch (err) {
      console.error("Error adding shop:", err);
    }
  };

  // 🔹 Update benefit
  const updateBenefit = async (e) => {
    e.preventDefault()
    setIsSaving(true); // يبدأ عرض "جاري الحفظ..."
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL}/admin/shop/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );
      refreshshop();
      resetForm();
      setEditingId(null);
    } catch (err) {
      console.error("Error updating benefit:", err);
    } finally{
      setIsSaving(false); // ينتهي عرض "جاري الحفظ..." بعد الحفظ
    }
  };

  // 🔹 Delete benefit
  const deleteBenefit = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/admin/shop/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setShop(shop.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Error deleting shop:", err);
    }
  };


  // 🔹 Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateBenefit(e);
    } else {
      addBenefit(e);
    }
  };

  const refreshshop = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/shop`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setShop(data);
  };

  const resetForm = () => {
    setForm({ name: "", description: "", fileUrl: "", imgPreview: "", display: false, price: 0 });
    setEditingId(null);
  };

  return (
    <div className="benefit-container">
      <h2 className="benefit-title">إدارة المتجر</h2>
      <form onSubmit={handleSubmit} className="benefit-form">
        <input
          type="text"
          placeholder="العنوان"
          value={form.name}
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <label id="shop-price" className="label">    
          السعر
        </label>
          <input
            type="number"
            placeholder="السعر"
            value={form.price}
            required
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
      
        
        <label className="label">
          أرفق صورة📤
          <div className="imageContainer">
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
              
            />
            {form.imgPreview && (
              <img src={form.imgPreview} alt="preview" className="previewImage" />
            )}
          </div>
        </label>
        <label className="checkboxLabel">
        <input
          id="display"
          type="checkbox"
          checked={form.display}
          onChange={e => setForm({ ...form, display: e.target.checked })}
        />{' '}
        إظهار
      </label>
        <textarea
          placeholder="النص"
          value={form.description}
          required
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div>
          <button type="submit" disabled={isSaving} className="add-button">
            {isSaving
              ? "⏳ جاري الحفظ..."
              : editingId
              ? "💾 حفظ التعديلات"
              : " إضافة"}
          </button>

          {editingId && !isSaving && (
            <button type="button" onClick={resetForm} className="cancel-btn">
              إلغاء
            </button>
          )}
          <hr />
        </div>
      </form>

      {loading ? (
        <p>⏳ جارٍ التحميل...</p>
      ) : (
        Array.isArray(shop) &&
        <ul className="benefit-list">
          {shop.map((b) => (
            <li key={b.id}
            className={`benefit-item ${editingId === b.id ? "selected" : ""}`}

            >
  
              {b.fileUrl ? (
                <img
                  src={`data:image/png;base64,${b.fileUrl}`} 
                  alt={b.name}
                  className="benefit-thumb"
                />
              ) : (
                <img src={"/favicon.jpg"} alt={b.name} className="benefit-thumb" />
                )}
              <div>
                <h3>{b.name}</h3>
                <p>{b.description}</p>
                <p>{b.price}</p>
              </div>
              <div className="btns">
              {b.display ? 
                <button className="show-hide">
                👀 
                </button>
                :
                <button className="show-hide">
                🚫
                </button>
                }
                <button className="edit-button" onClick={() => startEditing(b)}>✏️</button>
                <button className="delete-button" onClick={() => deleteBenefit(b.id)}>❌</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}