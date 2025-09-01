Todo Rakendus - Kasutamise Juhend
Lihtne ülesannete haldamise rakendus, mis töötab REST API-ga ja sisaldab kaht disaini režiimi.
Mis see on?
See on veebipõhine todo rakendus, kus saad:

Registreeruda ja sisse logida
Ülesandeid lisada, muuta ja kustutada
Ülesandeid tehtuks märkida
Ülesandeid filtreerida (kõik/aktiivsed/tehtud)
Lülitada kahe disaini vahel (tavaline vs ilus AI-disain)

Kuidas kasutada?
1. Esmakordne kasutamine

Ava index.html fail brauseris
Registreeru: täida väljad "Username", "First name", "Last name", "Password"
Kliki "Create account"
Oled automaatselt sisse logitud

2. Tagasi tulek
Kui oled juba registreerunud:

Ava rakendus
Logi sisse: täida "Username" ja "Password"
Kliki "Log in"

3. Ülesannete lisamine

Pärast sisselogimist näed "Add task" sektsiooni
Täida "Title" (kohustuslik)
Lisa soovi korral "Description"
Kliki "Add"

4. Ülesannete haldamine

Tehtud märkimine: kliki linnukest ülesande kõrval
Muutmine: kliki "Edit" nuppu
Kustutamine: kliki "Delete" nuppu
Filtreerimine: kasuta "All", "Active", "Done" nuppe

5. Disaini vahetamine
Ekraani ülemises paremas nurgas on nupp "Style App with LLM":

Kliki seda, et lülitada kauni AI-disaini ja tavalise disaini vahel
Näed kohe, kuidas rakendus muutub ilusamaks

Tehnilised üksikasjad
Failid

index.html - põhifail HTML struktuuriga
script.js - kogu JavaScripti funktsionaalsus

API ühendus
Rakendus kasutab REST API-t: https://demo2.z-bit.ee

Kõik andmed salvestatakse serveris
Sinu sessioon jääb meelde (localStorage)

Funktsionaalsused

Kasutaja registreerimine ja autentimine
CRUD operatsioonid ülesannete jaoks (Create, Read, Update, Delete)
Ülesannete filtreerimine oleku järgi
Inline redigeerimine
Disaini lülitamine (tavaline/AI-disain)
Sessiooni salvestamine

Probleemide korral
Kui midagi ei tööta:

Kontrolli internetiühendust
Ava brauseri Developer Tools (F12) ja vaata Console'i vigu
Proovi välja logida ja uuesti sisse logida
Kontrolli, et kasutajanimi ja parool on õiged

Märkused

Rakendus töötab ainult internetiühendusega
Andmed salvestatakse välises API-s
Disaini lülitamise funktsioon on puhtalt visuaalne - andmed jäävad samaks
Browseris JavaScript peab olema lubatud
