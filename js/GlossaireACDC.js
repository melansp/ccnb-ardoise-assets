/**
 * Glossaire Interactif ACDC - CCNB
 * Script à intégrer dans les pages Ardoise.
 * Utilisation : Placer <script src="chemin/vers/glossaire.js"></script> juste avant la fermeture </body>
 */

// 1. La base de données du glossaire (Remplace le fichier .json)
const donneesGlossaire = {
    "alignement pédagogique": "Cohérence absolue entre les objectifs d'apprentissage visés, la nature des activités et les critères d'évaluation.",
    "taxonomie": "Outil (ex: Bloom, Krathwohl) classifiant la complexité cognitive ou affective des apprentissages attendus.",
    "intégrité académique": "Engagement collectif à produire un travail intellectuel authentique, honnête et respectueux de la propriété intellectuelle.",
    "sécurité psychologique": "Climat de travail sain où l'étudiant se sent en confiance pour s'exprimer ou faire des erreurs sans crainte d'être jugé.",
    "triangulation": "Stratégie d'évaluation combinant trois sources : le produit (livrable), le processus (interactions) et le propos (réflexion).",
    "attitudes professionnelles": "Dispositions intérieures durables (le comment, le savoir-être) orientant les comportements, comme la rigueur ou la vigilance.",
    "compétences sociales": "Savoir-agir complexe et observable (le quoi), comme la collaboration ou la communication.",
    "passager clandestin": "Membre d'une équipe qui se désengage du travail tout en profitant de la note collective du groupe.",
    "hypervigilance": "Posture d'évaluation exacerbée par le stress, où l'enseignant cherche activement à débusquer les fautes ou le plagiat (biais de détection).",
    "grille critériée": "Outil structuré présentant les critères et les niveaux de performance pour assurer une évaluation cohérente et fidèle."
};

// 2. La logique d'injection et de modification du DOM
function initialiserGlossaire() {
    // Cibler uniquement notre conteneur pour ne pas polluer l'interface d'Ardoise
    const conteneur = document.querySelector('.ccnb-contenu');
    if (!conteneur) return;

    // Injecter les styles pour les infobulles (tooltips)
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
        .ccnb-mot-glossaire:hover {
            color: #27BDBE;
        }
        /* Style de la boîte d'infobulle */
        .ccnb-mot-glossaire::after {
            content: attr(data-definition);
            position: absolute;
            bottom: 120%;
            left: 50%;
            transform: translateX(-50%);
            background-color: #191546;
            color: #ffffff;
            padding: 0.75rem;
            border-radius: 6px;
            font-size: 0.85rem;
            font-family: Arial, sans-serif;
            font-weight: normal;
            line-height: 1.4;
            white-space: normal;
            width: max-content;
            max-width: 250px;
            z-index: 1000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.15);
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s, visibility 0.2s, bottom 0.2s;
            pointer-events: none;
        }
        /* Petite flèche sous l'infobulle */
        .ccnb-mot-glossaire::before {
            content: '';
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-width: 6px;
            border-style: solid;
            border-color: #191546 transparent transparent transparent;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s, visibility 0.2s, bottom 0.2s;
            pointer-events: none;
            z-index: 1000;
        }
        /* Affichage au survol */
        .ccnb-mot-glossaire:hover::after,
        .ccnb-mot-glossaire:hover::before {
            opacity: 1;
            visibility: visible;
        }
        .ccnb-mot-glossaire:hover::after { bottom: 130%; }
        .ccnb-mot-glossaire:hover::before { bottom: calc(130% - 12px); }
    `;
    document.head.appendChild(styleGlossaire);

    // Mettre en évidence les termes dans le texte
    // On cible uniquement les paragraphes et les éléments de liste pour éviter de briser les titres (h1/h2) ou les liens (a)
    const elementsTexte = conteneur.querySelectorAll('p, li');
    
    // Trier les clés du plus long au plus court pour éviter qu'un mot court ne brise un mot composé
    const termesTries = Object.keys(donneesGlossaire).sort((a, b) => b.length - a.length);

    elementsTexte.forEach(element => {
        // Sécurité : ignorer si l'élément est à l'intérieur d'un lien ou d'un bouton existant
        if (element.closest('a') || element.closest('button')) return;

        let htmlContent = element.innerHTML;
        
        termesTries.forEach(terme => {
            // Expression régulière : recherche le mot entier, insensible à la casse
            // Utilisation d'un lookahead/lookbehind basique pour s'assurer qu'on ne remplace pas à l'intérieur de balises HTML existantes
            const regex = new RegExp(`(?<!<[^>]*)\\b(${terme})\\b(?![^<]*>)`, 'gi');
            
            htmlContent = htmlContent.replace(regex, (match) => {
                return `<span class="ccnb-mot-glossaire" data-definition="${donneesGlossaire[terme]}">${match}</span>`;
            });
        });

        element.innerHTML = htmlContent;
    });
}

// Lancer le script une fois que la page HTML est complètement chargée
document.addEventListener('DOMContentLoaded', initialiserGlossaire);
