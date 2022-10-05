from PIL import Image
import os
import re
import json

pattern = r"\d_[a-zA-Z]*.jpg"

path = r'/Users/jonathanp/Library/CloudStorage/OneDrive-SharedLibraries-NAMM/Museum of Making Music - Documents/Collection/Collection Image Library/D-Rail Artifact Photos-closeups/Collection Images/Staging/1B'
imagesJSON = {}
file_list = []
file_dict = {}

for root, dirs, files in os.walk(path):
    for file in files:
        file_list.append(file)

file_list.sort()

for file in file_list:
    obj = file.split('_')[0]
    view = file.split('_')[1].split('.jpg')[0]
    key_found = False
    for k in file_dict.copy():
        if obj == k:
            key_found = True
    if not key_found:
        file_dict[obj] = {"images": []}
    key_found = False 
    for view_name in file_dict[obj]['images'].copy():
        if view == view_name['name']:
            key_found = True
    if not key_found:
        #print(file, obj, view, file_dict[obj]['images'])
        file_dict[obj]['images'].append({'name':view, 'width':0, 'height':0, 'altsizes':[]})
    if len(file.split('_')) == 2:
        img = Image.open(path + '/' + file)
        w,h = img.size
        for image in file_dict[obj]['images']:
            if image['name'] == view:
                image['width'] = w
                image['height'] = h
    else:
        size = file.split('_')[2].split('.jpg')[0]
        for image in file_dict[obj]['images']:
            if image['name'] == view:
                image['altsizes'].append("_" + size)


#print(json.dumps(file_dict))

def get_database():
    from pymongo import MongoClient
    import pymongo

    # Provide the mongodb atlas url to connect python to mongodb using pymongo
    CONNECTION_STRING = "mongodb://mommRailAdmin:MoMM5790mOmm@192.168.168.180:27017/?authSource=admin&readPreference=primary&directConnection=true&ssl=false"

    # Create a connection using MongoClient. You can import MongoClient or use pymongo.MongoClient
    from pymongo import MongoClient
    client = MongoClient(CONNECTION_STRING)

    db = client.museum

    # Create the database for our example (we will use the same database throughout the tutorial
    return db.drex
    
# This is added so that many files can reuse the function get_database()
if __name__ == "__main__":    
    # Get the database
    col = get_database()

    result = col.find({'type':'artifact'})
    for doc in result:
        for obj in file_dict:
            if doc['identifier'] == obj:
                #print(file_dict[obj]["images"])
                col.update_one({"identifier":doc["identifier"]},{"$set":{"content.images":file_dict[obj]["images"]}})
                print('updating ', doc['identifier'])