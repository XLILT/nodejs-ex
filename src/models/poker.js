// 扑克类
window.Poker = {};

// 定义54张牌
Poker.all_pokers = [
    115,103,104,105,106,107,108,109,110,111,112,113,114,
    215,203,204,205,206,207,208,209,210,211,212,213,214,
    315,303,304,305,306,307,308,309,310,311,312,313,314,
    415,403,404,405,406,407,408,409,410,411,412,413,414,
    518,519
];

// 定义花色
Poker.shape = {
    1:'meihua',     //梅花
    2:'fangkuai',   //方块
    3:'heitao',     //黑桃
    4:'hongtao',    //红桃
    5:''            //大王
};

Poker.gen_random_all_pokers = function() {
    var pokers = Poker.all_pokers,
        temp = [];

    while(pokers.length){
        temp.push(pokers.splice(Math.random() * (pokers.length), 1)[0]);
    }

    return temp;
};

/**
 * [获取牌面花色]
 * @param  {[type]} poker [description]
 * @return {[type]}       [description]
 */
Poker.get_shape = function(poker) {
    return Math.floor(poker / 100);
};

/**
 * [获取牌面点数]
 * @param  {[type]} poker [description]
 * @return {[type]}       [description]
 */
Poker.get_number = function(poker) {
    return poker % 100;
};

/**
 * [获取牌面的花色字符串]
 * @param  {[type]} poker [description]
 * @return {[type]}       [description]
 */
Poker.gen_shape_str = function(poker) {
    return Poker.shape[Poker.get_shape(poker)];
};

Poker.sort = function(pokers) {
    return pokers.sort(function(a, b) {
                a = a%100;
                b = b%100;
                return a - b;
            });
};

function PokerRule() {
}

window.poker_ruler = new PokerRule;

PokerRule.prototype.poker_group_type = {
    "single": 11,                       //单个
    "single_sequence": 12,              //单顺, eg: 3-4-5-6-7
    "joker_boom": 99,                   //王炸

    "double": 21,                       //对子
    "doubule_sequence": 22,             //连对

    "triple_sequence": 31,              //三(连)不带
    "triple_sequence_with_single": 32,  //三(连)带单
    "triple_sequence_with_double": 33,  //三(连)带对

    "quadruple_with_single": 41,       //四带单
    "quadruple_with_double": 42,       //四带对
    "quadruple_boom": 98               //四不带炸弹
};

/**
 * [获取牌面数值相同的卡牌最大数量]
 * @param  {[type]} pokers [description]
 * @return {[type]}        [description]
 */
PokerRule.prototype.get_max_same_number_count = function(pokers) {
    var max_count = 0,
        number_group = {};

    pokers.forEach(function(poker) {
        var num = Poker.get_number(poker);
        number_group[num] = number_group[num] || 0;
        number_group[num]++;

        if (number_group[num] > max_count) {
            max_count = number_group[num];
        };
    });

    return max_count;
}

/**
 * [获取牌型及最小值]
 * @param  {[type]} pokers                [description]
 * @param  {[type]} max_same_number_count [description]
 * @return {[type]}                       [description]
 */
