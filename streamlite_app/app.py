import streamlit as st
import sys
import os
import requests

# Add current directory to Python path
sys.path.append(os.path.dirname(__file__))
from utils import get_token

st.set_page_config(
    page_title="Urban Growth Analytics",
    page_icon="🏙️",
    layout="wide",
    initial_sidebar_state="expanded"
)

def main():
    st.sidebar.title("🏙️ Urban Growth Analytics")
    st.sidebar.markdown("---")
    
    # Check authentication
    token = get_token()
    
    if token:
        # User is logged in - show dashboard directly
        st.switch_page("pages/dashboard.py")
    else:
        # User is not logged in - show welcome page
        show_welcome_page()

def show_welcome_page():
    st.title("🌆 Welcome to Urban Growth Analytics")
    st.subheader("Monitor and Predict Urban Development with Advanced Analytics")
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown("""
        ### 🧠 Advanced Features:
        - **Urban Growth Prediction**: U-Net model for accurate urban expansion forecasts
        - **Satellite Image Analysis**: Deep learning-based analysis of urban development patterns
        - **Real-time Analytics**: Live monitoring of urban growth metrics
        - **Predictive Modeling**: Data-driven projections for urban planning
        
        ### 📊 What You Can Do:
        - Visualize model predictions vs ground truth
        - Analyze urban growth trends over time
        - Monitor model performance metrics (Accuracy, F1-Score, IoU)
        - Generate urban expansion probability maps
        
        ### 🚀 Get Started:
        1. Create an account or login
        2. Access the Dashboard
        3. Explore urban growth predictions
        4. Analyze model performance
        """)
    
    with col2:
        st.image("https://cdn-icons-png.flaticon.com/512/3079/3079165.png", width=150)
        st.markdown("---")
        st.info("""
        **🔐 Secure Access**  
        
        Login to access advanced urban growth predictions and analytics.
        """)
    
    # Quick actions
    st.markdown("---")
    st.subheader("Quick Access")
    
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("🔐 Login to Dashboard", use_container_width=True):
            st.switch_page("pages/login.py")
    
    with col2:
        if st.button("📝 Create Account", use_container_width=True):
            st.switch_page("pages/register.py")
    
    # System status
    st.markdown("---")
    st.subheader("🔧 System Status")
    
    col1, col2 = st.columns(2)
    
    with col1:
        try:
            response = requests.get("http://localhost:5000/", timeout=5)
            if response.status_code == 200:
                st.success("✅ Backend server is running")
            else:
                st.warning("⚠️ Backend server response unexpected")
        except:
            st.error("❌ Backend server is not available")
    
    with col2:
        # Check if model files exist without loading them
        model_path = r"C:\Users\Lenovo\Desktop\LY MAJOR PROJECT\data\models\urban_growth_unet.h5"
        data_path = r"C:\Users\Lenovo\Desktop\LY MAJOR PROJECT\data\predictions\test_predictions.npz"
        
        if os.path.exists(model_path) and os.path.exists(data_path):
            st.success("✅ Model files available")
        else:
            st.error("❌ Model files not found")

if __name__ == "__main__":
    main()