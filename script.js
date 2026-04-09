/**
<<<<<<< HEAD
 * BMI Calculator — Frontend JavaScript (Updated for Amirul)
=======
 * BMI Calculator — Frontend JavaScript
 * ─────────────────────────────────────────────────────────────
 * SECURITY NOTE (Important to understand):
 *
 * You CANNOT hide frontend JS or API keys from browser DevTools.
 * Anyone opening "Inspect → Sources" will see this entire file.
 *
 * Therefore:
 *  - The x-api-key below is a CLIENT-SIDE key only. It should be:
 *    (a) a low-privilege key scoped only to /calculate
 *    (b) stored in an environment variable injected at build time
 *        (e.g. by Vercel), NOT hard-coded in production
 *  - Real security lives on the BACKEND:
 *    • API key validation happens server-side
 *    • Rate limiting is enforced server-side
 *    • Input validation is done server-side
 *    • Secrets (database passwords, AI keys) NEVER touch the frontend
 *
 * The frontend is a convenience layer; the backend is the trust boundary.
 * ─────────────────────────────────────────────────────────────
>>>>>>> 87b7c72a907a49781e548c1e14a3bf8bd0010eff
 */

// ── CONFIGURATION ─────────────────────────────────────────────
const CONFIG = {
<<<<<<< HEAD
  // Backend URL with /calculate endpoint added
  API_URL: "https://bmi-backend-z10s.onrender.com/calculate",

  // Your Secret API Key from Render Environment Variables
  API_KEY: 'amirul123',

  // Optional: n8n webhook for logging (currently placeholder)
=======
  // Replace with your actual Render backend URL after deployment
  API_URL: "https://bmi-backend-z10s.onrender.com",

  // In production: inject via build process or environment variable.
  // This key is visible to users — that is expected and acceptable.
  // The backend ALSO validates and rate-limits this key.
  API_KEY: 'YOUR_SECRET_API_KEY',

  // Optional: n8n webhook for logging (can be left empty to skip)
>>>>>>> 87b7c72a907a49781e548c1e14a3bf8bd0010eff
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

<<<<<<< HEAD
  if (!calcBtn) return;

=======
  if (!calcBtn) return; // safety guard

  // Allow Enter key to trigger calculation
>>>>>>> 87b7c72a907a49781e548c1e14a3bf8bd0010eff
  [heightInput, weightInput].forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') calcBtn.click();
    });
<<<<<<< HEAD
=======
    // Clear error styling on user input
>>>>>>> 87b7c72a907a49781e548c1e14a3bf8bd0010eff
    input.addEventListener('input', () => {
      input.classList.remove('input-error');
      hideError();
    });
  });

  calcBtn.addEventListener('click', handleCalculate);

<<<<<<< HEAD
=======
  /**
   * Main handler: validates → shows spinner → calls API → redirects
   */
>>>>>>> 87b7c72a907a49781e548c1e14a3bf8bd0010eff
  async function handleCalculate() {
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);

<<<<<<< HEAD
    const validationError = validateInputs(height, weight);
    if (validationError) {
      showError(validationError);
      return;
    }

=======
    // ── CLIENT-SIDE VALIDATION ───────────────────────────────
    // Note: backend validates too. This is UX, not security.
    const validationError = validateInputs(height, weight);
    if (validationError) {
      showError(validationError);
      if (isNaN(height) || height < 50 || height > 300) {
        heightInput.classList.add('input-error');
        heightInput.focus();
      }
      if (isNaN(weight) || weight < 10 || weight > 300) {
        weightInput.classList.add('input-error');
      }
      return;
    }

    // ── SHOW LOADING STATE ───────────────────────────────────
