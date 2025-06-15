
export const programs = [
  {
    time: "05:00 - 06:00",
    title: "Réveil Africa",
    host: "Aminata Diallo",
    description: "Le meilleur réveil musical pour bien commencer la journée avec les sons d'Afrique",
  },
  {
    time: "06:00 - 09:00",
    title: "Morning Africa",
    host: "Kofi Mensah", 
    description: "Informations, musique et actualités pour débuter la matinée en beauté",
  },
  {
    time: "09:00 - 12:00",
    title: "Africa Connection",
    host: "Marie Faye",
    description: "Connectez-vous à l'Afrique avec des émissions interactives et de la belle musique",
  },
  {
    time: "12:00 - 14:00",
    title: "Midi Africa", 
    host: "John Okafor",
    description: "Pause déjeuner avec les meilleurs tubes africains et internationaux",
  },
  {
    time: "14:00 - 17:00",
    title: "Afternoon Africa",
    host: "Samuel Eto'o",
    description: "L'après-midi en compagnie de vos artistes préférés d'Afrique et d'ailleurs",
  },
  {
    time: "17:00 - 19:00",
    title: "Drive Time Africa",
    host: "Youssou N'Dour", 
    description: "Accompagnez votre retour du travail avec les hits du moment",
  },
  {
    time: "19:00 - 22:00",
    title: "Evening Africa",
    host: "Angelique Kidjo",
    description: "Soirée détente avec les plus beaux sons d'Afrique et du monde",
  },
  {
    time: "22:00 - 00:00",
    title: "Night Africa",
    host: "Salif Keita",
    description: "Prolongez votre soirée avec une sélection musicale raffinée",
  },
  {
    time: "00:00 - 05:00",
    title: "Nuit Africa",
    host: "Automatic Playlist",
    description: "Musique douce et relaxante pour accompagner vos nuits",
  },
];

export interface Program {
  time: string;
  title: string;
  host: string;
  description: string;
}
