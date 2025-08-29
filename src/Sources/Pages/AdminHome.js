import React, { useState, useEffect } from "react";
import "../Style/Benefits.css";

export default function AdminHome() {
  const [homeDet, sethomeDet] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const token = sessionStorage.getItem("token");

  const [form, setForm] = useState({
    Title: "",
    Image: "",
    imgPreview: "",
    Detail: "",
    Display: false,
  });

  // 🔹 Fetch all Home
  useEffect(() => {
    const fetchHome = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/Home`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        sethomeDet(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching Home:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchHome();
  }, [token]);

  // 🔹 Start editing
  const startEditing = (home) => {
    setEditingId(home.id);
    setForm({
      Title: home.Title,
      Detail: home.Detail,
      Image: home.Image,
      imgPreview: home.Image
        ? home.Image.startsWith("http") || home.Image.startsWith("/")
          ? home.Image
          : `data:image/png;base64,${home.Image}`
        : "",
      Display: home.Display,
    });
  };

  // 🔹 Handle file upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        const base64Only =
          typeof dataUrl === "string" ? dataUrl.split(",")[1] : "";
        setForm((prev) => ({
          ...prev,
          Image: base64Only,
          imgPreview: dataUrl,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔹 Add new homeDet
  const addHomeDet = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/Home`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      refreshHomeDet();
      resetForm();
    } catch (err) {
      console.error("Error adding homeDet:", err);
    }
  };

  // 🔹 Update homeDet
  const updatehomeDet = async () => {
    setIsSaving(true);
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/home/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      refreshHomeDet();
      resetForm();
      setEditingId(null);
    } catch (err) {
      console.error("Error updating homeDet:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // 🔹 Delete homeDet
  const deletehomeDet = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/home/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      sethomeDet((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Error deleting homeDet:", err);
    }
  };

  // 🔹 Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updatehomeDet();
    } else {
      addHomeDet();
    }
  };

  const refreshHomeDet = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/Home`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    sethomeDet(Array.isArray(data) ? data : []);
  };

  const resetForm = () => {
    setForm({ Title: "", Detail: "", Image: "", imgPreview: "", Display: false });
    setEditingId(null);
  };

  return (
    <div className="benefit-container">
      <h2 className="benefit-title">إدارة الرئيسية</h2>

      {/* Form */}
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
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            {form.imgPreview && (
              <img src={form.imgPreview} alt="preview" className="previewImage" />
            )}
          </div>
        </label>

        <label className="checkboxLabel">
          <input
            id="display"
            type="checkbox"
            checked={form.Display}
            onChange={(e) => setForm({ ...form, Display: e.target.checked })}
          />
          إظهار
        </label>

        <textarea
          placeholder="النص"
          value={form.Detail}
          required
          onChange={(e) => setForm({ ...form, Detail: e.target.value })}
        />

        <button type="submit" disabled={isSaving || loading}>
          {isSaving ? "⏳ جاري الحفظ..." : editingId ? "💾 حفظ التعديلات" : "➕ إضافة"}
        </button>

        {editingId && !isSaving && (
          <button type="button" onClick={resetForm} className="cancel-btn">
            إلغاء
          </button>
        )}
      </form>

      <hr />

      {/* List */}
      {loading ? (
        <p>⏳ جارٍ التحميل...</p>
      ) : homeDet.length > 0 ? (
        <ul className="benefit-list">
          {homeDet.map((b) => (
            <li key={b.id} className="benefit-item">
              {b.Image ? (
                <img src={b.Image} alt={b.Title} className="benefit-thumb" />
              ) : (
                <img src={"/favicon.jpg"} alt={b.Title} className="benefit-thumb" />
              )}
              <div>
                <h3>{b.Title}</h3>
                <p>{b.Detail}</p>
              </div>
              <div className="btns">
                {b.Display ? "👀" : "🚫"}
                <button className="edit-btn" onClick={() => startEditing(b)}>✏️</button>
                <button className="delete-btn" onClick={() => deletehomeDet(b.id)}>❌</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>لا يوجد تفاصيل</p>
      )}
    </div>
  );
}
