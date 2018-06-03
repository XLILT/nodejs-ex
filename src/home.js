require('./models/poker');
require('./models/ui');
var { Player } = require('./models/game');
require('./models/ai');

require('./models/css/base.css');
require('./models/css/main.less');

(function(window){
    /*
    users = [
    {
        name: "user0",
        sex: 'male',
        pokers: [203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 518, 519, 303, 304]
    },
    {
        name: "user1",
        sex: 'female',
        pokers: [104]
    },
    {
        name: "user2",
        sex: 'female',
        pokers: [105]
    }
    ];

    var my_id = 0;
    UI.show_users(users, my_id);
    window.I = users[my_id];
    I.index = my_id;
    UI.show_my_pokers(I.pokers);

    UI.init_my_buttons();
    */

    var my_id = 0;
    var arr = [
        [1,2],
        [2,0],
        [0,1]
    ];

    var ids = ['#rightUserContent','#leftUserContent'];

    for (var i = 0; i < 3; i++) {
        var player = new Player;
        player.name = "user" + i;
        if(i !== my_id)  {
            player.is_ai = true;
        }

        if(i === my_id) {
            player.pokers_show_dom_id = '#myProfileContent';
        }
        else if(i === arr[my_id][0]){
            player.pokers_show_dom_id = ids[0];
        }
        else {
            player.pokers_show_dom_id = ids[1];
        }

        game.join_player(i, player);
    }

    game.start();

    window.I = game.players[my_id];
    I.index = my_id;

    UI.show_my_pokers(I.pokers);

    UI.init_my_buttons();

    UI.bind_event();

    game.get_landlord(my_id);

    UI.show_users(game.players, my_id);

    UI.show_my_pokers(I.pokers);
    UI.update_poker_num(I.pokers.length, I.index);

    game.players[game.landlord_index].on_play(game.landlord_index);

})(window);
