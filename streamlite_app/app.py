import streamlit as st
import sys
import os
import requests
import urllib.parse

# Add current directory to Python path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)

from utils import get_token, decode_token

# ---------------------------
# Streamlit Page Config
# ---------------------------
st.set_page_config(
    page_title="Urban Growth Analytics",
    page_icon="🏙️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ---------------------------
# Main App
# ---------------------------
def main():
    st.sidebar.title("🏙️ Urban Growth Analytics")
    st.sidebar.markdown("---")
    
    # Get token from URL or session
    token = get_token()
    
    if token:
        try:
            # Validate token
            decoded = decode_token(token)
            if decoded:
                # User is authenticated → go to dashboard
                st.switch_page("pages/dashboard.py")
            else:
                show_welcome_page()
        except:
            show_welcome_page()
    else:
        # User is not logged in → show welcome
        show_welcome_page()

# ---------------------------
# Welcome Page
# ---------------------------
def show_welcome_page():
    st.title("🌆 Welcome to Urban Growth Analytics")
    st.subheader("Monitor and Predict Urban Development with Advanced Analytics")

    col1, col2 = st.columns([2, 1])

    with col1:
        st.markdown("""
        ### 🧠 Advanced Features:
        - **Urban Growth Prediction** using U-Net deep learning model  
        - **Satellite Image Analysis** for urban expansion patterns  
        - **Real-time Analytics** for performance monitoring  
        - **Predictive Modeling** for future planning  

        ### 📊 What You Can Do:
        - Compare predictions vs ground truth  
        - Analyze growth trends over time  
        - Track Accuracy, F1-Score, IoU  
        - Generate probability maps  

        ### 🚀 Get Started:
        1. Create an account or login  
        2. Open the Dashboard  
        3. Explore predictions  
        4. Analyze results  
        """)

    with col2:
        st.image(
            "https://cdn-icons-png.flaticon.com/512/3079/3079165.png",
            width=150
        )
        st.markdown("---")
        st.info("""
        **🔐 Secure Access**  
        Login to access advanced urban growth analytics.
        """)

    # ---------------------------
    # Quick Actions
    # ---------------------------
    st.markdown("---")
    st.subheader("Quick Access")

    c1, c2 = st.columns(2)

    with c1:
        if st.button("🔐 Login to Dashboard", use_container_width=True):
            st.switch_page("pages/login.py")

    with c2:
        if st.button("📝 Create Account", use_container_width=True):
            st.switch_page("pages/register.py")

    # ---------------------------
    # System Status
    # ---------------------------
    st.markdown("---")
    st.subheader("🔧 System Status")

    c1, c2 = st.columns(2)

    # ✅ Backend status check
    with c1:
        try:
            resp = requests.get("http://localhost:5000/", timeout=3)
            if resp.status_code == 200:
                st.success("✅ Backend server is running")
            else:
                st.warning(f"⚠️ Backend responded with status {resp.status_code}")
        except Exception:
            st.error("❌ Backend server is not reachable")

    # ✅ Model & data file check
    with c2:
        model_path = r"C:\Users\Lenovo\Desktop\LY MAJOR PROJECT\data\models\urban_growth_unet.h5"
        data_path = r"C:\Users\Lenovo\Desktop\LY MAJOR PROJECT\data\predictions\test_predictions.npz"

        if os.path.exists(model_path) and os.path.exists(data_path):
            st.success("✅ Model & prediction files found")
        else:
            missing = []
            if not os.path.exists(model_path):
                missing.append("Model file")
            if not os.path.exists(data_path):
                missing.append("Prediction data")
            st.warning("⚠️ Missing: " + ", ".join(missing) + "\n\nRunning in demonstration mode.")

# ---------------------------
# Run App
# ---------------------------
if __name__ == "__main__":
    main()