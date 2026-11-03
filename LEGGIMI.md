# leela — PWA classica 0.4.5

## Pubblica

1. Estrai lo ZIP.
2. Carica tutti i file della cartella `leela` insieme sul tuo hosting statico HTTPS, per esempio GitHub Pages. Conserva i nomi e la posizione relativa dei file.
3. Apri l’indirizzo del sito in Chrome.
4. Attendi «Pronta per l’uso offline · 0.4.5».
5. Menu ⋮ → Aggiungi a schermata Home → Installa.
6. Avvia leela dall’icona. Consenti la fotocamera.

Non aprire l’HTML locale per installare la PWA. Non sono richiesti account o servizi ChatGPT. Questo pacchetto non è stato pubblicato su ChatGPT Sites. La pubblicazione su un hosting classico resta da fare; lo ZIP non è un’app Android installabile direttamente.

## Scatta

1. Porta il peso sul piede sinistro. Inquadra una scena ferma. Tieni il telefono diritto. Scatta.
2. Porta il peso sul piede destro, spostando il telefono lateralmente senza ruotarlo.
3. Mantieni un punto lontano alla stessa altezza nelle due immagini. Non girare il telefono per sovrapporlo in orizzontale.
4. Scatta la seconda foto.
5. Regola l’allineamento: correggi prima l’altezza, poi sovrapponi un punto vicino.
6. Salva il risultato prima di chiudere l’app.

Evita primi piani ravvicinati e soggetti in movimento. Il trasferimento del peso non misura la base di ripresa: per soggetti vicini riduci lo spostamento.

## Esporta

- Alternanza → regola «Velocità dell’alternanza» → «Salva GIF alternata».
- Rosso/ciano → «Salva anaglifo PNG».
- Affiancate → «Salva coppia PNG».

La GIF usa le due foto già allineate, l’ordine sinistra/destra scelto e l’intervallo impostato. Si ripete in ciclo. Lato lungo massimo 720 px; palette condivisa da 256 colori, quindi la resa cromatica è ridotta rispetto alle foto. L’encoder usa blocchi LZW brevi: i file possono pesare più di GIF con compressione ottimizzata. Il PNG mantiene la risoluzione della coppia allineata. Tutto viene elaborato sul dispositivo.

## Modifiche della 0.4.5

- Slider «Velocità dell’alternanza»: verso destra accelera. Intervallo da 1000 a 50 ms per foto; valore iniziale 450 ms. La GIF usa lo stesso intervallo selezionato.
- Guida riorganizzata nelle sezioni Scatta, Allinea, Rilievo, Consigli e App. Istruzioni illustrate, spiegazioni dei formati e soluzioni pratiche distinte e navigabili.
- Pulsante «Torna alle foto» e navigazione della guida sempre visibili; scorre soltanto il contenuto della sezione.
- Nome aggiornato in tutte le occorrenze: leela, inclusi manifest, cache e file esportati.
- Nuova palette viola #923B9D, grigio #4D5D65 e bianco.
- Icona A: pupilla nera centrale, due contorni viola sfalsati, bordi interni attenuati al 50%, sclera bianca nella sovrapposizione ed estremità al 50%.
- Registrazione della fotocamera, ripresa, sovrapposizione e allineamento conservano la logica già provata sul telefono.

## Caratteristiche consolidate

- «Nuova coppia» nella barra superiore, visibile durante la ripresa e nel risultato.
- Disegni di allineamento disponibili nelle istruzioni anche su telefono.
- Icona coordinata al nome leela e alla nuova palette.

- Nome: leela. Icona: occhio sdoppiato con pupilla centrale.
- Inquadratura e scatto restano nella schermata durante entrambi gli scatti, in verticale e in orizzontale. Il formato del fotogramma viene conservato; lo spazio libero resta attorno all’immagine.
- Istruzioni brevi; guida completa nel pulsante «Guida».
- Importazione foto separata dalla fotocamera integrata.
- Esportazione GIF locale, inclusa nella cache offline.
- Pacchetto statico autonomo; nessuna dipendenza da ChatGPT, CDN, librerie remote o server di elaborazione.

