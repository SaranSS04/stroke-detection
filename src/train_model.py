"""Train logistic regression and XGBoost models and write handoff artifacts."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    average_precision_score,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.pipeline import Pipeline

from .preprocessing import build_preprocessor, load_data, split_data


def build_models(preprocessor, positive_weight: float) -> dict[str, Pipeline]:
    from xgboost import XGBClassifier

    return {
        "logistic_regression": Pipeline(
            [
                ("preprocessor", preprocessor),
                ("classifier", LogisticRegression(
                    class_weight="balanced", max_iter=2000, random_state=42
                )),
            ]
        ),
        "xgboost": Pipeline(
            [
                ("preprocessor", preprocessor),
                ("classifier", XGBClassifier(
                    n_estimators=350,
                    max_depth=3,
                    learning_rate=0.04,
                    subsample=0.85,
                    colsample_bytree=0.85,
                    min_child_weight=3,
                    scale_pos_weight=positive_weight,
                    objective="binary:logistic",
                    eval_metric="aucpr",
                    early_stopping_rounds=50,
                    random_state=42,
                    n_jobs=4,
                )),
            ]
        ),
    }


def prediction_frame(ids, target, probabilities) -> pd.DataFrame:
    return pd.DataFrame({"patient_id": ids, "true_label": target, "predicted_probability": probabilities})


def evaluate_probabilities(target, probabilities) -> dict[str, float]:
    predictions = (probabilities >= 0.5).astype(int)
    return {
        "auroc": roc_auc_score(target, probabilities),
        "auprc": average_precision_score(target, probabilities),
        "precision": precision_score(target, predictions, zero_division=0),
        "recall": recall_score(target, predictions, zero_division=0),
        "f1": f1_score(target, predictions, zero_division=0),
    }


def train(data_path: Path, output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    features, target, ids = load_data(data_path)
    splits = split_data(features, target, ids)

    for name, x, y, row_ids in [
        ("train", splits.x_train, splits.y_train, splits.id_train),
        ("val", splits.x_val, splits.y_val, splits.id_val),
        ("test", splits.x_test, splits.y_test, splits.id_test),
    ]:
        frame = x.copy()
        frame.insert(0, "patient_id", row_ids.to_numpy())
        frame["stroke"] = y.to_numpy()
        frame.to_csv(output_dir / f"{name}.csv", index=False)

    positive_weight = float((target == 0).sum() / (target == 1).sum())
    preprocessor = build_preprocessor(splits.x_train)
    transformed_train = preprocessor.fit_transform(splits.x_train)
    transformed_val = preprocessor.transform(splits.x_val)
    models = build_models(preprocessor, positive_weight)
    metrics: dict[str, dict[str, float]] = {}
    fitted = {}
    for name, model in models.items():
        if name == "xgboost":
            model.named_steps["classifier"].fit(
                transformed_train,
                splits.y_train,
                eval_set=[(transformed_val, splits.y_val)],
                verbose=False,
            )
        else:
            model.fit(splits.x_train, splits.y_train)
        validation_probabilities = model.predict_proba(splits.x_val)[:, 1]
        test_probabilities = model.predict_proba(splits.x_test)[:, 1]
        metrics[name] = {
            "validation": evaluate_probabilities(splits.y_val, validation_probabilities),
            "test": evaluate_probabilities(splits.y_test, test_probabilities),
        }
        fitted[name] = model
        validation_frame = prediction_frame(
            splits.id_val, splits.y_val, validation_probabilities
        )
        test_frame = prediction_frame(splits.id_test, splits.y_test, test_probabilities)
        validation_frame.to_csv(output_dir / f"val_predictions_{name}.csv", index=False)
        test_frame.to_csv(output_dir / f"test_predictions_{name}.csv", index=False)
        if name == "xgboost":
            validation_frame.to_csv(output_dir / "val_predictions.csv", index=False)
            test_frame.to_csv(output_dir / "test_predictions.csv", index=False)

    # XGBoost is the requested production artifact; validation metrics still compare both models.
    joblib.dump(fitted["logistic_regression"], output_dir / "logistic_model.pkl")
    joblib.dump(fitted["xgboost"], output_dir / "model.pkl")
    (output_dir / "metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    print(json.dumps(metrics, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", type=Path, default=Path("data/stroke_prediction.csv"))
    parser.add_argument("--output-dir", type=Path, default=Path("outputs"))
    arguments = parser.parse_args()
    train(arguments.data, arguments.output_dir)
