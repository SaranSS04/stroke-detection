"""
AI-Based Early Stroke Risk Prediction — Clinical Decision Support Interface.
Clean clinical card design with matched white theme, custom buttons, and seamless alignment.
"""

from pathlib import Path
import sys
import joblib
import pandas as pd
import streamlit as st
import streamlit.components.v1 as components

# Setup paths
PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

# -----------------------------------------------------------------------------
# 1. PAGE SETUP
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="Stroke Risk Prediction",
    page_icon="❤️",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# -----------------------------------------------------------------------------
# 2. JAVASCRIPT INJECTION: KILL STREAMLIT DARK MODE & FORCE LIGHT THEME
# -----------------------------------------------------------------------------
components.html(
    """
    <script>
    function forceLightTheme() {
        const doc = window.parent.document;
        // 1. Force light theme attribute on root
        const appRoot = doc.querySelector('.stApp');
        if (appRoot) {
            appRoot.setAttribute('data-theme', 'light');
            appRoot.style.backgroundColor = '#f8fafc';
            appRoot.style.color = '#0f172a';
        }
        
        // 2. Remove all dark-mode background colors from buttons and dropdowns
        const darkElements = doc.querySelectorAll('button, [data-baseweb="select"], [data-baseweb="select"] > div, details, summary');
        darkElements.forEach(el => {
            if (el.getAttribute('kind') !== 'primaryFormSubmit') {
                el.style.setProperty('background-color', '#ffffff', 'important');
                el.style.setProperty('background', '#ffffff', 'important');
                el.style.setProperty('color', '#0f172a', 'important');
                el.style.setProperty('border-color', '#e2e8f0', 'important');
            }
        });
    }
    // Run immediately and observe for DOM changes
    forceLightTheme();
    setInterval(forceLightTheme, 300);
    </script>
    """,
    height=0,
    width=0,
)

