import matplotlib.pyplot as plt
import numpy as np

# Total number of responses
total_responses = 43

# Updated data based on the provided responses (calculating percentages)
amounts = {
    '0€ (Would do it anyway)': (4 / total_responses) * 100,         # 4 responses
    '0.01-0.25€': (7 / total_responses) * 100,                      # 7 responses
    '0.26-0.50€': (6 / total_responses) * 100,                      # 6 responses
    '0.51-1.00€': (3 / total_responses) * 100,                      # 3 responses
    'Above 1€': (2 / total_responses) * 100,                        # 2 responses
    'Other/No specific amount': (21 / total_responses) * 100        # 21 responses
}

# Create bar chart
plt.figure(figsize=(10, 6))
bars = plt.bar(amounts.keys(), amounts.values(), color='#2ecc71')

# Customize the chart
plt.title('Minimum Bottle Return Incentive Preferences', pad=20, fontsize=14)
plt.xlabel('Amount in Euros (€)', fontsize=12)
plt.ylabel('Percentage of Responses (%)', fontsize=12)
plt.ylim(0, 60)  # Set y-axis limit from 0 to 60%

# Rotate x-axis labels for better readability
plt.xticks(rotation=45, ha='right')

# Add percentage labels on top of each bar
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height + 1,
             f'{height:.2f}%',
             ha='center', va='bottom')

# Adjust layout to prevent label cutoff
plt.tight_layout()

plt.show()