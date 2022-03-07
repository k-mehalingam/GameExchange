const { v4: uuidv4 } = require('uuid');
const games = [
    {
        id: '1',
        name: 'DOTA 2',
        category: "MOBA",
        device_type: 'pc',
        description: 'Dota is a series of strategy video games now developed by Valve. The series began in 2003 with the release of Defense of the Ancients, a fan-developed multiplayer online battle arena mod for the video game Warcraft III: Reign of Chaos and its expansion, The Frozen Throne.',
        image: '/assests/images/moba.jpg',
        device_img: '/assests/images/pc.jpg'
    },
    {
        id: '2',
        name: 'Counter Strike: Global Offensive',
        category: "Shooting",
        device_type: 'playstation',
        description: 'Counter-Strike: Global Offensive (CS: GO) expands upon the team-based action gameplay that it pioneered when it was launched 19 years ago. CS: GO features new maps, characters, weapons, and game modes, and delivers updated versions of the classic CS content (de_dust2, etc.).',
        image: '/assests/images/shooting.jpg',
        device_img: '/assests/images/ps.jpg'
    },
    {
        id: '3',
        name: 'Need For Speed',
        category: "Racing",
        device_type: 'nintindo',
        description: 'Need for Speed is a racing video game franchise published by Electronic Arts and currently developed by Criterion Games, the developers of Burnout. The series generally centers around illicit street racing and tasks players to complete various types of races while evading the local law enforcement in police pursuits.',
        image: '/assests/images/nfs.jpg',
        device_img: '/assests/images/nn.jpg'
    },
    {
        id: '4',
        name: 'WWE',
        category: "Action",
        device_type: 'xbox',
        description: 'WWE 2K, is a series of professional wrestling sports video games based on WWE that launched in 2000. The premise of the series is to emulate pro wrestling, more specifically that of WWE, with various match types, storylines, and characters.',
        image: '/assests/images/nfs.jpg',
        device_img: '/assests/images/xbox.jpeg'
    }
]

exports.find = () => games;

exports.findById = (id) => games.find(game=>game.id === id);

exports.save = function (game) {
    game.id = uuidv4();
    game.image = "/assests/images/game.jpeg";
    games.push(game);
}

exports.updateById = function(id, newGame) {
    let game = games.find(game=>game.id === id);
    if(game) {
        game.name = newGame.name;
        game.device_type = newGame.device_type;
        game.description = newGame.description;
        // game.image = newGame.image;
        return true;
    } else {
        return false;
    }
}

exports.deleteById = function(id) {
    let index = games.findIndex(game => game.id === id);
    if(index != -1) {
        games.splice(index, 1);
        return true;
    } else {
        return false;
    }
}