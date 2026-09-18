"""Data loading, validation, preprocessing, and stratified splitting."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.model_selection import train_test_split

TARGET = "stroke"
ID_COLUMN = "id"
RANDOM_STATE = 42
CATEGORICAL_FEATURES = [
    "gender",
    "ever_married",
    "work_type",
    "Residence_type",
    "smoking_status",
]
NUMERIC_FEATURES = [
    "age",
    "hypertension",
    "heart_disease",
    "avg_glucose_level",
    "bmi",
]
SELECTED_FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES


@dataclass
class DataSplits:
    x_train: pd.DataFrame
    x_val: pd.DataFrame
    x_test: pd.DataFrame
    y_train: pd.Series
    y_val: pd.Series
    y_test: pd.Series
    id_train: pd.Series
    id_val: pd.Series
    id_test: pd.Series


def load_data(csv_path: str | Path) -> tuple[pd.DataFrame, pd.Series, pd.Series]:
    """Load raw data, remove the identifier from features, and normalize N/A values."""
    data = pd.read_csv(csv_path, na_values=["N/A", "NA", ""])
    required = {ID_COLUMN, TARGET, *SELECTED_FEATURES}
    missing = required.difference(data.columns)
    if missing:
        raise ValueError(f"Missing required columns: {sorted(missing)}")
    if data[TARGET].isna().any():
        raise ValueError("Target contains missing values.")

    ids = data[ID_COLUMN].copy()
    target = data[TARGET].astype("int8")
    features = data[SELECTED_FEATURES].copy()
    return features, target, ids


def split_data(
    features: pd.DataFrame,
    target: pd.Series,
    ids: pd.Series,
    test_size: float = 0.15,
    val_size: float = 0.15,
) -> DataSplits:
    """Create stratified train, validation, and test partitions."""
    x_train, x_temp, y_train, y_temp, id_train, id_temp = train_test_split(
        features,
        target,
        ids,
        test_size=test_size + val_size,
        stratify=target,
        random_state=RANDOM_STATE,
    )
    relative_test_size = test_size / (test_size + val_size)
    x_val, x_test, y_val, y_test, id_val, id_test = train_test_split(
        x_temp,
        y_temp,
        id_temp,
        test_size=relative_test_size,
        stratify=y_temp,
        random_state=RANDOM_STATE,
    )
    return DataSplits(
        x_train, x_val, x_test, y_train, y_val, y_test, id_train, id_val, id_test
    )


def build_preprocessor(features: pd.DataFrame) -> ColumnTransformer:
    numeric = [column for column in NUMERIC_FEATURES if column in features.columns]
    categorical = [column for column in CATEGORICAL_FEATURES if column in features.columns]
    numeric_pipeline = Pipeline(
        [("imputer", SimpleImputer(strategy="median")), ("scaler", StandardScaler())]
    )
    categorical_pipeline = Pipeline(
        [
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", OneHotEncoder(handle_unknown="ignore")),
        ]
    )
    return ColumnTransformer(
        [("numeric", numeric_pipeline, numeric), ("categorical", categorical_pipeline, categorical)]
    )
