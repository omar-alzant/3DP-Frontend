/**
 * STL File Validation Utility
 * Provides comprehensive validation for both ASCII and Binary STL files
 */

/**
 * Validates an STL file from a URL
 * @param {string} stlFileUrl - URL to the STL file
 * @returns {Promise<Object>} Validation result with isValid, format, facetCount, and error properties
 */
export const validateSTLFile = async (stlFileUrl) => {
  if (!stlFileUrl) return { isValid: false, error: 'No file URL provided' };
  
  try {
    // Fetch the STL file content
    const response = await fetch(stlFileUrl);
    if (!response.ok) {
      return { isValid: false, error: 'Failed to fetch STL file' };
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Check if it's a binary STL file (first 80 bytes should not be ASCII text)
    const header = uint8Array.slice(0, 80);
    const headerText = new TextDecoder().decode(header);
    
    // Check for ASCII STL format (starts with "solid")
    if (headerText.trim().toLowerCase().startsWith('solid')) {
      return validateASCIISTL(uint8Array);
    } else {
      return validateBinarySTL(uint8Array);
    }
  } catch (error) {
    return { isValid: false, error: `Validation error: ${error.message}` };
  }
};

/**
 * Validates an ASCII STL file
 * @param {Uint8Array} uint8Array - File content as Uint8Array
 * @returns {Object} Validation result
 */
const validateASCIISTL = (uint8Array) => {
  const text = new TextDecoder().decode(uint8Array);
  const lines = text.split('\n');
  
  // Check for required STL keywords
  const hasSolid = lines.some(line => line.trim().toLowerCase().startsWith('solid'));
  const hasFacet = lines.some(line => line.trim().toLowerCase().startsWith('facet'));
  const hasVertex = lines.some(line => line.trim().toLowerCase().startsWith('vertex'));
  const hasEndloop = lines.some(line => line.trim().toLowerCase().startsWith('endloop'));
  const hasEndfacet = lines.some(line => line.trim().toLowerCase().startsWith('endfacet'));
  const hasEndsolid = lines.some(line => line.trim().toLowerCase().startsWith('endsolid'));
  
  if (!hasSolid || !hasFacet || !hasVertex || !hasEndloop || !hasEndfacet || !hasEndsolid) {
    return { isValid: false, error: 'Invalid ASCII STL format - missing required keywords' };
  }
  
  // Count facets to ensure there's actual geometry
  const facetCount = lines.filter(line => line.trim().toLowerCase().startsWith('facet')).length;
  if (facetCount === 0) {
    return { isValid: false, error: 'STL file contains no facets' };
  }
  
  // Validate vertex coordinates
  const vertexLines = lines.filter(line => line.trim().toLowerCase().startsWith('vertex'));
  for (const vertexLine of vertexLines) {
    const coords = vertexLine.trim().split(/\s+/).slice(1);
    if (coords.length !== 3) {
      return { isValid: false, error: 'Invalid vertex format in ASCII STL' };
    }
    
    // Check if coordinates are valid numbers
    for (const coord of coords) {
      if (isNaN(parseFloat(coord))) {
        return { isValid: false, error: 'Invalid vertex coordinates in ASCII STL' };
      }
    }
  }
  
  return { isValid: true, format: 'ASCII', facetCount };
};

/**
 * Validates a Binary STL file
 * @param {Uint8Array} uint8Array - File content as Uint8Array
 * @returns {Object} Validation result
 */
const validateBinarySTL = (uint8Array) => {
  if (uint8Array.length < 84) {
    return { isValid: false, error: 'Binary STL file too small' };
  }
  
  // Binary STL format: 80-byte header + 4-byte triangle count + triangles
  const triangleCount = new DataView(uint8Array.buffer, 80, 4).getUint32(0, true);
  
  // Each triangle is 50 bytes (12 floats for vertices + 3 floats for normal + 2 bytes attribute)
  const expectedSize = 84 + (triangleCount * 50);
  
  if (uint8Array.length !== expectedSize) {
    return { isValid: false, error: `Binary STL size mismatch. Expected ${expectedSize} bytes, got ${uint8Array.length}` };
  }
  
  if (triangleCount === 0) {
    return { isValid: false, error: 'Binary STL file contains no triangles' };
  }
  
  // Validate triangle data structure
  try {
    for (let i = 0; i < triangleCount; i++) {
      const offset = 84 + (i * 50);
      
      // Check if we have enough bytes for this triangle
      if (offset + 50 > uint8Array.length) {
        return { isValid: false, error: 'Binary STL file truncated' };
      }
      
      // Validate normal vector (3 floats)
      // const normalX = new DataView(uint8Array.buffer, offset, 4).getFloat32(0, true);
      // const normalY = new DataView(uint8Array.buffer, offset + 4, 4).getFloat32(0, true);
      // const normalZ = new DataView(uint8Array.buffer, offset + 8, 4).getFloat32(0, true);
      
      // Validate vertices (9 floats)
      for (let j = 0; j < 9; j++) {
        const vertexOffset = offset + 12 + (j * 4);
        const vertex = new DataView(uint8Array.buffer, vertexOffset, 4).getFloat32(0, true);
        if (isNaN(vertex)) {
          return { isValid: false, error: 'Invalid vertex data in binary STL' };
        }
      }
    }
  } catch (error) {
    return { isValid: false, error: 'Error parsing binary STL data' };
  }
  
  return { isValid: true, format: 'Binary', facetCount: triangleCount };
};

/**
 * Validates an STL file from a File object (for file uploads)
 * @param {File} file - File object from input
 * @returns {Promise<Object>} Validation result
 */
export const validateSTLFileFromFile = async (file) => {
  if (!file) return { isValid: false, error: 'No file provided' };

  const ext = file.name.toLowerCase();
  if (!(ext.endsWith('.stl'))) {
    return { isValid: false, error: 'File must have .stl extension' };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    if (ext.endsWith('.obj')) {
      // Basic OBJ check: should contain "v " or "f " lines
      const text = new TextDecoder().decode(uint8Array);
      if (/\nv\s+/.test(text) || /\nf\s+/.test(text)) {
        return { isValid: true, type: 'obj' };
      }
      return { isValid: false, error: 'Invalid OBJ file format' };
    }

    // STL check
    const header = new TextDecoder().decode(uint8Array.slice(0, 80));
    const solidHeader = header.trim().toLowerCase().startsWith("solid");

    if (solidHeader) {
      // Try ASCII first
      const asciiResult = validateASCIISTL(uint8Array);
      if (asciiResult.isValid) return { ...asciiResult, type: 'stl-ascii' };

      // Fallback to binary if ASCII failed
      const binaryResult = validateBinarySTL(uint8Array);
      if (binaryResult.isValid) return { ...binaryResult, type: 'stl-binary' };

      return { isValid: false, error: 'Not a valid STL (ASCII or Binary)' };
    } else {
      return { ...validateBinarySTL(uint8Array), type: 'stl-binary' };
    }
  } catch (error) {
    return { isValid: false, error: `Validation error: ${error.message}` };
  }
};

/**
 * Gets basic STL file information
 * @param {string} stlFileUrl - URL to the STL file
 * @returns {Promise<Object>} File information including format, facetCount, and fileSize
 */
export const getSTLFileInfo = async (stlFileUrl) => {
  const validation = await validateSTLFile(stlFileUrl);
  if (!validation.isValid) {
    return validation;
  }
  
  try {
    const response = await fetch(stlFileUrl);
    const contentLength = response.headers.get('content-length');
    
    return {
      ...validation,
      fileSize: contentLength ? parseInt(contentLength) : 'Unknown',
      fileName: stlFileUrl.split('/').pop() || 'Unknown'
    };
  } catch (error) {
    return { ...validation, fileSize: 'Unknown', fileName: 'Unknown' };
  }
};
