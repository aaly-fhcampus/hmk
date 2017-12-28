from flask_sqlalchemy import SQLAlchemy
from flask import Blueprint

db = SQLAlchemy()
mod = Blueprint("api", __name__, template_folder="templates", static_folder='static')

from . import controlller
from . import models