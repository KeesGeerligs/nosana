import pandas as pd
import numpy as np
from sklearn.linear_model import LassoCV
from sklearn.metrics import r2_score, mean_absolute_error
from sklearn.model_selection import cross_val_score, KFold
from statsmodels.stats.outliers_influence import variance_inflation_factor
import statsmodels.api as sm

# Load the dataset
data = pd.read_csv(r"results\image_benchmark_results.csv")

# List of simplified predictors
key_predictors = [
    'BatchSize_10_AvgPowerUsage',
    'PingLatency_s'
]

def outlier_removal(group):
    # Remove outliers that are beyond 3 standard deviations from the mean
    numeric_cols = group.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        mean = group[col].mean()
        std = group[col].std()
        group = group[(group[col] >= mean - 3 * std) & (group[col] <= mean + 3 * std)]
    return group

# Apply the outlier removal function
cleaned_data = data.groupby(['Framework', 'Market']).apply(outlier_removal).reset_index(drop=True)

# Check for multicollinearity using VIF
X_vif = cleaned_data[key_predictors]
X_vif = sm.add_constant(X_vif)  # Add intercept for VIF calculation
vif_data = pd.DataFrame()
vif_data['Feature'] = X_vif.columns
vif_data['VIF'] = [variance_inflation_factor(X_vif.values, i) for i in range(X_vif.shape[1])]
print("VIF Data:\n", vif_data)

# Optionally, you can address multicollinearity based on VIF results

# Group by framework and market, fit Lasso regression, and compute adjusted latency
adjusted_latencies = []

for (framework, market), group_data in cleaned_data.groupby(['Framework', 'Market']):
    if len(group_data) < 5:
        continue  # Skip groups with insufficient data for 5-fold CV
    
    # Prepare predictors and target variable
    X = group_data[key_predictors].values
    y = group_data['BatchSize_10_AverageLatency'].values

    # Fit Lasso regression model with cross-validation
    cv_folds = min(5, len(group_data))  # Adjust CV folds based on data size
    lasso = LassoCV(cv=cv_folds).fit(X, y)

    # Predict latency and compute residuals (adjusted latency)
    group_data = group_data.copy()  # Avoid SettingWithCopyWarning
    group_data['PredictedLatency'] = lasso.predict(X)
    group_data['Residuals'] = y - group_data['PredictedLatency']

    # Cross-validation
    kf = KFold(n_splits=cv_folds, shuffle=True, random_state=42)
    cv_scores = cross_val_score(lasso, X, y, cv=kf, scoring='r2')

    # Output the cross-validation R-squared
    print(f"Framework: {framework}, Market: {market}, CV R-squared: {cv_scores.mean():.4f}")

    # Calculate R-squared and MAE for the group
    r_squared = r2_score(y, group_data['PredictedLatency'])
    mae = mean_absolute_error(y, group_data['PredictedLatency'])
    group_data['R_squared'] = r_squared
    group_data['MAE'] = mae

    # Store results
    adjusted_latencies.append(group_data)

# Combine all the group results
adjusted_data = pd.concat(adjusted_latencies)

# Group by 'Framework' and 'Market' and calculate statistics
grouped_results = adjusted_data.groupby(['Framework', 'Market']).agg(
    avg_latency=('BatchSize_10_AverageLatency', 'mean'),
    std_latency=('BatchSize_10_AverageLatency', 'std'),
    avg_mae=('MAE', 'mean'),
    std_residuals=('Residuals', 'std'),
    avg_r_squared=('R_squared', 'mean'),
    count=('BatchSize_10_AverageLatency', 'count')
).reset_index()

# Display the sorted grouped results
grouped_sorted = grouped_results.sort_values(by=['Framework', 'avg_latency'], ascending=True)
print(grouped_sorted)
