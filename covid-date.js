class CovidDate {

  year = 0; month = 0; day = 0;
  hour = 0; minute = 0; second = 0;

    constructor(y, m, d, hh, mm, ss) {

        this.year = y; this.month = m; this.day = d;
        this.hour = hh; this.minute = mm; this.second = ss;

        if (this.year < 2020) { this.year = 2020; }
        if (this.month < 1 || this.month > 12) { this.month = 1; }
        if (this.day < 1 || this.day > daysInMonth(this.year, this.month)) { this.day = 1; }
        if (this.hour < 0 || this.hour > 23) { this.hour = 0; }
        if (this.minute < 0 || this.minute > 59) { this.minute = 0; }
        if (this.second < 0 || this.second > 59) { this.second = 0; }
    }

    weekday() {

        return (start_2020_day + covidDayDiff(start_2020_date, this)) % 7;
    }

    nextDay() {

        if (++this.day > daysInMonth(this.year, this.month)) {

            this.day = 1;
            if (++this.month > 12) {

                this.year++;
                this.month = 1;
            }
        }

        this.hour = 0; this.minute = 0; this.second = 0;
    }

    nextWeek() {

        if ((this.day += 7 - this.weekday()) > daysInMonth(this.year, this.month)) {

            this.day -= daysInMonth(this.year, this.month);
            if (++this.month > 12) {

                this.year++; this.month = 1;
            }
        }

        this.hour = 0; this.minute = 0; this.second = 0;
    }

    nextMonth() {

        if (++this.month > 12) {

            this.year++;
            this.month = 1;
        }

        this.day = 1;

        this.hour = 0; this.minute = 0; this.second = 0;
    }

    nextYear() {

        this.year++; this.month = 1; this.day = 1;

        this.hour = 0; this.minute = 0; this.second = 0;
    }

    outputShort() {

        return ('0').repeat(3 - Math.floor(Math.log10(this.year))) +
            this.year.toString() + '-' +
            (this.month < 10 ? '0' : '') +
            this.month.toString() + '-' +
            (this.day < 10 ? '0' : '') +
            this.day.toString();

    }

    outputLong() {

        return this.outputShort() + ' ' +
            (this.hour < 10 ? '0' : '') +
            this.hour.toString() + ':' +
            (this.minute < 10 ? '0' : '') +
            this.minute.toString() + ':' +
            (this.second < 10 ? '0' : '') +
            this.second.toString();
    }

}

const covidNow = () => {

  return ((d) => {
    return new CovidDate(
      d.getFullYear(),
      1 + d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds());
  })(new Date());

}

const covidCompare = (d1, d2) => {

  return d1.year - d2.year ||
    d1.month - d2.month ||
    d1.day - d2.day ||
    d1.hour - d2.hour ||
    d1.minute - d2.minute ||
    d1.second - d2.second;

}

const covidCheckShort = (s) => {

  var y, m, d;

  if (s.length !== 10) {
    return;
  }

  if (s.charAt(4) !== '-' ||
    s.charAt(7) !== '-' ||
    isNaN(y = parseInt(s.substring(0, 4))) || y < 2020 ||
    isNaN(m = parseInt(s.substring(5, 7))) || m <= 0 ||
    isNaN(d = parseInt(s.substring(8))) || d <= 0) {
    return;
  }

  return new CovidDate(y, m, d, 0, 0, 0);

}

const covidCheckLong = (s) => {

  var y, m, d, hh, mm, ss;

  if (s.length !== 19) {
    return;
  }

  if (s.charAt(4) !== '-' ||
    s.charAt(7) != '-' ||
    s.charAt(10) != ' ' ||
    s.charAt(13) != ':' ||
    s.charAt(16) != ':' ||
    isNaN(y = parseInt(s.substring(0, 4))) || y < 2020 ||
    isNaN(m = parseInt(s.substring(5, 7))) || m <= 0 ||
    isNaN(d = parseInt(s.substring(8, 10))) || d <= 0 ||
    isNaN(hh = parseInt(s.substring(11, 13))) || hh < 0 ||
    isNaN(mm = parseInt(s.substring(14, 16))) || mm < 0 ||
    isNaN(ss = parseInt(s.substring(17))) || ss < 0) {
    return;
  }

  return new CovidDate(y, m, d, hh, mm, ss);

}