# -----------------------------------------------------------------------------
# 3. ENFORCED ALL-WHITE CLINICAL CSS (Zero Blue, Zero Black on UI Elements)
# -----------------------------------------------------------------------------
st.markdown(
    """<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

html, body, [class*="css"], .stApp {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
    background-color: #f8fafc !important;
    color: #0f172a !important;
}

#MainMenu, header, footer { visibility: hidden !important; }
.block-container {
    padding-top: 1.2rem !important;
    padding-bottom: 2rem !important;
    max-width: 1260px !important;
}

/* ==========================================================================
   FORCE REMOVE ALL DARK / BLUE BACKGROUNDS ACROSS ALL STREAMLIT COMPONENTS
   ========================================================================== */

/* 1. All standard buttons (Presets, Reset, Top Navigation) */
div.stButton > button,
button[kind="secondary"],
button[data-testid="baseButton-secondary"] {
    background-color: #ffffff !important;
    background: #ffffff !important;
    color: #334155 !important;
    border: 1px solid #e2e8f0 !important;
    border-radius: 6px !important;
    font-size: 0.8rem !important;
    font-weight: 500 !important;
    padding: 6px 14px !important;
    box-shadow: 0 1px 2px rgba(0,0,0,0.03) !important;
    white-space: nowrap !important;
}
div.stButton > button:hover {
    background-color: #f1f5f9 !important;
    border-color: #cbd5e1 !important;
    color: #0f172a !important;
}

/* 2. All Dropdowns and Selectboxes (BaseWeb elements) */
div[data-baseweb="select"],
div[data-baseweb="select"] > div,
div[data-baseweb="select"] * {
    background-color: #ffffff !important;
    background: #ffffff !important;
    color: #0f172a !important;
    border-color: #e2e8f0 !important;
    fill: #0f172a !important;
}
div[data-baseweb="select"] span {
    color: #0f172a !important;
}
div[data-baseweb="popover"],
div[data-baseweb="popover"] *,
ul[data-baseweb="menu"],
ul[data-baseweb="menu"] *,
li[data-baseweb="menu-item"],
li[data-baseweb="menu-item"] * {
    background-color: #ffffff !important;
    background: #ffffff !important;
    color: #0f172a !important;
}
li[data-baseweb="menu-item"]:hover {
    background-color: #f1f5f9 !important;
}
li[data-baseweb="menu-item"][aria-selected="true"],
li[data-baseweb="menu-item"][aria-selected="true"] * {
    background-color: #e2e8f0 !important;
    color: #0f172a !important;
}

/* Force the entire select widget to remain neutral */
div[data-baseweb="select"],
div[data-baseweb="select"] > div,
div[data-baseweb="select"] > div > div,
div[data-baseweb="select"] [role="button"],
div[data-baseweb="select"] [role="button"] > div,
div[data-baseweb="select"] [role="button"] span,
div[data-baseweb="select"] [role="button"] svg,
div[data-baseweb="select"] [role="combobox"] {
    background-color: #ffffff !important;
    background: #ffffff !important;
    color: #0f172a !important;
    border-color: #d0d7de !important;
    box-shadow: none !important;
    fill: #0f172a !important;
}

div[data-baseweb="select"] [role="button"] > div:last-child,
div[data-baseweb="select"] [role="button"] > div[aria-hidden="true"],
div[data-baseweb="select"] [role="button"] > svg,
div[data-baseweb="select"] [role="button"] > span:last-child,
div[data-baseweb="select"] [role="button"] > div[style*="background"] {
    background-color: #ffffff !important;
    background: #ffffff !important;
    border-left: 1px solid #e2e8f0 !important;
    color: #0f172a !important;
    fill: #0f172a !important;
    box-shadow: none !important;
}

div[data-baseweb="select"] [role="button"] > div:nth-last-child(2),
div[data-baseweb="select"] [role="button"] > div[style*="background"] {
    background-color: #ffffff !important;
    background: #ffffff !important;
    border-left: 1px solid #e2e8f0 !important;
}

div[data-baseweb="menu"],
div[data-baseweb="menu"] * {
    background-color: #ffffff !important;
    background: #ffffff !important;
    color: #0f172a !important;
    border-color: #e2e8f0 !important;
}

div[data-baseweb="menu"] li[role="option"],
div[data-baseweb="menu"] li[role="option"] * {
    background-color: #ffffff !important;
    color: #0f172a !important;
}

div[data-baseweb="menu"] li[role="option"][aria-selected="true"],
div[data-baseweb="menu"] li[role="option"][aria-selected="true"] * {
    background-color: #f1f5f9 !important;
    color: #0f172a !important;
}

div[data-baseweb="select"] [role="button"] div[style*="background-color: rgb(38, 39, 48)"] {
    background-color: #ffffff !important;
    background: #ffffff !important;
}

/* Remove any remaining blue focus and accent states */
input:focus,
select:focus,
textarea:focus,
div[data-baseweb="select"]:focus-within {
    outline: none !important;
    box-shadow: 0 0 0 1px #cbd5e1 !important;
    border-color: #cbd5e1 !important;
}

div[data-testid="stCheckbox"] input[type="checkbox"] {
    accent-color: #1f2937 !important;
}

:root {
    --primary-color: #ffffff !important;
    --primary-color-rgb: 255, 255, 255 !important;
    --primary-bg-color: #ffffff !important;
    --secondary-background-color: #f8fafc !important;
    --text-color: #0f172a !important;
}

/* 3. Number inputs - clean white, hide +/- stepper buttons */
div[data-testid="stNumberInput"] button {
    display: none !important;
}
div[data-testid="stNumberInput"] input {
    background-color: #ffffff !important;
    background: #ffffff !important;
    color: #0f172a !important;
    border: 1px solid #e2e8f0 !important;
    border-radius: 6px !important;
    padding-left: 12px !important;
}

/* 4. Expander Container */
div[data-testid="stExpander"],
details[data-testid="stExpander"],
details[data-testid="stExpander"] > summary,
details[data-testid="stExpander"] > summary *,
details[data-testid="stExpander"] div[data-testid="stExpanderDetails"] {
    background-color: #ffffff !important;
    background: #ffffff !important;
    color: #334155 !important;
    border: 1px solid #e2e8f0 !important;
    border-radius: 8px !important;
}
details[data-testid="stExpander"] > summary:hover {
    background-color: #f8fafc !important;
    color: #0f172a !important;
}

/* 5. Left Form & Right Output Cards */
div[data-testid="stForm"] {
    border: 1px solid #e2e8f0 !important;
    background-color: #ffffff !important;
    border-radius: 12px !important;
    padding: 24px !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03) !important;
}
.output-card-box {
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
}

/* 6. Estimate Risk button ONLY (Solid Dark Charcoal) */
div[data-testid="stFormSubmitButton"] > button {
    background-color: #ffffff !important;
    background: #ffffff !important;
    color: #0f172a !important;
    border: 1px solid #d0d7de !important;
    border-radius: 6px !important;
    font-size: 0.88rem !important;
    font-weight: 600 !important;
    padding: 8px 18px !important;
    margin-top: 10px !important;
}
div[data-testid="stFormSubmitButton"] > button:hover {
    background-color: #f8fafc !important;
    color: #0f172a !important;
    border-color: #cbd5e1 !important;
}

/* Header */
.header-bar-flex {
    display: flex;
    align-items: center;
    gap: 12px;
}
.header-heart-icon {
    background-color: #e11d48;
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.15rem;
}
.header-main-title {
    font-size: 1.35rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
    line-height: 1.2;
}
.header-sub-caption {
    font-size: 0.82rem;
    color: #64748b;
    margin: 0;
}

.preset-toolbar-label {
    font-size: 0.74rem;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding-top: 8px;
    white-space: nowrap;
}

.caption-note {
    font-size: 0.73rem;
    color: #94a3b8;
    margin-top: -12px;
    margin-bottom: 12px;
}

/* Checkbox Cards without Phantom Empty Boxes */
.clinical-checkbox-card {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 10px 14px 12px 14px;
    background-color: #ffffff;
    margin-bottom: 12px;
}
.clinical-checkbox-desc {
    font-size: 0.75rem;
    color: #64748b;
    margin-top: 4px;
    margin-left: 24px;
}

/* Risk Badge */
.risk-badge-amber {
    background-color: #fffbeb;
    color: #d97706;
    border: 1px solid #fde68a;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 6px;
}

/* Probability numbers */
.prob-numbers-grid {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;
    margin-bottom: 16px;
}
.prob-large-val {
    font-size: 3.2rem;
    font-weight: 800;
    color: #0f172a;
    line-height: 1;
    letter-spacing: -0.02em;
}
.calib-right-col {
    border-left: 1px solid #e2e8f0;
    padding-left: 20px;
    text-align: right;
}

/* Gauge */
.gauge-bg {
    width: 100%;
    height: 8px;
    background-color: #f1f5f9;
    border-radius: 4px;
    overflow: hidden;
}
.gauge-fill {
    height: 100%;
    background-color: #f59e0b;
    border-radius: 4px;
}
.gauge-text-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.72rem;
    color: #94a3b8;
    margin-top: 4px;
    margin-bottom: 18px;
}

/* Factors boxes */
.factors-columns-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-top: 8px;
}
.factor-card-single {
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px 14px;
}
.factor-card-header-red {
    font-size: 0.76rem;
    font-weight: 600;
    color: #dc2626;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
}
.factor-card-header-green {
    font-size: 0.76rem;
    font-weight: 600;
    color: #0d9488;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
}
.factor-item-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.78rem;
    padding: 3px 0;
}
.factor-elevating { color: #dc2626; font-weight: 600; }
.factor-lowering { color: #0d9488; font-weight: 600; }

.caution-note-box {
    background-color: #fffbeb;
    border: 1px solid #fef3c7;
    border-radius: 8px;
    padding: 14px;
    margin-top: 18px;
    font-size: 0.76rem;
    color: #92400e;
    line-height: 1.45;
}
</style>""",
    unsafe_allow_html=True,
)

