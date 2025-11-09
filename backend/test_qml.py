#!/usr/bin/env python3
"""
Test script for QML prediction module
"""
import time
import json
from qml_prediction import run_quantum_prediction, get_model_info

def test_qml_prediction():
    """Test the QML prediction functionality"""
    print("Testing QML prediction module...")
    
    # Test startup features
    test_features = {
        "team": 0.8,
        "traction": 0.7,
        "market": 0.6,
        "innovation": 0.9,
        "financials": 0.7
    }
    
    # Get model info
    print("\n1. Getting model info:")
    model_info = get_model_info()
    print(json.dumps(model_info, indent=2))
    
    # Run prediction
    print("\n2. Running quantum prediction:")
    start_time = time.time()
    result = run_quantum_prediction(test_features)
    total_time = time.time() - start_time
    
    print(f"\nPrediction completed in {total_time:.2f} seconds")
    print(json.dumps(result, indent=2))
    
    # Verify results
    assert "prediction" in result, "Prediction result missing"
    assert "confidence" in result, "Confidence score missing"
    assert "circuit_depth" in result, "Circuit depth missing"
    assert "model_version" in result, "Model version missing"
    
    print("\n✅ QML prediction test passed!")
    
    return result

if __name__ == "__main__":
    test_qml_prediction()