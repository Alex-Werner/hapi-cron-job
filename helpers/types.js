const types = {
    //
    every: /^every\b/,
    at: /^(at|@)\b/,
    //
    second: /^(s|sec(ond)?(s)?)\b/,
    minute: /^(m|min(ute)?(s)?)\b/,
    hour: /^(h(our)?(s)?)\b/,
    day: /^(d(ay)?(s)?)\b/,
    week: /^(w(eek)?(s)?)\b/,
    //
    clockTime: /^(([0]?[1-9]|1[0-2]):[0-5]\d(\s)?(am|pm))\b/,
    fullTime: /^(([0]?\d|[1]\d|2[0-3]):([0-5]\d))\b/,
    anyNumber: /^([0-9]+)\b/,
    plain: /^((plain))\b/,
}
module.exports = types;