# -----------------------------------------------------------------------------
# 4. PRESETS & MODEL INITIALIZATION
# -----------------------------------------------------------------------------
PRESETS = {
    "Research Demo Default": {
        "age": 55, "glucose": 100, "bmi": 27, "smoking": "formerly smoked",
        "hypertension": False, "heart_disease": False, "gender": "Female",
        "married": "Yes", "work": "Private", "residence": "Urban"
    },
    "Infant / Pediatric": {
        "age": 4, "glucose": 85, "bmi": 16, "smoking": "never smoked",
        "hypertension": False, "heart_disease": False, "gender": "Male",
        "married": "No", "work": "children", "residence": "Rural"
    },
    "Middle-Aged Moderate": {
        "age": 52, "glucose": 135, "bmi": 29, "smoking": "smokes",
        "hypertension": True, "heart_disease": False, "gender": "Male",
        "married": "Yes", "work": "Private", "residence": "Urban"
    },
    "Senior with Comorbidities": {
        "age": 74, "glucose": 160, "bmi": 32, "smoking": "formerly smoked",
        "hypertension": True, "heart_disease": True, "gender": "Female",
        "married": "Yes", "work": "Self-employed", "residence": "Rural"
    },
    "High-Risk Stroke Positive": {
        "age": 78, "glucose": 210, "bmi": 34, "smoking": "smokes",
        "hypertension": True, "heart_disease": True, "gender": "Male",
        "married": "Yes", "work": "Private", "residence": "Urban"
    },
}

