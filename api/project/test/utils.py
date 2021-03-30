from factory import fuzzy
from datetime import datetime, timedelta


def get_fuzzy_date(start_days_ago, end_days_ago):
    date = fuzzy.FuzzyDate(
        start_date=(datetime.now() - timedelta(days=start_days_ago)).date(),
        end_date=(datetime.now() - timedelta(days=end_days_ago)).date(),
    ).fuzz()
    return datetime(date.year, date.month, date.day)
