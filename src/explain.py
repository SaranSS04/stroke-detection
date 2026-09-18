"""Create a global SHAP summary plot for the XGBoost model."""

from __future__ import annotations

import argparse
from pathlib import Path

import joblib
import matplotlib.pyplot as plt
import pandas as pd
import shap

from .preprocessing import load_data, split_data


def explain(data_path: Path, model_path: Path, output_dir: Path) -> None:
    features, target, ids = load_data(data_path)
    splits = split_data(features, target, ids)
    model = joblib.load(model_path)
    transformed = model.named_steps["preprocessor"].transform(splits.x_test)
    classifier = model.named_steps["classifier"]
    names = model.named_steps["preprocessor"].get_feature_names_out()
    sample = transformed.toarray() if hasattr(transformed, "toarray") else transformed
    values = shap.TreeExplainer(classifier)(sample)
    plt.figure()
    shap.summary_plot(values, sample, feature_names=names, show=False, max_display=15)
    plt.tight_layout()
    plt.savefig(output_dir / "shap_summary.png", dpi=160, bbox_inches="tight")
    plt.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", type=Path, default=Path("data/stroke_prediction.csv"))
    parser.add_argument("--model", type=Path, default=Path("outputs/model.pkl"))
    parser.add_argument("--output-dir", type=Path, default=Path("outputs"))
    args = parser.parse_args()
    explain(args.data, args.model, args.output_dir)
