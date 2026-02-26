// --------------------------------------------------------------------------
// App State & Data
// --------------------------------------------------------------------------
let history = JSON.parse(localStorage.getItem('brinjal_history') || '[]');
let plotCount = parseInt(localStorage.getItem('brinjal_plot_count') || '10');
let currentLang = localStorage.getItem('brinjal_lang') || 'en';

const translations = {
    en: {
        nav_home: "Home",
        nav_management: "Management Advice",
        nav_history: "History",
        nav_map: "Field Map",
        nav_finder: "Fertilizer Finder",
        voice_assistant: "Voice Assistant",
        logout: "Logout",
        home_title: "Nursery Management Dashboard",
        home_subtitle: "Industrial performance monitoring for your Brinjal plantation.",
        stat_total: "Total Plots",
        stat_healthy: "Healthy",
        stat_diseased: "Damping-off",
        detection_title: "Disease Detection",
        active_badge: "Live Scanner",
        label_plot: "Target Plot",
        option_select_plot: "Select Plot...",
        btn_choose: "Choose Image",
        btn_analyze: "Analyze Health",
        btn_tell_results: "Tell Analysis Results",
        mgmt_title: "Smart Management Helper",
        mgmt_subtitle: "Expert recommendations based on your soil and crop stage.",
        label_soil: "Soil Composition",
        soil_red: "Red Soil",
        soil_medium: "Medium Loam",
        soil_clay: "Clay Heavy",
        label_stage: "Current Stage",
        stage_nursery: "Nursery",
        stage_veg: "Vegetative",
        stage_flower: "Flowering",
        stage_harvest: "Harvesting",
        btn_generate_advice: "Generate Management Advice",
        btn_tell_advice: "Tell Advice",
        map_title: "Field Layout Map",
        map_subtitle: "Configure your plantation area and monitor plot-wise health status.",
        label_plots_count: "Number of Plots",
        btn_init_field: "Initialize Field",
        legend_healthy: "Healthy",
        legend_diseased: "Diseased",
        legend_none: "Not Scanned",
        history_title: "Scan History",
        history_subtitle: "Timeline of all nursery health diagnostics.",
        btn_clear_history: "Clear All Records",
        th_date: "DateTime",
        th_plot: "Plot ID",
        th_status: "Status",
        th_conf: "Confidence",
        th_diag: "Diagnosis",
        no_history: "No scan records found. Start scanning your plots.",
        finder_title: "Fertilizer Shop Network (TN)",
        finder_subtitle: "Official agricultural input supply network across Tamil Nadu districts.",
        label_district: "Search District",
        option_select_district: "Select District...",
        btn_detect_location: "Auto-Detect",
        btn_tell_shops: "Tell Store Information",
        alert_select_plot: "Select a Plot number first",
        alert_choose_image: "Choose an image to analyze",
        status_healthy: "Healthy",
        status_diseased: "Damping-off",
        analyzing: "Analyzing...",
        connect_error: "Error connecting to AI Server. Ensure it is running.",
        mgmt_rec: "Industrial Management Recommendation:",
        voice_greet: "Welcome to Brinjal Care Pro. I am your assistant. Currently, you have {total} plots. {healthy} are healthy and {diseased} need attention.",
        advice_healthy_high: "Excellent health. Maintain current schedule.",
        advice_healthy_low: "Health looks good. Monitor soil temperature.",
        advice_diseased_critical: "CRITICAL: Severe symptoms. Remove and destroy infected saplings immediately. Drench soil with Copper Oxychloride.",
        advice_diseased_warning: "WARNING: Moderate symptoms. Improve drainage and reduce watering. Spray Captan if spread continues.",
        advice_diseased_monitor: "MONITOR: Early signs detected. Segregate this plot and check for root rot."
    },
    ta: {
        nav_home: "முகப்பு",
        nav_management: "நிர்வாக ஆலோசனை",
        nav_history: "வரலாறு",
        nav_map: "கள வரைபடம்",
        nav_finder: "உரம் கண்டறிதல்",
        voice_assistant: "ஒலி உதவியாளர்",
        logout: "வெளியேறு",
        home_title: "நாற்றங்கால் மேலாண்மை டாஷ்போர்டு",
        home_subtitle: "உங்கள் கத்தரி தோட்டத்திற்கான தொழில்முறை கண்காணிப்பு.",
        stat_total: "மொத்த மனைகள்",
        stat_healthy: "ஆரோக்கியமானது",
        stat_diseased: "வாடல் நோய்",
        detection_title: "நோய் கண்டறிதல்",
        active_badge: "நேரடி ஸ்கேனர்",
        label_plot: "இலக்கு மனை",
        option_select_plot: "மனையைத் தேர்ந்தெடுக்கவும்...",
        btn_choose: "படத்தைத் தேர்வு செய்யவும்",
        btn_analyze: "ஆரோக்கியத்தை ஆய்வு செய்யவும்",
        btn_tell_results: "முடிவுகளைக் கூறவும்",
        mgmt_title: "ஸ்மார்ட் மேலாண்மை உதவியாளர்",
        mgmt_subtitle: "உங்கள் மண் மற்றும் பயிர் நிலையின் அடிப்படையில் நிபுணர் பரிந்துரைகள்.",
        label_soil: "மண் அமைப்பு",
        soil_red: "செம்மண்",
        soil_medium: "நடுத்தர வண்டல் மண்",
        soil_clay: "களிமண்",
        label_stage: "தற்போதைய நிலை",
        stage_nursery: "நாற்றங்கால்",
        stage_veg: "வளர்ச்சி நிலை",
        stage_flower: "பூக்கும் நிலை",
        stage_harvest: "அறுவடை",
        btn_generate_advice: "மேலாண்மை ஆலோசனையை உருவாக்கவும்",
        btn_tell_advice: "ஆலோசனையைக் கூறவும்",
        map_title: "கள வரைபடம்",
        map_subtitle: "உங்கள் தோட்டப் பகுதியை அமைத்து மனைகளின் நிலையை கண்காணிக்கவும்.",
        label_plots_count: "மனைகளின் எண்ணிக்கை",
        btn_init_field: "களத்தைத் தொடங்கவும்",
        legend_healthy: "ஆரோக்கியமானது",
        legend_diseased: "நோய் பாதிப்பு",
        legend_none: "ஸ்கேன் செய்யப்படவில்லை",
        history_title: "ஸ்கேன் வரலாறு",
        history_subtitle: "அனைத்து நாற்றங்கால் சுகாதார ஆய்வுகளின் காலவரிசை.",
        btn_clear_history: "அனைத்து பதிவுகளையும் அழி",
        th_date: "தேதி மற்றும் நேரம்",
        th_plot: "மனை ஐடி",
        th_status: "நிலை",
        th_conf: "நம்பிக்கை",
        th_diag: "நோய் கண்டறிதல்",
        no_history: "ஸ்கேன் பதிவுகள் எதுவும் இல்லை. உங்கள் மனைகளை ஸ்கேன் செய்யத் தொடங்குங்கள்.",
        finder_title: "உரம் கடை நெட்வொர்க் (தமிழ்நாடு)",
        finder_subtitle: "தமிழ்நாடு மாவட்டங்கள் முழுவதும் அதிகாரப்பூர்வ வேளாண் கடை நெட்வொர்க்.",
        label_district: "மாவட்டத்தைத் தேடுங்கள்",
        option_select_district: "மாவட்டத்தைத் தேர்ந்தெடுக்கவும்...",
        btn_detect_location: "தானாகக் கண்டறி",
        btn_tell_shops: "கடை தகவலைக் கூறவும்",
        alert_select_plot: "முதலில் மனை எண்ணைத் தேர்ந்தெடுக்கவும்",
        alert_choose_image: "ஆய்வு செய்ய ஒரு படத்தைத் தேர்வு செய்யவும்",
        status_healthy: "ஆரோக்கியமானது",
        status_diseased: "வாடல் நோய்",
        analyzing: "ஆய்வு செய்யப்படுகிறது...",
        connect_error: "AI சர்வருடன் இணைப்பதில் பிழை. அது இயங்குவதை உறுதி செய்யவும்.",
        mgmt_rec: "தொழில்முறை மேலாண்மை பரிந்துரை:",
        voice_greet: "விவசாயி நண்பரே, வருக! நான் உங்கள் உதவியாளர். தற்போது {total} மனைகள் உள்ளன. {healthy} ஆரோக்கியமாக உள்ளன, {diseased} மனைகளுக்கு கவனம் தேவை.",
        advice_healthy_high: "மிகச்சிறந்த ஆரோக்கியம். தற்போதைய பராமரிப்பைத் தொடரவும்.",
        advice_healthy_low: "ஆரோக்கியம் நன்றாக உள்ளது. மண்ணின் வெப்பநிலையை கண்காணிக்கவும்.",
        advice_diseased_critical: "மிகவும் முக்கியமானது: கடுமையான அறிகுறிகள். பாதிக்கப்பட்ட நாற்றுகளை உடனடியாக அகற்றி அழிக்கவும். காப்பர் ஆக்ஸிகுளோரைடு கரைசலை மண்ணில் ஊற்றவும்.",
        advice_diseased_warning: "எச்சரிக்கை: மிதமான அறிகுறிகள். வடிகால் வசதியை மேம்படுத்தி நீர் பாய்ச்சுவதைக் குறைக்கவும். தேவைப்பட்டால் மருந்துகளைத் தெளிக்கவும்.",
        advice_diseased_monitor: "கண்காணிக்கவும்: ஆரம்ப கால அறிகுறிகள் கண்டறியப்பட்டுள்ளன. இந்த மனையைத் தனிமைப்படுத்தி வேர் அழுகல் உள்ளதா என்று பார்க்கவும்."
    }
};

