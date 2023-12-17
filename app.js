const express = require('express');
const tf = require('@tensorflow/tfjs-node');
const multer = require('multer');
const classMapping = require('./pkg/constants')
const classifyRepository = require('./src/classifyrepository')

const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function loadModel() {
  const modelPath = './final-model/model.json';
  const model = await tf.loadLayersModel(tf.io.fileSystem(modelPath));
  return model;
}

app.post('/predict', upload.single('image'), async (req, res) => {
  try {
    const model = await loadModel();

    const imageBuffer = req.file.buffer;
    const imageTensor = tf.node.decodeImage(imageBuffer, 3);
    
    const resizedImage = tf.image.resizeBilinear(imageTensor, [224, 224]);

    const processedImage = resizedImage.toFloat().expandDims(0);

    const prediction = model.predict(processedImage);
    const result = prediction.dataSync();


    const highest = Math.max(...result)
    const classPos = result.indexOf(highest)

    const currentDate = new Date();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; 
    const currentDay = currentDate.getDate();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const currentSecond = currentDate.getSeconds();

    const date = currentYear + "-" + currentMonth + "-" + currentDay + " " + currentHour + ":" + currentMinute + ":" + currentSecond


    classifyRepository.insertData(classMapping, classPos, highest, date)
    res.json(
        {
            code: 200,
            data: {
                className: classMapping[classPos],
                confidence: highest,
                date: date
            }
        }
    ).status(200)
    
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Prediction failed' });
  }
});

loadModel().then(() => {
  app.listen(port, () => {
    console.log(`INFO Server is running on http://localhost:${port}`);
  });
});
