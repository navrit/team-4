'''
    Phone: from Twilio
    Location(: --> GPS [51.2:41.4], else GoogleMap lookup),

    Message: Location, condition type, issues (general purpose message), Name, Age

    STRUCTURED SMS [ ; ]

        Augustus;15;51.3,13.4;visual,mobility;No braille facilities at school;

        Name;Age;[Lat,Lng]/[Place name];Condition types;Issue?;?
        ;;89,67;;
    '''
# -*- coding: utf-8 -*-
import MySQLdb as mdb
import pandas as pd

class SQLObject:
    def __init__(self, query="SELECT * FROM codeforgood.data;"):
        self.db = mdb.connect('127.0.0.1','root','jpmorgan','codeforgood')
        self.cursor = self.db.cursor()
        self.query = query

    def __del__(self):
        self.close()
    def __exit__(self):
        self.close()
    def close(self):
        self.db.close()

    def get(self):
        df = pd.read_sql(self.query, con = self.db)
        df = df.to_json(path_or_buf = None,
                        orient = 'records',
                        date_format = 'iso',
                        double_precision = 10,
                        force_ascii = True,
                        date_unit = 'ms',
                        default_handler = None)

    def getData(self):
        df = pd.read_sql("SELECT * FROM codeforgood.data;", con=self.db)
        df = df.to_json(path_or_buf = None,
            orient = 'records',
            date_format = 'iso',
            double_precision = 10,
            force_ascii = True,
            date_unit = 'ms',
            default_handler = None)
        self.writeFile(df)

    def writeFile(self,df):
        target = open('data.json', 'w')
        try:
            target.truncate()
            target.write(df)
            target.close()
        except IOError:
            target.close()
            print "\n>> FATAL I/O ERROR - NO OUTPUT\n"
        except Exception:
            target.close()
            print "\n>> ERRORRR - Some non IO error, what the hell is going on"

if __name__ == "__main__":
    sql = SQLObject()
    sql.get()
