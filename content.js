/* CONTENIDO DEL RECORRIDO — se edita aquí sin tocar el 3D.
   Cada escena aparece entre dos paradas del recorrido (from → to). */
window.WILLIAN = {
  nav: [
    { label: 'Sala', go: 'sala-in' },
    { label: 'Papá', go: 'papa-door' },
    { label: 'Hermano', go: 'bro-door' },
    { label: 'Mamá', go: 'mama-door' }
  ],
  scenes: [
    {
      id: 'intro', from: 'start', to: 'porch', center: true,
      kicker: '23 de noviembre de 2026',
      title: '¡Felices 40 años, Willian!',
      text: 'Un regalo de Mamá, Papá y tu hermano para llevarte siempre cerca, sin importar los kilómetros.',
      hint: 'Desliza hacia abajo para entrar a casa'
    },
    {
      id: 'sala', from: 'sala-in', to: 'sala-n2',
      kicker: 'La sala',
      title: 'Pasa, Willian',
      text: 'Esta es la casa donde nos criamos. Mira alrededor y, cuando quieras, sigue por el pasillo.'
    },
    {
      id: 'papa1', from: 'papa-door', to: 'papa1',
      kicker: 'El cuarto de Papá',
      title: 'Por tus 40 años',
      text: 'Hola hijo Willy, te amo 💓💪 Hijo, hoy en tus 40 años, Dios mediante, te recuerdo como siempre: un gran hijo, muy educado, responsable. Un gran hijo y hermano, un buen tío, un buen esposo, un buen padre. Me siento muy orgulloso de ti, hijo. Mi amor hacia ti es inmenso. Si alguna vez te fallé o hice cosas malas, te pido perdón; pero sobre todo, he dado lo mejor de mí. Siente un abrazo grande lleno de bendiciones. Te extraño mucho; aquí estaré siempre para ti, apoyándote siempre, estés donde estés, hijo querido. Te amo, hijo Willy.',
      sign: '— Tu papá'
    },
    {
      id: 'papa2', from: 'papa1', to: 'papa2',
      kicker: 'El cuarto de Papá',
      title: 'Aunque estemos lejos',
      text: 'Hijo, ya en tus 40 años 💓🙏 Cómo pasa el tiempo, hijo. Cuenta conmigo a la distancia: siempre te apoyaré, allá o aquí. Le agradezco a Dios por tenerte como hijo y por poder amarte y respetarte siempre. Eres grande e inteligente. Bendiciones, hijo, te amo. ¡Feliz cumpleaños!',
      sign: '— Tu papá'
    },
    {
      id: 'papa3', from: 'papa2', to: 'papa3',
      kicker: 'El cuarto de Papá',
      title: 'Las fotos que eligió',
      text: 'Hijo, elegí estas fotos porque son muy originales y me traen recuerdos muy bonitos de esos tiempos. Te haré barra dondequiera que estés. Te amo. ¡Feliz 40!',
      sign: '— Papá',
      photos: [
        { src: 'fotos/papa1.jpg', cap: 'Foto elegida por Papá' },
        { src: 'fotos/papa2.jpg', cap: 'Foto elegida por Papá' },
        { src: 'fotos/papa3.jpg', cap: 'Foto elegida por Papá' },
        { src: 'fotos/papa4.jpg', cap: 'Foto elegida por Papá' }
      ]
    },
    {
      id: 'papa4', from: 'papa3', to: 'papa-out',
      kicker: 'El cuarto de Papá',
      title: 'Sus canciones',
      text: 'Hijo, estas canciones me traen muchos recuerdos bonitos de cuando andábamos juntos, p’arriba y p’abajo. Cuídate. ¡Feliz cumple, Willy, hijo! Te amo.',
      sign: '— Papá',
      songs: [
        { label: 'Canción 1 de Papá', url: 'https://youtu.be/QOVc-4S2WVc' },
        { label: 'Canción 2 de Papá', url: 'https://youtu.be/9LXL0WqAFJc' },
        { label: 'Canción 3 de Papá', url: 'https://youtu.be/9fqPtmLAU3I' }
      ]
    },
    {
      id: 'hermano1', from: 'bro-door', to: 'bro1',
      kicker: 'El cuarto de tu hermano',
      title: 'Williii, ¡felices 40!',
      text: '¡Williii, felices 40 años, hermano! Al verte llegar al cuarto piso es imposible no mirar atrás y agradecer por todo el camino que hemos recorrido como compañeros de vida. Se me vienen a la mente nuestros años de juventud, cuando armábamos aquellos equipos familiares para ir a competir a los barrios y urbanizaciones —quedando campeones en unas cuantas canchas y disfrutando cada partido al máximo—, o cuando compartíamos la fiebre por el Barça (aunque yo ya me haya retirado de ver fútbol y tú sigas firme con esa pasión).',
      sign: '— Tu hermano'
    },
    {
      id: 'hermano2', from: 'bro1', to: 'bro2',
      kicker: 'El cuarto de tu hermano',
      title: 'Compañeros de vida',
      text: 'Tampoco olvido cuando soñábamos con estudiar deporte en la universidad, ni mucho menos nuestros años trabajando en la construcción; gracias a ese esfuerzo junto a ti pude pagarme la carrera y graduarme. Aunque me llevas 5 años y, con el tiempo, cada uno tomó su propio rumbo —tú con tu energía y tu empuje, y yo buscando un camino más espiritual—, nuestra forma de ser hermanos siempre ha sido la más genuina: velar porque el otro esté bien, sin importar dónde estemos.',
      sign: '— Tu hermano'
    },
    {
      id: 'hermano3', from: 'bro2', to: 'bro3',
      kicker: 'El cuarto de tu hermano',
      title: 'Lo que admiro de ti',
      text: 'Si algo te reconozco y admiro profundamente hoy, a tus 40, es tu capacidad impresionante para crecer. Eres de los que, a donde llega, echa raíces fuertes y levanta su mundo a punta de temple. Me da una alegría inmensa saber que, después de tanto trajinar en Chile, desde aquellos días en que te recibí en casa y luego fuimos vecinos, hoy tienes tu propio hogar allá. Y aquí en Venezuela, mientras vivo en tu casa y te la cuido, veo todos los días el fruto de tu constancia. Te admiro mucho, Willi.',
      sign: '— Tu hermano',
      photos: [
        { src: 'fotos/hermano1.jpg', cap: 'Foto elegida por tu hermano' },
        { src: 'fotos/hermano2.jpg', cap: 'Foto elegida por tu hermano' },
        { src: 'fotos/hermano3.jpg', cap: 'Foto elegida por tu hermano' },
        { src: 'fotos/hermano4.jpg', cap: 'Foto elegida por tu hermano' },
        { src: 'fotos/hermano5.jpg', cap: 'Foto elegida por tu hermano' },
        { src: 'fotos/hermano6.jpg', cap: 'Foto elegida por tu hermano' }
      ]
    },
    {
      id: 'hermano4', from: 'bro3', to: 'bro-out',
      kicker: 'El cuarto de tu hermano',
      title: 'Las llaves',
      text: 'Ya son casi 3 años desde que me regresé a Venezuela y nos dimos el último abrazo, pero los kilómetros nunca han cambiado nuestro código. Aunque hoy no estemos jugando en la misma cancha ni viviendo puerta con puerta como en aquellos tiempos en Chile, quiero que cada vez que agarres estas llaves recuerdes que aquí tienes a tu hermano menor cuidando lo tuyo, celebrando tus triunfos y deseando que sigas creciendo sin techo. Sigue disfrutando de tu casa, de tu familia y de todo lo que te has ganado a pulso. En las buenas y en las malas, sabes que siempre cuentas conmigo.',
      sign: '— Tu hermano'
    },
    {
      id: 'mama1', from: 'mama-door', to: 'mama2',
      kicker: 'El cuarto de Mamá',
      title: 'Llegaron los 40',
      text: 'Y llegaron los 40. Qué felicidad poder haber estado ahí en estos cuarenta años, unos cerca y otros lejos, pero ahí, desde el corazón y en mis oraciones. Feliz y agradecida de poder decir: tengo un hijo de cuarenta años. Aunque no te guste ese número, es una muy buena edad, de conciencia, de cosas claras y pies sobre la tierra. Muy, pero muy feliz cumpleaños, hijo de mi vida, y feliz llegada al cuarto piso. Que sean muchos más, con salud, salud, salud y prosperidad. Un abrazo desde la distancia, te quiero un montón.',
      sign: '— Tu mamá'
    },
    {
      id: 'mama2', from: 'mama2', to: 'mama3',
      kicker: 'El cuarto de Mamá',
      title: 'Con orgullo, desde la distancia',
      text: 'Veo con mucho orgullo, desde la distancia, todo lo que has crecido como persona, cómo has formado una hermosa familia y, a nivel de trabajo, la distancia es solo física: el amor siempre está. Te quiero mucho, un abrazote desde la distancia, y cuando sea físico va a ser otro nivel.',
      sign: '— Tu mamá'
    },
    {
      id: 'mama3', from: 'mama3', to: 'mama4',
      kicker: 'El cuarto de Mamá',
      title: 'Sus fotos',
      text: 'Las fotos, ¡ahí las fotos! Cada foto tiene una historia: un viaje a visitar a la abuela cuando eras bebé, una foto visitando tu casa, una foto de despedida, y así, recuerdos y vivencias diferentes. Son pocas porque ahora es que hay recuerdos que vienen a la mente cada vez que las veo.',
      sign: '— Tu mamá',
      photos: [
        { src: 'fotos/mama1.jpg', cap: 'Foto elegida por Mamá' },
        { src: 'fotos/mama2.jpg', cap: 'Foto elegida por Mamá' },
        { src: 'fotos/mama3.jpg', cap: 'Foto elegida por Mamá' },
        { src: 'fotos/mama4.jpg', cap: 'Foto elegida por Mamá' },
        { src: 'fotos/mama5.jpg', cap: 'Foto elegida por Mamá' },
        { src: 'fotos/mama6.jpg', cap: 'Foto elegida por Mamá' }
      ]
    },
    {
      id: 'mama4', from: 'mama4', to: 'mama5',
      kicker: 'El cuarto de Mamá',
      title: 'Su canción',
      text: 'Elegí esta canción porque representa todas las emociones juntas: la alegría de saber que viene tu hijo, el miedo de saber si todo va a salir bien y, a la vez, la esperanza, y aparte la incertidumbre de pensar «¿lo haré bien o no?». Tantas cosas encierra esta canción. Con amor, desde una madre imperfecta para un hijo perfecto.',
      sign: '— Tu mamá',
      songs: [
        { label: 'Canción de Mamá', url: 'https://youtu.be/jcH4hL0LVn8' }
      ]
    },
    {
      id: 'cierre', from: 'mama5', to: 'end', last: true,
      kicker: 'Con todo el amor de casa',
      title: 'Tu equipo titular',
      text: 'Willian, sabemos que son muchos años sin poder chocar las copas en la misma mesa ni darte el abrazo que tanto te debemos. Por eso quisimos que tus 40 años quedaran grabados en acero, para que cada vez que salgas de casa con tus llaves, nos lleves contigo. No importa la distancia ni el tiempo: somos tu equipo titular, tu barra incondicional y tu hogar. ¡Felices 40 años, te amamos con toda el alma!',
      sign: '— Mamá, Papá y tu hermano'
    }
  ]
};
