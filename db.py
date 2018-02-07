import sqlite3 as lite
import sys

print(lite.version)
print(lite.sqlite_version)

try:
    con = lite.connect('test.db')
    cur = con.cursor()
    cur.execute('SELECT SQLITE_VERSION()')
    data = cur.fetchone()
    print("SQLite Version: {}".format(data))
except lite.Error as e:
    print("Error {}:".format(e.args[0]))
    sys.exit(1)
finally:
    if con:
        con.close()

con = lite.connect('user.db')

with con:
    cur = con.cursor()
    cur.execute("CREATE TABLE Users(Id INT, Name TEXT)")
    cur.execute("INSERT INTO Users VALUES(1,'Michelle')")
    cur.execute("INSERT INTO Users VALUES(2,'Sonya')")
    cur.execute("INSERT INTO Users VALUES(3,'Greg')")

# https://pythonspot.com/tag/database/