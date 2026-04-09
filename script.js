/**
 * BMI Calculator — Frontend JavaScript (Clean Version)
 */

// ── CONFIGURATION ─────────────────────────────────────────────
const CONFIG = {
  API_URL: "https://bmi-backend-z10s.onrender.com/calculate",
  API_KEY: 'amirul123',
  N8N_WEBHOOK_URL: 'https://your-n8n-url/webhook/bmi-log',
};

// ── DETERMINE CURRENT PAGE ─────────────────────────────────────
const isResultPage = document.body.classList.contains('result-page');

if (isResultPage) {
  initResultPage();
} else {
  initCalculatorPage();
}

// ════════════════════════════════════════════════════════════════
//  CALCULATOR PAGE  (index.html)
// ════════════════════════════════════════════════════════════════

function initCalculatorPage() {
  const heightInput = document.getElementById('heightInput');
  const weightInput = document.getElementById('weightInput');
  const calcBtn     = document.getElementById('calcBtn');
  const spinner     = document.getElementById('spinner');
  const btnText     = document.getElementById('btnText');
  const errorBanner = document.getElementById('errorBanner');
  const errorText   = document.getElementById('errorText');

  if (!calcBtn) return;

  [heightInput, weightInput].forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') calcBtn.click();
    });
    input.addEventListener('input', () => {
      input.classList.remove('input-error');
      hideError();
    });
  });

  calcBtn.addEventListener('click', handleCalculate);

  async function handleCalculate() {
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);

    const validationError = validateInputs(height, weight);
    if (validationError) {
      showError(validationError);
      return;
    }

    setLoading(true);
    hideError();

    try {
      const result = await fetchBMI(height, weight);

      const params = new URLSearchParams({
        bmi:      result.bmi,
        category: result.category,
        height:   height,
        weight:   weight,
      });
      window.location.href = `result.html?${params.toString()}`;

    } catch (err) {
      showError(getUserFriendlyError(err));
      setLoading(false);
    }
  }

  function validateInputs(height, weight) {
    if (isNaN(height) || height < 50 || height > 300) return 'Valid height (50-300cm) dorkar.';
    if (isNaN(weight) || weight < 10 || weight > 300) return 'Valid weight (10-300kg) dorkar.';
    return null;
  }

  function setLoading(isLoading) {
    calcBtn.disabled = isLoading;
    if (isLoading) {
      spinner.classList.add('visible');
      btnText.textContent = 'Calculating…';
    } else {
      spinner.classList.remove('visible');
      btnText.textContent = 'Calculate BMI';
    }
  }

  function showError(message) {
    errorText.textContent = message;
    errorBanner.hidden = false;
  }

  function hideError() {
    errorBanner.hidden = true;
  }
}

// ════════════════════════════════════════════════════════════════
//  API CALL (The Logic Core)
// ════════════════════════════════════════════════════════════════

async function fetchBMI(height, weight) {
  const response = await fetch(CONFIG.API_URL, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key':    CONFIG.API_KEY,
    },
    body: JSON.stringify({ height, weight }),
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.detail || 'Server error');
  }

  return await response.json();
}

function getUserFriendlyError(err) {
  if (err.message.includes('403')) return 'Invalid API Key! Render check koro.';
  if (err.message.includes('429')) return 'Too many requests. Ektu opekkha koro.';
  return 'Opps! Backend connect hochhe na. Render ki Live?';
}

// ════════════════════════════════════════════════════════════════
//  RESULT PAGE LOGIC
// ════════════════════════════════════════════════════════════════

function initResultPage() {
  const params   = new URLSearchParams(window.location.search);
  const bmi      = parseFloat(params.get('bmi'));
  const category = params.get('category') || 'Unknown';
  
  if (isNaN(bmi)) {
    window.location.href = 'index.html';
    return;
  }

  const bmiNumber = document.getElementById('bmiNumber');
  const bmiCategory = document.getElementById('bmiCategory');
  
  if (bmiNumber) bmiNumber.textContent = bmi;
  if (bmiCategory) bmiCategory.textContent = category;
}