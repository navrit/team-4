# -*- coding: utf-8 -*-
import MySQLdb as mdb
import pandas as pd

class SQLObject:
    def __init__(self):
        self.db = mdb.connect('127.0.0.1','root','jpmorgan','data')
        self.cursor = self.db.cursor()
        print getStations()

    def __del__(self):
        self.close()
    def __exit__(self):
        self.close()
    def close(self):
        self.db.close()

    '''def inject(self,data):
        print ">> INJECTING "
        data = self.parsePacket(data)'''

    '''def parsePacket(self,data):
        data = data.split(',') # Commas are our delimiters for the message '''

    def getStations(self):
        df = pd.read_sql(
            "SELECT * \
            FROM data.data;",
            con=self.db)
        return df

if __name__ == "__main__":
    sql = SQLObject()
