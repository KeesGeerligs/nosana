import matplotlib.pyplot as plt
import numpy as np

# Data for each GPU
gpus = [
    ("RTX A100", 80, 312, 1935, 161.24),
    ("RTX A6000", 48, 38.7, 768, 50.39),
    ("RTX 4090", 24, 82.58, 1008, 81.92),
    ("RTX 3090", 24, 35.58, 936, 38.01),
    ("RTX 3090 Ti", 24, 39.99, 1008, 39.67),
    ("RTX 4080", 16, 48.74, 716.8, 68),
    ("RTX A4000", 16, 19.2, 448, 42.86),
    ("RTX 3060", 12, 12.74, 360, 35.39),
    ("RTX 3080 Ti", 12, 34.1, 760, 44.87),
    ("RTX 4070", 12, 29.15, 504, 57.84),
    ("RTX 4070 Ti", 12, 40.09, 504, 79.54),
    ("RTX 3080", 10, 29.77, 760, 39.17),
    ("RTX 3080 (Laptop)", 8, 18.98, 448, 42.37),
    ("RTX 3060 Ti", 8, 16.2, 448, 36.16),
    ("RTX 3070", 8, 20.31, 571, 35.26),
    ("RTX 3070 Ti", 8, 21.7, 608, 35.69),
    ("RTX 3070 (Laptop)", 8, 15.95, 448, 35.63),
    ("RTX 4060", 8, 15.11, 272, 55.55),
    ("RTX 4060 Ti", 8, 22.06, 288, 76.6),
    ("RTX 4070 (Laptop)", 8, 15.6, 256, 60.94),
    ("RTX 3060 (Laptop)", 6, 10.94, 336, 32.56),
    ("RTX 3050 Ti (Laptop)", 4, 5.3, 192, 27.6),
    ("RTX 3050 (Laptop)", 4, 4.33, 192, 22.55)
]

main_gpus = [
    gpu for gpu in gpus if gpu[0] in ["RTX 3060", "RTX 4090", "RTX A4000", "RTX A6000", "RTX A100"]
]
# Colors and markers for clarity
colors = plt.cm.viridis(np.linspace(0, 1, len(gpus)))
markers = ['o', 'v', '^', '<', '>', 's', 'p', '*', 'h', 'H', '+', 'x', 'D', 'd', '|', '_']
# Redefining max_oi and max_perf due to new addition
max_oi = max(gpu[4] for gpu in main_gpus) *1.1
max_perf = max(gpu[2] for gpu in main_gpus) *1.1

# Recreating the plot with the new GPU added
fig, ax = plt.subplots(figsize=(14, 10))

# Adjust the computation to correctly represent the starting linear increase
for idx, (name, vram, tflops, bandwidth, compute_per_byte) in enumerate(main_gpus):
    # Creating x values from 0 to max compute/byte for each GPU
    x_linear = np.linspace(0, compute_per_byte, 100)
    y_linear = (tflops / compute_per_byte) * x_linear
    
    # Extend the line horizontally after reaching peak performance
    x_flat = np.linspace(compute_per_byte, max_oi, 100)
    y_flat = np.full_like(x_flat, tflops)
    
    # Combine arrays
    x_full = np.concatenate([x_linear, x_flat])
    y_full = np.concatenate([y_linear, y_flat])
    
    # Plotting the linear and flat parts with distinct markers for each GPU
    ax.plot(x_full, y_full, linestyle='-', label=name, alpha=0.8, markevery=[-1])

# Plot aesthetics
ax.set_xlim(0, max_oi)
ax.set_ylim(0, max_perf)
ax.set_xlabel('Operational Intensity (Ops/Byte)')
ax.set_ylabel('Performance (TFLOPS)')
ax.set_title('Roofline Model for NVIDIA GPUs')
ax.grid(True)
ax.legend(title="GPU Models", bbox_to_anchor=(1.05, 1), loc='upper left')

plt.tight_layout()
plt.show()