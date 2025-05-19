import csv

def clean_value(value):
    """Clean monetary values by removing $ and commas."""
    if isinstance(value, str):
        # Handle potential empty strings or invalid numeric strings after cleaning
        cleaned = value.replace("$", "").replace(",", "")
        try:
            # Attempt to convert to float to check validity, but keep as string for SQL
            float(cleaned)
            return cleaned
        except ValueError:
            return 'NULL' # Return SQL NULL if conversion fails
    elif value is None:
        return 'NULL'
    return value

# Read CSV file
with open('nos_price_history.csv', 'r') as csv_file:
    reader = csv.DictReader(csv_file)
    rows = []
    for row in reader:
        # Skip rows with empty Date or Price, treat others as NULL
        if not row['Date'] or not row['Price']:
            continue
        
        # Ensure MarketCap and Volume are cleaned or set to NULL
        market_cap = clean_value(row.get('MarketCap'))
        volume = clean_value(row.get('Volume'))
        price = clean_value(row.get('Price')) # Price should also be cleaned/validated

        # Skip row if essential numeric fields are NULL after cleaning
        if price == 'NULL': # MarketCap and Volume might be legitimately 0 or NULL
             continue

        rows.append({
            'date': row['Date'],
            # Use NULL for market_cap/volume if cleaning resulted in NULL
            'market_cap': market_cap if market_cap != 'NULL' else 'NULL',
            'volume': volume if volume != 'NULL' else 'NULL',
            'price': price
        })

# Generate SQL insert statement
# Assuming column names based on the user's desired format order
sql = 'INSERT INTO "nos_price_history" ("date_timestamp", "col2", "col3", "col4", "col5", "price", "market_cap", "volume", "col9", "col10", "col11", "col12") VALUES\n'

value_strings = []
for row in rows:
    # Handle potential NULLs for market_cap and volume properly
    market_cap_sql = row['market_cap'] if row['market_cap'] != 'NULL' else 'NULL'
    volume_sql = row['volume'] if row['volume'] != 'NULL' else 'NULL'
    price_sql = row['price'] # Assumes price is never NULL based on earlier check

    value_string = f"(TO_TIMESTAMP('{row['date']}', 'YYYY-MM-DD'), NULL, NULL, NULL, NULL, {price_sql}, {market_cap_sql}, {volume_sql}, NULL, NULL, NULL, NULL)"
    value_strings.append(value_string)

sql += ",\n".join(value_strings)
sql += ";" # End the statement with a semicolon

# Write to migration file
with open('nos_price_history_migration.sql', 'w') as sql_file:
    sql_file.write(sql)

print(f"Migration file created: nos_price_history_migration.sql") 