>>>>>>> 87b7c72a907a49781e548c1e14a3bf8bd0010eff
    setLoading(true);
    hideError();

    try {
<<<<<<< HEAD
      // API CALL
      const result = await fetchBMI(height, weight);

      // Redirect to result.html
=======
      // ── API CALL ─────────────────────────────────────────
      const result = await fetchBMI(height, weight);

      // ── OPTIONAL: Log to n8n ─────────────────────────────
      if (CONFIG.N8N_WEBHOOK_URL && CONFIG.N8N_WEBHOOK_URL !== 'https://your-n8n-url/webhook/bmi-log') {
        sendToN8n(height, weight, result.bmi, result.category).catch(() => {
          // Silent fail — analytics should never block UX
        });
      }

      // ── REDIRECT to result.html with query params ─────────
>>>>>>> 87b7c72a907a49781e548c1e14a3bf8bd0010eff
      const params = new URLSearchParams({
        bmi:      result.bmi,
        category: result.category,
        height:   height,
        weight:   weight,
      });
      window.location.href = `result.html?${params.toString()}`;

    } catch (err) {
<<<<<<< HEAD
=======
      // Show user-friendly error — NEVER expose raw error details
>>>>>>> 87b7c72a907a49781e548c1e14a3bf8bd0010eff
      showError(getUserFriendlyError(err));
      setLoading(false);
    }
  }

<<<<<<< HEAD
  function validateInputs(height, weight) {
    if (isNaN(height) || height < 50 || height > 300) return 'Valid height (50-300cm) dorkar.';
    if (isNaN(weight) || weight < 10 || weight > 300) return 'Valid weight (10-300kg) dorkar.';
    return null;
  }

=======
  /**
   * Validates height and weight inputs on the client side.
   * @returns {string|null} error message, or null if valid
   */
  function validateInputs(height, weight) {
    if (isNaN(height) || heightInput.value.trim() === '') {
      return 'Please enter your height in centimetres.';
    }
    if (height < 50 || height > 300) {
      return `Height must be between 50 and 300 cm. You entered: ${height}`;
    }
    if (isNaN(weight) || weightInput.value.trim() === '') {
      return 'Please enter your weight in kilograms.';
    }
    if (weight < 10 || weight > 300) {
      return `Weight must be between 10 and 300 kg. You entered: ${weight}`;
    }
    return null; // all good
  }

  /**
   * Toggles button loading state + spinner visibility.
   */
>>>>>>> 87b7c72a907a49781e548c1e14a3bf8bd0010eff
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
<<<<<<< HEAD
=======
    errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
>>>>>>> 87b7c72a907a49781e548c1e14a3bf8bd0010eff
  }

  function hideError() {
    errorBanner.hidden = true;
  }
}

// ════════════════════════════════════════════════════════════════
<<<<<<< HEAD
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
=======
//  API CALL
// ════════════════════════════════════════════════════════════════

/**
 * Calls the backend API to calculate BMI.
 *
 * Security notes:
 *  - x-api-key header is added for backend key validation
 *  - Content-Type is explicit to prevent MIME sniffing issues
 *  - We catch both network errors and bad HTTP status codes
 */
async function fetchBMI(height, weight) {
  const controller = new AbortController();
  const timeout    = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(CONFIG.API_URL, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key':    CONFIG.API_KEY,          // backend auth key
      },
      body:   JSON.stringify({ height, weight }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      // Parse structured error from backend if available
      let errMsg = `Server error (${response.status})`;
      try {
        const errData = await response.json();
        // errData.detail comes from FastAPI validation errors
        if (errData.detail) {
          errMsg = Array.isArray(errData.detail)
            ? errData.detail.map(e => e.msg).join(', ')
            : String(errData.detail);
        }
      } catch (_) { /* ignore parse errors */ }
      const error = new Error(errMsg);
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    return data; // { bmi: number, category: string }

  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

/**
 * Returns a human-friendly error message.
 * NEVER expose stack traces, server internals, or raw error objects to users.
 */
function getUserFriendlyError(err) {
  if (err.name === 'AbortError') {
    return 'Request timed out. Please check your connection and try again.';
  }
  if (err.status === 401 || err.status === 403) {
    return 'Authentication error. Please refresh the page and try again.';
  }
  if (err.status === 429) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  if (err.status >= 500) {
    return 'The server encountered an error. Please try again shortly.';
  }
  if (!navigator.onLine) {
    return 'You appear to be offline. Please check your internet connection.';
  }
  // Show backend validation messages if they exist
  if (err.message && !err.message.startsWith('Server error')) {
    return err.message;
  }
  return 'Something went wrong. Please try again.';
}

// ════════════════════════════════════════════════════════════════
//  N8N WEBHOOK LOGGING (fire-and-forget)
// ════════════════════════════════════════════════════════════════

/**
 * Sends BMI calculation data to n8n webhook for logging/automation.
 * Fails silently — analytics must never block the user journey.
 */
async function sendToN8n(height, weight, bmi, category) {
  await fetch(CONFIG.N8N_WEBHOOK_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      height,
      weight,
      bmi,
      category,
      timestamp: new Date().toISOString(),
    }),
  });
}

