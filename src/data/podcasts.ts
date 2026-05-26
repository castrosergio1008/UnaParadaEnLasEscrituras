export interface Episode {
  id: string
  title: string
  description: string
  spotifyId: string
  duration: string
  date: string
}

export interface Series {
  id: string
  title: string
  description: string
  episodes: Episode[]
}

export const showId = "3NlOQmbSAy21EpKirDk8o0"

export const seriesList: Series[] = [
  {
    id: "evangelio-y-gracia",
    title: "Evangelio y Gracia",
    description: "Comprendiendo la profundidad del evangelio, la gracia de Dios y nuestra respuesta a su amor inmerecido.",
    episodes: [
      {
        id: "lo-que-intentas-ganar",
        title: "Lo que intentas ganar ya fue pagado",
        description: "El legalismo meritocrático es el intento del hombre de ganarse el favor de Dios mediante el cumplimiento de normas y el esfuerzo propio, ignorando tanto la profundidad de su depravación como la suficiencia absoluta de la gracia.",
        spotifyId: "4xq1ULoENKuVIXK6y9E6E1",
        duration: "9 min",
        date: "2026-05-13"
      },
      {
        id: "evangelismo-fiel",
        title: "El evangelismo fiel requiere conversión",
        description: "El evangelismo bíblico no termina cuando la persona cree, sino cuando la persona está convertida.",
        spotifyId: "",
        duration: "12 min",
        date: "2026-05-12"
      },
      {
        id: "quien-es-y-que-hizo",
        title: "Quién es y qué hizo",
        description: "El evangelismo bíblico no puede presentar un Cristo incompleto. El creyente que aprende a explicar con claridad quién es Cristo y qué hizo en la cruz está entregando el corazón del evangelio.",
        spotifyId: "6Tt3vPmguRq2bmnNQYUO0z",
        duration: "10 min",
        date: "2026-05-21"
      },
      {
        id: "arrepentimiento-y-fe",
        title: "Arrepentimiento y fe",
        description: "El evangelismo bíblico no termina con una invitación sino con una invitación clara a responder. El creyente que aprende a presentar la sentencia que pesa sobre el pecador y la invitación a la fe está completando el ciclo del evangelismo fiel: del diagnóstico al remedio, de la sentencia a la gracia, del conocimiento a la decisión.",
        spotifyId: "4nHgNcaIysn47Kv34FyF6f",
        duration: "11 min",
        date: "2026-05-22"
      },
      {
        id: "creencias-que-salvan",
        title: "Creencias que salvan vs. creencias que condenan",
        description: "No toda creencia en Dios salva. El evangelio presenta verdades concretas que deben ser creídas para ser salvo.",
        spotifyId: "",
        duration: "10 min",
        date: "2026-05-11"
      }
    ]
  },
  {
    id: "vida-cristiana",
    title: "Vida Cristiana",
    description: "Principios bíblicos para el matrimonio, la familia y nuestro caminar diario con Cristo.",
    episodes: [
      {
        id: "dios-disenador-matrimonio",
        title: "Dios es el diseñador del matrimonio",
        description: "El matrimonio no es una invención cultural ni una institución humana modificable según las preferencias de cada época. Es el diseño original de Dios establecido antes de que el pecado entrara al mundo.",
        spotifyId: "",
        duration: "11 min",
        date: "2026-05-26"
      },
      {
        id: "no-eres-inferior",
        title: "No eres inferior, eres indispensable",
        description: "La complementariedad en el matrimonio no es una jerarquía de valor sino una distribución de funciones. El hombre y la mujer son iguales en dignidad pero diferentes en diseño, y esa diferencia no divide sino que completa.",
        spotifyId: "0sNPGwWfDJnZfmYxxhalKY",
        duration: "10 min",
        date: "2026-05-26"
      },
      {
        id: "fundamento-al-nuevo-creyente",
        title: "Fundamenta al nuevo creyente en las promesas divinas",
        description: "El creyente que aprende a basar su seguridad en las promesas inmutables de Dios sobre su salvación está completando el ciclo del evangelismo fiel.",
        spotifyId: "19twLFIhag934m2v3IrGaP",
        duration: "12 min",
        date: "2026-05-24"
      },
      {
        id: "habla-de-juicio-con-amor",
        title: "Háblame de juicio con amor",
        description: "El evangelismo fiel no oculta la doctrina del juicio ni suaviza las consecuencias eternas del pecado. El creyente que aprende a presentar la sentencia que pesa sobre el pecador y la invitación a la fe está completando el ciclo del evangelismo fiel.",
        spotifyId: "2SyUaM6W9Y8of1ayJSxlVE",
        duration: "10 min",
        date: "2026-05-20"
      },
      {
        id: "la-confianza-en-las-obras",
        title: "La confianza en las obras",
        description: "La confianza en las obras propias es el obstáculo más universal y más tenaz que el evangelismo fiel encuentra.",
        spotifyId: "2xcLXrbhm30kOikGeuCYGq",
        duration: "11 min",
        date: "2026-05-22"
      }
    ]
  },
  {
    id: "teologia-y-doctrina",
    title: "Teología y Doctrina",
    description: "Estudios profundos sobre la naturaleza de Dios, el pecado, la salvación y las doctrinas fundamentales de la fe cristiana.",
    episodes: [
      {
        id: "dios-disenador-matrimonio",
        title: "Dios es el diseñador del matrimonio",
        description: "El matrimonio no es una invención cultural ni una institución humana modificable según las preferencias de cada época.",
        spotifyId: "02IOqmaJNdTTxDaWnIDbKk",
        duration: "9 min",
        date: "2026-05-25"
      },
      {
        id: "quien-es-dios",
        title: "Quién es Dios y qué es el pecado",
        description: "El evangelismo bíblico nunca comienza con el hombre sino con Dios. El creyente que aprende a presentar la santidad de Dios y la realidad del pecado está colocando el fundamento sin el cual ninguna otra verdad del evangelio tiene sentido.",
        spotifyId: "4qZQy0YRBYMKaUiMfh6KAn",
        duration: "10 min",
        date: "2026-05-19"
      },
      {
        id: "error-buscar-a-dios",
        title: "El error de buscar a Dios solo por lo que da",
        description: "Pensar que Dios está solo para suplir nuestras necesidades, reduce a Dios a un proveedor de beneficios temporales y convierte la fe en un contrato comercial donde el hombre busca a Dios no por quién Él es sino por lo que puede obtener de Él.",
        spotifyId: "45UuMUweqKIdxqdyyAALX8",
        duration: "12 min",
        date: "2026-05-15"
      },
      {
        id: "todos-los-caminos",
        title: "Todos los caminos no llevan a Dios",
        description: "El ecumenismo sincretista que afirma que todos los caminos llevan a Dios no es una postura de amplitud espiritual sino una negación directa de la revelación bíblica, de la exclusividad de Cristo como único mediador y de la suficiencia absoluta del evangelio como el único mensaje que salva.",
        spotifyId: "5IVNNDWojGLLvn6OtQfJVV",
        duration: "11 min",
        date: "2026-05-16"
      },
      {
        id: "saber-mucho-de-dios",
        title: "Saber mucho de Dios sin conocer a Dios",
        description: "El intelectualismo árido es el error de acercarse a Dios únicamente como objeto de análisis académico, acumulando conocimiento teológico sin permitir que ese conocimiento transforme el carácter, produzca amor genuino ni se traduzca en obediencia real.",
        spotifyId: "6ByksiGLtwkpganWHa5IgR",
        duration: "11 min",
        date: "2026-05-14"
      }
    ]
  },
  {
    id: "matrimonio-y-familia",
    title: "Matrimonio y Familia",
    description: "La familia como diseño divino: principios bíblicos para el matrimonio, la crianza de los hijos y las relaciones familiares.",
    episodes: [
      {
        id: "diseno-original",
        title: "El diseño original del matrimonio",
        description: "Dios estableció el matrimonio con un propósito claro. Comprender ese diseño original nos ayuda a vivir conforme a su voluntad.",
        spotifyId: "",
        duration: "10 min",
        date: "2026-05-25"
      },
      {
        id: "la-gloria-del-sabado",
        title: "La gloria del sábado y el día de reposo",
        description: "El sábado es un regalo de Dios. Descansar en Él es un acto de fe y una ordenanza para nuestro bien.",
        spotifyId: "",
        duration: "11 min",
        date: "2026-05-23"
      }
    ]
  }
]

export function getAllEpisodes(): Episode[] {
  return seriesList.flatMap(s => s.episodes)
}