/* Helper functions for covidDayDiff. */

const daysInYear = (y) => 365 + (!(y % 4) && !(!(y % 100) && y % 400) ? 1 : 0);

const daysInMonth = (y, m) => {

    switch (m) {

        case 4: case 6: case 9: case 11:
            return 30; break;

        case 1: case 3: case 5: case 7: case 8: case 10: case 12:
            return 31; break;

        case 2:
            return 28 + (!(y % 4) && !(!(y % 100) && y % 400) ? 1 : 0);
            break;
    }
};

const daysPassedInYear = (y, m, d) => {

    var dnd = 0;

    for (var i = 1; i < m; i++) { dnd += daysInMonth(y, m); }

    dnd += d; return dnd;

}

const daysLeftInYear = (y, m, d) => daysInYear(y) - daysPassedInYear(y, m, d);

const daysLeftInMonth = (y, m, d) => daysInMonth(y, m) - d;

const covidDayDiff = (d1, d2) => {

    // Assumption is d1 <= d2.

    if (covidCompare(d1, d2) > 0) { return; }

    var
        dn1_year = d1.year, dn1_month = d1.month, dn1_day = d1.day,
        dn2_year = d2.year, dn2_month = d2.month, dn2_day = d2.day;

    var dnd = 0;

    if (dn2_year > dn1_year) {

        dnd += daysLeftInYear(dn1_year, dn1_month, dn1_day);
        for (var i = 1; i < dn2_year - dn1_year; i++) {
            dnd += daysInYear(dn1_year + i);
        }

        dn1_year = dn2_year; dn1_month = 1; dn1_day = 1;
        dnd++;
    }

    if (dn2_month > dn1_month) {

        dnd += daysLeftInMonth(dn1_year, dn1_month, dn1_day);
        for (var i = 1; i < dn2_month - dn1_month; i++) {
            dnd += daysInMonth(dn1_year, dn1_month + i);
        }

        dn1_month = dn2_month; dn1_day = 1;
        dnd++;
    }

    dnd += dn2_day - dn1_day;

    return dnd;

}

/* Helpers for Same/Start functions. */

const start_2020_date = new CovidDate(2020, 1, 1);
const start_2020_day = 2;

/* Assumes d1 is a Monday and therefore 'week start' comparison. */

const sameWeek = (d1, d2) => covidDayDiff(d1, d2) < 7;

const sameMonth = (d1, d2) => d1.year === d2.year && d1.month === d2.month;

const sameYear = (d1, d2) => d1.year === d2.year;

/* Assume d1 is in 2020. */

const startWeek = (d1) => {

    var sy = d1.year, sm = d1.month, sd = d1.day - ((start_2020_day + covidDayDiff(start_2020_date, d1)) % 7);

    if (sd <= 0) {

        if (--sm == 0) { sy--; sm = 12; }
        sd = daysInMonth(sy, sm) + sd;

    }

    return new CovidDate(sy, sm, sd);

};

const startMonth = (d1) => new CovidDate(d1.year, d1.month, 1);

const startYear = (d1) => new CovidDate(d1.year, 1, 1);


exports.covidDate = (y, m, d, hh, mm, ss) => new CovidDate(y, m, d, hh, mm, ss);

exports.covidNow = covidNow;
exports.covidCompare = covidCompare;
exports.covidCheckShort = covidCheckShort;
exports.covidCheckLong = covidCheckLong;
exports.covidDayDiff = covidDayDiff;

exports.sameWeek = sameWeek;
exports.sameMonth = sameMonth;
exports.sameYear = sameYear;

exports.startWeek = startWeek;
exports.startMonth = startMonth;
exports.startYear = startYear;

exports.daysInMonth = daysInMonth;
exports.daysInYear = daysInYear;



