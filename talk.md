# Présentation xState

## Comment j'ai découvert cette bibliothèque ?

Lors d'une mission pour la maison d'édition de livres numériques [MOBiDYS](https://www.mobidys.com/), j'ai travaillé sur des epub qui étaient utilisés sur des plateformes mobiles (ce qui, au passage, m'a obligé à maintenir du code pour Internet Explorer 11).

Comme vous pouvez le constater sur la slide, le projet contenait un certain nombre de fonctionnalités, allant de la gestion des polices, mise en valeur des syllabes, gestion de l'audio, aide à la lecture, mise en valeur de phrases, mode sombre, etc.

La première approche que j'ai eue pour gérer les états de l'application était de créer un système de subscription, un pattern très répandu que je pensais approprié pour ce genre de fonctionnalités. Cependant, avec le nombre de fonctionnalités qui augmentait à chaque itération, la gestion des états devenait de plus en plus complexe et difficile à maintenir.

J'ai donc recherché une solution qui me permettrait de gérer les états de l'application de manière plus efficace et plus maintenable. C'est à ce moment-là que j'ai découvert xState pour la gestion d'état de l'application.

## Qu’est-ce que xState ?

xState est une bibliothèque pour créer et exécuter des machines à états finis et des statecharts. Ces machines peuvent être vues comme des acteurs qui réagissent à des événements et modifient leur état interne.

Inspirée du modèle de programmation par acteurs, elle fonctionne sur tous les environnements JS possibles, aussi bien côté client que côté serveur. Cela permet de faire du frontend, du backend ou de créer des CLI.

## Qu’est-ce qu’une machine à états finis ?

Laissez-moi vous présenter Woufi, qui sera notre star de cette première partie de présentation.

Comme vous pouvez le voir, Woufi est un chien qui a des états et des actions.

Il ne peut être que dans un état à la fois. Il peut passer d'un état à un autre en fonction des actions qui lui sont envoyées.

Liste des états de Woufi :

- waiting
- on a walk
- walk complete

Liste des actions de Woufi :

- leave home
- return home

Comme vous pouvez le constater, uniquement une seule action peut être effectuée à la fois et cette action n'est possible que si Woufi est dans un état qui le permet.
Les états ne peuvent transitionner que dans un sens prédéfini.
Une notion de directionnalité très marquée contrairement à d'autres modèles de gestion d'état.

Nous pouvons faire le parallèle avec une `Promise` en JS qui peut être dans un des états suivants :

- pending
- fulfilled
- rejected

Et ce sont les événements qui sont envoyés à la promise qui permettent de changer d'état.

## Ajoutons de la complexité

Un état peut lui-même avoir des sous-états. Par exemple, l'état `on a walk` de Woufi peut avoir les sous-états suivants :

- activity
- tail

Comme vous pouvez le constater, il est possible de gérer des états en parallèle totalement indépendants en toute simplicité.

Nous pouvons encore faire un parallèle avec JS, par exemple une `Promise` peut avoir des sous-`Promise` qui sont exécutées en parallèle.
Si besoin d'avoir une gestion spécifique des erreurs.
