import React, {  useState, useEffect, useRef } from 'react';
import '../Style/Meshy.css'; 

function MeshyGenerator() {
  const [prompt, setPrompt] = useState('');
  const [ThumbnalMeshy, setThumbnalMeshy] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [Progress, setProgress] = useState(0);
  const [DownloadProgress, setDownloadProgress] = useState(0);
  const [Status, setStatus] = useState(0);
  const [loading, setLoading] = useState(false);
  const [TaskId, setTaskId] = useState("");
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const handleGenerateMeshy = async () => {
    const controller = new AbortController();
    const timeout = 60000;
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const token = sessionStorage.getItem('token');

    try {
      // 1️⃣ Create task.3

      const res = await fetch(`${process.env.REACT_APP_API_URL}/threeDMaker`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      });
  
      const { taskId } = await res.json();
      if (!taskId) throw new Error("No taskId returned");
  
      setIsImageLoaded(false);
      setStatus("Processing...");
  
      // 2️⃣ Poll until finished
      let finished = false;
      setTaskId(taskId);
      
      while (!finished) {
        const checkRes = await fetch(`${process.env.REACT_APP_API_URL}/threeDMaker/${taskId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const checkData = await checkRes.json();
        // console.log("Polling data:", checkData);
        setProgress(checkData.progress);
        setLoading(true);

        if (checkData.progress >= 100) {
          setLoading(false);
          // setResult(checkData.result);
        }
        
        if (checkData.status === "SUCCEEDED") {
          setThumbnalMeshy(checkData.thumbnail_url);
          setLoading(false);
          // console.log(checkData.model_urls);
          
          finished = true;
        } else if (["FAILED", "CANCELED"].includes(checkData.status)) {
          // setValidationError(`Task ${checkData.status}`);
          finished = true;
        } else {
          // Small delay to avoid hammering server
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
  
      clearTimeout(timeoutId);
    } catch (error) {
      console.error("Error generating STL:", error);
      // setValidationError(`Generation error: ${error.message}`);
      clearTimeout(timeoutId);
    }
  };

 // Helper: Download file
 const triggerDownload = (url, filename = "model.stl") => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Main handler
const GetStlRef = async () => {
  setLoading(true);
  setDownloadProgress(0);
  setError(null);

  const controller = new AbortController();
  controllerRef.current = controller;
  const timeoutId = setTimeout(() => controller.abort(), 60000);
  const token = sessionStorage.getItem('token');

  try {
    // 1️⃣ Create task
    const res = await fetch(`${process.env.REACT_APP_API_URL}/threeDMaker/remesh`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      
      },
      body: JSON.stringify({ TaskId }),
      signal: controller.signal,
    });

    const response = await res.json();
    const newTaskId = response.data?.result;
    if (!newTaskId) throw new Error("No newTaskId returned");

    // 2️⃣ Poll until finished
    const poll = async () => {
      try {
        const checkRes = await fetch(
          `${process.env.REACT_APP_API_URL}/threeDMaker/remesh/${newTaskId}`,
          { 
            headers: 
            {
              'Authorization': `Bearer ${token}`,
            },
            signal: controller.signal
          }
        );
        const checkData = await checkRes.json();

        setDownloadProgress(checkData.progress || 0);

        if (checkData.status === "SUCCEEDED") {
          triggerDownload(checkData.model_urls?.stl);
          setLoading(false);
          clearTimeout(timeoutId);
        } else if (["FAILED", "CANCELED"].includes(checkData.status)) {
          setError(`Task ${checkData.status}`);
          setLoading(false);
          clearTimeout(timeoutId);
        } else {
          setTimeout(poll, 1000); // re-poll after 1s
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(`Polling error: ${err.message}`);
          setLoading(false);
        }
      }
    };

    poll();
  } catch (error) {
    if (error.name !== "AbortError") {
      setError(`Generation error: ${error.message}`);
    }
    setLoading(false);
    clearTimeout(timeoutId);
  }
};

// Cleanup if component unmounts
useEffect(() => {
  return () => {
    controllerRef.current?.abort();
  };
}, []);

  

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerateMeshy();
    }
  };
  
  return (
    <div className='container'>
      <div className='part1'>
        {(Progress === 100) && 
          (
            <img
              src={ThumbnalMeshy}
              alt="aiThumbnailMaker"
              loading="lazy"
              onLoad={() => setIsImageLoaded(true)}
          />)}
      </div>
      <div>
        <h2>مولد الصور ثلاثية الأبعاد</h2>
        <label htmlFor="details">تفاصيل النموذج</label>
        <textarea
          id="details"
          name="details"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="أكتب التفاصيل الخاصة بك هنا"
          />
        <br />
        {(!isImageLoaded && Progress !== 100 && loading) && (
          <div style={{ marginTop: 20 }}>
            <div style={{ width: "100%", background: "#ddd", height: "5px" }}>
              <div
                style={{
                  width: `${Progress}%`,
                  background: "green",
                  height: "100%",
                  transition: "width 0.3s"
                }}
              />
            </div>
            <p>{Progress}%</p>
          </div>
        )}
        <div className='btns'>
        <button disabled={loading} onClick={handleGenerateMeshy}>البدأ بالعملية</button> 
        <>
      {isImageLoaded && (
        <button
          disabled={loading}
          onClick={GetStlRef}
        >
          {loading ? (
            <>
              تحضير الملف... ({DownloadProgress}%)
              <span className="spinner-small" />
            </>
          ) : (
            "تنزيل (STL)"
          )}
        </button>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
          </div>
        </div>
      </div>
  );
}

export default MeshyGenerator;
