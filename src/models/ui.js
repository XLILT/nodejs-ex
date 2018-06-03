var $ = require('jquery');

// 界面管理类
window.UI = {};

// 按钮对应css类
UI.cls_obj = {
    '不出':'pass',
    '提示':'tips',
    '开始':'start',
    '出牌':'play',
    '重选':'reselect',
    '不叫':'gamble0',
    '3分':'gamble3',
    '2分':'gamble2',
    '1分':'gamble1'
}

UI.timer = null;
UI.max_one_turn_seconds = 30;

UI.bind_event = function() {
    $('#myPokers').delegate('.poker', 'click', this.on_event_click_poker);
    $('#myButtons').delegate('.button', 'click', this.on_event_click_button);
}

/**
 * [展示底牌]
 * @return {[type]} [description]
 */
UI.show_landlord_pokers = function(landlord_pokers) {
    landlord_pokers.forEach(function(a) {
        UI.gen_poker_DOM(a, !0).appendTo('#dipai');
    });
}

/**
 * [展示全部用户头像]
 * @param  {[type]} users [description]
 * @param  {[type]} myid  [description]
 * @return {[type]}       [description]
 */
UI.show_users = function(users, myid) {
    var arr = [
        [2, 0, 1],
        [0, 1, 2],
        [1, 2, 0]
    ];
    arr = arr[myid];
    var ids = ['#leftUser', '#myProfile', '#rightUser'];

    for(var i = 0; i < 3; i++) {
        var user_id = arr[i];
        if(users[user_id]) {
            users[user_id].nodeID = ids[i];
            UI.show_one_user(users[user_id], user_id, users[user_id].nodeID);
        }
    }
}

/**
 * [显示我的扑克牌]
 * @param  {[type]} pokers [description]
 * @return {[type]}        [description]
 */
UI.show_my_pokers = function(pokers) {
    $('#myPokers').empty();

    var pokers = Poker.sort(pokers),
        len, interval, right_margin,
        $node;

    len = pokers.length;
    interval = 33;
    right_margin = Math.floor((850 - (interval * (len - 1) + len)) / 2);

    pokers.forEach(function(poker, i) {
        $node = UI.gen_poker_DOM(poker);
        $node.css({zIndex: (100 - i), right: right_margin + interval * i}).appendTo('#myPokers');
    });
}

/**
 * [显示操作按钮]
 * @return {[type]} [description]
 */
UI.init_my_buttons = function() {
    var buttons = ['不出','重选','提示','出牌'];
    var $node;
    buttons.forEach(function(text) {
        $node = UI.gen_button_DOM(text);
        $node.appendTo('#myButtons');
    });

    UI.activate_button(false);
}

/**
 * [响应点击扑克时间]
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
UI.on_event_click_poker = function(e) {
    var $t = $(this),
        pokers = [],
        is_selected = $t.attr('pselected');

    pokers.push(parseInt($t.attr('poker'), 10));
    if(is_selected)
    {
        // unselect it
        UI.select_pokers(pokers, false);
    }
    else
    {
        // select it
        UI.select_pokers(pokers);
    }
}

UI.on_event_click_button = function(e) {
    var button_title = this.title;

    if (button_title ===  "出牌")
    {
        UI.on_button_play();
    }
    else if (button_title ===  "不出")
    {
        UI.on_button_not_play();
    }
    else if (button_title ===  "重选")
    {
        UI.on_button_reselect();
    }
    else if (button_title ===  "提示")
    {
        UI.on_button_tips();
    }
}

UI.on_button_not_play = function() {
    game.play_pokers(I.index, []);

    // 失效按钮
    this.activate_button(false);
}

UI.on_button_reselect = function() {
    $('#myPokers > .poker[selected="true"]').css({bottom:0}).removeAttr('pselected');
}

UI.on_button_tips = function() {

}

UI.on_button_play = function() {

    var pokers = this.get_selected_pokers();

    if(pokers.length === 0) {
        this.show_tips('请选择要出的牌');
        return;
    }

    if(game.play_pokers(I.index, pokers) === false) {
        this.show_tips('不符合出牌规则');
        return;
    }

    /*
    //出牌
    this.do出牌(cards,'#myProfileContent');
    //this.updateMe
    this.showMePoker(I.pokers);
    this.setNextUser();
    this.buttonHide();
    */
}

UI.show_played_pokers = function(pokers, id) {
    $('.pokerContainer').empty();

    var len;
    if(len = pokers.length) {
        if(id.indexOf('#') !== 0) {
            id = '#' + id;
        }

        var temp = 0,
            obj,
            rOrL = 'left',
            every = 25;
        if(id === '#myProfileContent') {
            temp = 350 - ((len-1) * every + 84) / 2;
            temp = temp < 0 ? 0 : temp;
        }else if(id === '#rightUserContent') {
            rOrL = 'right';
        }

        pokers.forEach(function(poker, index) {
            len++;
            obj = {zIndex:100 + len};
            obj[rOrL] = index * every + temp
            UI.gen_poker_DOM(poker, false).css(obj).appendTo(id);
        });
    }
}

UI.on_user_turn = function(user_index) {
    $('.hightlight').removeClass('hightlight');
    UI.clear_timer();

    var $node = $('#userID'+user_index).addClass('hightlight').find('.clock').show().find('p').html(UI.max_one_turn_seconds);
    UI.timer = setInterval(function() {
        var time = +$node.html();
        time--;
        if(time === 0){

            game.on_time_out();

            UI.clear_timer();
            return;
        }

        $node.html(time);
    }, 1000);
}

