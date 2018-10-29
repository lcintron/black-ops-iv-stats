
function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
}

function Player() {
    let self = this;
    self.id = '';
    self.name = ko.observable();
    self.gamertag = ko.observable();
    self.kills = ko.observable(0);
    self.avataruri = ko.observable('');
    self.deaths = ko.observable(0);
    self.ekia = ko.observable(0);
    self.suicides = ko.observable(0);
    self.rank = ko.observable();
    self.level = ko.observable();
    self.prestige = ko.observable();
    self.totalgames = ko.observable(0);
    self.timeplayed = ko.observable(0)
    self.totalshots = ko.observable(0);
    self.longestkillstreak = ko.observable(0);
    self.kd = ko.pureComputed(function () {
        if (self.deaths() === 0)
            return self.kills();

        return (self.kills() / self.deaths()).toFixed(2);
    });
}

function AppViewModel() {
    let self = this;
    self.players = ko.observableArray();
    self.lastupdated = ko.observable("--");
    self.addPlayer = function (p) {
        let player = new Player();
        player.id = p.username;
        player.name(p.name);
        player.gamertag(p.username);
        player.avataruri("");
        let stats = p.mp.lifetime.all;
        player.kills(stats.kills);
        player.deaths(stats.deaths);
        player.ekia(stats.ekia);
        player.suicides(stats.suicides);
        player.level(p.mp.level);
        player.prestige(p.mp.prestige);
        player.totalgames(stats.totalGamesPlayed);
        player.timeplayed(stats.timePlayedTotal);
        player.totalshots(stats.totalShots);
        player.longestkillstreak(stats.longestKillstreak);
        self.players.push(player);
    };
    self.addPlayers = function (json) {
        if (json && json.players) {
            let players = json.players;
            players.forEach(function (p) {
                if(p.username && p.platform)
                    self.addPlayer(p);
            });

            //sort after adding all players
            self.sortPlayers();

            //set interval 
            let int = setInterval(self.requestUpdatePlayers, 30000);
            self.lastupdated("Last updated " + timeSince(new Date(json.lastupdated)));
            console.log('Players added!');
        }
    };
    self.sortPlayers = function () {
        if (self.players() && self.players().length > 0) {
            self.players.sort(function (left, right) {
                return left.kd() === right.kd() ? 0 : (left.kd() < right.kd() ? 1 : -1);
            });
        }
    }

    self.updatePlayer = function (p) {
        for (i = 0; i < self.players().length; i++) {
            let player = self.players()[i];
            if (player.id === p.username) {
                player.name(p.name);
                player.gamertag(p.username);
                player.avataruri("");
                let stats = p.mp.lifetime.all;
                player.kills(stats.kills);
                player.deaths(stats.deaths);
                player.ekia(stats.ekia);
                player.suicides(stats.suicides);
                player.level(p.mp.level);
                player.prestige(p.mp.prestige);
                player.totalgames(stats.totalGamesPlayed);
                player.timeplayed(stats.timePlayedTotal);
                player.totalshots(stats.totalShots);
                player.longestkillstreak(stats.longestKillstreak);
                return;
            }
        };
    };

    self.updatePlayers = function (json) {
        if (json && json.players) {
            for (i = 0; i < json.players.length; i++) {
                var p = json.players[i];
                self.updatePlayer(p);
            }

            //sort after updating players
            self.sortPlayers();
            self.lastupdated("Last updated " + timeSince(new Date(json.lastupdated)));
            console.log('Players updated!');
        }

    };

    self.requestUpdatePlayers = function () {
        $.getJSON("./data.json", self.updatePlayers);
    };


    $.getJSON("./data.json", self.addPlayers);
}

var bops = {
    vm: new AppViewModel()
};

// Activates knockout.js
ko.applyBindings(bops.vm);
