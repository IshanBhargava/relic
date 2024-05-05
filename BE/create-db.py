import pandas as pd
import mysql.connector
import datetime

pd.set_option('display.max_columns', None)

dt = pd.read_csv("../BE/final_cars.csv").rename(columns = {
    'id':'car_id',
    'condition':'conditions',
    'lat':'lati',
    'long':'longi'})

data = dt.to_dict("records")

for rec in data:
    datetime_with_timezone = datetime.datetime.strptime(rec['posting_date'], "%Y-%m-%dT%H:%M:%S%z")
    rec['posting_date'] = datetime_with_timezone.isoformat()

dataBase = mysql.connector.connect(
host ="localhost",
user ="root",
passwd ="<password>",
database = "dsc-550",
connection_timeout = 500
)

for rec in data:
    placeholder = ", ".join(["%s"] * len(rec))
    query = "INSERT INTO car ({cols}) values ({values})".format(cols=",".join(rec.keys()), values=placeholder)
    cursorObject = dataBase.cursor(dictionary=True)
    cursorObject.execute(query, list(rec.values()))
    results = cursorObject.fetchall()
    dataBase.commit()
    cursorObject.close()