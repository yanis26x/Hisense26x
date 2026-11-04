# custom-VIDAA

Launcher React pour contrôler une TV VIDAA et ouvrir ses applications ou entrées HDMI.

## pour push sur vercel
```sh
npx vercel --prod
```
https://hisense26x.vercel.app/

## Lancement

Depuis le dossier `custom-VIDAA`, lancer le serveur TV :

```sh
node server.cjs
```

Dans un deuxième terminal, depuis le même dossier :

```sh
npm run dev
```

Ouvrir l’adresse affichée par Vite. La TV doit être accessible sur le réseau local.

## Vérifications

```sh
npm run build
npm run lint
```
