# WMP-SoSe2024

# Teilnehmer
- Clemens Abraham
- Felix Gahler
- Emil Petersen

## Aufgabe/Idee:
- Weboberfläche mit Api anbindung zu fyyd.de
- Anforderungen sollen wir selber ausdenken/erstellen. 
- Vorstellung + CodeReview im Praktikum

## Tools:
- node.js package manager
- Vue framework per npm install


## Project setup for Vue JS 'podcast-project'
1. Open the terminal.
2. ```npm install -g @vue/cli``` (installs vue framework globally) or on macOS: ```npm install -g @vue/cli```
3. Go into your IDE and clone the project.
4. Open the terminal inside your IDE and type ```cd *project path*``` (sets path location to folder where vue project lies)
5. ```npm install``` (installs 'node_modules' / vue library) or on macOS: ```sudo npm install```
6. ```npm run serve``` (starts live server for web page) or on macOS: ```sudo npm run serve```
<br>

## Tutorials
<br>

### HTTP & REST
https://moodle.hs-anhalt.de/pluginfile.php/485048/mod_resource/content/1/V4%20HTTP%20und%20REST.pdf
### How to FETCH data from an API using JavaScript ↩️
https://www.youtube.com/watch?v=37vxWr0WgQk
### What are JavaScript PROMISES? 🤞
https://www.youtube.com/watch?v=NOzi4wBHn0o&list=PLhsIRYH7hjMrR-yfCdOX13NAI-oG5sIn2&index=3
### JavaScript ASYNC/AWAIT is easy! ⏳
https://www.youtube.com/watch?v=9j1dZwFEJ-c
### Vue.js 3 Tutorial
https://www.youtube.com/playlist?list=PL4cUxeGkcC9hYYGbV60Vq3IXYNfDk8At1

## Funktionale und nichtfunktionale Anforderungen:
<br>

### Funktionalität:
-	Suchfunktion mit Filtern (Sprache, Veröffentlichungszeitraum, Episodendauer)
-	Podcast-Detailansichten mit Wiedergabefunktion
-	Benutzerkontenverwaltung (Registrierung, Login, Passwort-Reset)
-	Kategorisiertes Podcast-Verzeichnis mit Anzeige neuer & beliebter Podcasts
-	Abonnement-Funktionalität für Podcasts mit Benachrichtigungen bei neuen Episoden
-	Integration der fyyd.de API zum Abrufen von Podcast-Daten
-	Mehrsprachige Benutzeroberfläche basierend auf fyyd.de Sprachen
### Usability:
-	Intuitive, leicht zu navigierende Benutzeroberfläche
-	Responsives Design für Desktop, Tablet und Smartphone
-	Barrierefreiheit gemäß Accessibility-Standards
-	Kontextsensitive Hilfe und Onboarding für neue Nutzer
-	Anpassungsmöglichkeiten (z.B. Schriftgröße, Farbschema, Downloadeinstellungen)
### Verlässlichkeit:
-	Hohe Verfügbarkeit mit 99,9% angestrebter Uptime
-	Fehlertoleranz durch Fehlerbehandlung und Wiederherstellungsmechanismen
-	Regelmäßige Backups zur Vermeidung von Datenverlust
-	Monitoring der Systemleistung und Fehlererkennung
### Sicherheit:
-	Verschlüsselte Datenübertragung via HTTPS
-	Sichere Authentifizierung und Zugriffskontrolle für Benutzerkonten
-	Schutz persönlicher Daten gemäß DSGVO
-	Regelmäßige Sicherheits-Audits und Updates
-	Schutz vor häufigen Angriffen wie SQL Injection, XSS etc.
### Performance:
-	Schnelle Antwortzeiten unter 2 Sek. für Suche und Abruf
-	Effiziente Datenverarbeitung und Caching zur Minimierung der Last
-	Skalierbarkeit für steigende Benutzerzahlen und Datenmengen
-	Ladezeit-Optimierung (Komprimierung, Lazy Loading etc.)
-	CDN-Nutzung für globale Reichweite und Geschwindigkeit
### Wartbarkeit:
-	Modulare, erweiterbare Architektur
-	Ausführliche Code-Dokumentation und Coding-Richtlinien
-	Versionskontrolle und definierte Release-Zyklen für Updates
-	Automatisierte Tests (Unit, Integration, UI)
-	Enge Kopplung von Frontend und Backend vermeiden
### Kompatibilität:
-	Unterstützung gängiger Browser (Chrome, Firefox, Safari, Edge)
-	Rückwärtskompatibilität innerhalb definierter Versionen
-	Kompatibilität mit verschiedenen Betriebssystemen und Geräten
-	Nutzung standardisierter Datenformate und Protokolle
-	Klare Dokumentation zu Systemvoraussetzungen
### Portierbarkeit:
-	Plattformunabhängiges Design für Web, Desktop und Mobile
-	Verwendung plattformübergreifender Frameworks und Bibliotheken
-	Containerisierung für einfache Bereitstellung in verschiedenen Umgebungen
-	Globalisierung und Lokalisierung für verschiedene Märkte
-	Skalierung auf unterschiedliche Systemgrößen (horizontal/vertikal)

<br>
