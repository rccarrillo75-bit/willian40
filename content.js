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
      id: 'sala', from: 'sala-in', to: 'north',
      kicker: 'La sala',
      title: 'Pasa, Willian',
      text: 'Esta es la casa donde nos criamos. Mira alrededor y, cuando quieras, sigue por el pasillo.'
    },
    {
      id: 'papa1', from: 'papa-door', to: 'papa1',
      kicker: 'El cuarto de Papá',
      title: 'Por tus 40 años',
      text: 'Hola hijo Willy, te amo 💓💪 Hijo, hoy en tus 40 años, Dios mediante, te recuerdo como siempre: un gran hijo, muy educado, responsable. Un gran hijo y hermano, un buen tío, un buen esposo, un buen padre. Me siento muy orgulloso de ti, hijo. Mi amor hacia ti es inmenso. Siente un abrazo grande lleno de bendiciones. Te extraño mucho; aquí estaré siempre para ti, apoyándote siempre, estés donde estés, hijo querido. Te amo, hijo Willy.',
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
      id: 'hermano', from: 'bro-door', to: 'bro-out',
      kicker: 'El cuarto de tu hermano',
      title: 'Mi cuarto',
      text: 'Aquí llegará el mensaje de tu hermano, su foto y su canción.',
      pending: true
    },
    {
      id: 'mama', from: 'mama-door', to: 'mama3',
      kicker: 'El cuarto de Mamá',
      title: 'Mamá',
      text: 'Aquí llegará el mensaje de Mamá, su foto y su canción.',
      pending: true
    },
    {
      id: 'cierre', from: 'mama3', to: 'end', last: true,
      kicker: 'Con todo el amor de casa',
      title: 'Tu equipo titular',
      text: 'Willian, sabemos que son muchos años sin poder chocar las copas en la misma mesa ni darte el abrazo que tanto te debemos. Por eso quisimos que tus 40 años quedaran grabados en acero, para que cada vez que salgas de casa con tus llaves, nos lleves contigo. No importa la distancia ni el tiempo: somos tu equipo titular, tu barra incondicional y tu hogar. ¡Felices 40 años, te amamos con toda el alma!',
      sign: '— Mamá, Papá y tu hermano'
    }
  ]
};
