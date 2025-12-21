import streamlit as st
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
import os
from sklearn.metrics import accuracy_score, f1_score, jaccard_score

# ---------------------------
# 1. Load Model
# ---------------------------
model_path = r"C:\Users\Lenovo\Desktop\LY MAJOR PROJECT\data\models\urban_growth_unet.h5"

if os.path.exists(model_path):
    model = tf.keras.models.load_model(
        model_path,
        custom_objects={"mse": tf.keras.losses.MeanSquaredError()}
    )
else:
    st.warning("⚠️ Model file not found. Running in visualization-only mode.")

st.title("🌆 Urban Growth Prediction Dashboard")
st.markdown("Visualize **predicted urban expansion** over time with AI-powered insights.")

# ---------------------------
# 2. Load Data
# ---------------------------
predictions_dir = r"C:\Users\Lenovo\Desktop\LY MAJOR PROJECT\data\predictions"
data_path = os.path.join(predictions_dir, "test_predictions.npz")

data = np.load(data_path)
preds, y_test = data["predictions"], data["ground_truth"]

# ---------------------------
# 3. Metrics
# ---------------------------
y_true_flat = y_test.flatten() > 0.5
y_pred_flat = preds.flatten() > 0.5

acc = accuracy_score(y_true_flat, y_pred_flat)
f1 = f1_score(y_true_flat, y_pred_flat)
iou = jaccard_score(y_true_flat, y_pred_flat)

st.subheader("📊 Model Performance Metrics")
st.write(f"**Accuracy:** {acc:.4f}")
st.write(f"**F1-Score:** {f1:.4f}")
st.write(f"**IoU:** {iou:.4f}")

# ---------------------------
# 4. Visualization
# ---------------------------
st.subheader("🖼️ Urban Growth Prediction Samples")

idx = st.slider("Select Sample Index", 0, len(preds)-1, 0)

col1, col2, col3 = st.columns(3)
with col1:
    st.image(y_test[idx, :, :, 0], caption="Ground Truth", use_container_width=True)
with col2:
    st.image(preds[idx, :, :, 0], caption="Predicted Mask", use_container_width=True)
with col3:
    diff = np.abs(y_test[idx, :, :, 0] - preds[idx, :, :, 0])
    st.image(diff, caption="Difference Map", use_container_width=True)

# ---------------------------
# 5. Trend Chart (Demo)
# ---------------------------
st.subheader("📈 Urban Growth Over Time")

years = [2000, 2005, 2010, 2015, 2020, 2030, 2040]
growth = [10, 18, 25, 40, 55, 70, 88]

fig, ax = plt.subplots()
ax.plot(years, growth, marker="o")
ax.set_xlabel("Year")
ax.set_ylabel("Urban Growth %")
ax.set_title("Urban Growth Projection")
st.pyplot(fig)
