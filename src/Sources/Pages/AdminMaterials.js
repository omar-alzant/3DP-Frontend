import React, { useState, useEffect } from 'react';
import '../Style/materials.css';

export default function AdminMaterials() {
  const [materials, setMaterials] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // Fetch materials on component mount
  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:3001/admin/materials',{ method: 'GET' })
      .then(res => res.json())
      .then(data => {setMaterials(data); setLoading(false)})
      .catch(err => console.error('Error fetching materials:', err));
  }, []);

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

    fetch('http://localhost:3001/admin/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, basePrice, description,  color, isNew, materialType, pricePerCm3  }),
    })
      .then(res => res.json())
      .then(() => {
        // Refresh the materials list
        return fetch('http://localhost:3001/admin/materials');
      })
      .then(res => res.json())
      .then(data => {
        setMaterials(data);
        setForm({ name: '', materialType: '', basePrice: 0, pricePerCm3: 0, description: '', color: '', imgPreview: '', isNew: false });
      })
      .catch(err => console.error('Error adding material:', err));
  };

  const deleteMaterial = (id) => {
    console.log(id);
    
    fetch(`http://localhost:3001/admin/materials/${id}`, { method: 'DELETE' })
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
      fetch(`http://localhost:3001/admin/materials/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, basePrice, description, color, isNew, materialType, pricePerCm3 }),
      })
        .then(res => res.json())
        .then(() => {
          setEditingId(null);
          resetForm();
          return fetch('http://localhost:3001/admin/materials');
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
    <div style={styles.container}>
    <h2 style={styles.heading}>إدارة مواد الطباعة</h2>
    <form onSubmit={handleSubmit} style={styles.formGrid}>
  <label style={styles.label}>
    الإسم
    <input
      id="name"
      required
      placeholder="الإسم"
      type="text"
      value={form.name}
      onChange={e => setForm({ ...form, name: e.target.value })}
      style={styles.input}
    />
  </label>

  <label style={styles.label}>
    النوع
    <input
      id="materialType"
      required
      placeholder="النوع"
      type="text"
      value={form.materialType}
      onChange={e => setForm({ ...form, materialType: e.target.value })}
      style={styles.input}
    />
  </label>

  <label style={styles.label}>
    السعر الأولي
    <input
      id="basePrice"
      required
      placeholder="السعر الأولي"
      type="number"
      value={form.basePrice}
      onChange={e => setForm({ ...form, basePrice: parseFloat(e.target.value) })}
      style={styles.input}
    />
  </label>

  <label style={styles.label}>
    السعر/cm³
    <input
      id="pricePerCm3"
      required
      placeholder="السعر/cm³"
      type="number"
      value={form.pricePerCm3}
      onChange={e => setForm({ ...form, pricePerCm3: parseFloat(e.target.value) })}
      style={styles.input}
    />
  </label>

  <label style={{ ...styles.label, gridColumn: 'span 2' }}>
    تفاصيل 
    <textarea
      id="description"
      required
      rows={3}
      placeholder="تفاصيل"
      value={form.description}
      onChange={e => setForm({ ...form, description: e.target.value })}
      style={{ ...styles.input, resize: 'vertical' }}
    />
  </label>

  <label style={{ ...styles.label, gridColumn: 'span 2' }}>
  📤 ارفع صورة
    <div style={styles.imageContainer}>
      <input 
        id="imageUpload"         
        type="file"
        hidden={true} 
        accept="image/*" 
        onChange={handleImageChange} 
      />
      {form.imgPreview && (
        <img src={form.imgPreview} alt="preview" style={styles.previewImage} />
      )}
    </div>
  </label>

  <label style={styles.checkboxLabel}>
    <input
      id="isNew"
      type="checkbox"
      checked={form.isNew}
      onChange={e => setForm({ ...form, isNew: e.target.checked })}
    />{' '}
    جديد
  </label>

  <button type='submit' style={styles.addButton}>
    {editingId ? 'عدل العنصر' : 'أضف عنصر'}
  </button>

  {editingId && (
    <button type="button" onClick={resetForm} style={styles.cancelButton}>
      Cancel
    </button>
  )}
    </form>


{/* *************************** All Existed materials list *************************** */}
    {loading 
    ?
    <span className="spinner" />
    :
    (
      <>
    {(materials) &&
    (<ul style={styles.materialList}>
      {materials.map(m => (
        <li key={m.id} style={styles.materialItem}>
          <div >
            {m.isNew &&  <div style={styles.badge}>جديد</div>}
            {m.color ? 
              <div className="image-container">
                <img width="10px" height="10px" src={`data:image/png;base64,${m.color}`} alt={m.name} className="material-image" />
              </div>
              :
              <p>بدون صورة</p>
              }
            </div>
          {m.materialType}   -   {m.name} — ${m.basePrice} + ${m.pricePerCm3}/cm³ 
          <div>
            <button 
              style={styles.editButton} 
              onClick={() => startEditing(m)}
            >
              ✏️
            </button>
            <button 
              style={styles.deleteButton} 
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

  const styles = {
    editButton: {
      padding: '6px 12px',
      border: 'none',
      borderRadius: '6px',
      backgroundColor: '#ffc107',
      color: '#fff',
      cursor: 'pointer',
      marginRight: '8px',
      marginBottom: '8px',

    },
    cancelButton: {
      fontFamily: "Cairo",
      padding: '12px 25px',
      backgroundColor: '#6c757d',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      marginBottom: '25px',
      transition: '0.2s all',
    },    
    label: {
      display: 'flex',
      cursor: 'Pointer',
      fontFamily: "Cairo",
      flexDirection: 'column',
      fontWeight: 'bold',
      color: '#444',
      fontSize: '14px',
      gap: '6px',
    },    
    container: {
      fontFamily: "Cairo",
      maxWidth: '800px',
      margin: '40px auto',
      padding: '30px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif',
    },
    heading: {
      fontFamily: "Cairo",
      textAlign: 'center',
      marginBottom: '25px',
      color: '#333',
    },
    badge: {
      // position: absolute,
      fontFamily: "Cairo",
      marginBottom: '5px',
      top: '12px',
      left: '12px',
      background: '#e74c3c',
      color: 'white',
      fontSize: '0.7rem',
      padding: '0.3rem',
      borderRadius: '12px',
      fontWeight: 'bold',
    },
    formGrid: {
      fontFamily: "Cairo",
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px',
      marginBottom: '20px',
    },
    input: {
      fontFamily: "Cairo",
      padding: '12px 15px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '16px',
      outline: 'none',
      transition: '0.2s all',
    },
    inputFocus: {
      borderColor: '#007bff',
    },
    imageContainer: {
      gridColumn: 'span 2',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    previewImage: {
      maxWidth: '200px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      gridColumn: 'span 2',
      fontSize: '16px',
    },
    addButton: {
      padding: '12px 25px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      marginBottom: '25px',
      transition: '0.2s all',
    },
    addButtonHover: {
      backgroundColor: '#0056b3',
    },
    materialList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    materialItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 15px',
      borderBottom: '1px solid #eee',
      borderRadius: '6px',
      marginBottom: '8px',
      backgroundColor: '#f9f9f9',
    },
    deleteButton: {
      fontFamily: "Cairo",
      padding: '6px 12px',
      border: 'none',
      borderRadius: '6px',
      backgroundColor: '#ff4d4f',
      color: '#fff',
      cursor: 'pointer',
    },
  };
  
