let uploadButton = document.querySelector(".upload .button")
let switchButton = document.getElementById("switchmode")
let uploaded = false;
uploadButton.addEventListener("change", uploadHTML, false);
let competitive = [];
let casual = [];
let current_is_comp = true;
let canswitch = false;

let ChartDays
let ChartGeneral
let ChartTimes
let ChartClasses
let ChartMaps
let ChartMedals
let ChartLocations
let ChartMatchDurations
let ChartQueueDurations
let ChartMMR

switchButton.onclick = ()=>{

    if(canswitch){
        let tmp = competitive;
        competitive = casual;
        casual = tmp;
        current_is_comp = !current_is_comp;

        if(current_is_comp){
            document.getElementById("mode").innerHTML = "The following statistics will be MyM Competitive only. And still include abandoned games (as long as there is data for them)"
            switchButton.innerHTML = "Switch Competitive with Casual";
        } else {
            document.getElementById("mode").innerHTML = "The following statistics will be Casual only. (Mistakes may happen because this was made mainly for the competitive mode)"
            switchButton.innerHTML = "Switch Casual with Competitive";
        }

        renderStatistics();
    }


}

function uploadHTML(event) {
    if (!uploaded) {
        uploaded = true;
        current_is_comp = true;
        competitive = [];
        casual = [];
        document.querySelector(".upload h2").innerHTML = "Upload your downloaded HTML Page with the button below: (pending)"


        let file = event.target.files[0];


        let reader = new FileReader();

        reader.onload = (function (text) {
            return function (e) {

                parseHTML(e.target.result)
            };
        })(file);

        // Read in the image file as a data URL.
        reader.readAsText(file);

    }
}

function getEntry(string, substring) {
    try {
        return string.split("<td>" + substring + "</td><td>")[1].split("</td>")[0]
    } catch (e) {
        return undefined;
    }
}

function parseHTML(html) {
    let matches = html.split("<th>Match ");
    matches.splice(0, 1);
    let alreadyin = [];

    for (let m in matches) {
        let match = matches[m];
        let obj = {};
        let matchid = parseInt(match.split("</th>")[0]);
        if (alreadyin.indexOf(matchid) != -1) {
            continue;
        }
        alreadyin.push(matchid);
        obj.conclusion = match.indexOf("<td>Reached Conclusion</td><td>Yes") != -1;
        obj.is_comp = match.indexOf("Type</td><td>Competitive") != -1;
        obj.map_index = parseInt(getEntry(match, "Map Index"));
        obj.creationtime = new Date(getEntry(match, "Match Creation Time"));
        obj.ip = getEntry(match, "Match IP");
        obj.match_port = parseInt(getEntry(match, "Match Port"));
        obj.datacenter = getEntry(match, "Datacenter");
        obj.match_size = parseInt(getEntry(match, "Match Size"));
        obj.join_time = new Date(getEntry(match, "Join Time"));
        obj.party_id_at_join = getEntry(match, "Party ID at Join");
        obj.team_at_join = getEntry(match, "Team at Join");
        obj.ping_estimate_at_join = parseInt(getEntry(match, "Ping Estimate at Join"));
        obj.joined_after_match_start = "Yes" == getEntry(match, "Joined After Match Start");
        obj.time_in_queue = parseInt(getEntry(match, "Time in Queue"));
        obj.match_end_time = new Date(getEntry(match, "Match End Time"));
        obj.season_id = getEntry(match, "Season ID");
        obj.match_status = parseInt(getEntry(match, "Match Status"));
        obj.match_duration = parseInt(getEntry(match, "Match Duration"));
        obj.red_team_final_score = parseInt(getEntry(match, "RED Team Final Score"));
        obj.blu_team_final_score = parseInt(getEntry(match, "BLU Team Final Score"));
        obj.winning_team = parseInt(getEntry(match, "Winning Team"));
        obj.game_mode = parseInt(getEntry(match, "Game Mode"));
        obj.win_reason = parseInt(getEntry(match, "Win Reason"));
        obj.match_flags = getEntry(match, "Match Flags");
        obj.match_included_bots = parseInt(getEntry(match, "Match Included Bots"));
        obj.time_left_match = new Date(getEntry(match, "Time Left Match"));
        obj.result_partyid = getEntry(match, "Result PartyID");
        obj.result_team = parseInt(getEntry(match, "Result Team"));
        obj.result_score = parseInt(getEntry(match, "Result Score"));
        obj.result_ping = parseInt(getEntry(match, "Result Ping"));
        obj.result_player_flags = getEntry(match, "Result Player Flags");
        obj.result_displayed_rating = parseInt(getEntry(match, "Result Displayed Rating"));
        obj.result_displayed_rating_change = parseInt(getEntry(match, "Result Displayed Rating Change"));
        obj.result_rank = parseInt(getEntry(match, "Result Rank"));
        obj.classes_played = parseInt(getEntry(match, "Classes Played"));
        obj.kills = parseInt(getEntry(match, "Kills"));
        obj.deaths = parseInt(getEntry(match, "Deaths"));
        obj.damage = parseInt(getEntry(match, "Damage"));
        obj.healing = parseInt(getEntry(match, "Healing"));
        obj.support = parseInt(getEntry(match, "Support"));
        obj.score_medal = parseInt(getEntry(match, "Score Medal"));
        obj.kills_medal = parseInt(getEntry(match, "Kills Medal"));
        obj.damage_medal = parseInt(getEntry(match, "Damage Medal"));
        obj.healing_medal = parseInt(getEntry(match, "Healing Medal"));
        obj.support_medal = parseInt(getEntry(match, "Support Medal"));
        obj.leave_reason = parseInt(getEntry(match, "Leave Reason"));
        obj.connection_time = new Date(getEntry(match, "Connection Time"));
        obj.id = matchid;

        if (obj.is_comp) {
            competitive.push(obj);
        } else {
            casual.push(obj);
        }
    }

    canswitch = true;
    renderStatistics();


}


