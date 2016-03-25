import json
from geojson import Feature, Point, FeatureCollection

features = []

#try:

with open('../data/bordercrossings/bordercrossings.json') as f:

    jsondata = json.load(f);

    for line in jsondata:
        if not line.get('country'):
            continue

        country = line['country']

        # don't need the country in the dict
        del line['country']

        #if country in data:
        #    data[country].append(line)
        #else:
        #    data[country] = [ line ]
       
        lat = float(line['lat'])
        lng = float(line['lng'])
        feature = Feature(geometry=Point((lng, lat)))

        del line['lat']
        del line['lng']

        feature.properties = line

        features.append(feature)

#except Exception as e:
#    print str(e)


with open('../data/bordercrossings/bordercrossings.geojson', 'w') as outfile:
    json.dump(FeatureCollection(features), outfile)