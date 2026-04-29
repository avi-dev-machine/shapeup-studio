import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'shapeup.db')
conn = sqlite3.connect(db_path)
c = conn.cursor()
c.execute("UPDATE gym_hours SET time_range='3:30 PM - 5:00 PM' WHERE slot_name LIKE '%Ladies%';")
conn.commit()
conn.close()
print("Updated successfully")