function displayPercent(value, context) {
    let total = context.dataset.data.reduce((total, num) => total + num)
    return context.chart.data.labels[context.dataIndex] + " - " + (value / total * 100).toFixed(1) + `% (${value})`;
}


function renderStatistics() {
    uploaded = false;
    document.querySelector(".upload h2").innerHTML = "Upload your downloaded HTML Page with the button below: (finished)";

    Chart.defaults.global.defaultFontColor = 'white';
    //Chart.defaults.global.responsive = false;

    //If we had charts before, we try to clean / destroy them
    try {
        ChartDays.destroy()
        ChartGeneral.destroy()
        ChartTimes.destroy()
        ChartClasses.destroy()
        ChartMaps.destroy()
        ChartMedals.destroy()
        ChartLocations.destroy()
        ChartMatchDurations.destroy()
        ChartQueueDurations.destroy()
        ChartMMR.destroy()
    } catch(e){
        console.log("There were no Chart instances yet, so couldn't destroy them")
    }

    ChartGeneral = new Chart("generalGames", {
        type: "pie",
        data: {
            "labels": ["Casual", "Competitive", "Competitive (Abandoned)"],
            "datasets": [{
                label: "Games",
                data: [casual.length, competitive.reduce(function (n, val) {
                    return n + (val.match_status == 0);
                }, 0), competitive.reduce(function (n, val) {
                    return n + (val.match_status == 3);
                }, 0)],
                backgroundColor: [
                    "#1e61cc",
                    "#cc1d38",
                    "#f72e4d"
                ]
            }]
        }
    })

    let days = [0, 0, 0, 0, 0, 0, 0];


    let hourtimes = [];
    let minutestep = 10;
    let curhours = 0;
    let curmin = 0;
    while (curhours < 24) {
        let time = curhours + ":" + curmin + ((curmin == 0) ? "0" : "");
        curmin += minutestep;
        if (curmin >= 60) {
            curmin -= 60;
            curhours++;
        }
        hourtimes.push(time);
    }


    let amount_per_hour = new Array(hourtimes.length).fill(0);


    let classestotal = new Array(9).fill(0);
    let classessolo = new Array(9).fill(0);


    let mapstotal = [];
    let mapnames = []


    let medals = [
        [new Array(5).fill(0)], new Array(5).fill(0), new Array(5).fill(0), new Array(5).fill(0)
    ];


    let serverlocations = [];
    let serverlocationnames = [];


    let playtimes = new Array(7).fill(0);


    let queuetimes = new Array(7).fill(0);


    let mmrchanges = new Array(11).fill(0);


    let textbaseddata = {
        "averageDamage": {
            "val": 0,
            "total": 0
        },
        "mostDamage": {
            "val": 0,
            "total": 0
        },
        "averageKills": {
            "val": 0,
            "total": 0
        },
        "mostKills": {
            "val": 0,
            "total": 0
        },
        "averageDeaths": {
            "val": 0,
            "total": 0
        },
        "mostDeaths": {
            "val": 0,
            "total": 0
        },
        "averageKD": {
            "val": 0,
            "total": 0
        },
        "averageHeals": {
            "val": 0,
            "total": 0
        },
        "mostHeals": {
            "val": 0,
            "total": 0
        },
        "averageScore": {
            "val": 0,
            "total": 0
        },
        "mostScore": {
            "val": 0,
            "total": 0
        },
        "averagePing": {
            "val": 0,
            "total": 0
        },
        "highPing": {
            "val": 0,
            "total": 0
        },
        "lowPing": {
            "val": 100,
            "total": 0
        },
        "gamesWon": {
            "val": 0,
            "total": 0
        },
        "gamesLost": {
            "val": 0,
            "total": 0
        },
        "averageMMRGain": {
            "val": 0,
            "total": 0
        },
        "mostMMRGain": {
            "val": 0,
            "total": 0
        },
        "averageMMRLoss": {
            "val": 0,
            "total": 0
        },
        "mostMMRLoss": {
            "val": 0,
            "total": 0
        },
        "gamesBot": {
            "val": 0,
            "total": 0
        },
        "longestQueue": {
            "val": 0,
            "total": 0
        },
        "shortestQueue": {
            "val": 1000,
            "total": 0
        },
        "averageQueue": {
            "val": 0,
            "total": 0
        },
        "longestWait": {
            "val": 0,
            "total": 0
        },
        "shortestWait": {
            "val": 1000,
            "total": 0
        },
        "averageWait": {
            "val": 0,
            "total": 0
        },
        "matchmakingBeta": {
            "val": 0,
            "total": 0
        }
    }
    
    competitive.forEach((match) => {
        if (!isNaN(match.creationtime.getTime())) {
            days[(((match.creationtime.getDay() - 1) % 7) + 7) % 7]++


            amount_per_hour[match.creationtime.getHours() * 60 / minutestep + match.creationtime.getMinutes() / minutestep << 0]++
        }


        let multiclass = (match.classes_played.toString(2).match(/1/g) || []) != 1;
        for (let i = 0; i < 10; i++) {
            if (((match.classes_played >> i) % 2 != 0) && i > 0) {
                if (multiclass) {
                    classestotal[i - 1]++;
                } else {
                    classessolo[i - 1]++;
                }
            }
        }


        let mapname = tf2maplist[match.map_index];
        let mapindex = mapnames.indexOf(mapname);
        if (mapindex == -1) {
            mapnames.push(mapname);
            mapstotal.push(1);
        } else {
            mapstotal[mapindex]++;
        }


        medals[match.damage_medal || 0][0]++
        medals[match.healing_medal || 0][1]++
        medals[match.score_medal || 0][2]++
        medals[match.support_medal || 0][3]++
        medals[match.kills_medal || 0][4]++


        let servername = match.datacenter;
        if (servername == "") {
            servername = "Unavailable"
        }
        let serverindex = serverlocationnames.indexOf(servername);
        if (serverindex == -1) {
            serverlocationnames.push(servername);
            serverlocations.push(1);
        } else {
            serverlocations[serverindex]++;
        }


        if (match.match_duration > 0) {
            let t = match.match_duration / 60;
            playtimes[Math.min(Math.floor(t / 10), 6)]++
        }


        if (match.time_in_queue > 0) {
            let t = match.time_in_queue / 60;
            queuetimes[Math.min(Math.floor(t / 10), 6)]++
        }


        if (match.match_status == 0) {


            if(match.result_displayed_rating_change < -100){
                mmrchanges[0]++;
            } else if (match.result_displayed_rating_change < -50){
                mmrchanges[1]++;
            } else if (match.result_displayed_rating_change < -20){
                mmrchanges[2]++;
            } else if (match.result_displayed_rating_change < -5){
                mmrchanges[3]++;
            } else if (match.result_displayed_rating_change < -1){
                mmrchanges[4]++;
            } else if (match.result_displayed_rating_change < 2){
                mmrchanges[5]++;
            } else if (match.result_displayed_rating_change < 5){
                mmrchanges[6]++;
            } else if (match.result_displayed_rating_change < 20){
                mmrchanges[7]++;
            } else if (match.result_displayed_rating_change < 50){
                mmrchanges[8]++;
            } else if (match.result_displayed_rating_change < 100){
                mmrchanges[9]++;
            } else {
                mmrchanges[10]++;
            }

            


            let pairs = [
                ["Damage", "damage"],
                ["Kills", "kills"],
                ["Deaths", "deaths"],
                ["Score", "result_score"]
            ]

            for(let i in pairs){
                textbaseddata["average"+pairs[i][0]].val += match[pairs[i][1]];
                textbaseddata["average"+pairs[i][0]].total++;

                if (match[pairs[i][1]] > textbaseddata["most"+pairs[i][0]].val) {
                    textbaseddata["most"+pairs[i][0]].val = match[pairs[i][1]];
                }
            }

            if ((match.classes_played >> 5) % 2 != 0){

                textbaseddata.averageHeals.val += match.healing;
                textbaseddata.averageHeals.total++;

                if(match.healing > textbaseddata.mostHeals.val){
                    textbaseddata.mostHeals.val = match.healing;
                }
            }

            if(match.match_included_bots>0){
                textbaseddata.gamesBot.val++;
            }

            
            if(match.result_displayed_rating_change >= 0){
                textbaseddata.gamesWon.val++;

                textbaseddata.averageMMRGain.val+=match.result_displayed_rating_change;
                textbaseddata.averageMMRGain.total++;

                if(match.result_displayed_rating_change > textbaseddata.mostMMRGain.val){
                    textbaseddata.mostMMRGain.val = match.result_displayed_rating_change;
                }

            } else {
                textbaseddata.gamesLost.val++;

                textbaseddata.averageMMRLoss.val+=Math.abs(match.result_displayed_rating_change);
                textbaseddata.averageMMRLoss.total++;

                if(Math.abs(match.result_displayed_rating_change) > textbaseddata.mostMMRLoss.val){
                    textbaseddata.mostMMRLoss.val = Math.abs(match.result_displayed_rating_change);
                }

            }
        }

        if(match.result_ping > 0){
            textbaseddata.averagePing.val+=match.result_ping;
            textbaseddata.averagePing.total++;

            if(match.result_ping > textbaseddata.highPing.val){
                textbaseddata.highPing.val = match.result_ping;
            }

            if(match.result_ping < textbaseddata.lowPing.val){
                textbaseddata.lowPing.val = match.result_ping;
            }
        }


        textbaseddata.averageQueue.val+=match.time_in_queue;
        textbaseddata.averageQueue.total++;

        if(match.time_in_queue>textbaseddata.longestQueue.val){
            textbaseddata.longestQueue.val = match.time_in_queue;
        }
        if(match.time_in_queue<textbaseddata.shortestQueue.val){
            textbaseddata.shortestQueue.val = match.time_in_queue;
        }

        if (!isNaN(match.creationtime.getTime()) && !isNaN(match.match_end_time.getTime())) {

            if(match.creationtime.getTime() <= 1467849600000){
                textbaseddata.matchmakingBeta.val++;
            }

            let differ = (match.match_end_time.getTime()-match.creationtime.getTime())/1000;
            
            textbaseddata.averageWait.val+=differ;
            textbaseddata.averageWait.total++;

            if(differ > textbaseddata.longestWait.val){
                textbaseddata.longestWait.val = differ;
            }

            if(differ < textbaseddata.shortestWait.val){
                textbaseddata.shortestWait.val = differ;
            }
        } else {
            textbaseddata.matchmakingBeta.val++;
        }


    })

    let averages = [
        "Damage", "Kills", "Deaths", "Score", "Heals", "Ping", "MMRGain", "MMRLoss", "Queue", "Wait"
    ]

    for(let i in averages){
        textbaseddata["average"+averages[i]].val /= textbaseddata["average"+averages[i]].total;
    }

    textbaseddata.averageKD.val = textbaseddata.averageKills.val/textbaseddata.averageDeaths.val;

    let turn_into_minutes = [
        "longestQueue", "shortestQueue", "averageQueue", "longestWait", "shortestWait", "averageWait"
    ]

    for(let i in turn_into_minutes){
        textbaseddata[turn_into_minutes[i]].val = textbaseddata[turn_into_minutes[i]].val / 60;
    }

    for(let x in textbaseddata){
        document.getElementById(x).innerHTML = ""+Math.round(textbaseddata[x].val*100)/100;
    }

    ChartDays = new Chart("gamesDay", {
        type: "bar",
        data: {
            "labels": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "datasets": [{
                label: "Amount of Games",
                data: days,
                backgroundColor: "#317df7"
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    gridLines: {
                        color: "#777777"
                    }
                }],
                yAxes: [{
                    gridLines: {
                        color: "#777777"
                    }
                }]
            },

        }
    })




    ChartTimes = new Chart("gamesTime", {
        type: "line",
        data: {
            "labels": hourtimes,
            "datasets": [{
                label: "Amount of Games",
                data: amount_per_hour,
                borderColor: "#317df7"
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    gridLines: {
                        color: "#777777"
                    }
                }],
                yAxes: [{
                    gridLines: {
                        color: "#777777"
                    }
                }]
            },
            legend: {
                display: false
            }
        }
    })

    ChartClasses = new Chart("classesPlayed", {
        type: "pie",
        data: {
            "labels": bit_classes,
            "datasets": [{
                    label: "Class Distribution",
                    data: classestotal,
                    backgroundColor: ["#db3936", "#db9336", "#d5db36", "#99db36", "#36db67", "#36dbd2", "#366ddb", "#5936db", "#b736db"]
                },
                {
                    label: "Classes played solo",
                    data: classessolo,
                    backgroundColor: ["#db3936", "#db9336", "#d5db36", "#99db36", "#36db67", "#36dbd2", "#366ddb", "#5936db", "#b736db"]
                }
            ]
        },
        options: {
            plugins: {
                datalabels: {
                    formatter: displayPercent
                }
            }
        }
    })


    ChartMaps = new Chart("mapsPlayed", {
        type: "pie",
        data: {
            "labels": mapnames,
            "datasets": [{
                label: "Maps",
                data: mapstotal,
                backgroundColor: randomColorArray(mapnames.length)
            }]
        },
        options: {
            plugins: {
                datalabels: {
                    formatter: displayPercent,
                    textStrokeColor: "black",
                    textStrokeWidth: 2
                }
            },
            sort: true
        }
    })




    ChartMedals = new Chart("medalsEarned", {
        type: "bar",
        data: {
            "labels": ["Damage", "Healing", "Score", "Support", "Kills"],
            "datasets": [{
                    label: "Bronze Medal",
                    data: medals[1],
                    backgroundColor: [
                        "#db6436",
                        "#96db36",
                        "#36dbc5",
                        "#3836db",
                        "#db36d5"
                    ]
                },
                {
                    label: "Silver Medal",
                    data: medals[2],
                    backgroundColor: [
                        "#a34927",
                        "#72a828",
                        "#2ebaa7",
                        "#2a28a3",
                        "#b72db2"
                    ]
                },
                {
                    label: "Gold Medal",
                    data: medals[3],
                    backgroundColor: [
                        "#77341b",
                        "#50771b",
                        "#208779",
                        "#1b1a72",
                        "#8c2388"
                    ]
                }
            ]
        }
    });


    ChartLocations = new Chart("serverLocations", {
        type: "pie",
        data: {
            "labels": serverlocationnames,
            "datasets": [{
                label: "Server Location",
                data: serverlocations,
                backgroundColor: randomColorArray(serverlocationnames.length)
            }]
        },
        options: {
            plugins: {
                datalabels: {
                    formatter: displayPercent,
                    textStrokeColor: "black",
                    textStrokeWidth: 2
                }
            },
            sort: true
        }
    })


    ChartMatchDurations = new Chart("matchDurations", {
        type: "pie",
        data: {
            "labels": ["0-10 minutes", "10-20 minutes", "20-30 minutes", "30-40 minutes", "40-50 minutes", "50-60 minutes", ">60 minutes"],
            "datasets": [{
                label: "Minutes",
                data: playtimes,
                backgroundColor: randomColorArray(7)
            }]
        },
        options: {
            plugins: {
                datalabels: {
                    formatter: displayPercent,
                    textStrokeColor: "black",
                    textStrokeWidth: 2
                }
            },
            sort: true
        }
    })

    ChartQueueDurations = new Chart("queueDurations", {
        type: "pie",
        data: {
            "labels": ["0-10 minutes", "10-20 minutes", "20-30 minutes", "30-40 minutes", "40-50 minutes", "50-60 minutes", ">60 minutes"],
            "datasets": [{
                label: "Minutes",
                data: queuetimes,
                backgroundColor: randomColorArray(7)
            }]
        },
        options: {
            plugins: {
                datalabels: {
                    formatter: displayPercent,
                    textStrokeColor: "black",
                    textStrokeWidth: 2
                }
            },
            sort: true
        }
    })

    ChartMMR = new Chart("mmrChanges", {
        type: "pie",
        data: {
            "labels": ["<-100", "-100 - -50", "-50 - -20", "-20 - -5", "-5 - -1", "0 - 2", "2 - 5", "5 - 20", "20 - 50", "50 - 100", "> 100"],
            "datasets": [{
                label: "MMR",
                data: mmrchanges,
                backgroundColor: randomColorArray(11)
            }]
        },
        options: {
            plugins: {
                datalabels: {
                    formatter: displayPercent,
                    textStrokeColor: "black",
                    textStrokeWidth: 2
                }
            },
            sort: true
        }
    })
}







