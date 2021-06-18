## Carto SQL API – Umkreissuche  
Wir stellen hier eine Script-Vorlage zur Verfügung,
mit der gezeigt wird, wie Adressen innerhalb eines bestimmten Radius ermittelt werden können.
Diese Vorlage dient nur als Idee/Ansatz für ähnlichgelagerte Projekte! 

### Live-Demo:
https://raw.githack.com/plzTeam/carto-umkreis-preview/master/index.html

## Präsentation - use case
Dieses hier umgesetzte Anwendungsbeispiel bezieht sich auf kategorisierte und geolokalisierte Zielgruppen. 
Jeder Teilnehmer (Datensatz) besteht daher aus einer Punktkoordinate, welche innerhalb der Beispielanwendung
um ein Zentrum ermittelbar ist.

Die Anwendung soll aufzeigen, wie clientseitig Datensätze
auf einer entfernten Carto-Datenbank erzeugt, entfernt und editiert werden können.
Außerdem wird anhand visueller und tabellarischer Darstellung die Ladegeschwindigkeit
komplexer GIS-Abfragen (Umkreisberechnung) demonstriert.
Zusätzlich wird die Filterung der Datensätze anhand eines Kategoriefeldes gezeigt. 

### Verwendete Testdaten
Es ist nicht möglich über diese App individuelle Daten einzupflegen, alle Testdaten werden 
über die [Faker.js](https://github.com/marak/Faker.js/) Bibliothek erzeugt.

## Warum Carto?
Die Basisanwendung von Carto ist OpenSource und somit vorallem kostentechnisch skalierbar.
Carto hat außerdem seine Stärken im Umgang mit GIS-Daten und deren Zugänglichkeit
(integriertes Auth, APIs, vereinfachte Map-Einbindungen).
Die Daten können entweder über die SQL-API oder mit einer direkten PostgreSQL-Datenbankverbindung abgefragt und manipuliert werden.
### Carto beziehen
+ Der offizielle Anbieter ist [Carto.com](https://carto.com/)
+ Eine kostengünstige Alternative ist [getgeodb.com](https://getgeodb.com/) auf Basis der unten genannten Repository
+ Übrig bleibt das Open-Source-Repository auf [github/CartoDB](https://github.com/CartoDB) für das Aufsetzen einer eigenen Server-Instanz

### Interessante Verweise für die Weiterentwicklung   
+ https://github.com/CartoDB/cartodb-nodejs

### Bekannte Stolpersteine
+ Projektion: die gängigen Koordinatensysteme für die visuelle Kartendarstellung
  sind nicht für Berechnungen im metrischen System nutzbar. Folglich muss zur Berechnung
  das Geometrie-Feld der Carto-Datenbank entsprechend transformiert werden.