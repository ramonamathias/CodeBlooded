import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from datetime import datetime
import numpy as np

class EnhancedTextDetector:
    def __init__(self):
        print("🤖 Loading AI text detection model...")
        try:
            self.tokenizer = AutoTokenizer.from_pretrained("Hello-SimpleAI/chatgpt-detector-roberta")
            self.model = AutoModelForSequenceClassification.from_pretrained("Hello-SimpleAI/chatgpt-detector-roberta")
            self.model.eval()
            print("✅ Text detection model loaded successfully!")
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            raise
        
    def detect_text(self, text):
        """Detect if text is AI-generated with detailed analysis"""
        try:
            inputs = self.tokenizer(text, truncation=True, padding=True, return_tensors="pt", max_length=512)
            
            with torch.no_grad():
                outputs = self.model(**inputs)
                predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
                
            ai_probability = float(predictions[0][1])
            confidence_score = max(ai_probability, 1 - ai_probability)
            
            words = text.split()
            
            return {
                'is_ai_generated': ai_probability > 0.5,
                'ai_probability': ai_probability,
                'human_probability': 1 - ai_probability,
                'confidence_score': confidence_score,
                'explanation': self._generate_explanation(ai_probability, text),
                'metadata': {
                    'word_count': len(words),
                    'character_count': len(text),
                    'sentence_count': len([s for s in text.split('.') if s.strip()]),
                    'avg_word_length': np.mean([len(word) for word in words]) if words else 0
                },
                'timestamp': datetime.now().isoformat(),
                'analysis_type': 'enhanced_text_detection'
            }
        except Exception as e:
            return {'error': f'Detection failed: {str(e)}'}
    
    def _generate_explanation(self, ai_prob, text):
        if ai_prob > 0.8:
            risk_level = "VERY HIGH"
            reason = "Strong AI patterns detected"
        elif ai_prob > 0.6:
            risk_level = "HIGH" 
            reason = "Multiple AI indicators present"
        elif ai_prob > 0.4:
            risk_level = "MEDIUM"
            reason = "Some AI-like characteristics detected"
        elif ai_prob > 0.2:
            risk_level = "LOW"
            reason = "Mostly human-like patterns"
        else:
            risk_level = "VERY LOW"
            reason = "Strong human writing indicators"
        
        return f"{risk_level} AI probability. Analysis reveals {reason}. Text shows {'characteristics typical of AI generation' if ai_prob > 0.5 else 'human-like writing patterns'}."