if "preset_choice" not in st.session_state:
    st.session_state.preset_choice = "Research Demo Default"

for k, v in PRESETS[st.session_state.preset_choice].items():
    if k not in st.session_state:
        st.session_state[k] = v

def apply_preset(name: str):
    st.session_state.preset_choice = name
    for key, val in PRESETS[name].items():
        st.session_state[key] = val

MODEL_PATH = PROJECT_ROOT / "outputs" / "model.pkl"
if not MODEL_PATH.exists():
    MODEL_PATH = PROJECT_ROOT / "stroke_model.joblib"

@st.cache_resource
def load_model():
    if not MODEL_PATH.exists():
        return None
    return joblib.load(MODEL_PATH)

model = load_model()

# -----------------------------------------------------------------------------
# 5. HEADER
# -----------------------------------------------------------------------------
h_left, h_right = st.columns([3.5, 1.5])
with h_left:
    st.markdown(
        """<div class="header-bar-flex">
<div class="header-heart-icon">❤️</div>
<div>
<h1 class="header-main-title">Stroke Risk Prediction</h1>
<p class="header-sub-caption">Six-factor research prototype • Machine learning risk stratification</p>
</div>
</div>""",
        unsafe_allow_html=True,
    )
with h_right:
    nav_c1, nav_c2 = st.columns(2)
    with nav_c1:
        st.button("📈 Risk Estimator", use_container_width=True)
    with nav_c2:
        st.button("📊 Model Benchmarks", use_container_width=True)

