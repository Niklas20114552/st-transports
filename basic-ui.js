const blackbox = document.querySelector("blackbox"),
    dialogbox = document.getElementById("stationbox"),
    dialogtitle = document.getElementById("dialogtitle"),
    personbox = document.getElementById("personbox"),
    routebox = document.getElementById("routebox");
let persons, start = "",
    destination = "",
    routes = "";
null != localStorage.getItem("persons") && "[]" != localStorage.getItem("persons") || localStorage.setItem("persons", "[1]"), localStorage.getItem("start") && (start = localStorage.getItem("start"), rebuildStart()), localStorage.getItem("destination") && (destination = localStorage.getItem("destination"), rebuildStop());
try {
    persons = JSON.parse(localStorage.getItem("persons"))
} catch (e) {
    localStorage.setItem("persons", "[1]"), persons = [1]
}

function removeItemOnce(e, t) {
    return t > -1 && e.splice(t, 1), e
}

function rebuildPersonsList() {
    const e = document.getElementById("travelers-list");
    e.innerHTML = "";
    for (var t = 0; t < persons.length; t++) {
        const n = document.createElement("travelerentry"),
            o = document.createElement("button"),
            s = document.createElement("img");
        s.src = "delete.svg", o.id = t, o.name = "traveler", 1 == persons.length && (o.disabled = !0), o.appendChild(s), n.appendChild(o), 1 == persons[t] ? n.innerHTML += "1 Adult (No Seacard)" : n.innerHTML += "1 Adult (With Seacard 50)", e.appendChild(n)
    }
    const n = document.getElementsByName("traveler");
    for (const e of n) e.addEventListener("click", (function () {
        removeItemOnce(persons, this.id), localStorage.setItem("persons", JSON.stringify(persons)), rebuildPersonsList(), rebuildPersons()
    }))
}

function rebuildStart() {
    document.getElementById("start-selector")
        .innerHTML = "", startsvg = document.createElement("img"), startsvg.src = "start.svg", document.getElementById("start-selector")
            .appendChild(startsvg), document.getElementById("start-selector")
                .innerHTML += "" == start ? "Start" : start
}

function rebuildStop() {
    document.getElementById("stop-selector")
        .innerHTML = "", stopsvg = document.createElement("img"), stopsvg.src = "destination.svg", document.getElementById("stop-selector")
            .appendChild(stopsvg), document.getElementById("stop-selector")
                .innerHTML += "" == destination ? "Destination" : destination
}

function rebuildPersons() {
    const e = document.getElementById("option-selector");
    e.innerHTML = "", personsvg = document.createElement("img"), personstring = "1 traveler", 1 == persons.length ? personsvg.src = "person.svg" : (personsvg.src = "persons.svg", personstring = persons.length + " travelers"), e.appendChild(personsvg), e.innerHTML += personstring
}

function secondStringify(e) {
    const t = Math.floor(e / 60),
        n = e % 60;
    let o;
    return o = 1 == t ? "1 minute" : t + " minutes", n > 0 ? 1 == n ? o + " 1 second" : o + " " + n + " seconds" : o
}

function calcPrice() {
    let e = 0;
    for (const t of persons) e += network.prices[t];
    return e
}