Gli scatti restano soltanto in memoria: chiudere o ricaricare l’app li perde. Passare a un’altra app spegne la fotocamera; riaprila al ritorno. «Chiudi fotocamera» conserva il primo scatto nella sessione. Gli aggiornamenti non ricaricano automaticamente una sessione con foto non salvate.

## Sorgenti

- `index.html`: interfaccia, fotocamera, allineamento ed esportazione.
- `pwa.js`: installazione, stato offline e aggiornamento volontario.
- `sw.js`: cache delle risorse locali e avvio offline.
- `gif-encoder.js`: encoder GIF89a autonomo, palette RGB332 condivisa, due fotogrammi.
- `manifest.webmanifest`, `icon-*.png`: configurazione e icone della PWA.

Nessuna compilazione necessaria. Per una nuova versione cambia sia `data-version` in index.html sia `VERSION` in sw.js. Pubblica insieme tutti i file.

## Verifiche della 0.4.4 (versione precedente)

- Estremi 50 e 1000 ms e valore iniziale 450 ms controllati.
- GIF agli estremi decodificate con un lettore indipendente: due fotogrammi, temporizzazione corretta e ciclo continuo.
- Nella versione precedente, confronto del codice della ripresa con la 0.4.3: identico.
- Navigazione della guida verificata nel browser a 360×640 e 320×480; comando per tornare alla foto visibile. Secondo scatto simulato a 320×480: documento senza scorrimento, tasto scatto entro lo schermo.
- Riferimenti DOM e sintassi JavaScript verificati.

## Verifiche precedenti

- Sintassi JavaScript, riferimenti DOM e file locali del manifest verificati.
- Mirino e scatto controllati nel browser con viewport 320×568, 320×480 e 640×360, anche al secondo scatto simulato. Nessuno scorrimento del documento durante la ripresa.
- GIF creata dall’interfaccia, poi riaperta con un decoder indipendente: due immagini diverse, 720×540, 450 ms per fotogramma e ciclo continuo.
- Encoder controllato anche con dimensioni minime e ai confini dei blocchi LZW.
- Ripresa e sovrapposizione sono state confermate dall’utente sulla versione precedente. Nuova guida e nuova gamma di velocità vanno provate sul telefono dopo l’aggiornamento.

Riferimento formato: https://www.w3.org/Graphics/GIF/spec-gif89a.txt. Graphics Interchange Format e GIF sono attribuiti a CompuServe Incorporated nella specifica originale.

## Riferimenti per la guida

- International Stereoscopic Union, The Three Golden Rules: https://isu3d.org/goldenrules/
- Fritz G. Waack, Stereo Photography, esposizione e base: https://www.stereoscopy.com/library/waack-ch-4.html

## Aggiornamento del nome e della grafica (0.4.5)

Pubblica i file di `leela` nello stesso percorso del sito già installato per aggiornare la PWA esistente. Il nome della cartella nel pacchetto non impone di cambiare URL o repository. L’identità del manifest, lo scope e lo start URL restano relativi allo stesso percorso. Dopo la pubblicazione usa «Aggiorna app», se compare, e attendi lo stato offline 0.4.5. Chrome può aggiornare nome e icona dell’installazione con ritardo; il titolo dentro l’app cambia subito dopo l’aggiornamento.

La fotografia, l’allineamento e le temporizzazioni conservano la logica precedente. Le illustrazioni dimostrative usano la nuova palette; i colori delle foto importate o scattate non vengono alterati dal tema.

## Controlli della 0.4.5

- Nessuna occorrenza del vecchio nome nei sorgenti e nelle istruzioni distribuiti.
- Sintassi JavaScript, riferimenti DOM, manifest e risorse locali verificati.
- Logica fotografica confrontata con la 0.4.4; nel JavaScript cambiano soltanto identificatori del nome e colori delle illustrazioni dimostrative.
- Encoder GIF verificato con decodifica indipendente a 50 e 1000 ms.
- Installazione della cache e avvio offline verificati con risposte simulate delle risorse; non costituisce una nuova prova di installazione sul telefono.
- PNG verificati a 192 e 512 pixel; icona controllata visivamente.
- Nuova palette e aggiornamento dell’icona installata restano da verificare sul dispositivo.