//Misc data extracted by trial + error or from the Itemtxt / Item Schema / TF2 Localisation

let compmapnames = ["cp_process_final", "cp_gorge", "cp_badlands", "cp_vanguard", "cp_granary", "cp_foundry", "cp_gullywash_final1", "cp_snakewater_final1", "koth_viaduct", "cp_sunshine", "cp_metalworks", "pl_swiftwater_final1", "pl_badwater", "ctf_turbine"]


let tf2maplist = {
    "0": "Missing",
    "1": "cp_gorge",
    "2": "cp_badlands",
    "3": "cp_vanguard",
    "4": "cp_granary",
    "5": "cp_foundry",
    "6": "cp_gullywash_final1",
    "7": "cp_snakewater_final1",
    "8": "koth_viaduct",
    "9": "cp_gravelpit",
    "10": "cp_dustbowl",
    "11": "cp_well",
    "12": "ctf_2fort",
    "13": "tc_hydro",
    "14": "ctf_well",
    "15": "pl_goldrush",
    "16": "cp_fastlane",
    "17": "ctf_turbine",
    "18": "pl_badwater",
    "19": "cp_steel",
    "20": "cp_egypt_final",
    "21": "cp_junction_final",
    "22": "plr_pipeline",
    "23": "pl_hoodoo_final",
    "24": "koth_sawmill",
    "25": "koth_nucleus",
    "26": "ctf_sawmill",
    "27": "cp_yukon_final",
    "28": "koth_harvest_final",
    "29": "ctf_doublecross",
    "30": "cp_freight_final1",
    "31": "pl_upward",
    "32": "plr_hightower",
    "33": "pl_thundermountain",
    "34": "cp_coldfront",
    "35": "cp_mountainlab",
    "36": "cp_degrootkeep",
    "37": "cp_5gorge",
    "38": "pl_frontier_final",
    "39": "plr_nightfall_final",
    "40": "koth_lakeside_final",
    "41": "koth_badlands",
    "42": "pl_barnblitz",
    "43": "sd_doomsday",
    "44": "koth_king",
    "45": "cp_standin_final",
    "46": "cp_process_final",
    "47": "cp_sunshine",
    "48": "cp_metalworks",
    "49": "pl_swiftwater_final1",
    "50": "pass_brickyard",
    "51": "pass_timbertown",
    "52": "pass_district",
    "53": "ctf_landfall",
    "54": "cp_snowplow",
    "55": "ctf_2fort_invasion",
    "56": "cp_powerhouse",
    "57": "koth_suijin",
    "58": "koth_probed",
    "59": "koth_highpass",
    "60": "pl_cactuscanyon",
    "61": "pl_borneo",
    "62": "pl_snowycoast",
    "63": "pd_watergate",
    "64": "arena_watchtower",
    "65": "arena_offblast_final",
    "66": "arena_badlands",
    "67": "arena_granary",
    "68": "arena_lumberyard",
    "69": "arena_nucleus",
    "70": "arena_ravine",
    "71": "arena_sawmill",
    "72": "arena_well",
    "73": "arena_byre",
    "74": "cp_gorge_event",
    "75": "cp_sunshine_event",
    "76": "koth_moonshine_event",
    "77": "pl_millstone_event",
    "78": "koth_viaduct_event",
    "79": "cp_manor_event",
    "80": "koth_harvest_event",
    "81": "koth_lakeside_event",
    "82": "plr_hightower_event",
    "83": "sd_doomsday_event",
    "84": "rd_asteroid",
    "85": "ctf_foundry",
    "86": "ctf_gorge",
    "87": "ctf_thundermountain",
    "88": "ctf_hellfire",
    "89": "mvm_ghost_town",
    "90": "mvm_mannhattan",
    "91": "mvm_rottenburg",
    "92": "mvm_bigrock",
    "93": "mvm_decoy",
    "94": "mvm_coaltown",
    "95": "mvm_mannworks",
    "96": "tr_dustbowl",
    "97": "tr_target",
    "98": "koth_maple_ridge_event",
    "99": "pl_fifthcurve_event",
    "100": "pd_pit_of_death_event",
    "101": "cp_mercenarypark",
    "102": "cp_mossrock",
    "103": "koth_lazarus",
    "104": "plr_bananabay",
    "105": "pl_enclosure_final",
    "106": "koth_brazil",
    "107": "koth_bagel_event",
    "108": "pl_rumble_event",
    "109": "pd_monster_bash",
    "110": "koth_slasher",
    "111": "pd_cursed_cove_event"
}