const districts = [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
    "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur",
    "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris",
    "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga",
    "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
    "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
    "Viluppuram", "Virudhunagar"
];

const shopData = {
    'Coimbatore': [
        { name: 'Sri Venkateswara Fertilizers', addr: 'Gandhipuram, Coimbatore', phone: '9876543210' },
        { name: 'Kongu Agro Centre', addr: 'Pollachi, Coimbatore', phone: '9842154270' }
    ],
    'Madurai': [
        { name: 'Meenakshi Agriculture', addr: 'Simmakkal, Madurai', phone: '9000123456' },
        { name: 'Pandyan Agro', addr: 'Melur, Madurai', phone: '9123456789' }
    ],
    'Salem': [
        { name: 'Salem Agri Inputs', addr: 'Attur, Salem', phone: '8754091851' }
    ],
    'Chennai': [
        { name: 'National Agro Chemicals', addr: 'Parrys, Chennai', phone: '044-25381234' }
    ]
};

const adviceData = {
    'Nursery': {
        'Red': { en: 'Basal: 25t/ha FYM + 50:50:30 kg/ha NPK. Water every 2 days. Maintain 60% soil moisture.', ta: 'அடிப்படை: ஒரு எக்டேருக்கு 25 டன் தொழுஉரம் + 50:50:30 கிகி NPK. 2 நாட்களுக்கு ஒருமுறை தண்ணீர் பாய்ச்சவும். 60% ஈரப்பதத்தை பராமரிக்கவும்.' },
        'Medium': { en: 'Basal: 25t/ha FYM + NPK 50:50:30. Split application of Nitrogen at Day 15.', ta: 'அடிப்படை: எக்டேருக்கு 25 டன் தொழுஉரம் + NPK 50:50:30. 15-வது நாளில் தழைச்சத்தை பிரித்து இடவும்.' },
        'Clay': { en: 'Use raised beds for drainage. Split NPK 50:50:30 basal. Avoid water stagnation.', ta: 'மேட்டுப்பாத்தி அமைத்து வடிகால் வசதி செய்யவும். NPK உரத்தை பிரித்து இடவும். தண்ணீர் தேங்குவதைத் தவிர்க்கவும்.' }
    },
    'Vegetative': {
        'Red': { en: 'Top dress 100kg N/ha at Day 30. Weekly irrigation. Monitor for shoot borer.', ta: '30-வது நாளில் எக்டேருக்கு 100 கிலோ தழைச்சத்தை மேலுரமாக இடவும். வாராந்திர பாசனம் செய்யவும். தண்டுத் துளைப்பானைக் கண்காணிக்கவும்.' },
        'Medium': { en: 'Hybrid: NPK 100:150:100 basal + 100kg N at Day 30. Earthing up required.', ta: 'வீரிய ஒட்டு: NPK 100:150:100 அடிப்படை + 30-ம் நாளில் 100 கிலோ தழைச்சத்து. மண் அணைத்தல் அவசியம்.' },
        'Clay': { en: 'Maintain drainage. Apply NPK in split doses. Use liquid fertilizers for better absorption.', ta: 'வடிகால் வசதியைப் பராமரிக்கவும். NPK உரங்களை பிரித்து இடவும். சிறந்த உறிஞ்சுதலுக்கு திரவ உரங்களைப் பயன்படுத்தவும்.' }
    }
};

