import pandas as pd
import numpy as np

data = pd.read_csv("results\image_benchmark_results.csv")

# Filter the data for the 'auto' framework and non-null latency values for BatchSize_1
auto_data = data[(data["Framework"] == "forge") & (data["BatchSize_10_AverageLatency"].notnull())]

# Function to detect and remove outliers based on Z-scores
def remove_outliers(df, column, z_thresh=3):
    z_scores = np.abs((df[column] - df[column].mean()) / df[column].std())
    return df[z_scores < z_thresh]

# Remove outliers from the dataset based on latency for Batch Size 1
cleaned_data = remove_outliers(auto_data, "BatchSize_10_AverageLatency")

# Group the data by 'Market' (GPU) and calculate statistics
grouped = cleaned_data.groupby("Market").agg(
    avg_latency=('BatchSize_10_AverageLatency', 'mean'),
    std_latency=('BatchSize_10_AverageLatency', 'std'),
    upper_bound=('BatchSize_10_AverageLatency', lambda x: x.mean() + 1.96 * x.std()),
    lower_bound=('BatchSize_10_AverageLatency', lambda x: x.mean() - 1.96 * x.std()),
    count=('BatchSize_10_AverageLatency', 'count')
).reset_index()

# Sort the DataFrame by avg_latency in ascending order
grouped_sorted = grouped.sort_values(by='avg_latency', ascending=True)

# Display the sorted statistics
print(grouped_sorted)



gpu_prices = {
    "4090": 0.32,
    "3060": 0.05,
    "3070": 0.08,
    "3080": 0.10,
    "3090": 0.19,
    "4060": 0.06,
    "4070": 0.10,
    "4080": 0.16,
    "A40": 0.80,
    "A100 40G": 1.28,
    "A100 80G": 1.60,
    "A4000": 0.13,
    "A5000": 0.32,
    "A6000": 0.80,
    "H100": 3.20
}


# Sort the GPU prices from high to low
sorted_gpu_prices = sorted(gpu_prices.items(), key=lambda x: x[1], reverse=True)

# Print the sorted GPU prices
print("\nGPU Prices:")
for gpu, price in sorted_gpu_prices:
    print(f"{gpu}: ${price:.2f}")


