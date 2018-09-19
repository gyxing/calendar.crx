var bigWeeks = {
    2018: {
        4: [14, 21],
        5: [5, 19],
        6: [2, 23],
        7: [7, 21],
        8: [4, 18],
        9: [1, 15]
    }
};

$(function () {

    var $list = $('#tb-list'), $curMonth = $('#cur-month');
    var curDate = new Date(), now = new Date();

    if(navigator.onLine) {
        // 更新大小周数据
        $.getJSON('https://gyxing.github.io/otherpage/static/weeks.json', function(ret) {
            bigWeeks = ret.bigweeks;
            window.LunarCalendar.setWorktime(ret.worktime);
            setMonth(curDate);
        });
    }

    setMonth(curDate);
    $list.fadeIn();

    // 设置当前日期信息
    var cur_info = window.LunarCalendar.solarToLunar(now.getFullYear(), now.getMonth()+1, now.getDate());
    // 节日
    var jieri = [];
    cur_info.term && jieri.push(cur_info.term);
    cur_info.solarFestival && jieri.push(cur_info.solarFestival);
    cur_info.lunarFestival && jieri.push(cur_info.lunarFestival);
    // 拼装数据
    var cur_html = '今天:【' + cur_info.zodiac + '年】 ' +
        cur_info.GanZhiYear + '年/' + cur_info.GanZhiMonth + '月/' + cur_info.GanZhiDay + '日' +
        '<i>' + cur_info.lunarMonthName + cur_info.lunarDayName + '</i>' +
        '<span>' + jieri.join('/') + '</span>';

    $('#cur-info').html(cur_html);


    $('.btn-pre').on('click', function () {
        curDate = new Date(curDate.getFullYear(), curDate.getMonth() - 1, 1);
        setMonth(curDate)
    });

    $('.btn-next').on('click', function () {
        curDate = new Date(curDate.getFullYear(), curDate.getMonth() + 1, 1);
        setMonth(curDate)
    });

    function setMonth(time) {
        $curMonth.text(time.getFullYear() + '年' + (time.getMonth() + 1) + '月');

        var curWeeks = getWeeks(time.getFullYear(), time.getMonth());
        setList(curWeeks);
    }

    function setList(weeks) {
        console.log('==============');
        $list.empty();
        for (var i = 0; i < weeks.length; i++) {
            var week = weeks[i];
            var tds = [];
            for (var k = 0; k < week.length; k++) {
                var d = new Date(week[k]);
                if (k == 0 && d.getDay() > 0) {
                    for (var m = 0; m < d.getDay(); m++) {
                        tds.push('<div>&nbsp;</div>')
                    }
                }
                var cls = [];
                // 当前日期
                if (d.getFullYear() == now.getFullYear() && d.getMonth() == now.getMonth() && d.getDate() == now.getDate()) {
                    cls.push('cur');
                }
                if (d.getDay() == 6) {
                    // 判断是否是大周
                    if (bigWeeks[d.getFullYear()] && bigWeeks[d.getFullYear()][d.getMonth() + 1]) {
                        bigWeeks[d.getFullYear()][d.getMonth() + 1].indexOf(d.getDate()) != -1 && cls.push('big')
                    }
                }
                var spans = '<p>' + d.getDate() + '</p>';
                // 农历信息
                var nongLi = window.LunarCalendar.solarToLunar(d.getFullYear(), d.getMonth() + 1, d.getDate());
                if(nongLi.worktime == 1) {
                    // 补班
                    cls.push('work');
                } else if (nongLi.worktime == 2) {
                    // 放假
                    cls.push('holiday');
                }
                var cls2 = nongLi.term || nongLi.lunarFestival || nongLi.solarFestival ? 'red' : '';
			    spans += '<p class="' + cls2 + '">' + (nongLi.lunarFestival || nongLi.solarFestival || nongLi.term || (nongLi.lunarDayName == '初一' ? nongLi.lunarMonthName : nongLi.lunarDayName)) + '</p>'
                tds.push('<div class="' + cls.join(' ') + '">' + spans + '</div>');
            }
            if (tds.length < 7) {
                let len = 7 - tds.length;
                for (var k = 0; k < len; k++) {
                    tds.push('<div>&nbsp;</div>')
                }
            }
            $list.append('<div class="table">' + tds.join('') + '</div>');
        }
    }

    // 划分一个月中的周期
    function getWeeks(year, month) {
        var start_date = new Date(year, month, 1);
        var end_date = new Date(year, month + 1, 0);

        var res = [], week = [];
        for (var i = start_date.getDate(); i <= end_date.getDate(); i++) {
            start_date.setDate(i);
            if (start_date.getDay() == 0) {
                week.length > 0 && res.push(week);
                week = [start_date.getTime()]
            } else {
                week.push(start_date.getTime());
            }
            if (start_date.getDate() == end_date.getDate()) {
                res.push(week);
            }
        }
        return res;
    }

});