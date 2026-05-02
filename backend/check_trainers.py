import sqlite3
conn = sqlite3.connect('shapeup.db')
cursor = conn.cursor()
cursor.execute("SELECT * FROM trainers")
rows = cursor.fetchall()
print(f"Found {len(rows)} trainers")
for row in rows:
    print(row)
conn.close()
