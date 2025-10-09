import React, { useRef, useState, useEffect } from 'react';
import Viewer from '../components/preview';
import QuantityInput from '../components/QuantityInput.js';
import MaterialGrid from '../components/MaterialGrid.js';
import { validateSTLFileFromFile } from '../utils/stlValidator';
import { useCart } from "../context/CartContext.js";
import { jwtDecode } from 'jwt-decode';
import Popup from "../components/Popup";
import { useSTLCache } from '../hooks/useSTLCache.js';

import '../Style/upload.css'; 

function Upload() {
  const [fileUrl, setFileUrl] = useState(null);
  const inputRef = useRef();
  const [fileName, setFileName] = useState('لم يتم اختيار ملف بعد');
  const [warningMsg, setWarningMsg] = useState('');
  const [wireframe, setWireframe] = useState(true);
  const [uploadMessage, setUploadMessage] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [volume, setVolume] = useState(0);
  const [face, setFace] = useState(null);
  const [result, setResult] = useState(null);
  const { addToCartForSTL } = useCart();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [token] = useState(sessionStorage.getItem("token") || ""); 
  const [showPopup, setShowPopup] = useState(false);

  const { cachedFile, cachedMeta, saveToCache, clearAll, updateMeta } = useSTLCache();

  // 🧠 Restore from cache
  useEffect(() => {
    if (cachedFile && cachedMeta) {
      try {
        const url = URL.createObjectURL(cachedFile);
        setFileUrl(url);
        setFileName(cachedMeta.fileName);
        setVolume(Math.abs(cachedMeta.volume));
        setFace(cachedMeta.facets || 0);
        setUploadMessage('✅ تم استعادة الملف السابق من التخزين المحلي');
        setResult({
          ...cachedMeta,
        });
      } catch (error) {
        console.error("Failed to create object URL:", error);
        setUploadMessage("⚠️ حدث خطأ أثناء تحميل الملف من التخزين المحلي");
      }
    }
  }, [cachedFile, cachedMeta]);

  const handleFileUpload = async (event) => {
    let file = event.target.files[0];
    if (!file?.name) return;

    let id = "";
    if (token) {
      const decoded = jwtDecode(token);
      id = decoded.id;
    } else {
      setShowPopup(true);
      return;
    }

    const validation = await validateSTLFileFromFile(file);
    if (!validation.isValid) {
      setFileName('❌ ملف STL غير صالح');
      setWarningMsg(`⚠️ ${validation.error}`);
      return;
    }

    setLoading(true);
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setFileUrl(url);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/uploadTest?id=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-Filename': file.name,
          'Authorization': `Bearer ${token}`,
        },
        body: file,
      });

      const data = await res.json();
      const absVolume = Math.abs(data.volume);
      setVolume(absVolume);
      setFace(validation.facetCount);

      const newMeta = {
        fileName: file.name,
        volume: absVolume,
        facets: validation.facetCount,
        price: data.price || 0,
        fileUrl: url,
        quantity: 1,
        isStl: true,
      };

      await saveToCache(file, newMeta);
      setResult(newMeta);
    } catch (err) {
      console.error(err);
      await clearAll();
      setResult({ error: "❌ حدث خطأ أثناء رفع الملف أو حساب الحجم" });
    } finally {
      setLoading(false);
    }
  };

  const handleMaterialSelect = async (material) => {
    setSelectedMaterial(material);
    if (!material || !volume) return;

    const newResult = {
      ...result,
      type: `${material.materialType} - ${material.name}`,
      price: Number(volume * (material.basePrice + material.pricePerCm3)).toFixed(2),
    };

    setResult(newResult);
    await updateMeta(cachedFile, newResult);
  };

  return (
    <div className="upload-container">
      {showPopup && (
        <Popup 
          message="لإكمال العملية يرجى تسجيل الدخول!" 
          onClose={() => setShowPopup(false)}
          navigationUrl={"login"} 
        />
      )}

      <div className='sub-section-upolar-part1'>
        <h2>🧊 STL Viewer</h2>
        {uploadMessage}
        <div className="upload-box">
          <input type="file" id="fileInput" accept=".stl" onChange={handleFileUpload} ref={inputRef} hidden />
          <label htmlFor="fileInput" className="file-label">📂 اختر ملف STL</label>
          {warningMsg && <span className="warning-msg" style={{ color: 'red' }}>{warningMsg}</span>}

          {fileUrl && (
            <button onClick={() => setWireframe(!wireframe)} className='btn-add'>
              {wireframe ? "Hide Wireframe" : "Show Wireframe"}
            </button>
          )}
        </div>
      </div>

      <div className='sub-section-upolar-part2'>
        <div className='viewer-result'>
          <Viewer fileUrl={fileUrl} wireframe={wireframe} width={'30dvw'} height={'30dvw'} />
          {result && !result.error && (
            <div id="result" className="result-box visible">
              <p>📦 <strong>الاسم:</strong> {fileName}</p>
              <p>📦 <strong>الحجم:</strong> {result.volume} سم³</p>
              <p>💰 <strong>السعر التقديري:</strong> $ {result.price}</p>
              <p>📊 <strong>عدد الوجوه:</strong> {result.facets}</p>

              <div className='quantity-input'>
                <div>🔢 <strong>الكمية:</strong></div>
                <QuantityInput
                  initial={result.quantity}
                  min={1}
                  onChange={(val) => {
                    const q = parseInt(val) || 1;
                    const updated = { ...result, quantity: q };
                    setResult(updated);
                    updateMeta(cachedFile, updated);
                  }}
                />
              </div>

              <button className='btn-add' hidden={!selectedMaterial} onClick={() => addToCartForSTL(result)}>
                ➕ إضافة إلى الصندوق
              </button>
            </div>
          )}
        </div>

        <div className="stlFile-volumePrice">
          {loading ? (
            <span className="spinner-large" />
          ) : (
            <MaterialGrid 
              FileExist={fileUrl !== null} 
              isMobile={isMobile}
              onMaterialSelect={handleMaterialSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Upload;
