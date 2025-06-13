yar
# prerequisite

install nodejs and yarn

```
  brew install yarn
```

# create a .env.development

```
REACT_APP_DHIS2_URL=https://dhis-pbf.moh.gov.et
REACT_APP_USER=xxxxxxxxxxxx
REACT_APP_PASSWORD=xxxxxxxxxxxx
REACT_APP_ORBF2_TOKEN=qsdqsd
REACT_APP_ORBF2_URL=http://127.0.0.1:3001
```

# start developement mode
```
yarn start
Then goto http://127.0.0.1:3000/ or localhost:3000
```

Note that localhost:3000 and 127.0.0.0:3000 needs to be whitelisted in Dhis2 Settings -> Access -> CORS whitelist
see https://dhis-pbf.moh.gov.et/dhis-web-settings/index.html#/access

# sample data for non regression

## not working (renamed ?)
[Acompte Facture trimestrielle PDSS](http://localhost:3000/#/reports/2019Q1/ycfAd7dPlp4/pdss-quarterly-advance)
[Facture trimestrielle Definitive PDSS](http://localhost:3000/#/reports/2018Q4/ycfAd7dPlp4/pdss-quarterly-deposit)
[Acompte Facture trimestrielle PVSBG](http://localhost:3000/index.html#/reports/2018Q4/jv39GZIfWuI/pvsbg-quarterly-advance)

[Facture trimestrielle Definitive PVSBG](http://localhost:3000/#/reports/2018Q2/jv39GZIfWuI/pvsbg-quarterly-deposit)

## ok


http://localhost:3000/#/reports/testData



# verify tests

```
yarn test
```

# deploy from master branch
this is done automatically via https://bitbucket.org/bluesquare_org/report-pdss-rdc-app/addon/pipelines/home#!/results/page/1

in case of trouble you can do it (becareful to be on the master branch) !

```
./ship.sh 'lepassword'
```