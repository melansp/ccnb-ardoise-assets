/**
 * Glossaire Interactif ACDC - CCNB
 * Hébergé sur GitHub. Gère la détection et l'affichage des définitions.
 */

// 1. Le grand dictionnaire centralisé (Ajoute tous tes termes ici)
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
    "savoir-agir": "Résultat concret, visible et fonctionnel d'une compétence mise en action dans un contexte précis (l'édific
};

function initialiserGlossaire() {
    const conteneur = document.querySelector('.ccnb-contenu');
    if (!conteneur) return;

    // 2. Déterminer quels mots activer pour cette page spécifique
    let motsAActiver = Object.keys(dictionnaireGlobal); // Par défaut: on active tout

    // Si la page HTML a défini une liste personnalisée (window.motsGlossaireActifs)
    if (typeof window.motsGlossaireActifs !== 'undefined' && Array.isArray(window.motsGlossaireActifs)) {
        motsAActiver = window.motsGlossaireActifs.map(mot => mot.toLowerCase());
    }

    // 3. Créer le dictionnaire filtré pour la page
    const donneesGlossaire = {};
    motsAActiver.forEach(mot => {
        if (dictionnaireGlobal[mot]) {
            donneesGlossaire[mot] = dictionnaireGlobal[mot];
        }
    });

    const termesActifs = Object.keys(donneesGlossaire);
    if (termesActifs.length === 0) return; // Sécurité : aucun mot à chercher

    // 4. Préparer l'expression régulière (tri par longueur et gestion des accents français)
    const termesTries = termesActifs.sort((a, b) => b.length - a.length);
    const regexSource = '(^|[^a-zA-ZÀ-ÿœœæç])(' + termesTries.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(s?)(?=[^a-zA-ZÀ-ÿœœæç]|$)';
    const regexTermes = new RegExp(regexSource, 'gi');

    // 5. Parcourir les nœuds de texte
    const walker = document.createTreeWalker(conteneur, NodeFilter.SHOW_TEXT, null, false);
    const noeudsAModifier = [];

    while (walker.nextNode()) {
        const noeud = walker.currentNode;
        const parent = noeud.parentNode;
        
        // Ignorer les balises interactives ou de code
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



// 2. La logique d'injection et de modification du DOM (Optimisée)
function initialiserGlossaire() {
    const conteneur = document.querySelector('.ccnb-contenu');
    if (!conteneur) return;

    // A. Injecter les styles pour les infobulles (tooltips)
    const styleGlossaire = document.createElement('style');
    styleGlossaire.textContent = `
        .ccnb-mot-glossaire {
            border-bottom: 2px dotted #27BDBE;
            color: #191546;
            cursor: help;
            position: relative;
            font-weight: 600;
            transition: color 0.2s;
        }
        .ccnb-mot-glossaire:hover { color: #27BDBE; }
        .ccnb-mot-glossaire::after {
            content: attr(data-definition);
            position: absolute; bottom: 120%; left: 50%; transform: translateX(-50%);
            background-color: #191546; color: #ffffff; padding: 0.75rem; border-radius: 6px;
            font-size: 0.85rem; font-family: Arial, sans-serif; font-weight: normal; line-height: 1.4;
            white-space: normal; width: max-content; max-width: 250px;
            z-index: 1000; box-shadow: 0 4px 6px rgba(0,0,0,0.15);
            opacity: 0; visibility: hidden; transition: opacity 0.2s, visibility 0.2s, bottom 0.2s;
            pointer-events: none; text-align: left;
        }
        .ccnb-mot-glossaire::before {
            content: ''; position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
            border-width: 6px; border-style: solid; border-color: #191546 transparent transparent transparent;
            opacity: 0; visibility: hidden; transition: opacity 0.2s, visibility 0.2s, bottom 0.2s;
            pointer-events: none; z-index: 1000;
        }
        .ccnb-mot-glossaire:hover::after, .ccnb-mot-glossaire:hover::before { opacity: 1; visibility: visible; }
        .ccnb-mot-glossaire:hover::after { bottom: 130%; }
        .ccnb-mot-glossaire:hover::before { bottom: calc(130% - 12px); }
    `;
    document.head.appendChild(styleGlossaire);

    // B. Préparer l'expression régulière
    // Trier par longueur décroissante pour éviter qu'un mot court (ex: "critère") ne brise un mot long (ex: "grille critériée")
    const termesTries = Object.keys(donneesGlossaire).sort((a, b) => b.length - a.length);
    // Créer une regex qui cherche les termes entiers et tolère un 's' optionnel pour le pluriel
    const regexSource = '\\b(' + termesTries.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(s?)\\b';
    const regexTermes = new RegExp(regexSource, 'gi');

    // C. Parcourir uniquement les nœuds de texte (plus sécuritaire que l'innerHTML)
    const walker = document.createTreeWalker(conteneur, NodeFilter.SHOW_TEXT, null, false);
    const noeudsAModifier = [];

    while (walker.nextNode()) {
        const noeud = walker.currentNode;
        const parent = noeud.parentNode;
        
        // Ignorer les textes déjà dans un lien, un bouton ou une balise de code/script
        if (parent.closest('a, button, .ccnb-mot-glossaire, script, style, code')) {
            continue;
        }
        
        // Si le texte contient un terme du glossaire, on l'ajoute à la file d'attente
        if (regexTermes.test(noeud.nodeValue)) {
            noeudsAModifier.push(noeud);
            regexTermes.lastIndex = 0; // Réinitialiser l'index
        }
    }

    // D. Remplacer les textes de manière chirurgicale
    noeudsAModifier.forEach(noeudTexte => {
        const fragment = document.createDocumentFragment();
        const texte = noeudTexte.nodeValue;
        let dernierIndex = 0;
        let match;
        
        regexTermes.lastIndex = 0;

        while ((match = regexTermes.exec(texte)) !== null) {
            // Ajouter le texte qui précède le mot-clé
            if (match.index > dernierIndex) {
                fragment.appendChild(document.createTextNode(texte.substring(dernierIndex, match.index)));
            }

            // Créer le conteneur du glossaire
            const span = document.createElement('span');
            span.className = 'ccnb-mot-glossaire';
            
            // Retrouver la clé du dictionnaire sans le "s" du pluriel (match[1]) et en minuscules
            const cleDictionnaire = match[1].toLowerCase();
            if (donneesGlossaire[cleDictionnaire]) {
                span.setAttribute('data-definition', donneesGlossaire[cleDictionnaire]);
                span.textContent = match[0]; // Conserver la casse et le pluriel original
                fragment.appendChild(span);
            } else {
                // Fallback (ne devrait pas arriver, mais sécuritaire)
                fragment.appendChild(document.createTextNode(match[0]));
            }

            dernierIndex = regexTermes.lastIndex;
        }

        // Ajouter la fin du texte
        if (dernierIndex < texte.length) {
            fragment.appendChild(document.createTextNode(texte.substring(dernierIndex)));
        }

        // Remplacer le nœud original
        noeudTexte.parentNode.replaceChild(fragment, noeudTexte);
    });
}

// Lancer le script au chargement
document.addEventListener('DOMContentLoaded', initialiserGlossaire);
