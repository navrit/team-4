# -*- coding: utf-8 -*-
import MySQLdb as mdb
import pandas as pd

class SQLObject:
    def __init__(self):
        self.db = mdb.connect('127.0.0.1','root','jpmorgan','data')
        self.cursor = self.db.cursor()
        df = pd.read_sql("SELECT * FROM codeforgood.data;", con=self.db)
        df = df.to_json
        print df
    def __del__(self):
        self.close()
    def __exit__(self):
        self.close()
    def close(self):
        self.db.close()

if __name__ == "__main__":
    sql = SQLObject()