UI.clear_timer = function() {
    $('.clock').hide();
    UI.timer && clearInterval(UI.timer);
}

/**
 * [获取已选扑克牌]
 * @return {[type]} [description]
 */
UI.get_selected_pokers = function() {
    var back = [];
    var $nodes = $('#myPokers > .poker[pselected="true"]');

    console.log($nodes)

    $nodes.each(function(index) {
        back.push(parseInt($nodes.eq(index).attr('poker'), 10));
    });

    return back;
}

/**
 * [选择或者弃选卡牌]
 * @param  {[type]}  pokers    [description]
 * @param  {Boolean} is_select [description]
 * @return {[type]}            [description]
 */
UI.select_pokers = function(pokers, is_select) {
    is_select = is_select == null ? true : is_select;
    pokers.forEach(function(poker) {
        var selector = '.poker[poker="' + poker + '"]';
        if(is_select)
        {
            $(selector).css({bottom:20}).attr('pselected', true);
        }
        else
        {
            $(selector).css({bottom:0}).removeAttr('pselected');
        }
    });
}

/**
 * 显示提示
 * @param  {[type]} tips [description]
 * @return {[type]}      [description]
 */
UI.show_tips = function(tips) {
    var $t = $('#tips').html(tips).css({visibility: 'visible'});

    setTimeout(function() {
        $t.css({visibility: 'hidden'});
    }, 5E3);
}

/**
 * [激活或者禁用按钮]
 * @param  {Boolean} is_activate [description]
 * @return {Boolean}             [description]
 */
UI.activate_button = function(is_activate) {
    if(is_activate)
    {
        $('#myButtons .button').removeClass('disabled');
    }
    else
    {
        $('#myButtons .button').addClass('disabled');
    }
}

/**
 * [生成按钮DOM]
 * @param  {[type]} text [description]
 * @return {[type]}      [description]
 */
UI.gen_button_DOM = function(text) {
    var cls = UI.cls_obj[text];
    return $('<div class="button" title="' + text + '"><div class="text ' + cls + '"><span></span><span></span></div></div>');
}

/**
 * [展示单个用户头像]
 * @param  {[type]} user  [description]
 * @param  {[type]} index [description]
 * @param  {[type]} id    [description]
 * @return {[type]}       [description]
 */
UI.show_one_user = function(user, index, id){
    var len = user.pokers.length,
        name = user.name,
        sex = user.sex,
        is_dizhu = user.is_landlord,
        $node;

    $node = UI.gen_user_DOM(is_dizhu, name, index, sex, len);
    $node.appendTo(id);
}

/**
 * [生成用户头像DOM]
 * @param  {Boolean} isDizhu   [description]
 * @param  {[type]}  name      [description]
 * @param  {[type]}  userIndex [description]
 * @param  {[type]}  sex       [description]
 * @param  {[type]}  num       [description]
 * @return {[type]}            [description]
 */
UI.gen_user_DOM = function(is_dizhu, name, user_index, sex, num) {
    if(is_dizhu){
        num = num || 20;
        sex = 'dizhu';
    }else{
        num = num || 17;
        sex = sex || 'male';
    }

    var id = 'userID' + user_index;
    var $node = $('<div id="' + id + '" class="user"></div>');
    var num_html = UI.gen_num_html(num);
    $node.html('<div class="clock"><p>30</p></div><p class="name">' + name + '</p><div class="img"><div class="' + sex + '"></div></div><div class="pokerNum">' + num_html + '</div>');
    return $node;
}

/**
 * [生成数字对应的html标签]
 * @param  {[type]} num [description]
 * @return {[type]}     [description]
 */
UI.gen_num_html = function(num) {
    num = '00'+num;
    num = num.slice(-2);
    num = num.split('');
    return '<div class="goldNum'+num[0]+'"></div><div class="goldNum'+num[1]+'"></div>';
}

/**
 * 更新扑克数量
 * @param {Object} num
 * @param {Object} index
 */
UI.update_poker_num = function(num, index) {
    var num_html = this.gen_num_html(num);
    $('#userID' + index + ' .pokerNum').html(num_html);
}

/**
 * [生成扑克的DOM]
 * @param  {[type]}  poker    [description]
 * @param  {Boolean} is_small [description]
 * @return {[type]}          [description]
 */
UI.gen_poker_DOM = function(poker, is_small) {
    is_small  = is_small || false;
    var value = Poker.get_number(poker),
       $node,
       type = Poker.gen_shape_str(poker);
    is_small = is_small ? 'poker spoker' : 'poker';
    $node = $('<div class="' + is_small + '" poker="' + poker + '"></div>');
    $node.html('<div class="p-content ' + type + ' poker' + value + '" ><p class="paimian"></p><p class="huase"></p></div>');
    //console.log($node);
    return $node;
}

/**
 * [显示游戏结果]
 * @param  {Boolean} is_landlord_win [description]
 * @return {[type]}                  [description]
 */
UI.on_game_over = function(is_landlord_win) {
    $(".main").css({opacity: 0.5});

    if(is_landlord_win) {
        $(".game-over .win").css({display: "block"});
    }
    else {
        $(".game-over .lose").css({display: "block"});
    }
};
