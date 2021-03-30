from datetime import date

class Utility():
    def date_month_year(self, date):
        return date.strftime("%d/%m/%Y")

    def month_date_year(self, date):
        return date.strftime("%m/%d/%Y")