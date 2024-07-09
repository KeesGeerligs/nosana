import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Set the directory containing the Excel files
directory = 'metrics'
# Set the directory where the plots will be saved
output_directory = 'plots'
os.makedirs(output_directory, exist_ok=True)

# Create a dictionary to store the data
data = {}

# Loop through each file in the directory
for filename in os.listdir(directory):
    if filename.endswith('.xlsx'):
        # Parse the filename to get the framework and CU
        parts = filename.split('_')
        framework = parts[1]
        cu = parts[2].replace('CU', '')
        
        # Read the Excel file
        filepath = os.path.join(directory, filename)
        df = pd.read_excel(filepath)
        
        # Ensure the CU is in the data dictionary
        if cu not in data:
            data[cu] = {}
        
        # Add the dataframe to the dictionary under the appropriate framework
        data[cu][framework] = df

# Plot the data and save the images
for cu, frameworks in data.items():
    plt.figure(figsize=(12, 8))
    for framework, df in frameworks.items():
        plt.plot(df['Time (seconds)'], df['Tokens per Second'], label=framework)
    
    plt.title(f'Tokens per Second for {cu} CU')
    plt.xlabel('Time (seconds)')
    plt.ylabel('Tokens per Second')
    plt.legend()
    plt.grid(True)
    
    # Save the plot as an image
    output_filepath = os.path.join(output_directory, f'{cu}_CU_comparison.png')
    plt.savefig(output_filepath)
    plt.close()