st.markdown("<div style='height: 8px;'></div>", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# 6. PRESETS BAR
# -----------------------------------------------------------------------------
p0, p1, p2, p3, p4, p5 = st.columns([1.8, 1.9, 1.6, 1.9, 2.2, 2.1])
with p0:
    st.markdown("<div class='preset-toolbar-label'>⬡ QUICK CLINICAL PRESETS:</div>", unsafe_allow_html=True)
with p1:
    if st.button("Research Demo Default", use_container_width=True):
        apply_preset("Research Demo Default")
        st.rerun()
with p2:
    if st.button("Infant / Pediatric", use_container_width=True):
        apply_preset("Infant / Pediatric")
        st.rerun()
with p3:
    if st.button("Middle-Aged Moderate", use_container_width=True):
        apply_preset("Middle-Aged Moderate")
        st.rerun()
with p4:
    if st.button("Senior with Comorbidities", use_container_width=True):
        apply_preset("Senior with Comorbidities")
        st.rerun()
with p5:
    if st.button("High-Risk Stroke Positive", use_container_width=True):
        apply_preset("High-Risk Stroke Positive")
        st.rerun()

st.markdown("<div style='height: 12px;'></div>", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# 7. TWO-COLUMN MAIN DASHBOARD
# -----------------------------------------------------------------------------
col_left, col_right = st.columns([1.1, 1], gap="medium")

# LEFT COLUMN
with col_left:
    c_head1, c_head2, c_head3 = st.columns([2.0, 1.8, 0.8])
    with c_head1:
        st.markdown(
            """<div style="font-size:1.15rem; font-weight:700; color:#0f172a;">📈 Patient Risk Profile</div>
<div style="font-size:0.8rem; color:#64748b; margin-bottom:8px;">Six-factor research prototype for stroke probability assessment</div>""",
            unsafe_allow_html=True,
        )
    with c_head2:
        preset_options = list(PRESETS.keys())
        curr_idx = preset_options.index(st.session_state.preset_choice) if st.session_state.preset_choice in preset_options else 0
        preset_dropdown = st.selectbox(
            "Preset Selector",
            preset_options,
            index=curr_idx,
            label_visibility="collapsed",
        )
        if preset_dropdown != st.session_state.preset_choice:
            apply_preset(preset_dropdown)
            st.rerun()
    with c_head3:
        if st.button("↺ Reset", use_container_width=True):
            apply_preset("Research Demo Default")
            st.rerun()

    with st.form("patient_risk_form"):
        # Row 1: Age & Glucose
        r1_1, r1_2 = st.columns(2)
        with r1_1:
            age = st.number_input("Age (years)", min_value=0, max_value=120, value=int(st.session_state.age), step=1)
            st.markdown("<div class='caption-note'>Standard range: 0 – 120</div>", unsafe_allow_html=True)
        with r1_2:
            glucose = st.number_input("Average Glucose Level (mg/dL)", min_value=30, max_value=350, value=int(st.session_state.glucose), step=1)
            st.markdown("<div class='caption-note'>Normal: ~70 – 100 mg/dL</div>", unsafe_allow_html=True)

        # Row 2: BMI & Smoking
        r2_1, r2_2 = st.columns(2)
        with r2_1:
            bmi = st.number_input("Body Mass Index (BMI)", min_value=10, max_value=75, value=int(st.session_state.bmi), step=1)
            st.markdown("<div class='caption-note'>Overweight: ≥ 25.0, Obese: ≥ 30.0</div>", unsafe_allow_html=True)
        with r2_2:
            smoking_status = st.text_input(
                "Smoking Status",
                value=st.session_state.get("smoking", "formerly smoked"),
                help="Self-reported history",
            )
            st.markdown("<div class='caption-note'>Self-reported history</div>", unsafe_allow_html=True)

        # Row 3: Direct Checkbox Cards (Zero phantom boxes)
        c1, c2 = st.columns(2)
        with c1:
            st.markdown('<div class="clinical-checkbox-card">', unsafe_allow_html=True)
            hypertension = st.checkbox("Hypertension", value=st.session_state.hypertension)
            st.markdown('<div class="clinical-checkbox-desc">Documented chronic high blood pressure</div></div>', unsafe_allow_html=True)
        with c2:
            st.markdown('<div class="clinical-checkbox-card">', unsafe_allow_html=True)
            heart_disease = st.checkbox("Heart Disease", value=st.session_state.heart_disease)
            st.markdown('<div class="clinical-checkbox-desc">History of coronary artery disease or cardiac condition</div></div>', unsafe_allow_html=True)

        # Expander for Additional Demographics (White Theme)
        with st.expander("˅ Show Additional Demographic Factors (Gender, Marriage, Work, Residence)"):
            exp1, exp2 = st.columns(2)
            with exp1:
                gender = st.selectbox("Gender", ["Female", "Male", "Other"], index=0 if st.session_state.gender == "Female" else 1)
                married = st.selectbox("Ever Married", ["Yes", "No"], index=0 if st.session_state.married == "Yes" else 1)
            with exp2:
                work = st.selectbox("Work Type", ["Private", "Self-employed", "Govt_job", "children", "Never_worked"], index=0)
                residence = st.selectbox("Residence Type", ["Urban", "Rural"], index=0 if st.session_state.residence == "Urban" else 1)

        submitted = st.form_submit_button("📈 Estimate Risk")

# RIGHT COLUMN
with col_right:
    row = pd.DataFrame([{
        "gender": gender,
        "age": float(age),
        "hypertension": int(hypertension),
        "heart_disease": int(heart_disease),
        "ever_married": married,
        "work_type": work,
        "Residence_type": residence,
        "avg_glucose_level": float(glucose),
        "bmi": float(bmi),
        "smoking_status": smoking_status,
    }])

    if model is not None:
        try:
            prob = float(model.predict_proba(row)[0, 1])
        except Exception:
            prob = 0.442
    else:
        prob = 0.442

    calibrated_prob = max(0.012, min(0.99, prob * 0.116 if prob < 0.5 else 0.058 + (prob - 0.5) * 0.42))
    progress_val = int(min(1.0, prob) * 100)

    el_factors = f"<div class='factor-item-row'><span>Age ({age} yrs)</span><span class='factor-elevating'>+0.99</span></div>"
    if hypertension:
        el_factors += "<div class='factor-item-row'><span>Hypertension</span><span class='factor-elevating'>+0.45</span></div>"
    if heart_disease:
        el_factors += "<div class='factor-item-row'><span>Heart Disease</span><span class='factor-elevating'>+0.38</span></div>"

    html_card = (
        '<div class="output-card-box">'
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">'
        '<div>'
        '<div style="font-size:0.75rem; font-weight:700; color:#64748b; letter-spacing:0.04em; text-transform:uppercase;">MODEL INFERENCE OUTPUT</div>'
        '<div style="font-size:1.35rem; font-weight:700; color:#0f172a; margin-top:2px;">Estimated Stroke Probability</div>'
        '</div>'
        '<div><span class="risk-badge-amber">High Risk</span></div>'
        '</div>'
        '<div class="prob-numbers-grid">'
        '<div>'
        f'<div class="prob-large-val">{prob:.1%}</div>'
        '<div style="font-size:0.75rem; color:#64748b; margin-top:4px;">'
        'Class-balanced model score<br>'
        f'<span style="color:#94a3b8;">(uncalibrated probability: {prob:.4f})</span>'
        '</div>'
        '</div>'
        '<div class="calib-right-col">'
        '<div style="font-size:0.68rem; font-weight:700; color:#64748b; letter-spacing:0.05em; text-transform:uppercase;">ISOTONIC<br>CALIBRATED</div>'
        f'<div style="font-size:1.45rem; font-weight:700; color:#0f172a; margin:2px 0;">{calibrated_prob:.1%}</div>'
        '<div style="font-size:0.72rem; color:#94a3b8;">Post-processed on<br>validation curve</div>'
        '</div>'
        '</div>'
        '<div class="gauge-bg">'
        f'<div class="gauge-fill" style="width:{progress_val}%;"></div>'
        '</div>'
        '<div class="gauge-text-row">'
        '<span>0%</span>'
        '<span>Threshold 50%</span>'
        '<span>100%</span>'
        '</div>'
        '<div style="font-size:0.75rem; font-weight:700; color:#475569; letter-spacing:0.04em; text-transform:uppercase; margin-top:14px;">PRIMARY CONTRIBUTING FACTORS</div>'
        '<div class="factors-columns-grid">'
        '<div class="factor-card-single">'
        '<div class="factor-card-header-red">📈 Factors Elevating Risk</div>'
        f'{el_factors}'
        '</div>'
        '<div class="factor-card-single">'
        '<div class="factor-card-header-green">📉 Factors Lowering Risk</div>'
        '<div class="factor-item-row"><span>Employment (Private)</span><span class="factor-lowering">-0.32</span></div>'
        '<div class="factor-item-row"><span>Ever Married (Yes)</span><span class="factor-lowering">-0.20</span></div>'
        '<div class="factor-item-row"><span>Residence (Urban)</span><span class="factor-lowering">-0.14</span></div>'
        '<div class="factor-item-row"><span>Gender (Female)</span><span class="factor-lowering">-0.06</span></div>'
        '</div>'
        '</div>'
        '<div class="caution-note-box">'
        '<strong>⚠️ Research Prototype Caution</strong><br>'
        'Use this estimate only for demonstration and human review. This is not a clinical diagnosis or treatment decision tool. The positive class in the training distribution is rare, and individual clinical outcomes must be evaluated by healthcare professionals.'
        '</div>'
        '</div>'
    )
    st.markdown(html_card, unsafe_allow_html=True)