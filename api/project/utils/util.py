from decimal import Decimal
import datetime
from django.db.models.fields.files import FieldFile

def default_proc(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    if isinstance(obj, (datetime.date, datetime.datetime)):
        return obj.isoformat()
    if isinstance(obj, FieldFile):
        return obj.name
    raise TypeError