// --------------------------------------------------------------------------
// Initialization
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initPlots();
    initImageUpload();
    initAdviceSystem();
    initFertilizerFinder();
    renderHistory();
    updateStats();
    initLanguage();
    initVoiceAssistant();
});

function initLanguage() {
    const btns = document.querySelectorAll('.lang-btn');
    btns.forEach(btn => {
        if (btn.getAttribute('data-lang') === currentLang) btn.classList.add('active');
        else btn.classList.remove('active');

        btn.addEventListener('click', () => {
            currentLang = btn.getAttribute('data-lang');
            localStorage.setItem('brinjal_lang', currentLang);
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyLanguage();
            // Re-render components that depend on text
            initPlots();
            renderHistory();
            initFertilizerFinder();
        });
    });
    applyLanguage();
}

function applyLanguage() {
    const els = document.querySelectorAll('[data-i18n]');
    els.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
}

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const screenId = item.getAttribute('data-screen');
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(screenId).classList.add('active');
        });
    });
}

function initVoiceAssistant() {
    const btn = document.getElementById('voiceAssistantBtn');
    btn.onclick = () => {
        const stats = getStats();
        let greeting = translations[currentLang].voice_greet
            .replace('{total}', stats.total)
            .replace('{healthy}', stats.healthy)
            .replace('{diseased}', stats.diseased);
        speak(greeting);
    };
}

