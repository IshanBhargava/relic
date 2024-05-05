from flask import Flask,request,jsonify 
from flask_cors import CORS
import mysql.connector
from math import asin, atan2, cos, degrees, radians, sin

app = Flask(__name__)

CORS(app)
app.config['CORS_HEADERS']="Content-Type"

def getConnection():
    dataBase = mysql.connector.connect(
        host ="localhost",
        user ="root",
        passwd ="admin@123",
        database = "dsc-550",
        connection_timeout = 500
    )
    return dataBase

bearings = {
    'north': 0,
    'east': 90,
    'south': 180,
    'west': 270
}

def get_point_at_distance(lat1, lon1, d, R=3959) -> dict:
    lat1 = radians(lat1)
    lon1 = radians(lon1)
    coords = {}
    for b in bearings.items():
        a = radians(b[1])
        lat2 = asin(sin(lat1) * cos(d/R) + cos(lat1) * sin(d/R) * cos(a))
        lon2 = lon1 + atan2(
            sin(a) * sin(d/R) * cos(lat1),
            cos(d/R) - sin(lat1) * sin(lat2)
        )
        coords[b[0]] = [degrees(lat2), degrees(lon2)]

    return (coords)

@app.route('/getcars', methods=['PUT'])
def addData():
    manufacturer = request.json.get("manufacturer")
    model = request.json.get("model")
    dist_range = int(request.json.get("dist_range"))
    lati = float(request.json.get("lat"))
    longi = float(request.json.get("long"))

    limit = 10

    price = request.json.get("price")
    year = request.json.get("year")
    mileage = request.json.get("mileage")

    coords = get_point_at_distance(lati, longi, dist_range)
    
    try:
        dataBase = getConnection()

        min_lat = min(coords['north'][0], coords['south'][0])
        max_lat = max(coords['north'][0], coords['south'][0])
        min_long = min(coords['east'][1], coords['west'][1])
        max_long = max(coords['east'][1], coords['west'][1])

        cursor = dataBase.cursor(dictionary=True)

        if len(model) > 0:
            sql = "SELECT * FROM car WHERE (manufacturer IN ({}) AND model IN ({}) AND (lati >= %s AND lati <= %s AND longi >= %s AND longi <= %s)) LIMIT %s".format(','.join(['%s' for _ in manufacturer]), ','.join(['%s' for _ in model]))
            cursor.execute(sql, manufacturer + model + [min_lat, max_lat, min_long, max_long, limit])
        else:
            sql = "SELECT * FROM car WHERE (manufacturer IN ({}) AND (lati >= %s AND lati <= %s AND longi >= %s AND longi <= %s)) LIMIT %s".format(','.join(['%s' for _ in manufacturer]))
            cursor.execute(sql, manufacturer + [min_lat, max_lat, min_long, max_long, limit])

        records = cursor.fetchall()
        dataBase.commit()
        cursor.close()
        dataBase.close()

        if records:
            return jsonify(records)
        else:
            return jsonify([])

    except mysql.connector.Error as err:
        return jsonify({'error': f"Error fetching records: {err}"}),500
    
    finally:
        if dataBase.is_connected():
            dataBase.close()
            cursor.close()

@app.route('/getcars', methods=['OPTIONS'])
def options_handler():
    # Set CORS headers for the preflight request 
    response_headers = {
        'Access-Control-Allow-Origin': '*',  # Adjust as needed for your specific requirements
        'Access-Control-Allow-Methods': '*',  # Adjust to include other allowed methods
        'Access-Control-Allow-Headers': '*',  # Adjust to include other allowed headers
    }
    return '', 200, response_headers

