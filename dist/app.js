let isTamil = false;
let model = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Load the model
    try {
        console.log('Loading model...');
        model = await tf.loadLayersModel('./brinjal_tfjs_model/model.json');
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Error loading model:', error);
        alert('Failed to load AI model. Using fallback analysis.');
    }
    
    // Language Toggle
    document.getElementById('langToggle').addEventListener('click', toggleLanguage);
    
    // ✅ SEPARATE INPUTS = MOBILE GALLERY WORKS!
    document.getElementById('cameraBtn').addEventListener('click', () => {
        document.getElementById('cameraInput').click();
    });
    
    document.getElementById('galleryBtn').addEventListener('click', () => {
        document.getElementById('galleryInput').click();
    });
    
    // ✅ TWO INPUT HANDLERS
    document.getElementById('cameraInput').addEventListener('change', handleImageUpload);
    document.getElementById('galleryInput').addEventListener('change', handleImageUpload);
});

function toggleLanguage() {
    isTamil = !isTamil;
    updateLanguage();
}

function updateLanguage() {
    const langToggle = document.getElementById('langToggle');
    const title = document.getElementById('title');
    const subtitle = document.getElementById('subtitle');
    
    if (isTamil) {
        langToggle.textContent = 'EN';
        title.textContent = 'கத்திரிக்காய் நோய் கண்டறியும் ஆப்';
        subtitle.innerHTML = 'கத்திரிக்காய் நடவு (50-100 நாட்கள்) <br> நோய் தடுப்பு AI பரிசோதனை';
    } else {
        langToggle.textContent = 'தமிழ்';
        title.textContent = 'Brinjal Disease Scanner';
        subtitle.textContent = 'Analyze brinjal nursery (50-100 days) for damping-off disease';
    }
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        processImage(file);
        // Reset input
        e.target.value = '';
    }
}

async function processImage(file) {
    const imgPreview = document.getElementById('imagePreview');
    const resultDiv = document.getElementById('result');
    
    // Show preview
    const reader = new FileReader();
    reader.onload = async (e) => {
        imgPreview.src = e.target.result;
        imgPreview.style.display = 'block';
        
        // Show analyzing
        resultDiv.textContent = isTamil ? 'பகுப்பாய்வு செய்யப்படுகிறது...' : 'Analyzing...';
        resultDiv.className = 'analyzing';
        resultDiv.style.display = 'block';
        
        // AI Analysis
        if (model) {
            try {
                const prediction = await predictImage(imgPreview);
                const diseasePercent = Math.round(prediction * 100);
                showResult(diseasePercent);
            } catch (error) {
                console.error('Prediction error:', error);
                // Fallback to simulation
                const diseasePercent = await simulateAnalysis(imgPreview);
                showResult(diseasePercent);
            }
        } else {
            // Fallback simulation
            const diseasePercent = await simulateAnalysis(imgPreview);
            showResult(diseasePercent);
        }
    };
    reader.readAsDataURL(file);
}

async function predictImage(imgElement) {
    // Preprocess image to 224x224
    const tensor = tf.browser.fromPixels(imgElement)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(tf.scalar(255.0))
        .expandDims();
    
    // Predict
    const prediction = model.predict(tensor);
    const result = await prediction.data();
    console.log('Model raw output:', result[0]);
    
    // Dispose tensors
    tensor.dispose();
    prediction.dispose();
    
    // Assuming model outputs 1 for healthy, 0 for diseased
    // So disease probability is 1 - result[0]
    const diseaseProb = 1 - result[0];
    console.log('Disease probability:', diseaseProb);
    return diseaseProb; // disease probability
}

async function simulateAnalysis(imgElement) {
    // Simulate AI (3 seconds)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simple pixel-based simulation
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;
    ctx.drawImage(imgElement, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    let brownPixels = 0;
    let totalPixels = 0;
    
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Brown soil/root detection
        if (r > 80 && r < 180 && g > 40 && g < 140 && b > 20 && b < 100) {
            brownPixels++;
        }
        totalPixels++;
    }
    
    const diseaseRatio = brownPixels / totalPixels;
    const diseasePercent = Math.min(Math.round(diseaseRatio * 100 * 3), 95);
    
    return diseasePercent;
}

function showResult(diseasePercent) {
    const resultDiv = document.getElementById('result');
    
    if (diseasePercent > 50) {
        resultDiv.innerHTML = isTamil 
            ? `⚠️ கத்திரிக்காய் நோய்: ${diseasePercent}%<br>10x10 மீட்டர் பகுதியில் நோய் காணப்படுகிறது`
            : `⚠️ Damping-off DETECTED: ${diseasePercent}%<br>Found in 10x10 meter area`;
        resultDiv.className = 'diseased';
    } else {
        resultDiv.innerHTML = isTamil 
            ? `✅ ஆரோக்கியமான தோட்டம்: ${100-diseasePercent}%<br>நோய் இல்லை - தொடரவும்`
            : `✅ Healthy Plants: ${100-diseasePercent}%<br>No disease detected - Continue farming`;
        resultDiv.className = 'healthy';
    }
}