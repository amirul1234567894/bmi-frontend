/**
 * BMI Calculator — Optimized Fast Version
 */

const CONFIG = {
  API_URL: "https://bmi-backend-z10s.onrender.com/calculate",
  API_KEY: 'amirul123',
  N8N_WEBHOOK_URL: 'https://your-n8n-url/webhook/bmi-seo',
};

const isResultPage = document.body.classList.contains('result-page');

if (isResultPage) {
  initResultPage();
} else {
  initCalculatorPage();
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

    if (isNaN(height) || isNaN(weight)) {
      showError("Valid input dao");
      return;
    }

    setLoading(true);

    // 🔥 instant redirect (UX boost)
    window.location.href = `result.html?loading=true&height=${height}&weight=${weight}`;

    try {
      const result = await fetchBMI(height, weight);

      sendToN8N(height, weight, result.bmi);

      const params = new URLSearchParams({
        bmi: result.bmi,
        category: result.category,
        height,
        weight
      });

      window.location.href = `result.html?${params.toString()}`;

    } catch (e) {
      alert("Server slow 😓");
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

  // loading state
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
}

/* ================= N8N ================= */

function sendToN8N(height, weight, bmi) {
  fetch(CONFIG.N8N_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      height,
      weight,
      bmi,
      time: new Date().toISOString()
    })
  }).catch(() => {});
}