# Import the dependencies.

# direct to folder
# run the app: python part_03_app.py

import matplotlib.pyplot as plt
from matplotlib.dates import DateFormatter

import numpy as np
import pandas as pd
import datetime as dt

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, text, inspect

from flask import Flask, jsonify , render_template

#################################################
# Database Setup
#################################################

engine = create_engine("sqlite:///../data/met_data.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(autoload_with=engine)

# Save references to each table
met = Base.classes.met

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)



#################################################
# Flask Routes
#################################################
@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Welcome to the Honolulu, Hawaii climate analysis API!<br/>"
        f"date format YYYY-MM-DD"
        f"Available Routes:<br/>"
        f"/api/v1.0/precipitation<br/>"
        f"/api/v1.0/stations<br/>"
        f"/api/v1.0/tobs<br/>"
        f"/api/v1.0/{{start.date}}<br/>"
        f"/api/v1.0/{{start.date}}/{{end.date}}"
    )

@app.route("/battle")
def index():
    return render_template('index.html')

# @app.route("/api/v1.0/<start>", defaults={'end': dt.datetime.now().strftime("%Y-%m-%d") } )
# @app.route("/api/v1.0/<start>/<end>")
# def temp_range( start , end ):
#     #### active station
#     # Require data from DB
#     session = Session(engine)
    
#     # require temperature within the date range
#     temp_data = session.query( func.min(measurement.tobs), func.avg(measurement.tobs) , func.max(measurement.tobs) ).\
#     filter( measurement.date >= start ).filter( measurement.date <= end ).all()
    
#     # Starting from the most recent data point in the database.
#     latest_date = session.query(measurement.date).order_by(measurement.date.desc()).first()
#     latest_date = [ i for i in latest_date ][0]
    
#     # Starting from the eariliest data point in the database.
#     earliest_date = session.query(measurement.date).order_by(measurement.date.asc()).first()
#     earliest_date = [ i for i in earliest_date ][0]
    
#     # Close session
#     session.close()
#     ####
    
#     # adjust entered date to excist data date
    
#     start_date = dt.datetime.strptime( start , "%Y-%m-%d")
#     end_date = dt.datetime.strptime( end, "%Y-%m-%d")
    
#     earliest_date = dt.datetime.strptime( earliest_date, "%Y-%m-%d")
#     latest_date = dt.datetime.strptime( latest_date, "%Y-%m-%d")
    
#     # actuall data range
#     date_from = max( start_date , earliest_date)
#     date_to = min( end_date , latest_date)
    
#     # transfer TMIN, TAVG, and TMAX to list
#     temp_data = temp_data[0]
#     temp_data = [ i for i in temp_data ]
    
#     if date_from <= date_to:
#         temp_dict = {"minimum temperature" : round(temp_data[0],2) , \
#                      "average temperature" : round(temp_data[1],2) , \
#                      "maximum temperature" : round(temp_data[2],2) , 
#                      "date_from" : date_from.strftime("%Y-%m-%d") , "date_to" : date_to.strftime("%Y-%m-%d") }
#     # error return for empty date range
#     else :
#         temp_dict = { "error" : "no data"}
        
#     return jsonify(temp_dict)

#################################################

if __name__ == '__main__':
    app.run(debug=False)