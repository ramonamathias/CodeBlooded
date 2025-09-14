import time
import json
import requests
from threading import Thread
import random

class IoTSensorManager:
    def __init__(self, server_url="http://localhost:5000"):
        self.server_url = server_url
        self.sensors = {
            'environmental': EnvironmentalSensor(),
            'biometric': BiometricSensor(),
            'security': SecuritySensor()
        }
        self.running = False
        
    def start_monitoring(self):
        """Start IoT sensor monitoring"""
        self.running = True
        for sensor_type, sensor in self.sensors.items():
            thread = Thread(target=self._monitor_sensor, args=(sensor_type, sensor))
            thread.daemon = True
            thread.start()
    
    def stop_monitoring(self):
        """Stop IoT sensor monitoring"""
        self.running = False
    
    def _monitor_sensor(self, sensor_type, sensor):
        """Monitor individual sensor"""
        while self.running:
            try:
                data = sensor.read_data()
                self._send_sensor_data(sensor_type, data)
                time.sleep(sensor.read_interval)
            except Exception as e:
                print(f"Error reading {sensor_type} sensor: {e}")
                time.sleep(5)
    
    def _send_sensor_data(self, sensor_type, data):
        """Send sensor data to server"""
        try:
            payload = {
                'sensor_type': sensor_type,
                'data': data,
                'timestamp': time.time()
            }
            
            # Send to server via webhook
            requests.post(
                f"{self.server_url}/api/sensor-data",
                json=payload,
                timeout=5
            )
        except Exception as e:
            print(f"Error sending sensor data: {e}")

class EnvironmentalSensor:
    def __init__(self):
        self.read_interval = 30  # seconds
    
    def read_data(self):
        """Simulate environmental sensor readings"""
        return {
            'temperature': round(random.uniform(20, 30), 1),
            'humidity': round(random.uniform(40, 70), 1),
            'light_level': round(random.uniform(100, 1000), 1),
            'noise_level': round(random.uniform(30, 80), 1),
            'air_quality': round(random.uniform(50, 150), 1)
        }

class BiometricSensor:
    def __init__(self):
        self.read_interval = 10  # seconds
    
    def read_data(self):
        """Simulate biometric sensor readings"""
        return {
            'heart_rate': random.randint(60, 100),
            'stress_level': round(random.uniform(0, 1), 2),
            'attention_score': round(random.uniform(0.3, 1.0), 2),
            'eye_strain': round(random.uniform(0, 1), 2),
            'posture_score': round(random.uniform(0.5, 1.0), 2)
        }

class SecuritySensor:
    def __init__(self):
        self.read_interval = 5  # seconds
    
    def read_data(self):
        """Simulate security sensor readings"""
        return {
            'motion_detected': random.choice([True, False]),
            'camera_active': True,
            'microphone_active': True,
            'network_activity': round(random.uniform(0, 100), 1),
            'suspicious_activity': random.choice([True, False]) if random.random() < 0.1 else False
        }

# Usage example
if __name__ == "__main__":
    manager = IoTSensorManager()
    manager.start_monitoring()
    
    print("IoT monitoring started. Press Ctrl+C to stop...")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        manager.stop_monitoring()
        print("IoT monitoring stopped.")
