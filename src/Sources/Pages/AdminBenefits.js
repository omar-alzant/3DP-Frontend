import React, { useState, useEffect } from "react";
import "../Style/Benefits.css";

export default function AdminBenefits() {
  const [benefits, setBenefits] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("token");
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    Title: "",
    Image: "",
    imgPreview: "",
    Details: "",
    display: false,
  });

  // 🔹 Fetch all benefits
  useEffect(() => {
    const fetchBenefits = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/benefits`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBenefits(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching benefits:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchBenefits();
  }, [token]);

  // 🔹 Start editing
  const startEditing = (benefit) => {
    setEditingId(benefit.id);
    setForm({
      Title: benefit.Title,
      Details: benefit.Details,
      Image: benefit.Image, // backend should return base64 or URL
      imgPreview: benefit.Image
        ? benefit.Image.startsWith("data:")
          ? benefit.Image
          : `data:image/png;base64,${benefit.Image}`
        : "",
      display: benefit.display
    });
  };

  // 🔹 Handle file upload
  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result; // data:image/png;base64,xxx
        const base64Only =
          typeof dataUrl === "string" ? dataUrl.split(",")[1] : "";
        setForm((prev) => ({
          ...prev,
          Image: base64Only,
          imgPreview: dataUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔹 Add new benefit
  const addBenefit = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/benefits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      refreshBenefits();
      resetForm();
    } catch (err) {
      console.error("Error adding benefit:", err);
    }
  };

  // 🔹 Update benefit
  const updateBenefit = async () => {
    setIsSaving(true); // يبدأ عرض "جاري الحفظ..."

    try {
      await fetch(
        `${process.env.REACT_APP_API_URL}/benefits/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );
      refreshBenefits();
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
      await fetch(`${process.env.REACT_APP_API_URL}/benefits/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setBenefits(benefits.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Error deleting benefit:", err);
    }
  };


  // 🔹 Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateBenefit();
    } else {
      addBenefit();
    }
  };

  const refreshBenefits = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/benefits`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setBenefits(data);
  };

  const resetForm = () => {
    setForm({ Title: "", Details: "", Image: "", imgPreview: "", display: false });
    setEditingId(null);
  };

  return (
    <div className="benefit-container">
      <h2 className="benefit-title">إدارة الفوائد</h2>
      <form onSubmit={handleSubmit} className="benefit-form">
        <input
          type="text"
          placeholder="العنوان"
          value={form.Title}
          required
          onChange={(e) => setForm({ ...form, Title: e.target.value })}
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
          value={form.Details}
          required
          onChange={(e) => setForm({ ...form, Details: e.target.value })}
        />

      <button type="submit" disabled={isSaving}>
        {isSaving
          ? "⏳ جاري الحفظ..." // يظهر أثناء الحفظ
          : editingId
          ? "💾 حفظ التعديلات"
          : "➕ إضافة"}
      </button>

      {editingId && !isSaving && (
        <button type="button" onClick={resetForm} className="cancel-btn">
          إلغاء
        </button>
      )}
      </form>

      <hr />
      {loading ? (
        <p>⏳ جارٍ التحميل...</p>
      ) : (
        Array.isArray(benefits) &&
        <ul className="benefit-list">
          {benefits.map((b) => (
            <li key={b.id} className="benefit-item">
  
              {b.Image ? (
                <img
                  src={`${b.Image}`}
                  alt={b.Title}
                  className="benefit-thumb"
                />
              ) : (
                <img src={"/favicon.jpg"} alt={b.Title} className="benefit-thumb" />
                )}
              <div>
                <h3>{b.Title}</h3>
                <p>{b.Details}</p>
              </div>
              <div className="btns">
              {b.display ? 
                <>
                👀 
                </>
                :
                <>
                🚫
                </>
                }
                <button className="edit-btn" onClick={() => startEditing(b)}>✏️</button>
                <button className="delete-btn" onClick={() => deleteBenefit(b.id)}>❌</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}