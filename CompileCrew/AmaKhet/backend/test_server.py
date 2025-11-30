#!/usr/bin/env python3
"""
Simple test script to check if the backend server is running
"""
import requests
import time

def test_server():
    """Test if the backend server is running"""
    try:
        # Wait a moment for server to start
        time.sleep(2)
        
        # Test basic endpoint
        response = requests.get("http://localhost:8000", timeout=5)
        print(f"✅ Server is running! Status: {response.status_code}")
        
        # Test docs endpoint
        response = requests.get("http://localhost:8000/docs", timeout=5)
        print(f"✅ API docs available! Status: {response.status_code}")
        
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Server is not running or not accessible")
        return False
    except Exception as e:
        print(f"❌ Error testing server: {e}")
        return False

if __name__ == "__main__":
    test_server()
