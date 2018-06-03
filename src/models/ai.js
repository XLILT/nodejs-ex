/*
 *  COPYRIGHT NOTICE
 *  Copyright (c) XiaolongMa
 *  All rights reserved.
 *
 *  @version : 1.0
 *  @author : mxl
 *  @E-mail : xiaolongicx@gmail.com
 *  @date : 2017/2/22
 *
 *  Revision Notes :
 */

function AI() {
}

window.ai = new AI;

/**
 * [在电脑轮次，为电脑选择出牌]
 * @param  {[type]} game  [description]
 * @param  {[type]} index [description]
 * @return {[type]}       [description]
 */
AI.prototype.selecte_pokers = function(game, index) {
    if(index !== game.playing_index) {
        return [];
    }

    if(game.last_player_index === -1 || game.last_player_index === game.playing_index) {
        return this.play_without_quell_pokers(game, index);
    }
    else {
        return this.play_with_quell_pokers(game, index);
    }
};

/**
 * [自由出牌轮次]
 * @param  {[type]} pokers [description]
 * @return {[type]}        [description]
 */
AI.prototype.play_without_quell_pokers = function(game, index) {
    // 简化逻辑，出任意单张
    var selected_pokers = [];
    selected_pokers.push(game.players[index].pokers[0]);
    return selected_pokers;
};

/**
 * [压制牌面轮次]
 * @param  {[type]} game  [description]
 * @param  {[type]} index [description]
 * @return {[type]}       [description]
 */
AI.prototype.play_with_quell_pokers = function(game, index) {
    // 简化逻辑，出任意可压制的牌组
    switch(game.last_pokers.length) {
    case 1:
        var sorted_pokers = Poker.sort(game.players[index].pokers),
            selected_pokers = [];

        for (var i = sorted_pokers.length - 1; i >= 0; i--) {
            if(Poker.get_number(sorted_pokers[i]) <= Poker.get_number(game.last_pokers[0])) {
                if(i + 1 <= sorted_pokers.length - 1) {

                    selected_pokers.push(sorted_pokers[i + 1]);

                    return selected_pokers;
                }
                else {
                    return selected_pokers;
                }
            }
            else {
                if(i === 0) {
                    selected_pokers.push(sorted_pokers[0]);

                    return selected_pokers;
                }
            }
        }

        return selected_pokers;

    default:
        return [];
    }
};

/**
 * [尽可能压制，优先出顺子、三带这种牌]
 * @param  {[type]} pokers        [description]
 * @param  {[type]} played_pokers [description]
 * @return {[type]}               [description]
 */
AI.prototype.play_if_could = function(pokers, played_pokers) {
    return null;
};

/**
 * [获取最优先打出的牌组，最简逻辑不考虑配合和剩余手牌]
 *
 *  顺子
 *  三个
 *  对子
 *  单个
 *
 * @param  {[type]} pokers [description]
 * @return {[type]}        [description]
 */
AI.prototype.get_priority_pokers = function(pokers) {
    // 有顺子出最长顺子
    var sort_unique_pokers = this.filter_and_sort_for_sequence(pokers);
    var longest_sequence = [],
        longest_len = 0;

    for (var i = 0; i < sort_unique_pokers.length - 4; i++) {
        var current_num = Poker.get_number(sort_unique_pokers[i]);

        for (var j = sort_unique_pokers.length - 1; j > i + 4; j--) {
            var remote_num = Poker.get_number(sort_unique_pokers[j]);
            if(remote_num - current_num === j - i) {
                if(longest_len < remote_num - current_num) {
                    longest_sequence = sort_unique_pokers.slice(i, j);
                    longest_sequence = remote_num - current_num;
                }

                break;
            }
        }
    }

    if(longest_len >= 5) {
        return longest_sequence;
    }

    // 出单个
    var sorted_pokers = Poker.sort(pokers);
    var single_poker = [];
    single_poker.push(sorted_pokers[0]);

    return single_poker;
};

/**
 * [获取可能组成顺子的牌，并排序去重(只留一张)]
 * @param  {[type]} pokers [description]
 * @return {[type]}        [description]
 */
AI.prototype.filter_and_sort_for_sequence = function(pokers) {
    var got_numbers = [],
        unique_pokers = [];

    pokers.forEach(function(poker) {
        var num = Poker.get_number(poker);
        if(got_numbers.indexOf(num) < 0 && num <= 14) {
            got_numbers.push(num);
            unique_pokers.push(poker);
        }
    });

    return Poker.sort(unique_pokers);
};
