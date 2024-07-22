import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import argparse

def generate_gpu_comparison_plots(model_name, gpu1, gpu2):
    directory = os.path.join('metrics', model_name)
    output_directory = os.path.join('plots', model_name)
    os.makedirs(output_directory, exist_ok=True)

    data = {}

    if os.path.exists(directory):
        for filename in os.listdir(directory):
            if filename.endswith('.xlsx'):
                parts = filename.split('_')
                framework = parts[1]
                cu = parts[2].replace('CU', '')
                gpu = parts[3].split('.')[0]  # Remove file extension if present

                if gpu not in [gpu1, gpu2]:
                    continue
                
                filepath = os.path.join(directory, filename)
                df = pd.read_excel(filepath)
                
                if cu not in data:
                    data[cu] = {}
                if gpu not in data[cu]:
                    data[cu][gpu] = {}
                if framework not in data[cu][gpu]:
                    data[cu][gpu][framework] = []

                data[cu][gpu][framework].append(df)

    if data:
        for cu, gpu_data in data.items():
            plt.figure(figsize=(12, 8))
            for gpu, frameworks in gpu_data.items():
                for framework, dfs in frameworks.items():
                    for df in dfs:
                        plt.plot(df['Time (seconds)'], df['Tokens per Second'], label=f'{framework} on {gpu}')
            
            plt.title(f'Tokens per Second for {cu} CU Comparison on {model_name}')
            plt.xlabel('Time (seconds)')
            plt.ylabel('Tokens per Second')
            plt.legend(title="Framework and GPU")
            plt.grid(True)
            
            output_filepath = os.path.join(output_directory, f'{cu}_CU_GPU_comparison.png')
            plt.savefig(output_filepath)
            plt.close()
            print(f"Plot saved: {output_filepath}")
    else:
        print("No data to plot.")

def main():
    parser = argparse.ArgumentParser(description='Generate GPU comparison plots for specified model and GPUs.')
    parser.add_argument('model_name', type=str, help='Name of the model directory under "metrics".')
    parser.add_argument('gpu1', type=str, help='Name of the first GPU to compare.')
    parser.add_argument('gpu2', type=str, help='Name of the second GPU to compare.')
    
    args = parser.parse_args()
    
    generate_gpu_comparison_plots(args.model_name, args.gpu1, args.gpu2)

if __name__ == '__main__':
    main()
