import os
import pandas as pd
import matplotlib.pyplot as plt
import argparse

def generate_framework_cu_plots(model_name_1, model_name_2):
    directories = [os.path.join('metrics', model_name_1), os.path.join('metrics', model_name_2)]
    output_directory = os.path.join('plots', f'{model_name_1}_vs_{model_name_2}')
    os.makedirs(output_directory, exist_ok=True)

    # Predefined CU levels
    predefined_cus = ['CU_1', 'CU_5', 'CU_10', 'CU_50', 'CU_100']
    data = {cu: {} for cu in predefined_cus}

    # Process each directory
    for directory in directories:
        gpu_model = directory.split('/')[-1].split('_')[-1]  # Parse the GPU model from the directory name
        if os.path.exists(directory):
            for filename in os.listdir(directory):
                if filename.endswith('.xlsx'):
                    parts = filename.split('_')
                    framework = parts[2]
                    key = f'{framework} ({gpu_model})'  # Formatted key for each framework-GPU combination

                    filepath = os.path.join(directory, filename)

                    # Read each sheet corresponding to a CU
                    for cu in predefined_cus:
                        if cu in data:
                            try:
                                df = pd.read_excel(filepath, sheet_name=cu)
                                if key not in data[cu]:
                                    data[cu][key] = []
                                data[cu][key].append(df)
                            except ValueError:
                                print(f"Warning: Sheet '{cu}' not found in file: {filename}")
                                continue

    # Generate plots for each CU
    for cu, frameworks in data.items():
        plt.figure(figsize=(12, 8))
        for key, dfs in frameworks.items():
            for df in dfs:
                plt.plot(df['Time (seconds)'], df['Tokens per Second'], label=key)

        plt.title(f'Llama 3 8B total tokens per Second - {cu} Comparison')
        plt.xlabel('Time (seconds)')
        plt.ylabel('Tokens per Second')
        plt.legend(title="Framework & GPU")
        plt.grid(True)

        output_filepath = os.path.join(output_directory, f'{cu}_comparison.png')
        plt.savefig(output_filepath)
        plt.close()
        print(f"Plot saved: {output_filepath}")

    if not any(frameworks for frameworks in data.values()):
        print("No data to plot.")

def main():
    parser = argparse.ArgumentParser(description='Generate performance comparison plots for each CU level across two GPUs and frameworks.')
    parser.add_argument('model_name_1', type=str, help='First directory name under "metrics" containing the data files.')
    parser.add_argument('model_name_2', type=str, help='Second directory name under "metrics" containing the data files.')

    args = parser.parse_args()
    
    generate_framework_cu_plots(args.model_name_1, args.model_name_2)

if __name__ == '__main__':
    main()
