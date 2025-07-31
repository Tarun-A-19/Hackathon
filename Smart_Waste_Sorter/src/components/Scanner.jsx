import React, { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';
import ResultCard from './ResultCard';

// Style objects for inline CSS
const styles = {
  scannerContainer: { textAlign: 'center' },
  buttonContainer: { display: 'flex', justifyContent: 'center', gap: '1rem', margin: '1rem 0' },
  button: {
    padding: '0.8rem 1.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: '#61dafb',
    border: 'none',
    borderRadius: '5px',
    color: '#282c34',
    fontWeight: 'bold',
  },
  webcamContainer: { marginTop: '1rem', position: 'relative', display: 'inline-block' },
  previewImage: { maxWidth: '100%', maxHeight: '250px', marginTop: '1rem', borderRadius: '8px', border: '3px solid #61dafb' },
  loader: { marginTop: '1rem', fontSize: '1.2rem' },
};

// Maps keywords from the AI model to the categories in your database
const categoryMapping = {
  'bottle': 'Plastic',
  'banana': 'Organic',
  'apple': 'Organic',
  'computer': 'E-Waste',
  'keyboard': 'E-Waste',
  'mouse': 'E-Waste',
  'cellular telephone': 'E-Waste',
  'cellphone': 'E-Waste',
  'envelope': 'Paper',
  'carton': 'Paper'
};

const Scanner = () => {
  const [allItems, setAllItems] = useState([]);
  const [scanResult, setScanResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [mode, setMode] = useState('options');
  const [model, setModel] = useState(null);

  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  // Load AI Model on component mount
  useEffect(() => {
    const loadModel = async () => {
      setLoadingMessage('Loading AI Model...');
      try {
        const loadedModel = await mobilenet.load();
        setModel(loadedModel);
        setLoadingMessage('');
      } catch (error) {
        console.error("Error loading model:", error);
        setLoadingMessage('Failed to load AI Model.');
      }
    };
    loadModel();
  }, []);

  // Fetch your custom disposal tips from your backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/waste');
        const data = await response.json();
        setAllItems(data);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };
    fetchItems();
  }, []);

  // REAL AI Analysis Function
  const analyzeImage = async () => {
    if (!model || !imageRef.current) return;

    setIsLoading(true);
    setLoadingMessage('🧠 Analyzing Image...');
    setScanResult(null);

    try {
      const predictions = await model.classify(imageRef.current);
      console.log('AI Predictions:', predictions);

      if (predictions && predictions.length > 0) {
        for (const prediction of predictions) {
          const keywords = prediction.className.split(', ');
          for (const keyword of keywords) {
            if (categoryMapping[keyword.toLowerCase()]) {
              const matchedCategory = categoryMapping[keyword.toLowerCase()];
              const resultData = allItems.find(item => item.category === matchedCategory);
              if (resultData) {
                setScanResult(resultData);
                setIsLoading(false);
                setLoadingMessage('');
                return;
              }
            }
          }
        }
      }
      setScanResult({ category: 'Uncategorized', disposalTips: 'Could not categorize this item. Please check local regulations for disposal.' });
    } catch (error) {
      console.error("Error during analysis:", error);
      setScanResult({ category: 'Error', disposalTips: 'An error occurred during image analysis.' });
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // Run analysis automatically when a new image is set
  useEffect(() => {
    if (imagePreview && model) {
      analyzeImage();
    }
  }, [imagePreview, model]);

  // Handlers for Webcam and File Upload
  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImagePreview(imageSrc);
    setMode('options');
  }, [webcamRef]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };
  
  const triggerFileUpload = () => fileInputRef.current.click();

  const handleBack = () => {
    setImagePreview(null);
    setScanResult(null);
    setMode('options');
  };

  return (
    <div style={styles.scannerContainer}>
      <h2>Smart Waste Scanner</h2>
      
      {loadingMessage && !isLoading && <p>{loadingMessage}</p>}
      
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }}/>
      
      {imagePreview && <img ref={imageRef} src={imagePreview} alt="Scan preview" style={styles.previewImage} crossOrigin="anonymous" />}
      
      {mode === 'webcam' && (
        <div style={styles.webcamContainer}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={400}
            videoConstraints={{ facingMode: "environment" }}
            screenshotCanvasProps={{
              crossOrigin: "anonymous",
              width: 400,
              height: 300
            }}
          />
          <div style={styles.buttonContainer}>
            <button onClick={handleCapture} style={styles.button}>Capture Photo</button>
            <button onClick={() => setMode('options')} style={{ ...styles.button, backgroundColor: '#555', color: 'white' }}>Cancel</button>
          </div>
        </div>
      )}
      
      {!imagePreview && mode === 'options' && (
        <div style={styles.buttonContainer}>
          <button onClick={() => setMode('webcam')} style={styles.button} disabled={!model}>📷 Use Camera</button>
          <button onClick={triggerFileUpload} style={styles.button} disabled={!model}>📄 Upload File</button>
        </div>
      )}
      
      {imagePreview && (
         <div style={styles.buttonContainer}>
            <button onClick={handleBack} style={{...styles.button, backgroundColor: '#f44336'}}>Scan Another</button>
         </div>
      )}
      
      {isLoading && <div style={styles.loader}>{loadingMessage}</div>}
      {scanResult && <ResultCard data={scanResult} />}
    </div>
  );
};

export default Scanner;