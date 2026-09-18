"""Train and evaluate a stroke-risk classification pipeline."""

from __future__ import annotations

import argparse
from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    average_precision_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier

TARGET = "stroke"
ID_COLUMN = "id"
RANDOM_STATE = 42


def load_data(csv_path: Path) -> pd.DataFrame:
    """Load the CSV and remove the non-predictive identifier column."""
    data = pd.read_csv(csv_path, na_values=["N/A", "NA", ""])

    required_columns = {
        ID_COLUMN,
        TARGET,
        "gender",
        "age",
        "hypertension",
        "heart_disease",
        "ever_married",
        "work_type",
        "Residence_type",
        "avg_glucose_level",
        "bmi",
        "smoking_status",
    }
    missing_columns = required_columns.difference(data.columns)
    if missing_columns:
        raise ValueError(f"Missing required columns: {sorted(missing_columns)}")

    if data[TARGET].isna().any():
        raise ValueError("The target column contains missing values.")

    return data.drop(columns=ID_COLUMN)


def build_preprocessor(features: pd.DataFrame) -> ColumnTransformer:
    numeric_columns = features.select_dtypes(include="number").columns.tolist()
    categorical_columns = features.select_dtypes(exclude="number").columns.tolist()

    numeric_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )
    categorical_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", OneHotEncoder(handle_unknown="ignore")),
        ]
    )

    return ColumnTransformer(
        transformers=[
            ("numeric", numeric_pipeline, numeric_columns),
            ("categorical", categorical_pipeline, categorical_columns),
        ]
    )


def evaluate_model(model: Pipeline, features: pd.DataFrame, target: pd.Series) -> dict[str, float]:
    probabilities = model.predict_proba(features)[:, 1]
    predictions = (probabilities >= 0.5).astype(int)
    return {
        "roc_auc": roc_auc_score(target, probabilities),
        "average_precision": average_precision_score(target, probabilities),
        "precision": precision_score(target, predictions, zero_division=0),
        "recall": recall_score(target, predictions, zero_division=0),
        "f1": f1_score(target, predictions, zero_division=0),
    }


def train(csv_path: Path, model_path: Path) -> None:
    data = load_data(csv_path)
    features = data.drop(columns=TARGET)
    target = data[TARGET].astype(int)

    x_train, x_test, y_train, y_test = train_test_split(
        features,
        target,
        test_size=0.2,
        stratify=target,
        random_state=RANDOM_STATE,
    )

    preprocessor = build_preprocessor(x_train)
    candidates = {
        "logistic_regression": LogisticRegression(
            class_weight="balanced",
            max_iter=2000,
            random_state=RANDOM_STATE,
        ),
        "random_forest": RandomForestClassifier(
            class_weight="balanced",
            n_estimators=400,
            min_samples_leaf=3,
            random_state=RANDOM_STATE,
            n_jobs=-1,
        ),
    }

    trained_models: dict[str, Pipeline] = {}
    results: dict[str, dict[str, float]] = {}
    for name, estimator in candidates.items():
        model = Pipeline(
            steps=[
                ("preprocessor", preprocessor),
                ("classifier", estimator),
            ]
        )
        model.fit(x_train, y_train)
        trained_models[name] = model
        results[name] = evaluate_model(model, x_test, y_test)

    best_name = max(results, key=lambda name: results[name]["average_precision"])
    best_model = trained_models[best_name]
    joblib.dump(best_model, model_path)

    print(f"Rows: {len(data):,}")
    print(f"Positive cases: {int(target.sum()):,} ({target.mean():.2%})")
    print(f"Missing BMI values handled by median imputation: {int(data['bmi'].isna().sum()):,}")
    print(f"Selected model: {best_name}")
    print("\nTest-set metrics at threshold 0.50:")
    print(pd.DataFrame(results).T.round(4).to_string())
    print("\nClassification report:")
    print(classification_report(y_test, best_model.predict(x_test), zero_division=0))
    print("Confusion matrix:")
    print(confusion_matrix(y_test, best_model.predict(x_test)))
    print(f"Saved model to: {model_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--data",
        type=Path,
        default=Path("stroke_prediction.csv"),
        help="Path to the input CSV file.",
    )
    parser.add_argument(
        "--model-out",
        type=Path,
        default=Path("stroke_model.joblib"),
        help="Path for the trained model artifact.",
    )
    args = parser.parse_args()
    train(args.data, args.model_out)