// ════════════════════════════════════════════════════════════════
//  RESULT PAGE  (result.html)
// ════════════════════════════════════════════════════════════════

function initResultPage() {
  // Read URL parameters — data was passed by index.html redirect
  const params   = new URLSearchParams(window.location.search);
  const bmi      = parseFloat(params.get('bmi'));
  const category = params.get('category') || 'Unknown';
  const height   = parseFloat(params.get('height'));
  const weight   = parseFloat(params.get('weight'));

  // If no valid BMI in URL, redirect back to calculator
  if (isNaN(bmi) || bmi <= 0) {
>>>>>>> 87b7c72a907a49781e548c1e14a3bf8bd0010eff
    window.location.href = 'index.html';
    return;
  }

<<<<<<< HEAD
  const bmiNumber = document.getElementById('bmiNumber');
  const bmiCategory = document.getElementById('bmiCategory');
  
  if (bmiNumber) bmiNumber.textContent = bmi;
  if (bmiCategory) bmiCategory.textContent = category;
}
=======
  displayResult(bmi, category, height, weight);
  renderTips(category);
  setupDownloadButton(bmi, category, height, weight);
}

/**
 * Renders the BMI number, category, gauge, and health message.
 */
function displayResult(bmi, category, height, weight) {
  const bmiNumber   = document.getElementById('bmiNumber');
  const bmiCategory = document.getElementById('bmiCategory');
  const catIcon     = document.getElementById('categoryIcon');
  const resultCard  = document.getElementById('resultCard');
  const healthMsg   = document.getElementById('healthMessage');
  const gaugeFill   = document.getElementById('gaugeFill');
  const gaugeNeedle = document.getElementById('gaugeNeedle');

  if (!bmiNumber) return;

  // Map category string to CSS class key
  const catKey = getCategoryKey(category);
  resultCard.classList.add(`cat-${catKey}`);

  // Animate BMI number counting up
  animateCounter(bmiNumber, 0, bmi, 900);

  bmiCategory.textContent = category;
  catIcon.textContent     = getCategoryIcon(catKey);
  healthMsg.textContent   = getHealthMessage(catKey, bmi);

  // Gauge: BMI scale from 10 to 40+ (capped at 40 for display)
  // Map bmi value to a percentage across [10, 40]
  const GAUGE_MIN = 10;
  const GAUGE_MAX = 40;
  const clampedBMI = Math.min(Math.max(bmi, GAUGE_MIN), GAUGE_MAX);
  const pct        = ((clampedBMI - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN)) * 100;

  // Small delay so transition animation plays
  setTimeout(() => {
    gaugeFill.style.width = `${pct}%`;
    gaugeNeedle.style.left = `${pct}%`;
  }, 200);

  // Update page title for accessibility
  document.title = `BMI ${bmi} – ${category} | Free BMI Calculator`;
}

/**
 * Renders contextual health tips based on BMI category.
 */
