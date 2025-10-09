O aplicatie web de cautat retete. A fost realizata in vanilla JS (cu arhitectura MVC). Utilizatorul scrie o reteta in search si ii vor fi afisate rezultate dintr-un API. Se vor recomanda si retete bazat pe cautarile efectuate, descarcarea retetei dorita (jpg), cat si un istoric al cautarilor.

Aplicatia a fost intr-un curs pe care l-am urmat, insa am venit cu cateva imbunatatiri.

Am realizat salvarea cautarile anterioare cu ajutorul localStorage. Ele vor fi afisate pe pagina home, alaturi cu un buton Delete History.
Am creat un buton pentru a descarca reteta (jpg) cu ingredientele necesare pentru a fi mult mai convenabila partea de cumparat a ingredientelor.
Se vor afisa sugestii bazate pe cautarile anterioare. Dacă utilizatorul a vizionat rețete cu titluri similare (ex: “Chicken Curry”, “Chicken Soup”, “Rice with Chicken”), aplicația extrage cele mai frecvente cuvinte (aici: “Chicken”, “Rice”) și caută automat rețete noi care conțin acele cuvinte.
-	La fiecare cautare si intrare pe reteta salvam in istoric (localStorage)
-	state.recommend este o structura de date Sett unde vom salva cuvintele din titlul retetei. Simultan vom avea un array de frecventa fiecarui cuvant
-	Alegem primele 2 dintre cele mai frecvente cuvinte (fara valori falsy ca: best, with, &. Care se pot afla in titlurile retetei)
-	Cautam in api aceste 2 cuvinte si afisam 6 retete (3 pentru fiecare)
-	Algo: Bag-of-words simplificat
Am realizat si un meniu unde pot fi adaugate diferite pagini.
Am continuat sa lucrez cu arhitectura MVC la adaugarea noilor caracteristici

