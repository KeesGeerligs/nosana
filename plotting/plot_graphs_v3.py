import os
import sys
import pandas as pd
import matplotlib.pyplot as plt

def load_excel_files(directory):
    sheets = {}
    for filename in os.listdir(directory):
        if filename.endswith(".xlsx") or filename.endswith(".xls"):
            filepath = os.path.join(directory, filename)
            try:
                sheet = pd.read_excel(filepath, sheet_name='CU_1')
                sheets[filename] = sheet
            except Exception as e:
                print(f"Could not load sheet 'CU_1' from {filename}: {e}")
    return sheets

def plot_cu1_combined_cutoff(sheets, time_cutoff=100):
    plt.figure(figsize=(12, 8))

    for name, data in sheets.items():
        if isinstance(data, pd.DataFrame):
            filtered_data = data[data['Time (seconds)'] <= time_cutoff]
            plt.plot(filtered_data['Time (seconds)'], filtered_data['Tokens per Second'], label=name)

    plt.xlabel('Time (seconds)')
    plt.ylabel('Tokens per Second')
    plt.title(f'Tokens per Second vs. Time (seconds)')
    plt.legend()
    plt.grid(True)
    plt.show()

def main(directory):
    sheets = load_excel_files(directory)
    plot_cu1_combined_cutoff(sheets, time_cutoff=100)

if __name__ == "__main__":
    directory = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
    main(directory)