@app.route('/getcarsmain', methods=['PUT'])
def addDataMain():
    manufacturer = request.json.get("manufacturer")
    model = request.json.get("model")
    dist_range = int(request.json.get("dist_range"))
    lati = float(request.json.get("lat"))
    longi = float(request.json.get("long"))

    limit = 10
    
    price = request.json.get('price')
    year = request.json.get('year')
    mileage = request.json.get('mileage')

    coords = get_point_at_distance(lati, longi, dist_range)

    try:
        dataBase = getConnection()
        min_lat = min(coords['north'][0], coords['south'][0])
        max_lat = max(coords['north'][0], coords['south'][0])
        min_long = min(coords['east'][1], coords['west'][1])
        max_long = max(coords['east'][1], coords['west'][1])

        cursor = dataBase.cursor(dictionary=True)

        if len(model) > 0:
            sql = "SELECT * FROM car WHERE (manufacturer IN ({}) AND model IN ({}) AND price >= (%s) AND price <= (%s) AND year >= (%s) AND year <= (%s) AND odometer >= (%s) AND odometer <= (%s) AND (lati >= %s AND lati <= %s AND longi >= %s AND longi <= %s)) LIMIT %s".format(','.join(['%s' for _ in manufacturer]), ','.join(['%s' for _ in model]))
            cursor.execute(sql, manufacturer + model + [price[0], price[1], year[0], year[1], mileage[0], mileage[1], min_lat, max_lat, min_long, max_long, limit])
        else:
            sql = "SELECT * FROM car WHERE (manufacturer IN ({}) AND price >= (%s) AND price <= (%s) AND year >= (%s) AND year <= (%s) AND odometer >= (%s) AND odometer <= (%s) AND (lati >= %s AND lati <= %s AND longi >= %s AND longi <= %s)) LIMIT %s".format(','.join(['%s' for _ in manufacturer]))
            cursor.execute(sql, manufacturer + [price[0], price[1], year[0], year[1], mileage[0], mileage[1], min_lat, max_lat, min_long, max_long, limit])

        records = cursor.fetchall()

        dataBase.commit()
        cursor.close()
        dataBase.close()

        if records:
            return jsonify(records)
        else:
            return jsonify([])

    except mysql.connector.Error as err:
        return jsonify({'error': f"Error fetching records: {err}"}),500
    
    finally:
        if dataBase.is_connected():
            dataBase.close()
            cursor.close()

@app.route('/getcarsmain', methods=['OPTIONS'])
def options_handler_main():
    # Set CORS headers for the preflight request 
    response_headers = {
        'Access-Control-Allow-Origin': '*',  # Adjust as needed for your specific requirements
        'Access-Control-Allow-Methods': '*',  # Adjust to include other allowed methods
        'Access-Control-Allow-Headers': '*',  # Adjust to include other allowed headers
    }
    return '', 200, response_headers

@app.route('/getsimilar', methods=['PUT'])
def getsimilar():
    target_cluster = request.json.get('cluster')
    carId = request.json.get('carId')

    limit = 10

    try:
        dataBase = getConnection()
        cursor = dataBase.cursor(dictionary=True)

        sql = "SELECT * FROM car WHERE clusters = %s AND car_id != %s ORDER BY RAND() LIMIT %s"
        cursor.execute(sql, [target_cluster, carId, limit])

        records = cursor.fetchall()
        dataBase.commit()
        cursor.close()
        dataBase.close()

        if records:
            return jsonify(records)
        else:
            # return jsonify({'message': 'No similar cars found'})
            return jsonify([])

    except mysql.connector.Error as err:
        return jsonify({'error': f"Error fetching similar cars: {err}"}),500

@app.route('/getsimilar', methods=['OPTIONS'])
def options_handler_similar():
    # Set CORS headers for the preflight request 
    response_headers = {
        'Access-Control-Allow-Origin': '*',  # Adjust as needed for your specific requirements
        'Access-Control-Allow-Methods': '*',  # Adjust to include other allowed methods
        'Access-Control-Allow-Headers': '*',  # Adjust to include other allowed headers
    }
    return '', 200, response_headers

if __name__ == "__main__":
    app.run(debug=True)