function buildRoutes() {
    document.querySelector("main")
        .innerHTML = "";
    const e = document.createElement("span");
    e.innerText = "Search results for: " + start + " → " + destination + ":", e.classList.add("searchtitle"), document.querySelector("main")
        .appendChild(e);
    for (var t = 0; t < routes.length; t++) {
        const e = document.createElement("routebox");
        e.id = t;
        const n = document.createElement("span");
        n.classList.add("routetitle");
        const o = document.createElement("div");
        o.classList.add("flexbox");
        let s = 0;
        for (const e of routes[t]) s += getTravelTimeForStops(getStops(e.stations[0], e.stations[1], e.line));
        for (const e of routes[t]) {
            const t = document.createElement("linebox");
            t.style.width = getTravelTimeForStops(getStops(e.stations[0], e.stations[1], e.line)) / s * 100 + "%", e.line.startsWith("USTe") ? t.style.backgroundColor = "rgb(6, 107, 95)" : t.style.backgroundColor = "rgb(107, 0, 107)", t.innerText = e.line.replace("USTe", "UltraStar express")
                .replace("UST", "UltraStar"), t.title = e.stations[0] + " → " + e.stations[1], o.appendChild(t)
        }
        n.innerText = secondStringify(s);
        const r = document.createElement("span");
        r.innerText = "Price: " + calcPrice() + " ", r.classList.add("pricetext");
        const l = document.createElement("span");
        l.classList.add("green-text"), l.innerHTML = "Emeralds", r.appendChild(l), e.appendChild(n), e.appendChild(o), e.appendChild(r), document.querySelector("main")
            .appendChild(e)
    }
    for (const e of document.querySelectorAll("routebox")) e.addEventListener("click", (function () {
        const e = routes[this.id],
            t = document.createElement("button");
        t.innerText = "Back", t.id = "routeback", document.getElementById("routetitle")
            .innerHTML = "", document.getElementById("routetitle")
                .appendChild(t), document.getElementById("routetitle")
                    .innerHTML += "Connection " + start + " → " + destination + ":", document.querySelectorAll("leftbox")
                        .forEach((function (e) {
                            e.remove()
                        }));
        for (const e of document.getElementsByClassName("changehere")) e.remove();
        for (var n = 0; n < e.length; n++) {
            const t = document.createElement("leftbox"),
                o = document.createElement("p");
            o.classList.add("stationtitle");
            const s = document.createElement("span");
            s.classList.add("platform"), s.innerText = "Platform " + getPlatformOfStop(e[n].stations[0], e[n].line), o.appendChild(s), o.innerHTML += e[n].stations[0], t.appendChild(o);
            const r = document.createElement("span");
            r.classList.add("traintitle"), e[n].line.startsWith("USTe") ? r.style.backgroundColor = "rgb(6, 107, 95)" : r.style.backgroundColor = "rgb(107, 0, 107)", r.innerText = e[n].line.replace("USTe", "UltraStar express")
                .replace("UST", "UltraStar") + " (" + e[n].line + ")", t.appendChild(r);
            const l = document.createElement("p");
            l.classList.add("stationtitle"), l.innerText = "Travel time: " + secondStringify(getTravelTimeForStops(getStops(e[n].stations[0], e[n].stations[1], e[n].line))), t.appendChild(l);
            const a = document.createElement("span");
            a.classList.add("operator"), a.innerText = "Operated by Seacrestica Transports Outpost.", t.appendChild(a);

            const st = getStops(e[n].stations[0], e[n].stations[1], e[n].line);
            st.shift(), st.pop();

            if (st.length != 0) {
                const v = document.createElement('details');
                v.classList.add('stopovers');
                const u = document.createElement('summary');
                u.innerText = 'Stopovers';
                v.appendChild(u);
                t.appendChild(v);
                const vd = document.createElement('div');
                for (const sv of st) {
                    const p = document.createElement('p');
                    const ps = document.createElement('span');
                    ps.classList.add('platform');
                    ps.innerText = 'Platform ' + getPlatformOfStop(sv, e[n].line);
                    p.appendChild(ps);
                    p.innerHTML += sv;
                    vd.appendChild(p);
                }
                v.appendChild(vd);
                t.appendChild(v);
            }

            const i = document.createElement("p");
            i.classList.add("stationtitle");
            const d = document.createElement("span");
            if (d.classList.add("platform"), d.innerText = "Platform " + getPlatformOfStop(e[n].stations[1], e[n].line), i.appendChild(d), i.innerHTML += e[n].stations[1], t.appendChild(i), routebox.appendChild(t), n < e.length - 1) {
                const e = document.createElement("p");
                const ch = document.createElement("img");
                ch.src = "change.svg"
                e.classList.add("changehere"), e.appendChild(ch), e.innerHTML += "Change train here", routebox.appendChild(e)
            }
        }
        blackbox.style.display = "block", routebox.style.display = "block", document.getElementById("routeback")
            .addEventListener("click", (() => {
                blackbox.style.display = "none", routebox.style.display = "none"
            }))
    }))
}
document.getElementById("start-selector")
    .addEventListener("click", (() => {
        blackbox.style.display = "block", dialogtitle.innerText = "Select the Start", dialogbox.style.display = "flex"
    }));
document.getElementById("stop-selector")
    .addEventListener("click", (() => {
        blackbox.style.display = "block", dialogtitle.innerText = "Select the Destination", dialogbox.style.display = "flex"
    }));
document.getElementById("option-selector")
    .addEventListener("click", (() => {
        blackbox.style.display = "block", personbox.style.display = "flex", rebuildPersonsList()
    }));
document.getElementById("dialoginput")
    .addEventListener("input", (function () {
        "⁣" === this.value.slice(-1) && (this.value = this.value.slice(0, -1), blackbox.style.display = "none", dialogbox.style.display = "none", "Select the Destination" == dialogtitle.innerText ? (destination = this.value, localStorage.setItem("destination", destination), rebuildStop()) : "Select the Start" == dialogtitle.innerText && (start = this.value, localStorage.setItem("start", start), rebuildStart()), this.value = "")
    }));
document.getElementById("personadd")
    .addEventListener("change", (function () {
        persons.push(this.value), localStorage.setItem("persons", JSON.stringify(persons)), this.value = "Add a traveler", rebuildPersons(), rebuildPersonsList()
    }));
document.getElementById("dialogback")
    .addEventListener("click", (() => {
        document.getElementById("dialoginput")
            .value = "", blackbox.style.display = "none", dialogbox.style.display = "none"
    }));
document.getElementById("personback")
    .addEventListener("click", (() => {
        blackbox.style.display = "none", personbox.style.display = "none"
    }));
document.getElementById("route-button")
    .addEventListener("click", (() => {
        "" == start || "" == destination ? document.querySelector("main")
            .innerText = "Please select a start and a destination." : start != destination ? (routes = findRoutes(network, start, destination), buildRoutes()) : document.querySelector("main")
                .innerText = "Start and destination are identical."
    }));
document.getElementById("swap")
    .addEventListener("click", (() => {
        const e = start;
        start = destination, destination = e, rebuildStart(), rebuildStop()
    }));

function rebuildStationlist() {
    while (document.querySelector('datalist').childElementCount != 0) {
        document.querySelector('datalist').childNodes[0].remove();
    }

    const sortedstations = network['stations'];
    sortedstations.sort((a, b) => a.name.localeCompare(b.name));
    for (const station of sortedstations) {
        const option = document.createElement('option');
        option.innerHTML = station.name + '\u2063';
        document.getElementById('stationlist').appendChild(option);
    }
}

rebuildPersons();
rebuildStationlist();