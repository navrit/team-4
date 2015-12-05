import random

s = """    {
        "location": {
            "lat": "%f",
            "lng": "%f"
        },
        "issue": "This is a Sample Issue %d",
        "phone": "+447948547728",
        "categories": [
        ]
    }"""


print('[')
for i in range(300):
  lat = random.uniform(-89.99, 89.99)
  lon = random.uniform(-179.99, 179.99)
  print(s % (lat, lon, i), ",", sep="")

lat = random.uniform(-89.99, 89.99)
lon = random.uniform(-179.99, 179.99)
print(s % (lat, lon, i+1))

print(']')

