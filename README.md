#box
L'applicazione client/server box è estrapolata da un applicazione in node.js più complessa realizzata per il progetto [Masbooth](http://masbooth.com/), questa parte si occupa di presentare su interfaccia browser le immagini contenute in una cartella. Queste sono presentate in forma di 'wall' con numero di righe e colonne configurabili, possiamo inoltre decidere il margine delle box, l'effetto di transizione, i tempi di aggiornamento e durata dell'effetto.
La comunicazione bidirezionale client/server è stata realizzata tramite socket.io.
Ho modificato il plugin bgswitcher usato dal client per l'effetto transizione aggiungendo semplici metodi per l'aggiornamento immagini (img_add) e modifica del tempo di transizione (change_duration).
Il resize delle box, necessario in quanto la pagina viene mostrata su browser a schermo intero è realizzato interamente in javascript.

##Installazione
```
npm install
nodejs server.js
```
Il server è in ascolto sulla porta 9080, a questo punto occorre connettersi con un browser a localhost:9080 e il server passerà al client la pagina html da popolare e visualizzare

##Setup e configurazione
Le immagini (jpg), in pic/sample, devono iniziare con il prefisso pic_, non c'è alcun controllo sull'estensione del file, nell'applicazione completa è il sever stesso a popolare la cartella di immagini.


I parametri della griglia immagini sono modificabili nel file config.json, occorre un riavvio del server per rendere effettive le modifiche. La descrizione dei parametri si trova in server.js

##Browser control
Dal browser con il tasto 'a' si cambia il tempo di switch fra le immagini, impostate nel file di configurazione, mentre con 'd' si fa un refresh delle immagini presenti nella cartella pic/sample