PokerRule.prototype.get_pokers_type_and_min_value = function(pokers) {
    var max_same_number_count = this.get_max_same_number_count(pokers);
    switch(max_same_number_count)
    {
        case 1:
            if(pokers.length === 1) {
                return {
                    type: this.poker_group_type["single"],
                    value: Poker.get_number(pokers[0])
                };
            }
            else if (pokers.length === 2) {
                if (pokers.indexOf(518) > -1 && pokers.indexOf(519) > -1)
                {
                    return {
                        type: this.poker_group_type["joker_boom"],
                        value: 518
                    };
                }
            }
            else if(pokers.length >= 5)
            {
                var sorted_pokers = Poker.sort(pokers);

                var current_num = Poker.get_number(sorted_pokers[0]),
                    is_valid = true;

                sorted_pokers.forEach(function(poker) {
                    if (current_num >= 15) {
                        is_valid = false;
                    }

                    if(current_num++ !== Poker.get_number(poker)) {
                        is_valid = false;
                    }
                });

                if(is_valid) {
                    return {
                        type: this.poker_group_type["single_sequence"],
                        value: Poker.get_number(sorted_pokers[0])
                    };
                }
            }

            return false;
        case 2:
            if (pokers.length === 2) {
                return {
                    type: this.poker_group_type["double"],
                    value: Poker.get_number(pokers[0])
                };
            }
            else if(pokers.length % 2 === 0) {
                var sorted_pokers = Poker.sort(pokers);
                var current_num = Poker.get_number(sorted_pokers[0]),
                    is_valid = true;

                for (var i = 0; i < sorted_pokers.length; i += 2) {
                    if (current_num !== Poker.get_number(sorted_pokers[i]) || current_num !== Poker.get_number(sorted_pokers[i + 1])) {
                        is_valid = false;
                    }

                    if (current_num++ >= 15) {
                        is_valid = false;
                    }
                };

                if (is_valid) {
                    return {
                        type: this.poker_group_type["doubule_sequence"],
                        value: Poker.get_number(sorted_pokers[0])
                    };
                }
            }

            return false;
        case 3:
            var number_group = {};

            pokers.forEach(function(poker) {
                var num = Poker.get_number(poker);
                number_group[num] = number_group[num] || 0;
                number_group[num]++;
            });

            var min_number = 0,
                triple_count = 0,
                single_count = 0,
                double_count = 0;

            for(var poker_num in number_group) {
                if(number_group[poker_num] === 3) {
                    triple_count++;

                    if(min_number === 0) {
                        min_number = poker_num;
                    }
                    else if(min_number > poker_num) {
                        min_number = poker_num;
                    }
                }
                else if(number_group[poker_num] === 2) {
                    double_count++;
                }
                else if(number_group[poker_num] === 1) {
                    single_count++;
                }
            }

            var is_valid = true,
                group_type = this.poker_group_type["triple_sequence"];
            if(single_count === 0 || double_count === 0) {
                if(single_count > 0) {
                    if(single_count !== triple_count) {
                        is_valid = false;
                    }
                    else {
                        group_type = this.poker_group_type["triple_sequence_with_single"];
                    }
                }

                if(double_count > 0) {
                    if(double_count !== triple_count) {
                        if(double_count * 2 === triple_count) {
                            group_type = this.poker_group_type["triple_sequence_with_single"];
                        }
                        else {
                            is_valid = false;
                        }

                    }
                    else {
                        group_type = this.poker_group_type["triple_sequence_with_double"];
                    }
                }
            }
            else {
                is_valid = false;
            }

            if(is_valid) {
                return {
                    type: group_type,
                    value: min_number
                }
            }
            else {
                return false;
            }
        case 4:
            if(pokers.length === 4) {
                return {
                    type: this.poker_group_type["quadruple_boom"],
                    value: Poker.get_number(pokers[0])
                }
            }
            else if(pokers.length == 6) {
                var sorted_pokers = Poker.sort(pokers);
                return {
                    type: this.poker_group_type["quadruple_with_single"],
                    value: Poker.get_number(sorted_pokers[4])
                }
            }
            else if(pokers.length == 8) {
                var number_group = {};

                pokers.forEach(function(poker) {
                    var num = Poker.get_number(poker);
                    number_group[num] = number_group[num] || 0;
                    number_group[num]++;
                });

                var min_number = 0;

                for(var poker_num in number_group) {
                    if(number_group[poker_num] === 4) {
                        if(min_number === 0) {
                            min_number = poker_num;
                        }
                        else if(min_number < poker_num) {
                            min_number = poker_num;
                        }
                    }
                    else if(number_group[poker_num] !== 2) {
                        return false;
                    }
                }

                return {
                    type: this.poker_group_type["quadruple_with_double"],
                    value: min_number
                }
            }

            return false;
        default:
            return false;
    }
}

/**
 * [是否符合出牌规则]
 * @param  {[type]} playing_pokers [将打出的牌组]
 * @param  {[type]} played_pokers  [需要压的牌组，若无需压制则为null]
 * @return {[type]}                [true-符合出牌规则, false-不符合出牌规则]
 */
PokerRule.prototype.could_play = function(playing_pokers, played_pokers) {
    var playing_pokers_type = this.get_pokers_type_and_min_value(playing_pokers);
    if(playing_pokers_type === false) {
        return false;
    }

    if(played_pokers === null || played_pokers === undefined || played_pokers.length === 0) {
        return true;
    }

    var played_pokers_type = this.get_pokers_type_and_min_value(played_pokers);
    if(played_pokers_type === false) {
        return false;
    }

    if(playing_pokers_type.type === this.poker_group_type["joker_boom"]) {
        if(played_pokers_type.type === this.poker_group_type["joker_boom"]) {
            return true;
        }
        else {
            return false;   //impossible
        }

    }
    else if(playing_pokers_type.type === this.poker_group_type["quadruple_boom"]) {
        if (played_pokers_type.type === this.poker_group_type["joker_boom"]) {
            return false;
        }
        else if(played_pokers_type.type === this.poker_group_type["quadruple_boom"]) {
            if(playing_pokers_type.value > played_pokers_type.value) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    }
    else {
        if (played_pokers_type.type === this.poker_group_type["joker_boom"]
            || played_pokers_type.type === this.poker_group_type["quadruple_boom"]) {
            return false;
        }
        else {
            if(playing_pokers.length !== played_pokers.length) {
                return false;
            }

            if(playing_pokers_type.type !== played_pokers_type.type) {
                return false;
            }

            if(playing_pokers_type.value > played_pokers_type.value) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    return true;
}