// --------------------------------------------------------------------------
// Plot Management
// --------------------------------------------------------------------------
function initPlots() {
    const plotSelect = document.getElementById('plotSelect');
    const fieldMap = document.getElementById('fieldMapWrapper');
    const plotInput = document.getElementById('plotCountInput');
    const setupBtn = document.getElementById('setupPlotsBtn');

    plotInput.value = plotCount;
    const selectLabel = translations[currentLang].option_select_plot;

    const render = () => {
        plotSelect.innerHTML = `<option value="">${selectLabel}</option>`;
        fieldMap.innerHTML = '';

        const plotStatusMap = {};
        history.forEach(item => {
            if (!plotStatusMap[item.plotId]) plotStatusMap[item.plotId] = item.statusEn; // use English status for logic
        });

        for (let i = 1; i <= plotCount; i++) {
            const pid = `P${i}`;
            const opt = document.createElement('option');
            opt.value = pid;
            opt.textContent = `Plot ${i}`;
            plotSelect.appendChild(opt);

            const box = document.createElement('div');
            box.className = `plot-box ${plotStatusMap[pid] === 'Healthy' ? 'plot-healthy' : (plotStatusMap[pid] === 'Damping-off' ? 'plot-diseased' : '')}`;
            box.textContent = pid;
            box.onclick = () => {
                document.querySelectorAll('.nav-item[data-screen="home-screen"]')[0].click();
                plotSelect.value = pid;
            };
            fieldMap.appendChild(box);
        }
    };

    setupBtn.onclick = () => {
        const val = parseInt(plotInput.value);
        if (val > 0 && val <= 100) {
            plotCount = val;
            localStorage.setItem('brinjal_plot_count', plotCount);
            render();
            updateStats();
        }
    };

    render();
}

