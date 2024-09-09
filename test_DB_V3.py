import psycopg2
import os

# Set environment variables for connection
os.environ['DB_HOST'] = "dbtestrun.cpsu6measava.eu-west-2.rds.amazonaws.com"
os.environ['DB_NAME'] = "dbtestrun"
os.environ['DB_USER'] = "dbtestrun"
os.environ['DB_PASSWORD'] = "dbtestrun"
os.environ['DB_PORT'] = "5432"

def connect_to_db():
    try:
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST'),
            database=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            port=os.getenv('DB_PORT'),
            sslmode='require'
        )
        print("Database connection established.")
        return conn
    except psycopg2.Error as e:
        print(f"Error connecting to database: {e}")
        return None

def retrieve_data():
    conn = connect_to_db()
    if conn:
        try:
            with conn.cursor() as cursor:
                # Retrieve data from benchmark_reports table
                cursor.execute("SELECT * FROM benchmark_reports;")
                rows = cursor.fetchall()
                
                # Print the retrieved data
                for row in rows:
                    print(row)
        except psycopg2.Error as e:
            print(f"Error retrieving data: {e}")
        finally:
            conn.close()
    else:
        print("Failed to connect to the database.")

if __name__ == "__main__":
    retrieve_data()
