
import os

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

from pathlib import Path
from io import BytesIO
import json

import numpy as np
import tensorflow as tf

from PIL import Image
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware


# ==========================================
# 1. PROJECT PATHS
# ==========================================

ROOT = Path(__file__).resolve().parent.parent

MODEL_PATH = ROOT / "models" / "cnn_best.keras"
CLASSES_PATH = ROOT / "results" / "class_names.json"


# ==========================================
# 2. CREATE FASTAPI APPLICATION
# ==========================================

app = FastAPI(
    title="LeafGuard AI API",
    description="Plant Leaf Disease Prediction",
    version="1.0"
)


# ==========================================
# 3. ENABLE CORS FOR REACT AND VERCEL
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://leaf-guard-ai-woad.vercel.app"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# 4. LOAD TRAINED CNN MODEL
# ==========================================

print("\nLoading LeafGuard AI model...")

model = tf.keras.models.load_model(MODEL_PATH)

print("CNN model loaded successfully!")


# ==========================================
# 5. LOAD 38 CLASS NAMES
# ==========================================

with open(CLASSES_PATH, "r", encoding="utf-8") as f:
    class_data = json.load(f)

if isinstance(class_data, list):
    class_names = class_data

elif isinstance(class_data, dict):
    class_names = [
        class_data[str(i)]
        for i in range(len(class_data))
    ]

else:
    raise ValueError("Invalid class_names.json format")


if len(class_names) != model.output_shape[-1]:
    raise ValueError(
        "Class names do not match model outputs"
    )

print(f"Loaded {len(class_names)} plant disease classes.")


# ==========================================
# 6. HOME API
# ==========================================

@app.get("/")
def home():
    return {
        "message": "LeafGuard AI API is running",
        "total_classes": len(class_names),
        "model": "CNN",
        "status": "Experimental"
    }


# ==========================================
# 7. PREDICTION API
# ==========================================

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    if file.content_type not in (
        "image/jpeg",
        "image/png",
        "image/webp"
    ):
        raise HTTPException(
            status_code=400,
            detail="Upload a JPG, PNG, or WebP image"
        )

    try:
        # STEP A: READ IMAGE
        content = await file.read()

        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=413,
                detail="Image must be smaller than 10 MB"
            )

        if not content:
            raise HTTPException(
                status_code=400,
                detail="Uploaded image is empty"
            )

        # STEP B: PREPROCESS IMAGE
        image = Image.open(
            BytesIO(content)
        ).convert("RGB")

        image = image.resize((224, 224))

        # Model already contains Rescaling(1/255).
        # Do not divide pixel values by 255 again.
        image_array = np.asarray(
            image,
            dtype=np.float32
        )

        image_array = np.expand_dims(
            image_array,
            axis=0
        )

        # STEP C: RUN CNN PREDICTION
        predictions = model.predict(
            image_array,
            verbose=0
        )[0]

        # STEP D: GET HIGHEST PREDICTION
        predicted_id = int(
            np.argmax(predictions)
        )

        predicted_class = class_names[
            predicted_id
        ]

        confidence = float(
            predictions[predicted_id]
        )

        # STEP E: PRINT TOP 5 PREDICTIONS
        top_5_indices = np.argsort(
            predictions
        )[-5:][::-1]

        print(
            "\n========== TOP 5 CNN PREDICTIONS ==========",
            flush=True
        )

        print(
            f"Uploaded file: {file.filename}",
            flush=True
        )

        for rank, index in enumerate(
            top_5_indices,
            start=1
        ):
            print(
                f"{rank}. {class_names[index]} "
                f"-> {float(predictions[index]) * 100:.2f}%",
                flush=True
            )

        print(
            "===========================================\n",
            flush=True
        )

        # STEP F: EXTRACT PLANT AND DISEASE
        plant, _, disease = (
            predicted_class.partition("___")
        )

        # STEP G: RETURN PREDICTION TO REACT
        return {
            "plant": plant.replace("_", " "),
            "disease": disease.replace("_", " "),
            "predicted_class": predicted_class,

            # Confidence on a 0-1 scale
            "confidence": round(confidence, 4),

            "warning": (
                "Experimental prediction. "
                "This model has limited validation accuracy. "
                "Results should not be treated as "
                "confirmed plant disease diagnoses."
            )
        }

    except HTTPException:
        raise

    except Exception as error:
        print(
            f"Prediction error: {error}",
            flush=True
        )

        raise HTTPException(
            status_code=400,
            detail="Could not process the uploaded image"
        )


# ==========================================
# END OF LEAFGUARD AI BACKEND
# ==========================================
