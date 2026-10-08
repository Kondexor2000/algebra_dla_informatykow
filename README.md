# Algebra Lab

Interaktywny projekt edukacyjny w React poświęcony algebrze abstrakcyjnej. Aplikacja działa w przeglądarce i nie korzysta z bazy danych ani serwera aplikacyjnego.

## Uruchomienie

Wymagany jest Node.js. W katalogu projektu wykonaj:

```bash
npm install
npm run dev
```

## Publikacja

Każdy push do gałęzi `main` automatycznie buduje aplikację i publikuje ją przez GitHub Pages:

https://kondexor2000.github.io/algebra_dla_informatykow/

Workflow wdrożeniowy znajduje się w `.github/workflows/deploy.yml`. Przy pierwszej publikacji w ustawieniach repozytorium, w sekcji **Settings → Pages**, jako źródło należy wybrać **GitHub Actions**.

## Co zawiera

- krótkie wprowadzenie do półgrup, monoidów, grup, pierścieni i ciał;
- interaktywny kalkulator arytmetyki modulo z tabelą działania;
- generator 1 000 losowych trójek sprawdzających łączność wybranego działania;
- przykładowy test własnościowy w stylu Rust/proptest.

Próby losowe ilustrują testowanie własności, ale nie stanowią formalnego dowodu. Zakres merytoryczny jest wprowadzeniem do pojęć algebry abstrakcyjnej; szczegółowy program kursu należy odczytać bezpośrednio z podanego sylabusa.
