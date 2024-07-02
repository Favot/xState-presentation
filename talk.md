# Présentation xState

## Comment j'ai découvert cette bibliothèque ?

Lors d'une mission pour la maison d'édition de livres numériques [MOBiDYS](https://www.mobidys.com/), j'ai travaillé sur des EPUB utilisés sur des plateformes mobiles. Cela m'a obligé à maintenir du code pour Internet Explorer 11, ce qui était un défi supplémentaire.

Comme vous pouvez le constater sur la diapositive, le projet comprenait un certain nombre de fonctionnalités, allant de la gestion des polices et de la mise en valeur des syllabes à la gestion de l'audio, à l'aide à la lecture, à la mise en valeur des phrases, au mode sombre, etc.

La première approche que j'ai eue pour gérer les états de l'application était de créer un système de souscriptions, un pattern très répandu que je pensais approprié pour ce genre de fonctionnalités. Cependant, avec le nombre croissant de fonctionnalités à chaque itération, la gestion des états devenait de plus en plus complexe et difficile à maintenir.

J'ai donc recherché une solution qui me permettrait de gérer les états de l'application de manière plus efficace et maintenable. C'est à ce moment-là que j'ai découvert xState pour la gestion des états de l'application.

## Qu’est-ce que xState ?

xState est une bibliothèque permettant de créer et d'exécuter des machines à états finis et des statecharts. Ces machines peuvent être considérées comme des acteurs qui réagissent à des événements et modifient leur état interne.

Inspirée du modèle de programmation par acteurs, xState fonctionne sur tous les environnements JavaScript possibles, aussi bien côté client que côté serveur. Cela permet de l'utiliser pour des applications frontend, backend, ou même pour créer des CLI.

## Qu’est-ce qu’une machine à états finis ?

Laissez-moi vous présenter Woufi, qui sera notre star de cette première partie de présentation.

Comme vous pouvez le voir, Woufi est un chien qui possède des états et des actions.

Il ne peut être que dans un état à la fois. Il peut passer d'un état à un autre en fonction des actions qui lui sont envoyées.

Liste des états de Woufi :

- waiting
- on a walk
- walk complete

Liste des actions de Woufi :

- leave home
- return home

Comme vous pouvez le constater, une seule action peut être effectuée à la fois et cette action n'est possible que si Woufi est dans un état qui le permet. Les états ne peuvent transitionner que dans un sens prédéfini. Il y a une notion de directionnalité très marquée, contrairement à d'autres modèles de gestion d'état.

Nous pouvons faire le parallèle avec une `Promise` en JavaScript, qui peut être dans un des états suivants :

- pending
- fulfilled
- rejected

Et ce sont les événements envoyés à la promise qui permettent de changer d'état.

## Ajoutons de la complexité

Un état peut lui-même avoir des sous-états. Par exemple, l'état `on a walk` de Woufi peut avoir les sous-états suivants :

- activity
- tail

Comme vous pouvez le constater, il est possible de gérer des états en parallèle de manière totalement indépendante et avec une grande simplicité.

Nous pouvons encore faire un parallèle avec JavaScript. Par exemple, une `Promise` peut avoir des sous-`Promise` qui sont exécutées en parallèle, permettant une gestion spécifique des erreurs si nécessaire.
