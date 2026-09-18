"""Generate threshold and coverage curves for human review workflows."""

from __future__ import annotations

import argparse
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.metrics import precision_score, recall_score


def build_curve(predictions: pd.DataFrame) -> pd.DataFrame:
    probabilities = predictions["calibrated_probability"].to_numpy()
    labels = predictions["true_label"].to_numpy()
    rows = []
    for margin in np.linspace(0.0, 0.45, 46):
        confident = np.abs(probabilities - 0.5) >= margin
        coverage = float(confident.mean())
        if confident.any():
            predicted = (probabilities[confident] >= 0.5).astype(int)
            rows.append({
                "margin": margin,
                "coverage": coverage,
                "precision": precision_score(labels[confident], predicted, zero_division=0),
                "recall": recall_score(labels[confident], predicted, zero_division=0),
            })
    return pd.DataFrame(rows)


def generate(output_dir: Path) -> None:
    path = output_dir / "test_predictions_calibrated.csv"
    if not path.exists():
        path = output_dir / "test_predictions.csv"
        predictions = pd.read_csv(path)
        predictions["calibrated_probability"] = predictions["predicted_probability"]
    else:
        predictions = pd.read_csv(path)
    curve = build_curve(predictions)
    curve.to_csv(output_dir / "coverage_curve.csv", index=False)
    plt.figure(figsize=(7, 5))
    plt.plot(curve["coverage"], curve["precision"], label="Precision")
    plt.plot(curve["coverage"], curve["recall"], label="Recall")
    plt.xlabel("Coverage (non-abstained cases)")
    plt.ylabel("Metric")
    plt.title("Coverage versus performance")
    plt.grid(alpha=0.2)
    plt.legend()
    plt.tight_layout()
    plt.savefig(output_dir / "coverage_curve.png", dpi=160)
    plt.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", type=Path, default=Path("outputs"))
    generate(parser.parse_args().output_dir)
