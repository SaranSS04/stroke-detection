"""Fit an isotonic calibration map on validation predictions."""

from __future__ import annotations

import argparse
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
from sklearn.isotonic import IsotonicRegression


def calibrate(output_dir: Path) -> None:
    validation = pd.read_csv(output_dir / "val_predictions_xgboost.csv")
    test = pd.read_csv(output_dir / "test_predictions.csv")
    calibrator = IsotonicRegression(out_of_bounds="clip")
    calibrator.fit(validation["predicted_probability"], validation["true_label"])

    validation["calibrated_probability"] = calibrator.predict(validation["predicted_probability"])
    test["calibrated_probability"] = calibrator.predict(test["predicted_probability"])
    validation.to_csv(output_dir / "val_predictions_calibrated.csv", index=False)
    test.to_csv(output_dir / "test_predictions_calibrated.csv", index=False)

    plt.figure(figsize=(6, 5))
    plt.plot(validation["predicted_probability"], validation["true_label"], ".", alpha=0.25, label="Validation observations")
    ordered = validation.sort_values("predicted_probability")
    plt.plot(ordered["predicted_probability"], ordered["calibrated_probability"], label="Isotonic calibration")
    plt.xlabel("Raw predicted probability")
    plt.ylabel("Observed/calibrated probability")
    plt.title("Validation probability calibration")
    plt.legend()
    plt.tight_layout()
    plt.savefig(output_dir / "calibration_curve.png", dpi=160)
    plt.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", type=Path, default=Path("outputs"))
    calibrate(parser.parse_args().output_dir)
