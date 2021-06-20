## Carto SQL API – Umkreissuche  
Wir stellen hier eine Script-Vorlage zur Verfügung,
mit der gezeigt wird, wie Adressen innerhalb eines bestimmten Radius ermittelt werden können.
Diese Vorlage dient nur als Idee/Ansatz für ähnlich gelagerte Projekte! ([Wichtiger Hinweis](#wichtiger-hinweis))

### Live-Demo:
https://raw.githack.com/plzTeam/carto-umkreis-preview/master/index.html

## Präsentation - use case
Dieses hier umgesetzte Anwendungsbeispiel bezieht sich auf kategorisierte und geolokalisierte Zielgruppen. 
Jeder Teilnehmer (Datensatz) besteht daher aus einer Punktkoordinate, welche innerhalb der Beispielanwendung
um ein Zentrum ermittelbar ist.

Die Anwendung soll aufzeigen, wie clientseitig Datensätze
auf einer entfernten Carto-Datenbank erzeugt, entfernt und editiert werden können.
Außerdem wird anhand visueller und tabellarischer Darstellung die Ladegeschwindigkeit
komplexer GIS-Abfragen (hier Umkreisberechnung) demonstriert.
Zusätzlich wird die Filterung der Datensätze anhand eines Kategoriefeldes gezeigt. 

### Verwendete Testdaten
Alle Testdaten werden über die [Faker.js](https://github.com/marak/Faker.js/) Bibliothek erzeugt.
Es ist daher nicht möglich über diese App individuelle Daten einzupflegen.

Für eine etwaige Import-Erweiterung sollten Grunddaten (bspw. via Excel) folgende Spalten enthalten:

x | y |  city | name | category
---|---|-----|------|-----
Number: (Breitengrad) | Number: (Längengrad) | String: (text) | String: (text) | Number: 1, 2 od. 3

## Warum Carto?
Die Basisanwendung von Carto ist Open-Source und somit vorallem kostentechnisch skalierbar.
Carto hat außerdem seine Stärken im Umgang mit GIS-Daten und deren Zugänglichkeit
(Zugangskontrolle, APIs, vereinfachte Visualisierung und Map-Einbindungen).
Daten können entweder über die SQL-API oder mit einer direkten PostgreSQL-Datenbankverbindung abgefragt und manipuliert werden.

Ganz abgesehen von der Entwicklersicht bietet Carto eine umfangreiche Nutzerumgebung
mit Map-Editor und vielen weiteren Features.

### Carto beziehen
+ Der offizielle Anbieter ist [Carto.com](https://carto.com/) - dort ist auch die umfangreiche [Dokumentation](https://docs.carto.com/) zu finden
+ Eine kostengünstige Alternative ist [getgeodb.com](https://getgeodb.com/) auf Basis des unten genannten Repository
+ Übrig bleibt das Open-Source-Repository auf [github/CartoDB](https://github.com/CartoDB) für das Aufsetzen einer eigenen Server-Instanz

### Interessante Verweise für die Weiterentwicklung   
+ https://github.com/CartoDB/cartodb-nodejs
+ https://www.npmjs.com/package/sqlstring - aktuell fehlt SQL-Escape von "Special Characters",
  dies führt bei manchen zufällig generierten Namen zu SQL-Fehlern (bspw. dieses Zeichen '&')

### Bekannte Stolpersteine
+ Projektion: die gängigen Koordinatensysteme für die visuelle Kartendarstellung
  sind nicht für Berechnungen im metrischen System nutzbar. Folglich muss zur Berechnung
  das Geometrie-Feld der Carto-Datenbank entsprechend transformiert werden.
  
# Wichtiger Hinweis
Dieses Script bitte niemals selbst online stellen! 

In diesem Script werden client-side SQL-Abfragen über eine zwar beschränkte
aber offene Schnittstelle gesendet. Dieser Part sollte server-side (bspw. über node.js) ausgelagert werden!

Der aktuell (Stand: 06/2021) verwendete API-Key und die Carto-Instanz wird ggf. in Zukunft
nicht mehr funktionieren! 