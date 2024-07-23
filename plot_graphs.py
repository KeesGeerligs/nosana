import os
import pandas as pd
import matplotlib.pyplot as plt
import argparse

def generate_framework_cu_plots(model_name):
    directory = os.path.join('metrics', model_name)
    output_directory = os.path.join('plots', model_name)
    os.makedirs(output_directory, exist_ok=True)

    # Predefined CU levels
    predefined_cus = ['1CU', '5CU', '10CU', '50CU', '100CU']
    data = {cu: {} for cu in predefined_cus}

    # Process each file
    if os.path.exists(directory):
        for filename in os.listdir(directory):
            if filename.endswith('.xlsx'):
                parts = filename.split('_')
                framework = parts[2]
                cu = parts[3]
                gpu = parts[3].split('.')[0]

                # Validate and adjust CU if it doesn't match predefined ones
                if cu not in data:
                    print(f"Warning: '{cu}' is not a recognized CU level. Skipping file: {filename}")
                    continue

                filepath = os.path.join(directory, filename)
                df = pd.read_excel(filepath)

                if framework not in data[cu]:
                    data[cu][framework] = []
                data[cu][framework].append(df)

    # Generate plots for each CU
    for cu, frameworks in data.items():
        plt.figure(figsize=(12, 8))
        for framework, dfs in frameworks.items():
            for df in dfs:
                plt.plot(df['Time (seconds)'], df['Tokens per Second'], label=f'{framework} ({cu})')

        plt.title(f'Tokens per Second - {cu} on {model_name}')
        plt.xlabel('Time (seconds)')
        plt.ylabel('Tokens per Second')
        plt.legend(title="Framework")
        plt.grid(True)

        output_filepath = os.path.join(output_directory, f'{cu}_comparison.png')
        plt.savefig(output_filepath)
        plt.close()
        print(f"Plot saved: {output_filepath}")

    if not any(frameworks for frameworks in data.values()):
        print("No data to plot.")

def main():
    parser = argparse.ArgumentParser(description='Generate performance comparison plots for each CU level across frameworks.')
    parser.add_argument('model_name', type=str, help='Directory name under "metrics" containing the data files.')
    
    args = parser.parse_args()
    
    generate_framework_cu_plots(args.model_name)

if __name__ == '__main__':
    main()
