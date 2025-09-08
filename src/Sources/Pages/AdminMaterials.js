import React, { useState, useEffect } from 'react';
import '../Style/materials.css';

export default function AdminMaterials() {
  const [materials, setMaterials] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem('token');

  const [form, setForm] = useState({
    name: '',
    basePrice: 0,
    pricePerCm3: 0,
    description: '',
    imgPreview: '',
    color: '',
    isNew: false,
    materialType: '',
  });

  useEffect(() => {
    
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/materials`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        setMaterials(Array.isArray(data) ? data : []);
              } catch (err) {
        console.error('Error fetching materials:', err);
      } finally {
        setLoading(false);
      }
    };
  
    if (token) fetchMaterials();
  }, [token]); // ✅ include token
  
  const startEditing = (material) => {
    setEditingId(material.id);
    setForm({
      name: material.name,
      basePrice: material.basePrice,
      pricePerCm3: material.pricePerCm3,
      description: material.description,
      imgPreview: material.color ? `data:image/png;base64,${material.color}` : '',
      color: material.color,
      isNew: material.isNew,
      materialType: material.materialType,
    });
  };
  
  const addMaterial = (e) => {
    e.preventDefault(); // stops page refresh

     const { name, basePrice, description,  color, isNew, materialType, pricePerCm3  } = form;

    fetch(`${process.env.REACT_APP_API_URL}/admin/materials`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name, basePrice, description,  color, isNew, materialType, pricePerCm3  }),
    })
      .then(res => res.json())
      .then(() => {
        // Refresh the materials list
        return fetch(`${process.env.REACT_APP_API_URL}/admin/materials`, {
          headers: {
            'Authorization': `Bearer ${token}`,

          }
        });
      })
      .then(res => res.json())
      .then(data => {
        setMaterials(data);
        setForm({ name: '', materialType: '', basePrice: 0, pricePerCm3: 0, description: '', color: '', imgPreview: '', isNew: false });
      })
      .catch(err => console.error('Error adding material:', err));
  };

  const deleteMaterial = (id) => {    
    fetch(`${process.env.REACT_APP_API_URL}/admin/materials/${id}`, 
      { method: 'DELETE', 
        headers: 
        {
          'Authorization': `Bearer ${token}`,
        } 
      })
      .then(() => setMaterials(materials.filter(m => m.id !== id)))
      .catch(err => console.error('Error deleting material:', err));
  };

  const handleImageChange = (e) => {
    e.preventDefault(); // stops page refresh

    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result; // e.g. data:image/png;base64,AAAA
        const base64Only = typeof dataUrl === 'string' ? dataUrl.split(',')[1] : '';
        setForm(prev => ({ ...prev, color: base64Only, imgPreview: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const { name, basePrice, description, color, isNew, materialType, pricePerCm3 } = form;
  
    if (editingId) {
      // UPDATE
      const token = sessionStorage.getItem('token');

      fetch(`${process.env.REACT_APP_API_URL}/admin/materials/${editingId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, basePrice, description, color, isNew, materialType, pricePerCm3 }),
      })
        .then(res => res.json())
        .then(() => {
          setEditingId(null);
          resetForm();
          return fetch(`${process.env.REACT_APP_API_URL}/admin/materials`);
        })
        .then(res => res.json())
        .then(data => setMaterials(data));
    } else {
      // ADD
      addMaterial(e);
    }
  };

  const resetForm = () => {
    setEditingId(null)
    setForm({ name: '', materialType: '', basePrice: 0, pricePerCm3: 0, description: '', color: '', imgPreview: '', isNew: false });
  };
  
  return (
    <div className='material-container'>
    <h2 className='heading'>إدارة مواد الطباعة</h2>
    <form onSubmit={handleSubmit} className="form-grid-admin-material">
      <div className='part1-material'>
      <label className="label">
        الإسم
        <input
          id="name"
          required
          placeholder="الإسم"
          type="text"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="input"
        />
      </label>

      <label className='label'>
        النوع
        <input
          id="materialType"
          required
          placeholder="النوع"
          type="text"
          value={form.materialType}
          onChange={e => setForm({ ...form, materialType: e.target.value })}
          className="input"
        />
      </label>

      <label className='label'>
        السعر الأولي
        <input
          id="basePrice"
          required
          placeholder="السعر الأولي"
          type="number"
          value={form.basePrice}
          onChange={e => setForm({ ...form, basePrice: parseFloat(e.target.value) })}
          className="input"
        />
      </label>

      <label className="label">
        السعر/cm³
        <input
          id="pricePerCm3"
          required
          placeholder="السعر/cm³"
          type="number"
          value={form.pricePerCm3}
          onChange={e => setForm({ ...form, pricePerCm3: parseFloat(e.target.value) })}
          className="input"
        />
      </label>

      <label className="label-Img">
      📤 ارفع صورة
        <div className="image-Container">
          <input 
            id="imageUpload"         
            type="file"
            hidden={true} 
            accept="image/*" 
            onChange={handleImageChange} 
          />
          {form.imgPreview && (
            <img src={form.imgPreview} alt="preview" className="preview-Image" />
          )}
        </div>
      </label>

      <label className="checkbox-Label">
        <input
          id="isNew"
          type="checkbox"
          checked={form.isNew}
          onChange={e => setForm({ ...form, isNew: e.target.checked })}
        />{' '}
        جديد
      </label>
    </div>

      <label className='label-Img'>
        تفاصيل 
        <textarea
          id="description"
          required
          rows={3}
          placeholder="تفاصيل"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="textarea"
        />
      </label>

      <div>
        <button type='submit' className="add-button">
          {editingId ? 'عدل العنصر' : 'أضف عنصر'}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm} className="cancel-button">
            إلغاء
          </button>
        )}
      </div>
    </form>


{/* *************************** All Existed materials list *************************** */}
    {loading 
    ?
    <p>⏳ جارٍ التحميل...</p>
    :
    (
      <>
    {(Array.isArray(materials)) &&
    (<ul className="material-list">
      {materials.map(m => (
        <li key={m.id} className='materialItem'>
          <div >
            {m.isNew &&  <div className="badge-new">جديد</div>}
            {m.color ? 
              <div className="image-container">
                <img width="10px" height="10px" src={`data:image/png;base64,${m.color}`} alt={m.name} className="material-image" />
              </div>
              :
              <p>بدون صورة</p>
              }
            </div>
          {m.materialType}   -   {m.name} — ${m.basePrice} + ${m.pricePerCm3}/cm³ 
          <div className='btn-edit-delete'>
            <button 
              className="edit-button" 
              onClick={() => startEditing(m)}
            >
              ✏️
            </button>
            <button 
              className="delete-button" 
              onClick={() => deleteMaterial(m.id)}
              >
              ❌
            </button>
            </div>
        </li>
      ))}
    </ul>
    )}
      </>
)}
  </div>
);
}
