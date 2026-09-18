"""
AI-Based Early Stroke Risk Prediction and Clinical Decision Support System.
React-inspired modern frontend interface wired directly to the existing ML model.
"""

from pathlib import Path
import sys
import joblib
import pandas as pd
import streamlit as st

# Ensure project root is available in path
PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

# -----------------------------------------------------------------------------
# 1. PAGE SETUP & REACT-THEME CSS STYLING
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="StrokeAI — AI-Powered Healthcare",
    page_icon="🩺",
    layout="wide",
    initial_sidebar_state="collapsed",
)

st.markdown(
    """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    html, body, [class*="css"], .stApp {
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        background-color: #0b1120;
        color: #f8fafc;
    }

    #MainMenu, header, footer {visibility: hidden;}
    .block-container {
        padding-top: 1.5rem;
        padding-bottom: 3rem;
        max-width: 1100px;
    }

    /* Logo & Branding */
    .logo-container {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 800;
        font-size: 1.25rem;
        color: #ffffff;
    }
    .logo-badge {
        background: #0ea5e9;
        color: #ffffff;
        padding: 6px;
        border-radius: 8px;
        display: flex;
        align-items: center;
    }
    .logo-container span span {
        color: #38bdf8;
    }

    /* Hero section */
    .hero-box {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: 24px;
        background: linear-gradient(135deg, #0f172a 0%, #172554 100%);
        border: 1px solid #1e3a8a;
        border-radius: 18px;
        padding: 38px 36px;
        margin-bottom: 30px;
        box-shadow: 0 10px 30px -10px rgba(14, 165, 233, 0.15);
    }
    .badge-pill {
        background: rgba(56, 189, 248, 0.12);
        color: #38bdf8;
        border: 1px solid rgba(56, 189, 248, 0.4);
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 0.78rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 14px;
    }
    .hero-h1 {
        font-size: 2.3rem;
        font-weight: 800;
        line-height: 1.15;
        margin: 0 0 14px 0;
        color: #ffffff;
    }
    .hero-h1 span {
        color: #38bdf8;
    }
    .hero-p {
        color: #94a3b8;
        font-size: 1rem;
        line-height: 1.55;
        margin: 0 0 20px 0;
    }
    .trust-badge {
        color: #64748b;
        font-size: 0.82rem;
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 14px;
    }

    /* Hero Card Right */
    .hero-card-right {
        background: #0f172a;
        border: 1px solid #334155;
        border-radius: 14px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
    .pulse-icon {
        width: 68px;
        height: 68px;
        border-radius: 50%;
        background: rgba(14, 165, 233, 0.15);
        color: #38bdf8;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        margin-bottom: 12px;
    }
    .mini-stats {
        display: flex;
        gap: 20px;
        margin-top: 18px;
        width: 100%;
        justify-content: center;
    }
    .mini-stat-card {
        background: #1e293b;
        padding: 10px 18px;
        border-radius: 8px;
        border: 1px solid #334155;
    }
    .mini-stat-card strong {
        display: block;
        color: #38bdf8;
        font-size: 1.15rem;
    }
    .mini-stat-card span {
        color: #94a3b8;
        font-size: 0.75rem;
    }

    /* Features */
    .features-header {
        text-align: center;
        margin-bottom: 24px;
    }
    .features-header span {
        color: #0ea5e9;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }
    .features-header h2 {
        font-size: 1.6rem;
        font-weight: 700;
        margin-top: 4px;
    }
    .card-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin-bottom: 26px;
    }
    .feature-item {
        background: #0f172a;
        border: 1px solid #1e293b;
        border-radius: 12px;
        padding: 20px;
    }
    .feature-item h4 {
        color: #ffffff;
        margin: 10px 0 6px 0;
        font-size: 1.05rem;
    }
    .feature-item p {
        color: #94a3b8;
        font-size: 0.85rem;
        line-height: 1.45;
        margin: 0;
    }

    .card-assessment {
        background: #0f172a;
        border: 1px solid #1e293b;
        border-radius: 14px;
        padding: 28px;
        margin-top: 10px;
    }

    /* Results */
    .result-banner {
        padding: 26px;
        border-radius: 14px;
        margin-bottom: 24px;
        color: #ffffff;
    }
    .result-low {
        background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
        border: 1px solid #10b981;
    }
    .result-mod {
        background: linear-gradient(135deg, #78350f 0%, #854d0e 100%);
        border: 1px solid #f59e0b;
    }
    .result-high {
        background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
        border: 1px solid #ef4444;
    }
    .result-percent {
        font-size: 3.5rem;
        font-weight: 800;
        line-height: 1;
        margin: 8px 0;
    }

    .disclaimer-strip {
        background: #0b1329;
        border-left: 4px solid #38bdf8;
        padding: 12px 16px;
        border-radius: 6px;
        font-size: 0.82rem;
        color: #94a3b8;
        margin-top: 24px;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# -----------------------------------------------------------------------------
# 2. MODEL LOADER
# -----------------------------------------------------------------------------
MODEL_PATH = PROJECT_ROOT / "outputs" / "model.pkl"
if not MODEL_PATH.exists():
    MODEL_PATH = PROJECT_ROOT / "stroke_model.joblib"


@st.cache_resource
def load_trained_model():
    if not MODEL_PATH.exists():
        return None
    return joblib.load(MODEL_PATH)


model = load_trained_model()

# -----------------------------------------------------------------------------
# 3. STATEFUL PAGE NAVIGATION
# -----------------------------------------------------------------------------
if "page" not in st.session_state:
    st.session_state.page = "home"
if "prediction_result" not in st.session_state:
    st.session_state.prediction_result = None

# TOP NAVBAR
nav_col1, nav_col2, nav_col3, nav_col4, nav_col5 = st.columns([3, 1, 1, 1, 1.6])
with nav_col1:
    st.markdown(
        """
        <div class="logo-container">
            <div class="logo-badge">🩺</div>
            <span>Stroke<span>AI</span></span>
        </div>
        """,
        unsafe_allow_html=True,
    )
with nav_col2:
    if st.button("Home", use_container_width=True):
        st.session_state.page = "home"
        st.rerun()
with nav_col3:
    if st.button("Assessment", use_container_width=True):
        st.session_state.page = "assessment"
        st.rerun()
with nav_col4:
    if st.button("About", use_container_width=True):
        st.session_state.page = "about"
        st.rerun()
with nav_col5:
    if st.button("▶ Start Assessment", type="primary", use_container_width=True):
        st.session_state.page = "assessment"
        st.rerun()

st.markdown("<hr style='border: 0; height: 1px; background: #1e293b; margin: 10px 0 24px 0;'>", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# PAGE: HOME
# -----------------------------------------------------------------------------
if st.session_state.page == "home":
    st.markdown(
        """
        <div class="hero-box">
            <div>
                <div class="badge-pill">🧠 AI-Powered Healthcare</div>
                <h1 class="hero-h1">Understand Your <span>Stroke Risk</span></h1>
                <p class="hero-p">
                    An AI-based risk assessment system that analyzes patient health and physiological factors 
                    to estimate stroke risk and provide explainable insights.
                </p>
                <div class="trust-badge">
                    🛡️ Designed for healthcare decision support
                </div>
            </div>
            <div class="hero-card-right">
                <div class="pulse-icon">💓</div>
                <h3 style="margin: 0; color: #f8fafc;">AI Risk Assessment</h3>
                <p style="color: #94a3b8; font-size: 0.85rem; margin: 6px 0;">
                    Analyze multiple clinical markers using an AI-powered prediction system.
                </p>
                <div class="mini-stats">
                    <div class="mini-stat-card">
                        <strong>7+</strong>
                        <span>Clinical Metrics</span>
                    </div>
                    <div class="mini-stat-card">
                        <strong>AI</strong>
                        <span>Prediction</span>
                    </div>
                </div>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    h_btn1, h_btn2, _ = st.columns([1.5, 1.5, 3])
    with h_btn1:
        if st.button("Start Assessment →", type="primary", use_container_width=True):
            st.session_state.page = "assessment"
            st.rerun()
    with h_btn2:
        if st.button("Learn More", use_container_width=True):
            st.session_state.page = "about"
            st.rerun()

    st.markdown("<div style='height: 25px;'></div>", unsafe_allow_html=True)

    st.markdown(
        """
        <div class="features-header">
            <span>HOW IT WORKS</span>
            <h2>Simple. Intelligent. Explainable.</h2>
        </div>
        <div class="card-grid">
            <div class="feature-item">
                <div style="font-size: 1.5rem;">👤</div>
                <h4>Patient Assessment</h4>
                <p>Enter basic demographic, physiological, and lifestyle information.</p>
            </div>
            <div class="feature-item">
                <div style="font-size: 1.5rem;">🧠</div>
                <h4>AI Analysis</h4>
                <p>The prediction system analyzes the provided patient information.</p>
            </div>
            <div class="feature-item">
                <div style="font-size: 1.5rem;">📈</div>
                <h4>Risk Insights</h4>
                <p>View an estimated risk level and important contributing factors.</p>
            </div>
        </div>
        <div class="disclaimer-strip">
            ℹ️ <b>Medical Notice:</b> This tool is for educational and decision-support purposes only and is not a substitute for professional medical diagnosis or treatment.
        </div>
        """,
        unsafe_allow_html=True,
    )

# -----------------------------------------------------------------------------
# PAGE: ASSESSMENT (Removed: Ever Married, Residence Type, Work Type)
# -----------------------------------------------------------------------------
elif st.session_state.page == "assessment":
    st.markdown(
        """
        <div style="margin-bottom: 20px;">
            <span style="color: #38bdf8; font-weight: 700; font-size: 0.8rem; letter-spacing: 0.05em;">STEP 1</span>
            <h1 style="margin: 4px 0; font-size: 2rem;">Patient Assessment</h1>
            <p style="color: #94a3b8; font-size: 0.95rem;">Enter the patient's information to perform an AI stroke-risk assessment.</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    if model is None:
        st.error("Model file (`outputs/model.pkl` or `stroke_model.joblib`) not found.")
        st.stop()

    with st.form("assessment_form"):
        st.markdown("### Patient Demographics & Physiology")
        c1, c2 = st.columns(2)
        with c1:
            age = st.number_input("Age", min_value=1.0, max_value=110.0, value=55.0, step=1.0)
            gender = st.selectbox("Gender", ["Male", "Female", "Other"])
        with c2:
            glucose = st.number_input("Average Glucose Level (mg/dL)", min_value=40.0, max_value=350.0, value=105.0)
            bmi = st.number_input("BMI (Body Mass Index)", min_value=10.0, max_value=75.0, value=27.4)

        st.markdown("### Clinical History & Lifestyle")
        c3, c4 = st.columns(2)
        with c3:
            hypertension = st.selectbox("Hypertension", options=[0, 1], format_func=lambda x: "Yes" if x == 1 else "No")
            heart_disease = st.selectbox("Heart Disease", options=[0, 1], format_func=lambda x: "Yes" if x == 1 else "No")
        with c4:
            smoking = st.selectbox("Smoking Status", ["never smoked", "formerly smoked", "smokes", "Unknown"])

        st.markdown("<br>", unsafe_allow_html=True)
        submitted = st.form_submit_button("Analyze Risk", type="primary", use_container_width=True)

    if submitted:
        # Pass standard baseline defaults for excluded social fields so model pipeline remains unbroken
        row = pd.DataFrame([{
            "gender": gender,
            "age": float(age),
            "hypertension": int(hypertension),
            "heart_disease": int(heart_disease),
            "ever_married": "Yes",
            "work_type": "Private",
            "Residence_type": "Urban",
            "avg_glucose_level": float(glucose),
            "bmi": float(bmi),
            "smoking_status": smoking,
        }])

        prob = float(model.predict_proba(row)[0, 1])
        st.session_state.prediction_result = {
            "probability": prob,
            "data": row.iloc[0].to_dict(),
        }
        st.session_state.page = "result"
        st.rerun()

# -----------------------------------------------------------------------------
# PAGE: RESULT
# -----------------------------------------------------------------------------
elif st.session_state.page == "result":
    if not st.session_state.prediction_result:
        st.warning("No assessment performed yet.")
        if st.button("Go to Assessment"):
            st.session_state.page = "assessment"
            st.rerun()
        st.stop()

    res = st.session_state.prediction_result
    prob = res["probability"]
    pdata = res["data"]

    if prob < 0.20:
        tier_title = "Low Estimated Risk"
        tier_class = "result-low"
        desc = "Current physiological and demographic factors fall within a lower probability bracket."
    elif prob < 0.50:
        tier_title = "Moderate / Elevated Risk"
        tier_class = "result-mod"
        desc = "Elevated risk indicators observed. Proactive monitoring and clinical checkups advised."
    else:
        tier_title = "High Priority Risk"
        tier_class = "result-high"
        desc = "Substantial risk probability detected. Immediate comprehensive medical consultation recommended."

    st.markdown(
        f"""
        <div class="result-banner {tier_class}">
            <div style="text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.08em; opacity: 0.9;">Estimated Stroke Risk</div>
            <div class="result-percent">{prob:.1%}</div>
            <div style="font-size: 1.35rem; font-weight: 700;">{tier_title}</div>
            <p style="margin: 8px 0 0 0; opacity: 0.95; font-size: 0.95rem;">{desc}</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    col_a, col_b = st.columns([1.2, 1])
    with col_a:
        st.markdown("#### Patient Assessment Summary")
        summary_df = pd.DataFrame({
            "Health Factor": ["Age", "Gender", "Hypertension", "Heart Disease", "Avg Glucose", "BMI", "Smoking"],
            "Value": [
                f"{pdata['age']:.0f} yrs",
                pdata["gender"],
                "Yes" if pdata["hypertension"] == 1 else "No",
                "Yes" if pdata["heart_disease"] == 1 else "No",
                f"{pdata['avg_glucose_level']:.1f} mg/dL",
                f"{pdata['bmi']:.1f}",
                pdata["smoking_status"],
            ],
        })
        st.dataframe(summary_df, use_container_width=True, hide_index=True)

    with col_b:
        st.markdown("#### Clinical Interpretation")
        factors = []
        if pdata["age"] >= 55:
            factors.append("• Advanced age is a primary non-modifiable risk contributor.")
        if pdata["hypertension"] == 1:
            factors.append("• Documented hypertension significantly increases vascular shear stress.")
        if pdata["heart_disease"] == 1:
            factors.append("• Pre-existing cardiac condition contributes to thromboembolic risk.")
        if pdata["avg_glucose_level"] >= 140:
            factors.append("• Elevated glucose levels indicate metabolic vascular burden.")
        if pdata["smoking_status"] in ["smokes", "formerly smoked"]:
            factors.append("• Tobacco exposure promotes vascular endothelial dysfunction.")
        if not factors:
            factors.append("• General baseline values within standard parameters.")

        for f in factors:
            st.markdown(f)

    st.markdown("<br>", unsafe_allow_html=True)
    if st.button("↺ New Assessment", type="primary"):
        st.session_state.page = "assessment"
        st.rerun()

    st.markdown(
        """
        <div class="disclaimer-strip">
            ℹ️ <b>Medical Disclaimer:</b> This risk percentage is an AI-generated decision support estimate and does not constitute a clinical diagnosis. Consult a healthcare professional for clinical decisions.
        </div>
        """,
        unsafe_allow_html=True,
    )

# -----------------------------------------------------------------------------
# PAGE: ABOUT
# -----------------------------------------------------------------------------
elif st.session_state.page == "about":
    st.markdown(
        """
        <div style="margin-bottom: 20px;">
            <span style="color: #38bdf8; font-weight: 700; font-size: 0.8rem; letter-spacing: 0.05em;">ABOUT THE SYSTEM</span>
            <h1 style="margin: 4px 0; font-size: 2rem;">AI-Based Early Stroke Risk Prediction</h1>
        </div>
        <div class="card-assessment">
            <h3 style="color: #38bdf8; margin-top: 0;">Project Objective</h3>
            <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.6;">
                Built for clinical decision support, this system leverages machine learning to identify early stroke risk patterns from patient demographics, physiological markers, and lifestyle factors.
            </p>
            <h3 style="color: #38bdf8; margin-top: 20px;">Dataset</h3>
            <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.6;">
                Trained strictly on the stroke prediction dataset (5,110 records) evaluating core physiological markers including age, gender, hypertension, heart disease, glucose levels, BMI, and smoking history.
            </p>
            <h3 style="color: #38bdf8; margin-top: 20px;">Safety & Governance</h3>
            <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.6;">
                This tool is intended for screening and educational decision support. It does not replace diagnostic neuroimaging or certified clinical evaluation.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )