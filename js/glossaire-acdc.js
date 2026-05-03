/**
 * Glossaire Interactif ACDC - CCNB
 * Hébergé sur GitHub. Gère la détection et l'affichage des définitions.
 */

// 1. Le grand dictionnaire centralisé
const dictionnaireGlobal = {
    "alignement pédagogique": "Cohérence absolue entre les objectifs d'apprentissage visés, la nature des activités et les critères d'évaluation.",
    "taxonomie": "Outil (ex: Bloom, Krathwohl) classifiant la complexité cognitive ou affective des apprentissages attendus.",
    "intégrité académique": "Engagement collectif à produire un travail intellectuel authentique, honnête et respectueux de la propriété intellectuelle.",
    "sécurité psychologique": "Climat de travail sain où l'étudiant se sent en confiance pour s'exprimer ou faire des erreurs sans crainte d'être jugé.",
    "triangulation": "Stratégie d'évaluation combinant trois sources : le produit (livrable), le processus (interactions) et le propos (réflexion).",
    "attitudes professionnelles": "Dispositions intérieures durables (le comment, le savoir-être) orientant les comportements (ex: rigueur, vigilance).",
    "compétences sociales": "Savoir-agir complexe et observable (le quoi), comme la collaboration ou la communication.",
    "passager clandestin": "Membre d'une équipe qui se désengage du travail tout en profitant de la note collective du groupe.",
    "hypervigilance": "Posture d'évaluation exacerbée par le stress, où l'enseignant cherche activement à débusquer les fautes ou le plagiat.",
    "grille critériée": "Outil structuré présentant les critères et les niveaux de performance pour assurer une évaluation cohérente.",
    "collaboration": "Travailler ensemble vers un but commun avec une intégration intensive et croisée des idées (synergie).",
    "coopération": "Diviser le travail en parties indépendantes où chacun fait sa part sans réelle intégration (juxtaposition).",
    "savoir-être": "Ensemble d'attitudes, de valeurs et de croyances qui orientent les comportements professionnels (les fondations).",
    "savoir-agir": "Résultat concret, visible et fonctionnel d'une compétence mise en action dans un contexte précis (l'édifice)."
};

function initialiserGlossaire() {
    const conteneur = document.querySelector('.ccnb-contenu');
    if (!conteneur) return;

    const donneesGlossaire = {};

    // 2. Étape A : Charger les mots du dictionnaire global (Tous, ou juste ceux filtrés)
    if (typeof window.motsGlossaireActifs !== 'undefined' && Array.isArray(window.motsGlossaireActifs)) {
        window.motsGlossaireActifs.forEach(mot => {
            const cle = mot.toLowerCase();
            if (dictionnaireGlobal[cle]) {
                donneesGlossaire[cle] = dictionnaireGlobal[cle];
            }
        });
    } else {
        Object.assign(donneesGlossaire, dictionnaireGlobal);
    }

    // 3. Étape B : Ajouter/Écraser avec les définitions spécifiques à la page (Locales)
    if (typeof window.definitionsLocales !== 'undefined' && typeof window.definitionsLocales === 'object') {
        for (const [mot, definition] of Object.entries(window.definitionsLocales)) {
            donneesGlossaire[mot.toLowerCase()] = definition;
        }
    }

    const termesActifs = Object.keys(donneesGlossaire);
    if (termesActifs.length === 0) return; 

    // 4. Préparer l'expression régulière
    const termesTries = termesActifs.sort((a, b) => b.length - a.length);
    const regexSource = '(^|[^a-zA-ZÀ-ÿœœæç])(' + termesTries.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(s?)(?=[^a-zA-ZÀ-ÿœœæç]|$)';
    const regexTermes = new RegExp(regexSource, 'gi');

    // 5. Parcourir les nœuds de texte
    const walker = document.createTreeWalker(conteneur, NodeFilter.SHOW_TEXT, null, false);
    const noeudsAModifier = [];

    while (walker.nextNode()) {
        const noeud = walker.currentNode;
        const parent = noeud.parentNode;
        
        if (parent.closest('a, button, .ccnb-mot-glossaire, script, style, code, .slider-container')) continue;
        
        if (regexTermes.test(noeud.nodeValue)) {
            noeudsAModifier.push(noeud);
            regexTermes.lastIndex = 0; 
        }
    }

    // 6. Remplacer et injecter les infobulles
    noeudsAModifier.forEach(noeudTexte => {
        const fragment = document.createDocumentFragment();
        const texte = noeudTexte.nodeValue;
        let dernierIndex = 0;
        let match;
        
        regexTermes.lastIndex = 0;

        while ((match = regexTermes.exec(texte)) !== null) {
            const charPrecedent = match[1];
            const terme = match[2];
            const indexTerme = match.index + charPrecedent.length;

            if (indexTerme > dernierIndex) {
                fragment.appendChild(document.createTextNode(texte.substring(dernierIndex, indexTerme)));
            }

            const span = document.createElement('span');
            span.className = 'ccnb-mot-glossaire';
            const cleDictionnaire = terme.toLowerCase();
            
            if (donneesGlossaire[cleDictionnaire]) {
                span.setAttribute('data-definition', donneesGlossaire[cleDictionnaire]);
                span.textContent = terme + match[3]; 
                fragment.appendChild(span);
            } else {
                fragment.appendChild(document.createTextNode(terme + match[3]));
            }

            dernierIndex = indexTerme + terme.length + match[3].length;
        }

        if (dernierIndex < texte.length) {
            fragment.appendChild(document.createTextNode(texte.substring(dernierIndex)));
        }

        noeudTexte.parentNode.replaceChild(fragment, noeudTexte);
    });
}

// Lancement automatique
document.addEventListener('DOMContentLoaded', initialiserGlossaire);