// --------------------------------------------------------------------------
// Prediction & History
// --------------------------------------------------------------------------
function initImageUpload() {
    const input = document.getElementById('imageInput');
    const preview = document.getElementById('imagePreview');
    const predictBtn = document.getElementById('predictBtn');
    const plotSelect = document.getElementById('plotSelect');

    document.getElementById('chooseBtn').onclick = () => input.click();

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (re) => preview.src = re.target.result;
            reader.readAsDataURL(file);
        }
    };

    predictBtn.onclick = async () => {
        const plotId = plotSelect.value;
        if (!plotId) return alert(translations[currentLang].alert_select_plot);
        if (!input.files[0]) return alert(translations[currentLang].alert_choose_image);

        const resultBox = document.getElementById('predictResult');
        resultBox.style.display = 'block';
        resultBox.innerHTML = `<div style="display: flex; align-items: center; gap: 10px;">${translations[currentLang].analyzing} <div class="spinner"></div></div>`;
        resultBox.className = 'result-box';

        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const response = await fetch('/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: reader.result })
                });
                const data = await response.json();

                const isHealthy = data.is_healthy;
                const conf = data.confidence;

                // Use currentLang to pull correct translation
                const lang = currentLang;
                const statusStr = isHealthy ? translations[lang].status_healthy : translations[lang].status_diseased;
                const statusEn = isHealthy ? 'Healthy' : 'Damping-off';

                let adviceText = "";
                if (!isHealthy) {
                    if (conf > 80) adviceText = translations[lang].advice_diseased_critical;
                    else if (conf > 50) adviceText = translations[lang].advice_diseased_warning;
                    else adviceText = translations[lang].advice_diseased_monitor;
                } else {
                    adviceText = conf > 90 ? translations[lang].advice_healthy_high : translations[lang].advice_healthy_low;
                }

                resultBox.innerHTML = `
                    <div style="font-size: 18px; font-weight: 800; margin-bottom: 8px;">${isHealthy ? '✅' : '⚠️'} ${statusStr} (${conf.toFixed(1)}%)</div>
                    <p style="font-size: 13px; opacity: 0.9;">${adviceText}</p>
                `;
                resultBox.className = `result-box ${isHealthy ? 'result-success' : 'result-error'}`;

                const tellBtn = document.getElementById('tellPredictBtn');
                tellBtn.style.display = 'block';

                // Bilingual voice message
                const speakMsg = lang === 'ta'
                    ? `${statusStr}. ${conf.toFixed(0)} சதவீத நம்பிக்கை. ${adviceText}`
                    : `${statusStr} detected with ${conf.toFixed(0)} percent confidence. ${adviceText}`;

                tellBtn.onclick = () => speak(speakMsg);

                saveScan(plotId, statusStr, statusEn, conf, adviceText);
            } catch (e) {
                resultBox.innerHTML = translations[currentLang].connect_error;
                resultBox.className = 'result-box result-error';
            }
        };
        reader.readAsDataURL(input.files[0]);
    };
}

function saveScan(plotId, status, statusEn, confidence, advice) {
    const entry = {
        date: new Date().toLocaleString(),
        plotId,
        status,
        statusEn,
        confidence: confidence.toFixed(1) + '%',
        advice
    };
    history.unshift(entry);
    if (history.length > 100) history.pop();
    localStorage.setItem('brinjal_history', JSON.stringify(history));

    renderHistory();
    updateStats();
    initPlots();
}

function renderHistory() {
    const list = document.getElementById('historyList');
    const msg = document.getElementById('noHistoryMsg');
    list.innerHTML = '';

    if (history.length === 0) {
        msg.style.display = 'block';
        return;
    }
    msg.style.display = 'none';

    history.forEach(item => {
        const tr = document.createElement('tr');
        const isHealthy = item.statusEn === 'Healthy';
        tr.innerHTML = `
            <td>${item.date}</td>
            <td><strong>${item.plotId}</strong></td>
            <td><span class="status-chip ${isHealthy ? 'status-healthy' : 'status-diseased'}">${item.status}</span></td>
            <td>${item.confidence}</td>
            <td style="font-size: 12px; color: var(--secondary-color);">${item.advice}</td>
        `;
        list.appendChild(tr);
    });
}

