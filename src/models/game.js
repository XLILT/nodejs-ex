/*
 *  COPYRIGHT NOTICE
 *  Copyright (c) XiaolongMa
 *  All rights reserved.
 *
 *  @version : 1.0
 *  @author : mxl
 *  @E-mail : xiaolongicx@gmail.com
 *  @date : 2017/2/20
 *
 *  Revision Notes :
 */

/**
 * [玩家闭包]
 */
function Player() {
}

//Player.prototype.name = "";

Player.prototype.name = "";
Player.prototype.sex = "male";

Player.prototype.is_landlord = false;
Player.prototype.pokers = [];

Player.prototype.is_ai = false;

Player.prototype.pokers_show_dom_id = "";

/**
 * [重置游戏状态]
 * @return {[type]} [description]
 */
Player.prototype.clear_game_status = function() {
    this.is_landlord = false;
    this.pokers = [];
};

Player.prototype.add_pokers = function(add_pokers) {
    this.pokers = this.pokers.concat(add_pokers);
};

Player.prototype.on_play = function(index) {
    UI.on_user_turn(index);

    if(index === I.index) {
        UI.activate_button(true);
    }
    else {
        setTimeout(function(index, player) {
            var selected_pokers = [];
            if(player.is_ai) {
                selected_pokers = ai.selecte_pokers(game, index);
            }

            game.play_pokers(index, selected_pokers);
        }, 3000, index, this);
    }
};

/**
 * [游戏闭包]
 */
function Game() {
}

window.game = new Game;

/**
 * [一局游戏的玩家]
 * @type {Array}
 */
Game.prototype.players = [null, null, null];

/**
 * [当前玩家数量]
 * @type {Number}
 */
Game.prototype.player_count = 0;

Game.prototype.landlord_index = -1;

/**
 * [地主牌（底牌）]
 * @type {Array}
 */
Game.prototype.landlord_pokers = [];

/**
 * [上一次出牌被打出的卡组]
 * @type {Array}
 */
Game.prototype.last_pokers = [];

/**
 * [上一次出牌玩家的下标]
 * @type {Number}
 */
Game.prototype.last_player_index = -1;

/**
 * [当前出牌玩家下标]
 * @type {Number}
 */
Game.prototype.playing_index = -1;

/**
 * [添加玩家到游戏]
 * @param {[type]} player [description]
 */
Game.prototype.join_player = function(index, player) {
    if(this.player_count >= 3) {
        return false;
    }

    if(index >= 0 && index <=2) {
        if(this.players[index] === null) {
            this.players[index] = player;
            this.player_count++;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }

    return true;
};

/**
 * [使玩家离开游戏]
 * @param  {[type]} index [description]
 * @return {[type]}       [description]
 */
Game.prototype.leave_player = function(index) {
    if(index >= 0 && index <=2) {
        if(this.players[index] !== null) {
            this.players[index] = null;
            this.player_count--;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }

    return true;
};

/**
 * [开始游戏]
 * @return {[type]} [description]
 */
Game.prototype.start = function() {
    if(this.player_count !== 3) {
        return false;
    }

    this.last_pokers = [];
    this.last_player_index = -1;
    this.playing_index = -1;

    var all_pokers = Poker.gen_random_all_pokers();
    this.landlord_pokers = all_pokers.splice(0, 3);

    this.players.forEach(function(player) {
        player.clear_game_status();

        player.pokers = all_pokers.splice(0, 17);
    });
}

/**
 * [玩家叫地主]
 * @param  {[type]} index [description]
 * @return {[type]}       [description]
 */
Game.prototype.get_landlord = function(index) {
    if(index >= 0 && index <= 2) {
        var landlord = this.players[index];

        this.landlord_index = index;
        landlord.is_landlord = true;
        this.playing_index = index;

        if(this.landlord_pokers.length === 3) {
            landlord.add_pokers(this.landlord_pokers);
        }

        UI.show_landlord_pokers(this.landlord_pokers);
    }
    else {
        return false;
    }
};

/**
 * [出牌]
 * @param  {[type]} index  [description]
 * @param  {[type]} pokers [description]
 * @return {[type]}        [description]
 */
Game.prototype.play_pokers = function(index, pokers) {
    if(index !== this.playing_index) {
        return false;
    }

    var final_pokers = this.players[index].pokers.concat(),
        pokers_existing = true;

    if(pokers instanceof Array && pokers.length > 0) {
        pokers.forEach(function(poker) {
            var poker_index = final_pokers.indexOf(poker);
            if(poker_index > -1) {
                final_pokers.splice(poker_index, 1);
            }
            else {
                pokers_existing = false;
            }
        });
    }

    if(pokers_existing) {
        if(pokers.length > 0) {
            if(this.last_player_index === this.playing_index || this.last_player_index === -1) {
                this.last_pokers = [];
            }

            if(poker_ruler.could_play(pokers, this.last_pokers) === false) {
                return false;
            }

            this.last_player_index = this.playing_index;
            this.last_pokers = pokers;

            this.players[index].pokers = final_pokers;

            // 更新牌数
            UI.update_poker_num(this.players[index].pokers.length, index);

            // 展示已经打出的牌
            UI.show_played_pokers(pokers, this.players[index].pokers_show_dom_id);

            if(index === I.index) {
                // 重绘我的扑克牌
                UI.show_my_pokers(I.pokers);

                // 失效按钮
                UI.activate_button(false);
            }
        }
    }
    else {
        return false;
    }

    if(final_pokers.length === 0) {
        this.on_game_over(index);

        return true;
    }

    if(++this.playing_index >= 3) {
        this.playing_index = 0;
    }

    this.players[this.playing_index].on_play(this.playing_index);

    return true;
};

/**
 * [出牌时间超时]
 * @return {[type]} [description]
 */
Game.prototype.on_time_out = function() {
    if(this.last_player_index === -1 || this.last_player_index === this.playing_index) {
        var sorted_pokers = Poker.sort(this.players[this.playing_index].pokers);
        var selected_pokers = [];
        selected_pokers.push(sorted_pokers[0]);

        this.play_pokers(this.playing_index, selected_pokers);
    }
    else {
        this.play_pokers(this.playing_index, []);
    }
}

/**
 * [游戏结束]
 * @param  {[type]} winner_index [description]
 * @return {[type]}              [description]
 */
Game.prototype.on_game_over = function(winner_index) {
    var is_landlord_win = this.players[winner_index].is_landlord;
    setTimeout(function(is_landlord_win) {
        UI.on_game_over(is_landlord_win);
    }, 1000, is_landlord_win);
}

export { Player };
