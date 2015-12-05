# -*- coding: utf-8 -*-
import MySQLdb as mdb
import pandas as pd

class SQLObject:
    def __init__(self, query):
        if not query:
          query = "SELECT * FROM codeforgood.data;"
        self.db = mdb.connect('127.0.0.1','root','jpmorgan','data')
        self.cursor = self.db.cursor()
        self.df = pd.read_sql(query, con=self.db)
        self.df = self.df.to_json(path_or_buf = None,
				   orient = 'records',
				   date_format = 'iso',
				   double_precision = 10,
				   force_ascii = True,
				   date_unit = 'ms',
				   default_handler = None)

    def __del__(self):
        self.close()
    def __exit__(self):
        self.close()
    def close(self):
        self.db.close()
    def get(self):
        return self.df

if __name__ == "__main__":
    sql = SQLObject("")
