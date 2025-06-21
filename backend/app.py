from flask import Flask, request, jsonify
import pandas as pd
import pickle
import numpy as np

app = Flask(__name__)

# Load model, scaler, label encoder, and PCA
try:
    with open("rf_model.pkl", "rb") as file:
        model = pickle.load(file)
    with open("scaler.pkl", "rb") as file:
        scaler = pickle.load(file)
    with open("label_encoder.pkl", "rb") as file:
        le = pickle.load(file)
    with open("pca.pkl", "rb") as file:
        pca = pickle.load(file)
except FileNotFoundError as e:
    print(f"Error: Missing required file - {e}")
    exit()

@app.route('/predict', methods=['POST'])
def predict():
    # Check if file is provided

    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded.'}), 400

    file = request.files['file']
    if not file.filename.endswith('.csv'):
        return jsonify({'error': 'File must be a CSV.'}), 400

    try:
        # Read CSV
        data = pd.read_csv(file)
        data.rename(columns={data.columns[0]: "sample_id"}, inplace=True)

        # Validate single row
        if len(data) == 0:
            return jsonify({'error': 'CSV file is empty.'}), 400
        if len(data) != 1:
            return jsonify({'error': f'Expected 1 row, found {len(data)} rows.'}), 400

        # Validate column count
        expected_columns = 20531
        X_single = data.drop(['sample_id'], axis=1)
        if X_single.shape[1] != expected_columns:
            return jsonify({'error': f'Expected {expected_columns} gene columns, got {X_single.shape[1]}.'}), 400

        # Preprocess
        X_single_scaled = scaler.transform(X_single)
        X_single_pca = pca.transform(X_single_scaled)

        # Predict
        y_pred_encoded = model.predict(X_single_pca)

        # Get confidence score
        probabilities = model.predict_proba(X_single_pca)[0]
        confidence = probabilities[y_pred_encoded[0]]

        # Decode prediction
        y_pred = le.inverse_transform(y_pred_encoded)[0]

        return jsonify({
            'sample_id': data['sample_id'].iloc[0],
            'prediction': y_pred,
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)