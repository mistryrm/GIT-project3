# Import the dependencies.

# direct to folder
# run the app: python part_03_app.py

import matplotlib.pyplot as plt
from matplotlib.dates import DateFormatter

import numpy as np
import pandas as pd
import datetime as dt

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
met = Base.classes.met_data
#################################################
# Flask Setup
#################################################
app = Flask(__name__)
#################################################
# Flask Routes
################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (f"""
        <html>
        <head>
        <title>Team 6 Project 3</title>
        <style>
        .centered {{
        position: fixed;
        top: 50px;
        left: 50px;
        }}
        </style>
        </head>
        <body>
        <div class="centered">
        <img src='https://c4.wallpaperflare.com/wallpaper/742/882/562/cat-figure-dog-wallpaper-preview.jpg'>
        <h4>Team 6 Project 3</h4>
        <h3><a href='https://miwiki612.github.io/leaflet-challenge/' >Visual Data Explorer: ^⌯𖥦⌯^ ੭ Cats VS Dogs ૮ ＾ﻌ＾ა</a></h3>
        <h4>Support by The Metropolitan Museum of Art Collection API</h4>
        Choice your team! API with json for objects<br/>
        <a href=/api/v1.0/cat>search Cats</a><br/>
        <a href=/api/v1.0/both>search Cats & Dogs join force</a><br/>
        <a href=/api/v1.0/dog>search Dogs</a><br/></div>
        </body></html>"""
    )

@app.route("/api/v1.0/<search_team>" )
def temp_team( search_team ):
    # Create our session (link) from Python to the DB
    session = Session(engine)
    conn = engine.connect()

    # Require data from DB
    team_df =  pd.read_sql(f"SELECT objectID , year , title, artist , department , objectURL FROM met_data WHERE team='{search_team}' ", conn)
    
    # Close session
    session.close()
    
    key_ls = team_df.columns

    team_return = [] 

    for i in range( len(team_df) ):
        one_object = {}
        for j in range(len(key_ls)) :
            one_object[ key_ls[j] ] =  team_df.iloc[ i , j ]
        team_return.append(one_object)

    ####        
    return jsonify(team_return)

#################################################

if __name__ == '__main__':
    app.run(debug=True)