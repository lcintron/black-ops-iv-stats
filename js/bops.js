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
        player.id = p.user.id;
        player.name(p.name);
        player.gamertag(p.user.username);
        player.avataruri(p.user.avatar);
        player.kills(p.stats.kills);
        player.deaths(p.stats.deaths);
        player.ekia(p.stats.ekia);
        player.suicides(p.stats.suicides);
        player.level(p.stats.level);
        player.prestige(p.stats.prestige);
        player.totalgames(p.stats.gamesplayed);
        player.timeplayed(p.stats.timeplayed);
        player.totalshots(p.stats.totalshots);
        player.longestkillstreak(p.stats.longestkillstreak);
        self.players.push(player);
    };
    self.addPlayers = function (json) {
        if (json && json.players) {
            let players = json.players;
            players.forEach(function (p) {
                self.addPlayer(p);
            });

            //sort after adding all players
            self.sortPlayers();

            //set interval 
            let int = setInterval(self.requestUpdatePlayers, 30000);
            self.lastupdated("Last updated on "+json.lastupdated);
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
            if (player.id === p.user.id) {
                player.name(p.name);
                player.gamertag(p.user.username);
                player.avataruri(p.user.avatar);
                player.kills(p.stats.kills);
                player.deaths(p.stats.deaths);
                player.ekia(p.stats.ekia);
                player.suicides(p.stats.suicides);
                player.level(p.stats.level);
                player.prestige(p.stats.prestige);
                player.totalgames(p.stats.gamesplayed);
                player.timeplayed(p.stats.timeplayed);
                player.totalshots(p.stats.totalshots);
                player.longestkillstreak(p.stats.longestkillstreak);
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
            self.lastupdated("Last updated on "+json.lastupdated);
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
