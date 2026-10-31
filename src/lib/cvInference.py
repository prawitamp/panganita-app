#!/usr/bin/env python3
"""
cvInference.py
Bridge eksekusi inferensi Computer Vision YOLO26n Panen
Menggunakan bobot model best.pt dari eksperimen Aulya Rakhmawati (PIC CV Kelompok 10).
Hanya MEMBACA bobot model (READ-ONLY) tanpa memodifikasi folder cv.
"""

import sys
import os
import json
import base64
import tempfile
import time

def run_inference(image_input, weights_path=None, conf_thresh=0.18):
    start_time = time.time()
    
    # Menentukan path bobot model default (read-only)
    if not weights_path:
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        weights_path = os.path.join(base_dir, "ai-pipeline", "cv", "runs", "yolo26n_detect_v1", "weights", "best.pt")
        
    if not os.path.exists(weights_path):
        return {
            "success": False,
            "error": f"Bobot model YOLO tidak ditemukan di: {weights_path}",
            "detections": []
        }
        
    try:
        from ultralytics import YOLO
    except ImportError:
        return {
            "success": False,
            "error": "Library 'ultralytics' belum terinstall di environment python ini.",
            "detections": []
        }
        
    # Tangani input berupa base64 atau path file
    temp_file = None
    target_img_path = image_input
    
    if image_input.startswith("data:image") or len(image_input) > 500:
        # Base64 string
        if "," in image_input:
            image_input = image_input.split(",", 1)[1]
        img_bytes = base64.b64decode(image_input)
        temp_file = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
        temp_file.write(img_bytes)
        temp_file.close()
        target_img_path = temp_file.name

    try:
        model = YOLO(weights_path)
        results = model.predict(source=target_img_path, conf=conf_thresh, verbose=False)
        
        detections = []
        img_w = 640
        img_h = 640
        
        for r in results:
            if hasattr(r, "orig_shape"):
                img_h, img_w = r.orig_shape
                
            for box in r.boxes:
                cls_id = int(box.cls[0])
                cls_name = model.names.get(cls_id, f"class_{cls_id}")
                conf = float(box.conf[0])
                xyxy = [float(x) for x in box.xyxy[0]]
                
                # Koordinat persentase untuk rendering overlay responsif di browser
                x1, y1, x2, y2 = xyxy
                norm_box = {
                    "top": round((y1 / img_h) * 100, 2),
                    "left": round((x1 / img_w) * 100, 2),
                    "width": round(((x2 - x1) / img_w) * 100, 2),
                    "height": round(((y2 - y1) / img_h) * 100, 2),
                }
                
                detections.append({
                    "class": cls_name,
                    "class_id": cls_id,
                    "confidence": round(conf, 4),
                    "box": xyxy,
                    "normalizedBox": norm_box
                })
                
        # Urutkan berdasarkan confidence tertinggi
        detections.sort(key=lambda d: d["confidence"], reverse=True)
        
        latency_ms = round((time.time() - start_time) * 1000, 1)
        
        return {
            "success": True,
            "engine": "YOLO26n Detect v1 (Aulya Rakhmawati, PIC CV)",
            "weights": os.path.basename(weights_path),
            "imageDimensions": {"width": img_w, "height": img_h},
            "totalDetected": len(detections),
            "detections": detections,
            "latencyMs": latency_ms
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "detections": []
        }
    finally:
        if temp_file and os.path.exists(temp_file.name):
            try:
                os.remove(temp_file.name)
            except:
                pass

if __name__ == "__main__":
    if len(sys.argv) < 2:
        # Baca dari stdin jika tidak ada argumen
        input_data = sys.stdin.read().strip()
    else:
        input_data = sys.argv[1]
        
    custom_weights = sys.argv[2] if len(sys.argv) > 2 else None
    res = run_inference(input_data, custom_weights)
    print(json.dumps(res, indent=2))
