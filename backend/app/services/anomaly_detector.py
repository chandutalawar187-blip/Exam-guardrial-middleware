from sklearn.ensemble import IsolationForest
import numpy as np

model = IsolationForest(contamination=0.1, random_state=42)

def detect_anomaly(events: list) -> dict:
    if len(events) < 5:
        return {'anomaly': False, 'score': 0.0}
    features = [[e.get('score_delta', 0)] for e in events]
    X = np.array(features)
    model.fit(X)
    scores = model.decision_function(X)
    avg = float(np.mean(scores))
    return {'anomaly': avg < -0.1, 'score': round(avg, 4)}
