TeamFortressMatchHistoryAnalyzer
================================

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Introduction
------------

Since the EU GDPR changes you can view your personal data on Steam. This includes information related to TF2, this information also includes the Match History of all Matches you played in Casual or Competitive. This is a tool which allows you to analyze this data after you download it as HTML page (yourself, a helper script is included on the page.). You can use it directly online [here](https://netroscript.github.io/TeamFortressMatchHistoryAnalyzer/) (or you just download it, do whatever you want).  

Selection of Screenshots
------------------------

The following examples are things included in the tool. But feel free to use the JSON data to do your own analysis.
 
![Amount of Games Played](https://i.imgur.com/YaTuggD.png)
 
![Games Plyed per Day](https://i.imgur.com/F2gzN5p.png)

![Classes played](https://i.imgur.com/TtY4Tjo.png)

![Queue Duration](https://i.imgur.com/ADgZDgP.png)

![Match Duration](https://i.imgur.com/vk2PeMl.png)

![Additional Stats](https://i.imgur.com/NG2TBKG.png)

How it works
------------

You can upload a (html) file, and the JavaScript accesses it and parses it (assuming it is from the Match History page). It then creates 2 lists, one with all casual games and one with all competitive games. It then iterates them and compares / checks values to build up the information needed for display. Then it displays it using Chart.js.

Usage
-----

Just download this as a folder, and open index.html in your browser.  

Or try it out [online](https://netroscript.github.io/TeamFortressMatchHistoryAnalyzer/)!


Credits
-------

Following Libraries are included and used:

* [Chart.js](https://www.chartjs.org/) - Licensed under the MIT License
* [chartjs-plugin-datalabels](https://chartjs-plugin-datalabels.netlify.com/) - Licensed under the MIT License