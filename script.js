/**
 * BMI Calculator — Cold Start Fix + Fast Version
 *
 * KEY FIXES:
 * 1. Frontend-এই BMI calculate করে instant result দেখায়
 * 2. Page load হওয়ার সাথেই backend warm-up ping পাঠায়
 * 3. Result page এ broken loading flow ঠিক করা হয়েছে
 */

const CONFIG = {
  API_URL: "https://bmi-backend-z10s.onrender.com/calculate",
  API_KEY: 'amirul123',
  N8N_WEBHOOK_URL: 'https://your-n8n-url/webhook/bmi-seo',
};

// ─── Render cold start fix: page load হওয়ার সাথেই ping করো ───
warmUpBackend();

const isResultPage = document.body.classList.contains('result-page');

if (isResultPage) {
  initResultPage();
} else {
  initCalculatorPage();
}

/* ================= WARM-UP ================= */

/**
 * Render free tier এ server ঘুমিয়ে পড়ে।
 * Page load হওয়া মাত্র একটা GET ping পাঠাই — এতে
 * user এর button click এর আগেই server জেগে ওঠে।
 */
function warmUpBackend() {
  fetch(CONFIG.API_URL.replace("/calculate", "/health")).catch(() => {});
}

/* ================= CALCULATOR PAGE ================= */

function initCalculatorPage() {
  const heightInput = document.getElementById('heightInput');
  const weightInput = document.getElementById('weightInput');
  const calcBtn = document.getElementById('calcBtn');
  const spinner = document.getElementById('spinner');
  const btnText = document.getElementById('btnText');
  const errorBanner = document.getElementById('errorBanner');
  const errorText = document.getElementById('errorText');

  if (!calcBtn) return;

  calcBtn.addEventListener('click', async () => {
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);

    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
      showError("Valid height আর weight দাও");
      return;
    }

    setLoading(true);

    // ─── STEP 1: Frontend-এই BMI হিসাব করো (instant, no wait) ───
    const frontendResult = calculateBMILocally(height, weight);

    // ─── STEP 2: সাথে সাথে result দেখাও, backend এর জন্য wait না করে ───
    const params = new URLSearchParams({
      bmi: frontendResult.bmi,
      category: frontendResult.category,
      height,
      weight
    });
    window.location.href = `result.html?${params.toString()}`;

    // ─── STEP 3: Background এ backend call করো (N8N এর জন্য) ───
    try {
      const result = await fetchBMI(height, weight);
      sendToN8N(height, weight, result.bmi);
    } catch (e) {
      // Silent fail — user already has result, N8N log optional
    }
  });

  function setLoading(v) {
    calcBtn.disabled = v;
    spinner.classList.toggle("visible", v);
    btnText.textContent = v ? "Calculating..." : "Calculate BMI";
  }

  function showError(msg) {
    errorText.textContent = msg;
    errorBanner.hidden = false;
  }
}

/* ================= LOCAL BMI CALCULATION ================= */

/**
 * Backend call ছাড়াই BMI calculate করে।
 * Backend slow বা down হলেও user instantly result পাবে।
 *
 * @param {number} height - সেন্টিমিটারে
 * @param {number} weight - কেজিতে
 */
function calculateBMILocally(height, weight) {
  const heightInMeters = height / 100;
  const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));

  let category;
  if (bmi < 18.5)       category = "Underweight";
  else if (bmi < 25.0)  category = "Normal weight";
  else if (bmi < 30.0)  category = "Overweight";
  else                  category = "Obese";

  return { bmi, category };
}

/* ================= API ================= */

async function fetchBMI(height, weight) {
  const res = await fetch(CONFIG.API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CONFIG.API_KEY
    },
    body: JSON.stringify({ height, weight })
  });

  if (!res.ok) throw new Error("API error");

  return await res.json();
}

/* ================= RESULT PAGE ================= */

function initResultPage() {
  const params = new URLSearchParams(window.location.search);

  const bmi = parseFloat(params.get("bmi"));
  const category = params.get("category");

  const bmiNumber = document.getElementById("bmiNumber");
  const bmiCategory = document.getElementById("bmiCategory");

  // loading=true param আর দরকার নেই (frontend calculation দিয়ে instant result)
  // তবে backward compatibility এর জন্য রাখা হলো
  if (params.get("loading")) {
    bmiNumber.textContent = "...";
    bmiCategory.textContent = "Calculating...";
    return;
  }

  if (isNaN(bmi)) {
    window.location.href = "index.html";
    return;
  }

  bmiNumber.textContent = bmi;
  bmiCategory.textContent = category;

  // BMI category অনুযায়ী color দেখাও (optional enhancement)
  highlightCategory(bmi);
}

/**
 * BMI value অনুযায়ী visual indicator (যদি element থাকে)
 */
function highlightCategory(bmi) {
  const indicator = document.getElementById("bmiIndicator");
  if (!indicator) return;

  let color;
  if (bmi < 18.5)       color = "#3b82f6"; // blue  - underweight
  else if (bmi < 25.0)  color = "#22c55e"; // green - normal
  else if (bmi < 30.0)  color = "#f59e0b"; // amber - overweight
  else                  color = "#ef4444"; // red   - obese

  indicator.style.color = color;
}

/* ================= N8N ================= */

function sendToN8N(height, weight, bmi) {
  fetch(CONFIG.N8N_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ height, weight, bmi, time: new Date().toISOString() })
  }).catch(() => {});
}
