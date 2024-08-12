import os
import pandas as pd
import matplotlib.pyplot as plt
import argparse

def generate_framework_cu_plots(model_name):
    directory = os.path.join('metrics', model_name)
    print(directory)
    output_directory = os.path.join('plots', model_name)
    os.makedirs(output_directory, exist_ok=True)

    # Predefined CU levels
    predefined_cus = ['CU_1', 'CU_5', 'CU_10', 'CU_50', 'CU_100']
    data = {cu: {} for cu in predefined_cus}

    # Process each file
    if os.path.exists(directory):
        for filename in os.listdir(directory):
            if filename.endswith('.xlsx'):
                parts = filename.split('_')
                framework = parts[2]

                filepath = os.path.join(directory, filename)

                # Read each sheet corresponding to a CU
                for cu in predefined_cus:
                    if cu in data:
                        try:
                            df = pd.read_excel(filepath, sheet_name=cu)
                            if framework not in data[cu]:
                                data[cu][framework] = []
                            data[cu][framework].append(df)
                        except ValueError:
                            print(f"Warning: Sheet '{cu}' not found in file: {filename}")
                            continue

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
