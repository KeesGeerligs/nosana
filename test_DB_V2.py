import psycopg2
import os

# Set environment variables for connection (use postgres as the default DB)
os.environ['DB_HOST'] = "dbtestrun.cpsu6measava.eu-west-2.rds.amazonaws.com"
os.environ['DB_NAME'] = "postgres"  # Use the default postgres database
os.environ['DB_USER'] = "dbtestrun"
os.environ['DB_PASSWORD'] = "dbtestrun"
os.environ['DB_PORT'] = "5432"

def connect_to_db():
    try:
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST'),
            database=os.getenv('DB_NAME'),  # Connecting to the default postgres DB
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            port=os.getenv('DB_PORT'),
            sslmode='require'  # Ensure SSL connection for security
        )
        print("Connected to database.")
        return conn
    except psycopg2.Error as e:
        print(f"Error connecting to database: {e}")
        return None

def list_databases():
    conn = connect_to_db()
    if conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT datname FROM pg_database WHERE datistemplate = false;")
                databases = cursor.fetchall()
                print("Databases on server:")
                for db in databases:
                    print(f"- {db[0]}")
        except psycopg2.Error as e:
            print(f"Error listing databases: {e}")
        finally:
            conn.close()
    else:
        print("Failed to connect to the database.")

if __name__ == "__main__":
    list_databases()