function getStats() {
    const plotStatusMap = {};
    history.forEach(item => {
        if (!plotStatusMap[item.plotId]) plotStatusMap[item.plotId] = item.statusEn;
    });
    const healthyCount = Object.values(plotStatusMap).filter(v => v === 'Healthy').length;
    const diseasedCount = Object.values(plotStatusMap).filter(v => v === 'Damping-off').length;
    return { total: plotCount, healthy: healthyCount, diseased: diseasedCount };
}

function updateStats() {
    const stats = getStats();
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-healthy').textContent = stats.healthy;
    document.getElementById('stat-diseased').textContent = stats.diseased;
}

// --------------------------------------------------------------------------
// Fertilizer Finder
// --------------------------------------------------------------------------
function initFertilizerFinder() {
    const districtSelect = document.getElementById('districtSelect');
    const shopList = document.getElementById('shopList');
    const selectLabel = translations[currentLang].option_select_district;

    districtSelect.innerHTML = `<option value="">${selectLabel}</option>`;
    districts.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = d;
        districtSelect.appendChild(opt);
    });

    const update = () => {
        const d = districtSelect.value;
        const shops = shopData[d] || [];
        if (!d) return shopList.innerHTML = '';

        if (shops.length === 0) {
            shopList.innerHTML = `<div style="grid-column: 1/-1; padding: 20px; text-align: center; color: var(--text-muted);">No official shops registered for ${d} yet.</div>`;
            return;
        }

        shopList.innerHTML = '';
        shops.forEach(s => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.padding = '16px';
            card.innerHTML = `
                <div style="font-weight: 700;">${s.name}</div>
                <div style="font-size: 12px; color: var(--text-muted); margin: 4px 0;">${s.addr}</div>
                <div style="color: var(--primary-color);">📞 ${s.phone}</div>
            `;
            shopList.appendChild(card);
        });

        document.getElementById('tellShopsBtn').onclick = () => {
            let msg = currentLang === 'en' ? `Found ${shops.length} shops in ${d}.` : `${d} மாவட்டத்தில் ${shops.length} கடைகள் உள்ளன.`;
            shops.forEach(s => msg += ` ${s.name}.`);
            speak(msg);
        };
    };

    districtSelect.onchange = update;
}

// --------------------------------------------------------------------------
// Advice & Voice
// --------------------------------------------------------------------------
function initAdviceSystem() {
    document.getElementById('getAdviceBtn').onclick = () => {
        const stage = document.getElementById('cropStage').value;
        const soil = document.getElementById('soilType').value;
        const advice = adviceData[stage]?.[soil]?.[currentLang] || (currentLang === 'en' ? "Maintain regular moisture." : "தவறாமல் நீர் பாய்ச்சவும்.");

        const box = document.getElementById('adviceResult');
        box.innerHTML = `<strong>${translations[currentLang].mgmt_rec}</strong><br>${advice}`;
        box.style.display = 'block';
        box.className = 'result-box result-success';

        const tellBtn = document.getElementById('tellAdviceBtn');
        tellBtn.style.display = 'block';
        tellBtn.onclick = () => speak(advice);
    };
}

function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    // Prefer Google Tamil or any Tamil voice if TA, else English
    const targetLang = currentLang === 'ta' ? 'ta' : 'en';
    let voice = voices.find(v => v.lang.toLowerCase().includes(targetLang));

    // Specific check for Google Tamil which is usually the best on Android/Chrome
    if (currentLang === 'ta') {
        const googleTamil = voices.find(v => v.name.includes('Google') && v.lang.startsWith('ta'));
        if (googleTamil) voice = googleTamil;
    }

    if (voice) utterance.voice = voice;
    else utterance.lang = currentLang === 'ta' ? 'ta-IN' : 'en-US';

    window.speechSynthesis.speak(utterance);
}
