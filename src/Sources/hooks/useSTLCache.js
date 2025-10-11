// useSTLCache.js
import { useState, useEffect } from 'react';
import { openDB } from 'idb';

// --- IndexedDB setup ---
async function getDB() {
  return openDB('stl-cache', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files');
      }
    },
  });
}

// Save file by key (like file name or ID)
async function saveFile(file, key) {
  const db = await getDB();
  await db.put('files', file, key);
}

// Get file by key
async function getFile(key) {
  if (!key) {
    console.warn("❌ No key specified for getFile()");
    return null;
  }
  const db = await getDB();
  return db.get('files', key);
}

// Delete one file
async function deleteFile(key) {
  const db = await getDB();
  await db.delete('files', key);
}

// Clear all
async function clearCache() {
  const db = await getDB();
  await db.clear('files');
}

export function useSTLCache() {
  const [cachedFile, setCachedFile] = useState(null);
  const [cachedMeta, setCachedMeta] = useState(null);

  useEffect(() => {
    (async () => {
      const meta = localStorage.getItem('stlMeta');
      if (!meta || meta === 'undefined' || meta === 'null') return; // ✅ extra safety
  
      let parsed;
      try {
        parsed = JSON.parse(meta);
      } catch (err) {
        console.warn("Invalid stlMeta JSON, clearing it...");
        localStorage.removeItem('stlMeta');
        return;
      }
  
      const fileKey = parsed?.fileName || 'uploadedFile';
      const file = await getFile(fileKey);
  
      if (file) {
        const blob = file instanceof Blob ? file : new Blob([file]);
        setCachedFile(blob);
        setCachedMeta(parsed);
      }
  
      console.log(fileKey);
    })();
  }, []);
  

const saveToCache = async (file, meta) => {
    if (!file) return console.warn("No file to cache");
    await saveFile(file, file.name);
    console.log(file.name)
    localStorage.setItem(`stlMeta_${file.name}`, JSON.stringify(meta));
    setCachedFile(file);
    setCachedMeta(meta);
    await updateMeta(file, meta)
  };


  async function saveFileToIndexedDB(name, file) {
    const db = await openDB('stl-cache', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files');
        }
      },
    });
    await db.put('files', file, name);
  }


  const updateMeta = async (file , meta) => {
    localStorage.setItem('stlMeta', JSON.stringify(meta));
    setCachedMeta(meta);
    if (file) setCachedFile(file);
  };

  const clearAll = async () => {
    await clearCache();
    localStorage.removeItem('stlMeta');
    setCachedFile(null);
    setCachedMeta(null);
  };

  return { cachedFile, cachedMeta, saveToCache, updateMeta, clearAll };
}
