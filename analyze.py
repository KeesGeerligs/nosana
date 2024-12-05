import json
import csv
from datetime import datetime, time
from operator import itemgetter

def filter_and_categorize_transactions(file_path):
    try:
        # Load the JSON data
        with open(file_path, 'r') as file:
            transactions = json.load(file)
        
        # Track node activities
        node_activities = {}  # {node_id: {'safe_period': bool, 'outside_period': bool, 'transactions': []}}
        
        # Process transactions
        for tx in transactions:
            log_messages = tx['details']['meta']['logMessages']
            timestamp = datetime.fromisoformat(tx['timestamp'].replace('Z', '+00:00'))
            tx_time = timestamp.time()
            
            # Check for Work or Finish instructions
            has_work = any("Instruction: Work" in msg for msg in log_messages)
            has_finish = any("Instruction: Finish" in msg for msg in log_messages)
            
            if has_work or has_finish:
                # Extract node identifier
                node_id = tx['details']['transaction']['message']['accountKeys'][0]['pubkey']
                tx_id = tx['signature']
                
                # Initialize node tracking if not exists
                if node_id not in node_activities:
                    node_activities[node_id] = {
                        'safe_period': False, 
                        'outside_period': False,
                        'transactions': []
                    }
                
                # Track activity periods and store transaction details
                tx_info = {
                    'node_id': node_id,
                    'tx_id': tx_id,
                    'timestamp': tx['timestamp'],
                    'in_safe_period': time(12, 30) <= tx_time <= time(15, 20)
                }
                node_activities[node_id]['transactions'].append(tx_info)
                
                if time(12, 30) <= tx_time <= time(15, 20):
                    node_activities[node_id]['safe_period'] = True
                else:
                    node_activities[node_id]['outside_period'] = True

        # Create a list of representative transactions (one per node)
        representative_transactions = []
        for node_id, activity in node_activities.items():
            category = 'Safe' if activity['safe_period'] else 'Compromised'
            
            # If node is safe, prioritize a transaction from safe period
            if category == 'Safe':
                safe_txs = [tx for tx in activity['transactions'] if tx['in_safe_period']]
                if safe_txs:
                    tx = safe_txs[0]  # Take the first safe period transaction
                else:
                    tx = activity['transactions'][0]  # Fallback to first transaction
            else:
                tx = activity['transactions'][0]  # For compromised nodes, take first transaction
                
            tx['category'] = category
            representative_transactions.append(tx)

        # Sort transactions by timestamp
        sorted_transactions = sorted(representative_transactions, key=lambda x: x['timestamp'])

        # Write results to CSV
        with open('node_categories.csv', 'w', newline='') as csvfile:
            fieldnames = ['Node ID', 'Category', 'Transaction ID', 'Timestamp', 'In Safe Period']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()

            for tx in sorted_transactions:
                writer.writerow({
                    'Node ID': tx['node_id'],
                    'Category': tx['category'],
                    'Transaction ID': tx['tx_id'],
                    'Timestamp': tx['timestamp'],
                    'In Safe Period': 'Yes' if tx['in_safe_period'] else 'No'
                })

        # Print summary
        print(f"Total nodes processed: {len(node_activities)}")
        print(f"Safe nodes: {len([n for n in node_activities.values() if n['safe_period']])}")
        print(f"Compromised nodes: {len([n for n in node_activities.values() if not n['safe_period']])}")
        print("\nNode categories saved to 'node_categories.csv'")

    except FileNotFoundError:
        print(f"File not found: {file_path}")
    except json.JSONDecodeError:
        print("Error decoding JSON from the file.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Run the filter and categorize
file_path = 'transactions.json'
filter_and_categorize_transactions(file_path)