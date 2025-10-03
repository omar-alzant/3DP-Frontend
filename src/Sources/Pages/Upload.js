import React, { useRef, useState,useEffect  } from 'react';
import Viewer from '../components/preview';
import QuantityInput from '../components/QuantityInput.js';
import MaterialGrid from '../components/MaterialGrid.js'
import { validateSTLFileFromFile } from '../utils/stlValidator';
import { useCart } from "../context/CartContext.js";
import { jwtDecode } from 'jwt-decode';
import Popup from "../components/Popup";

import '../Style/upload.css'; 


function Upload() {
  const [fileUrl, setFileUrl] = useState(null);
  const [fileUrlForStorage, setFileUrlForStorage] = useState(null);
  const inputRef = useRef();
  const [fileName, setFileName] = useState('لم يتم اختيار ملف بعد');
  const [warningMsg, setWarningMsg] = useState('');
  const [wireframe, setwireframe] = useState(true);
  const [UploadMessage, setUploadMessage] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [Volume, setVolume] = useState(0);
  const [Face, setFace] = useState(null);
  const [result, setResult] = useState(null);
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [token] = useState(sessionStorage.getItem("token") || ""); // 👈 new state
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {  
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1200);
    };
  
    window.addEventListener("resize", handleResize);
    // ✅ Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [token]);

  const handleFileUpload = async (event) => {
    let file = event.target.files[0];
    let decoded = "";
    let id = "";
    
    if(token){
      decoded = jwtDecode(token);
      id = decoded.id
    }
    else{
      setShowPopup(true);
      file = null
      return
    }
    
    if (!file.name) return;
 
    if (file) {
      const validation = await validateSTLFileFromFile(file);
    
      if (!validation.isValid) {
        setFileName('ملف STL غير صالح');
        setUploadMessage("❌ ملف STL غير صالح");
        setWarningMsg(`⚠️ ${validation.error}`);
        setFileUrl(null);
        setResult(null);
        return;
      }

      const url = URL.createObjectURL(file);
      setFileName(file.name);
      setWarningMsg('');  
      setFileUrl(url);
      setUploadMessage(`✅ تم تحميل الملف بنجاح (${validation.format} format, ${validation.facetCount} facets)`);

      const formData = new FormData();
      formData.append('file', file);

      // const resultDiv = document?.getElementById('result');
      // resultDiv.textContent = '⏳ جارٍ رفع الملف وحساب الحجم...';
      const token = sessionStorage.getItem('token');
      
      setLoading(true)
      fetch(`${process.env.REACT_APP_API_URL}/upload?id=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-Filename': file.name,
          'Authorization': `Bearer ${token}`,
        },
        body: file,
      })
      .then((res) => res.json())
      .then((data) => {
        const absVolume = Math.abs(data.volume);
        setFileUrlForStorage(`${process.env.REACT_APP_API_URL}/files/${id}/${data.fileName}`, {
          headers:{ 'Authorization': `Bearer ${token}`}
        })
        setVolume(absVolume);
        setFace(validation.facetCount);
        console.log({selectedMaterial})
        if(selectedMaterial){
          setResult({
            volume: absVolume,
            price:
              selectedMaterial.basePrice +
              absVolume * selectedMaterial.pricePerCm3,
            facets: validation.facetCount,
          });
        }
      })
        .catch((err) => {
          setLoading(false);
          console.error(err);
          setResult({ error: "❌ حدث خطأ أثناء رفع الملف أو حساب الحجم" });
        });
    } else {
      setFileName('لم يتم اختيار ملف صالح');
      setUploadMessage("⚠️ لم يتم اختيار أي ملف");
      setWarningMsg('⚠️ الرجاء رفع ملف STL فقط');
      setFileUrl(null);
    }
    setLoading(false);

  };

  const ChangeWireframe = () => {
    setwireframe(!wireframe);
  }
  
  const handleMaterialSelect = (material) => {
    setSelectedMaterial(material);   
    if(Volume && material){
      setResult({
        name: fileName,
        type: `${material.materialType} - ${material.name}`,
        fileUrl: fileUrlForStorage,
        volume: Volume,
        price: Number(Math.abs(material.basePrice + Volume * material.pricePerCm3).toFixed(2)),
        facets: Face,
        quantity: quantity,
        isStl: true,
      });      
    }
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
          <div className="upload-box">
            {/* <input type="file" id="fileInput" class="file-input" /> */}
            <div>
              <input type="file" id="fileInput" accept=".stl" onChange={handleFileUpload} ref={inputRef} hidden={true}/>
              <label htmlFor="fileInput" className="file-label">📂 اختر ملف STL</label>
              {warningMsg && (
                <span className="warning-msg" style={{ color: 'red' }}>
                  {warningMsg}
                </span>
              )}
            </div>
            { fileUrl !== null && 
            (
              <>
                <button 
                  onClick={ChangeWireframe}
                  className='btn-add'
                >
                  {wireframe ? "Hide Wireframe" : "Show Wireframe"}
                </button>
              </> 
            )}
          </div>
        </div>
      <div className='sub-section-upolar-part2' >
        <div className='viewer-result'>
          <Viewer className="viewer" fileUrl={fileUrl} wireframe={wireframe} width={'30dvw'} height={'30dvw'}/>
          {result && (
          <div id="result" className="result-box visible">
            {result.error ? (
              <p>{result.error}</p>
            ) : (
              <>
                <p>📦 <strong>الاسم:</strong> {fileName} </p>
                <p>📦 <strong>الحجم:</strong> {result.volume} سم³</p>
                <p >💰 <strong>السعر التقديري:</strong> $ {result.price}</p>
                <p>📊 <strong>عدد الوجوه:</strong> {result.facets}</p>
                {/* ✅ Quantity Input */}
                <div className='quantity-input'>
                  <div>
                    🔢 <strong>الكمية:</strong> 
                  </div>
                  <QuantityInput initial={1} min={1} onChange={(val) => 
                    {
                      const q = parseInt(val) || 1;
                      setQuantity(q);
                      if(result){
                        setResult({ ...result, quantity: q }); // update quantity in result                        
                      }
                    } 
                  } />

                </div>
                <button className='btn-add' onClick={() => addToCart(result)}>
                  ➕ إضافة إلى الصندوق
                </button>

              </>
            )}
          </div>
            )}
          
        </div>
        <div className="stlFile-volumePrice">
            {loading 
            ?
            <span className="spinner-large" />
            :
            (
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
