from datetime import datetime, date
from decimal import Decimal
import json


def parse_date(date_str) -> date:
    if isinstance(date_str, str):
        return datetime.strptime(date_str, "%Y/%m/%d").date()
    elif isinstance(date_str, date):
        return date_str
    else:
        raise ValueError("Unsupported date format")


class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)
