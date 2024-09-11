import psycopg2
import os
import json
from psycopg2 import sql

# Set environment variables for testing
os.environ['DB_HOST'] = "dbtestrun.cpsu6measava.eu-west-2.rds.amazonaws.com"
os.environ['DB_NAME'] = "dbtestrun"
os.environ['DB_USER'] = "dbtestrun"
os.environ['DB_PASSWORD'] = "dbtestrun"
os.environ['DB_PORT'] = "5432"

def connect_to_db():
    # Connect to the PostgreSQL database
    try:
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST'),
            database=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            port=os.getenv('DB_PORT'),
            sslmode='require'  # Ensure SSL connection for security
        )
        print("Database connection established.")
        return conn
    except psycopg2.Error as e:
        print(f"Error connecting to database: {e}")
        return None

def insert_test_data():
    conn = connect_to_db()
    if conn:
        try:
            with conn.cursor() as cursor:
                # Create the table if it doesn't exist
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS benchmark_reports (
                        id SERIAL PRIMARY KEY,
                        total_duration FLOAT,
                        total_tokens_produced INT,
                        avg_tokens_per_sec FLOAT,
                        total_requests INT,
                        status_distribution JSONB,
                        avg_latency FLOAT,
                        gpu_stats JSONB,
                        report_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                """)
                conn.commit()

                # Insert a sample report into the database
                sample_report = {
                    "total_duration": 123.45,
                    "total_tokens_produced": 6789,
                    "average_tokens_per_second": 55.0,
                    "total_requests_made": 150,
                    "status_distribution": {
                        "200": 140,
                        "500": 10
                    },
                    "average_latency": 0.25,
                    "gpu_stats": {
                        0: {
                            "avg_clock_speed": 1500.5,
                            "avg_power_usage": 100.0,
                            "avg_utilization": 80.0
                        }
                    }
                }

                insert_query = sql.SQL("""
                    INSERT INTO benchmark_reports (
                        total_duration, total_tokens_produced, avg_tokens_per_sec,
                        total_requests, status_distribution, avg_latency, gpu_stats
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s)
                """)

                cursor.execute(insert_query, [
                    sample_report["total_duration"],
                    sample_report["total_tokens_produced"],
                    sample_report["average_tokens_per_second"],
                    sample_report["total_requests_made"],
                    json.dumps(sample_report["status_distribution"]),
                    sample_report["average_latency"],
                    json.dumps(sample_report["gpu_stats"])
                ])

                conn.commit()
                print("Sample data inserted successfully.")
        except psycopg2.Error as e:
            print(f"Error inserting data into database: {e}")
        finally:
            conn.close()
    else:
        print("Failed to connect to the database.")

if __name__ == "__main__":
    insert_test_data()
