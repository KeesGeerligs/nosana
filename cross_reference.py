import csv
from datetime import datetime

def load_node_categories(file_path):
    categorized_nodes = {}
    try:
        with open(file_path, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                categorized_nodes[row['Node ID']] = {
                    'category': row['Category'],
                    'tx_id': row['Transaction ID'],
                    'timestamp': row['Timestamp']
                }
    except FileNotFoundError:
        print(f"File not found: {file_path}")
    return categorized_nodes

def load_stolen_addresses(file_path):
    stolen_addresses = set()
    try:
        with open(file_path, 'r') as file:
            reader = csv.reader(file)
            next(reader, None)  # Skip header if exists
            for row in reader:
                stolen_addresses.add(row[0])  # Assuming address is first column
    except FileNotFoundError:
        print(f"File not found: {file_path}")
    return stolen_addresses

def cross_reference_addresses():
    # Load both datasets
    categorized_nodes = load_node_categories('node_categories.csv')
    stolen_addresses = load_stolen_addresses('csv_drained_node_addresses.csv')

    # Cross reference
    matches = []
    unmatched_categorized = []
    unmatched_stolen = set(stolen_addresses)

    for node_id, details in categorized_nodes.items():
        if node_id in stolen_addresses:
            matches.append({
                'address': node_id,
                'category': details['category'],
                'tx_id': details['tx_id'],
                'timestamp': details['timestamp']
            })
            unmatched_stolen.remove(node_id)
        else:
            unmatched_categorized.append(node_id)

    # Write results to CSV
    with open('cross_reference_results.csv', 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Category', 'Address', 'Original Category', 'Transaction ID', 'Timestamp'])
        
        # Write matches
        for match in matches:
            writer.writerow([
                'Match (Found in both lists)',
                match['address'],
                match['category'],
                match['tx_id'],
                match['timestamp']
            ])
        
        # Write unmatched categorized nodes
        for address in unmatched_categorized:
            writer.writerow([
                'Categorized Only',
                address,
                categorized_nodes[address]['category'],
                categorized_nodes[address]['tx_id'],
                categorized_nodes[address]['timestamp']
            ])
        
        # Write unmatched stolen addresses
        for address in unmatched_stolen:
            writer.writerow([
                'Stolen Only',
                address,
                '',  # No category
                '',  # No transaction ID
                ''   # No timestamp
            ])

    # Print summary
    print(f"\nCross-Reference Results:")
    print(f"Total Categorized Nodes: {len(categorized_nodes)}")
    print(f"Total Stolen Addresses: {len(stolen_addresses)}")
    print(f"Matches Found: {len(matches)}")
    print(f"Unmatched Categorized Nodes: {len(unmatched_categorized)}")
    print(f"Unmatched Stolen Addresses: {len(unmatched_stolen)}")
    print("\nDetailed results saved to 'cross_reference_results.csv'")

if __name__ == "__main__":
    cross_reference_addresses() 