function renderTips(category) {
  const grid    = document.getElementById('tipsGrid');
  if (!grid) return;

  const catKey = getCategoryKey(category);

  const allTips = {
    underweight: [
      { icon: '🥗', title: 'Increase Caloric Intake', text: 'Focus on nutrient-dense foods: nuts, whole grains, lean proteins, and healthy fats.' },
      { icon: '💪', title: 'Strength Training', text: 'Light resistance exercise can help build healthy muscle mass alongside increased nutrition.' },
      { icon: '🩺', title: 'Consult a Professional', text: 'A doctor or dietitian can assess whether an underlying cause needs attention.' },
    ],
    normal: [
      { icon: '✅', title: 'Maintain Your Balance', text: 'You\'re in a healthy range. Focus on variety, regular exercise, and adequate sleep.' },
      { icon: '🏃', title: 'Stay Active', text: '150 minutes of moderate-intensity exercise per week supports long-term health.' },
      { icon: '🔁', title: 'Regular Check-ins', text: 'Recalculate your BMI every few months to monitor any gradual changes.' },
    ],
    overweight: [
      { icon: '🚶', title: 'Increase Daily Movement', text: 'Even 30 minutes of brisk walking daily can make a meaningful difference over time.' },
      { icon: '🥦', title: 'Review Your Diet', text: 'Consider reducing processed foods, sugary drinks, and increasing fibre intake.' },
      { icon: '💤', title: 'Prioritise Sleep', text: 'Poor sleep is linked to weight gain. Aim for 7–9 hours of quality sleep per night.' },
    ],
    obese: [
      { icon: '🩺', title: 'Speak to Your Doctor', text: 'A GP can assess your overall health and refer you to appropriate support services.' },
      { icon: '📋', title: 'Set Small Goals', text: 'Losing even 5–10% of body weight can significantly reduce health risk.' },
      { icon: '🧠', title: 'Consider Support', text: 'Structured programmes like NHS Weight Management offer evidence-based help.' },
    ],
  };

  const tips = allTips[catKey] || allTips.normal;
  grid.innerHTML = tips.map(t => `
    <div class="tip-card">
      <div class="tip-icon">${t.icon}</div>
      <h3>${t.title}</h3>
      <p>${t.text}</p>
    </div>
  `).join('');
}

/**
 * Sets up the "Download Result" button to save a plain text file.
 */
function setupDownloadButton(bmi, category, height, weight) {
  const btn = document.getElementById('downloadBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const content = `BMI RESULT
══════════════════════════════
Date:     ${new Date().toLocaleDateString('en-GB', { dateStyle: 'long' })}
Time:     ${new Date().toLocaleTimeString()}

Height:   ${height} cm
Weight:   ${weight} kg
BMI:      ${bmi}
Category: ${category}

══════════════════════════════
CATEGORY REFERENCE
  Underweight: < 18.5
  Normal:      18.5 – 24.9
  Overweight:  25 – 29.9
  Obese:       ≥ 30
══════════════════════════════

This result is for informational purposes only.
Consult a healthcare professional for personalised advice.

Generated by BMICalc — https://your-domain.com
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `bmi-result-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

// ════════════════════════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════════════════════════

function getCategoryKey(category) {
  const c = (category || '').toLowerCase();
  if (c.includes('under'))  return 'underweight';
  if (c.includes('normal')) return 'normal';
  if (c.includes('over'))   return 'overweight';
  if (c.includes('obese'))  return 'obese';
  return 'normal';
}

function getCategoryIcon(catKey) {
  const icons = {
    underweight: '↓',
    normal:      '✓',
    overweight:  '↑',
    obese:       '⚠',
  };
  return icons[catKey] || '○';
}

function getHealthMessage(catKey, bmi) {
  const messages = {
    underweight: `Your BMI of ${bmi} falls in the underweight range. This may indicate insufficient caloric intake or an underlying health condition. Consider speaking with a healthcare professional.`,
    normal:      `Your BMI of ${bmi} is within the healthy range. Well done! Maintain your current habits — balanced nutrition and regular activity are key to staying here.`,
    overweight:  `Your BMI of ${bmi} is in the overweight range. Small, consistent lifestyle changes — more movement and mindful eating — can bring your BMI back to the healthy zone.`,
    obese:       `Your BMI of ${bmi} is in the obese range. This is associated with increased health risks. Speaking with a GP is a positive first step toward personalised support.`,
  };
  return messages[catKey] || `Your BMI is ${bmi}.`;
}

/**
 * Animates a number counting from `start` to `end` over `duration` ms.
 */
function animateCounter(element, start, end, duration) {
  const startTime = performance.now();
  const range     = end - start;

  function step(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = (start + range * eased).toFixed(1);

    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = end; // ensure exact final value
    }
  }

  requestAnimationFrame(step);
}
>>>>>>> 87b7c72a907a49781e548c1e14a3bf8bd0010eff
