#import requests
import requests,json,datetime
from urllib import quote_plus


players = {
    "Luis":"onecintron",
    "Andres": "andresblanco813",
    "Leandro": "mighty dro",
    "Orlando": "Ix BiG TyMe xI",
    "-": "ADIDAS1505",
    "-": "ByteRocket",
    "Eduardo": "edtron08"
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
        content = content+json.dumps(data)
        if index != (len(players)-1):
            content= content+","

content = content+"]}"

newjson = json.loads(content)
statschanged = newjson["players"] != oldjson["players"]

if statschanged:
    f = open ("data.json", "w")
    f.write(content)