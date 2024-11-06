import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

# Load the data (using a corrected file path)
data = pd.read_csv(r"results\image_benchmark_results.csv")


size = "30"
# Filter the data for non-null latency and power usage values for BatchSize_10
# We'll consider all frameworks now and handle them within the analysis
data = data[
    (data["BatchSize_"+size+"_AverageLatency"].notnull()) &
    (data["BatchSize_"+size+"_AvgPowerUsage"].notnull())
]

# Remove any rows where power usage is zero or negative
data = data[data["BatchSize_"+size+"_AvgPowerUsage"] > 0]

def remove_outliers(df, column, z_thresh=3):
    def outlier_removal(group):
        if group[column].std() == 0:
            return group
        z_scores = np.abs((group[column] - group[column].mean()) / group[column].std())
        return group[z_scores < z_thresh]

    # Group the DataFrame, process the groups, and remove the grouping columns before applying the function
    grouped_df = df.groupby(['Framework', 'Market'])
    
    # Apply the outlier removal function to each group, but don't include the grouping columns in the operation
    return pd.concat([
        outlier_removal(group).assign(Framework=framework, Market=market)
        for (framework, market), group in grouped_df
    ]).reset_index(drop=True)



# Remove outliers based on latency and power usage for Batch Size 10 within each framework and market
cleaned_data = remove_outliers(data, "BatchSize_"+size+"_AverageLatency")
cleaned_data = remove_outliers(cleaned_data, "BatchSize_"+size+"_AvgPowerUsage")

# List to collect adjusted data
adjusted_latencies = []

# Loop over each framework and market group
for (framework, market), group_data in cleaned_data.groupby(['Framework', 'Market']):
    if len(group_data) < 2:
        continue  # Not enough data points for regression

    # Prepare data for regression
    X = group_data["BatchSize_"+size+"_AvgPowerUsage"].values.reshape(-1, 1)
    y = group_data["BatchSize_"+size+"_AverageLatency"].values

    # Fit the model
    model = LinearRegression()
    model.fit(X, y)

    # Predict latency based on power usage
    group_data['PredictedLatency'] = model.predict(X)

    # Compute adjusted latency as residuals
    group_data['AdjustedLatency'] = y - model.predict(X)

    adjusted_latencies.append(group_data)

# Combine all adjusted data
adjusted_data = pd.concat(adjusted_latencies)

# Group the data by 'Framework' and 'Market' and calculate statistics
grouped = adjusted_data.groupby(['Framework', 'Market']).agg(
    avg_latency=('BatchSize_'+size+'_AverageLatency', 'mean'),
    std_latency=('BatchSize_'+size+'_AverageLatency', 'std'),
    avg_adjusted_latency=('AdjustedLatency', 'mean'),
    std_adjusted_latency=('AdjustedLatency', 'std'),
    count=('BatchSize_'+size+'_AverageLatency', 'count')
).reset_index()

# Sort the DataFrame by 'Framework' and 'avg_latency' in ascending order
grouped_sorted = grouped.sort_values(by=['Framework', 'avg_latency'], ascending=True)

# Create a dictionary to map markets to prices
market_prices = {
    '4090': 0.32,
    '3060': 0.05,
    '3070': 0.08,
    '3080': 0.10,
    '3090': 0.19,
    '4060': 0.06,
    '4070': 0.10,
    '4080': 0.16,
    'A40': 0.80,
    'A100 40GB': 1.28,
    'A100': 1.60,
    'A4000': 0.13,
    'A5000': 0.32,
    'A6000': 0.80,
    'H100': 3.20
}

# Add the 'Price' column to the grouped_sorted DataFrame
grouped_sorted['Price'] = grouped_sorted['Market'].map(market_prices)

# Print the forge_data along with the prices
forge_data = grouped_sorted[grouped_sorted['Framework'] == 'forge']
print(forge_data)