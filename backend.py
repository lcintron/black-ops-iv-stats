#import requests
import requests,json,datetime
from urllib import quote_plus


players = {
    "Luis":"onecintron",
    "Andres": "andresblanco813",
    "Leandro": "mighty dro",
    "Orlando": "Ix BiG TyMe xI",
    "-0-": "ADIDAS1505",
    "-1-": "ByteRocket"
}

statschanged = False
olddata = open("data.json").read()
oldjson = json.loads(olddata)

content = "{ \"lastupdated\":\""+str(datetime.datetime.now())+"\", \"players\":["
for index,player in enumerate(players):
    gamertag = players[player].replace(" ", "%20")
    validateurl = "https://bo4tracker.com/api/validate/bo4/"+gamertag+"/xbl"
    statsurl = "https://bo4tracker.com/api/stats/bo4/"+gamertag+"/xbl"
    validateresponse = requests.get(validateurl)
    validate = validateresponse.json()
    if validate["success"]:
        statsresponse = requests.get(statsurl)
        data = statsresponse.json()
        data["name"] = player
        data.pop("cache", None)
        content = content+json.dumps(data)
        if index != (len(players)-1):
            content= content+","

content = content+"]}"

newjson = json.loads(content)
statschanged = json.dumps(newjson["players"]) != json.dumps(oldjson["players"])

if statschanged:
    print(str(datetime.datetime.now()) +": Data changed")
    f = open ("data.json", "w")
    f.write(content)
else:
    print(str(datetime.datetime.now()) +": Data unchanged")