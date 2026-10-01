/**
 * Every word on the site lives here. In headlines, *mot* marks the one accented word
 * (green everywhere, red in the hero H1) — see components/Accent.tsx.
 */
export const site = {
  name: "Geotehnika SARL",
  founded: 1992,

  nav: [
    { id: "accueil", label: "Accueil" },
    { id: "expertises", label: "Expertises" },
    { id: "approche", label: "Approche" },
    { id: "realisations", label: "Réalisations" },
    { id: "entreprise", label: "Entreprise" },
    { id: "contact", label: "Contact" },
  ],

  loading: {
    label: "Chargement",
  },

  hero: {
    title: "Nous bâtissons sur ce que les autres ne *voient* pas.",
    subtitle:
      "Fondations spéciales, injection, clouage et génie civil. Depuis 1992 au Maroc.",
    cta: { label: "Parler à un ingénieur", href: "#contact" },
    scrollHint: "Faites défiler",
    filmLabel:
      "Film d'un chantier : une pelle mécanique creuse dans une carrière, puis la caméra s'élève vers le ciel.",
    captions: [
      "Chaque terrain est différent.",
      "Nous étudions, puis nous forons.",
      "Précision millimétrique, sous la surface.",
      "Le résultat : des ouvrages qui durent.",
    ],
  },

  expertises: {
    title: "Quatre métiers, du *sol* à l'ouvrage.",
    lead: "Nous intervenons là où le bâtiment commence : dans le terrain qui le porte.",
    items: [
      {
        title: "Fondations spéciales",
        previewImage: "/expertise/fondations-speciales.webp",
        scope: "Pieux, micropieux, parois moulées.",
        text: "Transmettre les charges d'un ouvrage jusqu'aux couches porteuses, quelle que soit la profondeur.",
      },
      {
        title: "Injection",
        previewImage: "/expertise/injection.webp",
        scope: "Traitement et consolidation des sols, étanchéité.",
        text: "Renforcer un terrain en place, combler les vides et arrêter les venues d'eau.",
      },
      {
        title: "Clouage & soutènement",
        previewImage: "/expertise/clouage-soutenement.webp",
        scope: "Parois clouées, tirants d'ancrage, stabilisation de talus.",
        text: "Tenir les terres pendant les travaux, et longtemps après.",
      },
      {
        title: "Génie civil & forages",
        previewImage: "/expertise/genie-civil-forages.webp",
        scope: "Sondages, forages, ouvrages d'art.",
        text: "Reconnaître le terrain, puis construire ce qui s'y appuie.",
      },
    ],
  },

  approche: {
    title: "De l'appel d'offres à la *livraison*.",
    lead: "Geotehnika assiste et conseille le client dès l'appel d'offres, et propose la solution la mieux adaptée en qualité, coût et délais selon la nature du terrain.",
    steps: [
      {
        title: "Appel d'offres",
        text: "Nous lisons le dossier avec vous et repérons les risques du terrain avant de chiffrer.",
      },
      {
        title: "Étude",
        text: "Reconnaissance, calculs, variantes : la solution la mieux adaptée en qualité, coût et délais.",
      },
      {
        title: "Exécution",
        text: "Nos équipes et notre matériel sur le chantier, avec un suivi HSE quotidien.",
      },
      {
        title: "Livraison",
        text: "Contrôles, essais et dossier de récolement : un ouvrage conforme, dans les délais.",
      },
    ],
    stats: [
      { value: 30, suffix: "+", label: "ans d'expérience" },
      { value: 200, prefix: "100–", label: "collaborateurs" },
      { text: "Casablanca", label: "Maroc" },
    ],
  },

  realisations: {
    title: "Nos chantiers, en *images*.",
    lead: "Un aperçu de nos interventions, de nos équipes et de notre matériel sur le terrain.",
    // Supplied photos grouped by visible subjects; no unverified city associations.
    items: [
    {
        "type": "Chantiers urbains",
        "photos": [
            {
                "image": "/realisations/chantier-02.webp",
                "thumbnail": "/realisations/chantier-02-thumb.webp",
                "caption": "Engins sur un chantier urbain.",
                "alt": "Une pelle mécanique et un camion sur un chantier urbain.",
                "width": 1280,
                "height": 960
            },
            {
                "image": "/realisations/chantier-04.webp",
                "thumbnail": "/realisations/chantier-04-thumb.webp",
                "caption": "Foreuse sur un chantier en ville.",
                "alt": "Une foreuse verticale installée au milieu d’un chantier urbain.",
                "width": 957,
                "height": 1280
            },
            {
                "image": "/realisations/chantier-10.webp",
                "thumbnail": "/realisations/chantier-10-thumb.webp",
                "caption": "Travaux et matériel sur chantier.",
                "alt": "Une pelle mécanique et du matériel au sein d’un chantier urbain.",
                "width": 1280,
                "height": 960
            }
        ]
    },
    {
        "type": "Forage",
        "photos": [
            {
                "image": "/realisations/chantier-05.webp",
                "thumbnail": "/realisations/chantier-05-thumb.webp",
                "caption": "Foreuse en intervention.",
                "alt": "Vue rapprochée d’une foreuse et de son outil de forage.",
                "width": 960,
                "height": 1280
            },
            {
                "image": "/realisations/chantier-12.webp",
                "thumbnail": "/realisations/chantier-12-thumb.webp",
                "caption": "Matériel de forage sur terrain ouvert.",
                "alt": "Une foreuse sur chenilles en intervention sur un terrain ouvert.",
                "width": 1156,
                "height": 868
            }
        ]
    },
    {
        "type": "Terrain ouvert",
        "photos": [
            {
                "image": "/realisations/chantier-08.webp",
                "thumbnail": "/realisations/chantier-08-thumb.webp",
                "caption": "Terrain et cages d’armature.",
                "alt": "Une pelle mécanique et des cages d’armature au pied d’un talus.",
                "width": 1280,
                "height": 960
            },
            {
                "image": "/realisations/chantier-09.webp",
                "thumbnail": "/realisations/chantier-09-thumb.webp",
                "caption": "Intervention au pied d’un talus.",
                "alt": "Une équipe et ses engins travaillent au pied d’un talus.",
                "width": 1280,
                "height": 960
            },
            {
                "image": "/realisations/chantier-11.webp",
                "thumbnail": "/realisations/chantier-11-thumb.webp",
                "caption": "Travaux sur terrain ouvert.",
                "alt": "Des engins de chantier et des intervenants sur un terrain ouvert.",
                "width": 1101,
                "height": 1150
            }
        ]
    },
    {
        "type": "Matériel & transport",
        "photos": [
            {
                "image": "/realisations/chantier-01.webp",
                "thumbnail": "/realisations/chantier-01-thumb.webp",
                "caption": "Parc d’engins de chantier.",
                "alt": "Deux pelles mécaniques stationnées dans un parc de matériel.",
                "width": 1280,
                "height": 960
            },
            {
                "image": "/realisations/chantier-06.webp",
                "thumbnail": "/realisations/chantier-06-thumb.webp",
                "caption": "Foreuse sur un porte-engins.",
                "alt": "Une foreuse chargée sur un porte-engins.",
                "width": 1280,
                "height": 960
            },
            {
                "image": "/realisations/chantier-07.webp",
                "thumbnail": "/realisations/chantier-07-thumb.webp",
                "caption": "Transport du matériel.",
                "alt": "Un engin de forage transporté sur un porte-engins.",
                "width": 1280,
                "height": 960
            }
        ]
    },
    {
        "type": "Équipes & engins",
        "photos": [
            {
                "image": "/realisations/chantier-13.webp",
                "thumbnail": "/realisations/chantier-13-thumb.webp",
                "caption": "Équipe au travail sur chantier.",
                "alt": "Des intervenants en tenue de chantier travaillent autour des engins.",
                "width": 1280,
                "height": 960
            },
            {
                "image": "/realisations/chantier-14.webp",
                "thumbnail": "/realisations/chantier-14-thumb.webp",
                "caption": "Engin de chantier en intervention.",
                "alt": "Vue d’un engin de chantier équipé d’un outil de creusement.",
                "width": 780,
                "height": 1040
            }
        ]
    },
    {
        "type": "Travaux de nuit",
        "photos": [
            {
                "image": "/realisations/chantier-03.webp",
                "thumbnail": "/realisations/chantier-03-thumb.webp",
                "caption": "Intervention de nuit.",
                "alt": "Un engin sur chenilles travaille sur un chantier éclairé de nuit.",
                "width": 1280,
                "height": 960
            }
        ]
    }
],
  },

  entreprise: {
    title: "Trente ans de *terrain*.",
    paragraphs: [
      "Fondée en 1992, Geotehnika SARL est une société marocaine de fondations spéciales. Son siège est à Casablanca, à Sidi Maârouf, et ses équipes interviennent sur des chantiers dans tout le Maroc.",
      "Nous faisons un métier où l'on ne voit pas le résultat : il est enterré sous l'ouvrage qu'il porte. C'est pourquoi nous tenons à trois choses.",
    ],
    commitments: [
      {
        title: "Qualité",
        text: "Des procédures d'exécution écrites, des essais sur chaque ouvrage et une traçabilité complète.",
      },
      {
        title: "HSE",
        text: "La sécurité des équipes et le respect de l'environnement, sur chaque chantier, chaque jour.",
      },
      {
        title: "Respect des délais",
        text: "Un planning tenu, parce qu'un chantier de fondations conditionne tout ce qui vient après.",
      },
    ],
  },

  contact: {
    title: "Parlons de votre *terrain*.",
    lead: "Décrivez-nous votre projet ; un ingénieur vous répond.",
    address: ["N°1029 Bd Al Qods", "Sidi Maârouf", "Casablanca 20270, Maroc"],
    phone: { label: "+212 5 22 58 48 44", href: "tel:+212522584844" },
    email: { label: "geotehnika@geotehnika.ma", href: "mailto:geotehnika@geotehnika.ma" },
    map: {
      lat: 33.5314883,
      lng: -7.6477044,
      placeId: "ChIJhbQSTMIypg0RFj4e857hhCY",
      linkLabel: "Itinéraire",
    },
    form: {
      name: "Nom",
      email: "Email",
      message: "Message",
      messagePlaceholder: "Type d'ouvrage, ville, calendrier envisagé…",
      submit: "Préparer mon e-mail",
      privacy: "Vos coordonnées servent uniquement à vous répondre.",
    },
  },

  footer: {
    legal: { label: "Mentions légales", href: "/mentions-legales" },
    linkedin: {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/geotehnika-sarl",
    },
  },
} as const;
