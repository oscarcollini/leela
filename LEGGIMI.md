# leela — PWA 0.4.10

## Cambiamento

Rimossa la procedura a dieci passaggi della 0.4.6. Non ci sono pulsanti Avanti o conferme intermedie: prima foto → seconda foto → risultato, con avanzamento automatico dopo ogni scatto.

- Prima foto: un campo «Primo piano a circa … m» aggiorna subito il suggerimento di spostamento. Valore iniziale 3 metri.
- Seconda foto: istruzione breve con la misura suggerita e il riferimento lontano da mantenere alla stessa altezza.
- Risultato: scelta del formato e cursori disponibili insieme, prima verticale e poi orizzontale. L’indicazione del dettaglio da allineare cambia con il formato.
- La guida completa rimane facoltativa nel pulsante Guida.

## Aggiornamento

1. Estrai lo ZIP.
2. Carica solo i file estratti nello stesso percorso HTTPS del sito esistente, per esempio nella radice del repository GitHub Pages.
3. Riapri il sito in Chrome. Se compare «Aggiorna app», salva gli scatti e toccalo.
4. In Guida → App attendi lo stato «Pronta per l’uso offline · 0.4.10».

Non serve rinominare il repository né cambiare URL. Il manifest conserva identità e scope relativi allo stesso percorso. Lo ZIP contiene sorgenti statici; non richiede compilazione o servizi ChatGPT. Il file HTML locale non permette di installare la PWA; usa il sito HTTPS per fotocamera e installazione.

## Uso

1. Stima la distanza dalla fotocamera all’elemento più vicino nell’inquadratura, anche se compare soltanto sul bordo. Puoi modificare direttamente il campo nella schermata della prima foto.
2. Apri la fotocamera. Inquadra una scena ferma con elementi a distanze diverse, lasciando margine ai bordi. Scatta.
3. Sposta il telefono a destra della misura suggerita, mantenendo altezza e direzione. Non ruotarlo verso il soggetto. Un dettaglio lontano deve stare alla stessa altezza nelle due immagini; può restare separato lateralmente. Scatta la seconda foto.
4. Nel risultato scegli il formato. Per Alternanza/GIF, allinea un dettaglio che vuoi mantenere fermo. Per Rosso/ciano o Affiancate, parti da un dettaglio dell’oggetto più vicino.
5. Correggi prima l’altezza, poi sovrapponi lateralmente il dettaglio. Gli altri oggetti possono restare separati.
6. Regola la velocità se usi Alternanza, quindi salva.

«Rifai il secondo scatto» conserva il primo e ti riporta alla seconda posizione; non chiede di spostarti ancora. «Nuova coppia» riavvia la ripresa e scarta gli scatti della sessione. Durante la ripresa il documento non scorre e il pulsante di scatto resta nella schermata. Nei risultati puoi scorrere i comandi; Nuova coppia e Guida restano nella barra superiore.

## Suggerimento di spostamento

La stima usa distanza del primo piano / 50: 2 centimetri per ogni metro. Esempi: 1 m → 2 cm; 2,5 m → 5 cm; 3 m → 6 cm; 5 m → 10 cm. Il campo accetta valori da 0,5 a 1000 metri; i limiti numerici non sono una certificazione di precisione. Un valore vuoto o non valido disabilita lo scatto finché viene corretto.

È una scelta iniziale prudente rispetto alla regola indicativa 1:30, non una garanzia. La resa dipende anche da inquadratura, sfondo, ritagli e visualizzazione. Usa l’inquadratura normale senza zoom. Se il movimento o il rilievo sono troppo forti, ripeti con uno spostamento più piccolo. L’app non misura quanto il telefono si muove. Trasferire il peso fra i piedi non corrisponde a una distanza fissa.

Riferimenti: https://isu3d.org/goldenrules/ ; https://www.stereoscopy.com/library/waack-ch-4.html ; https://www.44bx.com/vic3d/bases.html

## Esportazione e dati

- Alternanza: GIF animata in ciclo, due fotogrammi, lato lungo massimo 720 px, palette condivisa da 256 colori. Intervallo 1000–50 ms; iniziale 450 ms.
- Rosso/ciano: anaglifo PNG, rosso per l’occhio sinistro.
- Affiancate: coppia PNG sinistra/destra per visore o visione parallela.

Gli scatti restano in memoria: salva prima di chiudere o ricaricare. Tutto viene elaborato sul dispositivo, senza inviare foto a un server. Passare a un’altra app spegne la fotocamera; riaprila al ritorno. Gli aggiornamenti non ricaricano automaticamente una sessione con scatti non salvati.

## Ritorno alla 0.4.5

La cartella `ritorno_0.4.5` contiene lo ZIP originale della versione prima degli esperimenti con la guida. Per tornare a quella versione, estrailo e carica il contenuto della sua cartella `leela` nello stesso percorso del sito. Riapri il sito, usa Aggiorna app se compare e verifica lo stato offline 0.4.5. Non caricare la cartella di ripristino nel sito.

## Componenti

`index.html`: interfaccia, fotocamera, allineamento ed esportazione. `pwa.js`: installazione e aggiornamento volontario. `sw.js`: cache offline. `gif-encoder.js`: encoder GIF autonomo. `manifest.webmanifest`: installazione PWA. `icon.svg` e `icon-*.png`: icone.

Palette viola #923B9D, grigio #4D5D65 e bianco; icona A. Nessuna nuova dipendenza o permesso.

## Verifiche 0.4.7

- Sintassi JavaScript, riferimenti DOM, assenza della procedura a passaggi, ordine dei cursori, validazione e calcolo della distanza verificati automaticamente.
- Istruzioni per il riferimento da allineare verificate per GIF e stereo.
- Acquisizione, normalizzazione, ritaglio, disegno del risultato ed esportazione confrontati con la 0.4.5: invariati.
- Interfaccia controllata nel browser con scatti simulati: passaggio diretto prima → seconda → risultato, modifica della distanza, cambio formato, ripetizione della seconda foto e nuova coppia.
- Nessuno scorrimento durante la ripresa a 320×480 e 640×360. Primo scatto a 320×480: pulsante fra y=378 e y=428; secondo fra y=332 e y=382; secondo a 640×360 fra y=286 e y=329.
- Integrità dello ZIP e copia originale di ripristino verificate.

Non è una nuova prova con la fotocamera fisica né una nuova installazione Android. La logica fotografica deriva dalla versione già provata dall’utente; la comodità delle nuove istruzioni resta da valutare sul telefono.
