const express = require('express');
const tf = require('@tensorflow/tfjs-node');
const multer = require('multer');

const app = express();
const port = 3000;

// Set storage engine for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to load the model asynchronously
async function loadModel() {
  const modelPath = './final-model/model.json';
  const model = await tf.loadLayersModel(tf.io.fileSystem(modelPath));
  return model;
}

// API endpoint for image prediction
app.post('/predict', upload.single('image'), async (req, res) => {
  try {
    // Load the model
    const model = await loadModel();

    // Convert image buffer to Tensor
    const imageBuffer = req.file.buffer;
    const imageTensor = tf.node.decodeImage(imageBuffer, 3);
    
    const resizedImage = tf.image.resizeBilinear(imageTensor, [224, 224]);

    // Convert to float and add an extra dimension to match the model's input shape
    const processedImage = resizedImage.toFloat().expandDims(0);

    // Make prediction
    const prediction = model.predict(processedImage);
    const result = prediction.dataSync(); // Assuming a single output node

    // Send the result as JSON
    res.json({ prediction: result });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Prediction failed' });
  }
});

// Start the server after loading the model
loadModel().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