let bit_classes = ["Scout", "Sniper", "Soldier", "Demo", "Medic", "Heavy", "Pyro", "Spy", "Engineer"]



let colors = ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "honeydew", "hotpink", "indianred ", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgrey", "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"];


function randomColorArray(size) {
    let out = [];
    let a = colors.slice(0);
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    while (size > 0) {
        out.push(a[size % a.length])
        size--;
    }
    return out;
}














// From https://jsfiddle.net/fx0a6o6q/3/ | https://github.com/chartjs/Chart.js/issues/3832#issuecomment-275666546      -    was slightly modified to work with the pie charts
Chart.plugins.register({
    beforeUpdate: function (chart) {
        // If this option is true, do the sorting. We only do this when the button is pressed
        if (chart.options.sort) {
            // This gets the dataArray for the first dataset
            let dataArray = chart.data.datasets[0].data;
            // We create an array of indexes
            // [0, 1, 2 ... length - 1]
            let dataIndexes = dataArray.map((d, i) => i);

            // We sort these indexes by the data value
            // If the data is [10, 0, 30, 20]
            // dataIndexes starts as [0, 1, 2, 3]
            // and is sorted into [1, 0, 3, 2]
            dataIndexes.sort((a, b) => {
                return dataArray[a] - dataArray[b];
            });

            // Npw we sort the data array so the chart will have the correct data
            dataArray.sort((a, b) => a - b);

            // At this point dataIndexes is sorted by value of the data, 
            // so we know how the indexes map to each other
            // Now we need to sort the bar objects, labels and background colours
            let labels = chart.data.labels;
            let newLabels = [];
            let newColors = [];

            labels.forEach((bar, i) => {
                // The meta.data array has the bars in the old order
                // so we look up the new index by using the dataIndexes array.
                // indexOf isn't the most efficient but we have a small number of bars
                let newIndex = dataIndexes.indexOf(i);

                // Copy the label to the new position
                newLabels[newIndex] = chart.data.labels[i];

                // Copy the color to the new position
                newColors[newIndex] = chart.data.datasets[0].backgroundColor[i];
            });

            chart.data.labels = newLabels;
            chart.data.datasets[0].backgroundColor = newColors;
        }
    }
});