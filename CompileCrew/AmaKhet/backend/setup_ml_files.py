#!/usr/bin/env python3
"""
Script to copy ML model files to the backend directory for easier access
"""
import shutil
import os
from pathlib import Path

def setup_ml_files():
    """Copy ML model files to backend directory"""
    
    # Define source and destination paths
    backend_dir = Path(__file__).parent
    ml_dir = backend_dir.parent / "ML" / "ML"
    
    # Files to copy
    files_to_copy = [
        "plant_disease_recog_model_pwp.keras",
        "plant_disease.json"
    ]
    
    # Create ML directory in backend if it doesn't exist
    backend_ml_dir = backend_dir / "ML" / "ML"
    backend_ml_dir.mkdir(parents=True, exist_ok=True)
    
    # Copy files
    for file_name in files_to_copy:
        source_path = ml_dir / file_name
        dest_path = backend_ml_dir / file_name
        
        if source_path.exists():
            shutil.copy2(source_path, dest_path)
            print(f"✅ Copied {file_name} to backend/ML/ML/")
        else:
            print(f"❌ File not found: {source_path}")
    
    print("\n🎉 ML files setup complete!")
    print("You can now run the backend server with: python main.py")

if __name__ == "__main__":
    setup_ml_files()
