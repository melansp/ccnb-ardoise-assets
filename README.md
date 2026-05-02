# Actifs pour création de contenu Ardoise (CCNB)

Ce dépôt héberge les fichiers de styles (CSS) et les scripts interactifs (JavaScript) utilisés pour la création de modules d'apprentissage dans le LMS Ardoise (D2L Brightspace) au Collège Commun[...] 

## 📂 Architecture du dépôt

* `/css/socle_ardoise.css` : Le socle visuel principal (couleurs, typographie, rubriques).

* `/js/` : Scripts réutilisables pour l'interactivité.
  * `glossaire-acdc.js` : Script qui rend une page plus facile à consulter en intégrant un glossaire interactif. Permet l'affichage de définitions au survol des mots clés du glossaire.

* `/icons/` : Icônes de la signature pédagogique du campus virtuel.

## ⚠️ Règle d'intégration (Namespace)

Pour éviter les conflits de style avec le framework Bootstrap (v4.6.1) natif d'Ardoise, **une encapsulation stricte est requise**.

Tout le code HTML généré et lié à ce CSS doit être encapsulé dans une balise principale :

```html
<div class="ccnb-contenu">
    <!-- Le contenu de la page ici -->
</div>
```