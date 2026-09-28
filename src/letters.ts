import { ApologyConfig } from './types';

export const REASON_LABELS = {
  misunderstanding: 'El brillo inolvidable de sus ojos y su mirada tierna 💖',
  distance: 'La dulzura infinita de su sonrisa que desarma mi alma ✨',
  harsh_words: 'La nobleza de su corazón puro y su comprensión 🌸',
  forgotten_event: 'La mágica conexión y complicidad de nuestro amor 💍',
  general: 'Su forma tan perfecta de hacerme suspirar y enamorarme cada día más 💞',
};

export function generateApologyLetter(config: ApologyConfig): string {
  const { friendName, cherishedMemory, reasonCategory, customReason, tone, relationshipDuration } = config;
  const name = friendName.trim() || 'Mari';
  const durationText = relationshipDuration ? ` durante este tiempo de amor compartido (${relationshipDuration})` : ' desde que iluminaste mi vida';
  
  let attractionClause = '';
  if (customReason && customReason.trim().length > 0) {
    attractionClause = customReason.trim();
  } else {
    switch (reasonCategory) {
      case 'misunderstanding':
        attractionClause = 'la luz tan infinita y cálida que irradias; basta una sola mirada de tus preciosos ojos para disipar cualquier tormenta y llenarme el pecho de una ternura desbordante';
        break;
      case 'distance':
        attractionClause = 'la dulzura infinita de tu risa y esa sonrisa tuya que parece hecha de pétalos y estrellas, capaz de desarmarme entero y recordarme por qué te amo con locura';
        break;
      case 'harsh_words':
        attractionClause = 'la inmensidad y pureza de tu corazón, que siempre me abraza sin juzgar y me hace sentir el ser humano más afortunado y amado de este mundo';
        break;
      case 'forgotten_event':
        attractionClause = 'nuestra complicidad inquebrantable, esa magia que surge cada vez que nuestras manos se tocan y el universo entero parece conspirar a favor de nuestro amor';
        break;
      default:
        attractionClause = 'la perfección absoluta de tu ser, esa belleza radiante que tienes tanto por fuera como en lo más hondo de tu alma, haciéndome suspirar de devoción en cada latido';
    }
  }

  const memorySection = cherishedMemory.trim() 
    ? `Al cerrar los ojos y pensar en nosotros, siempre revive en mi alma aquel instante imborrable: "***${cherishedMemory.trim()}***". Recordarlo es sentir de nuevo ese nudo de emoción en el pecho, ese latido acelerado que me confirma que nací para encontrarte y amarte. Ese momento resume tu magia: pura, tierna y eterna.`
    : `Al recordar cada instante que hemos compartido, una ola inmensa de amor y agradecimiento inunda mi pecho. Cada caricia, cada mirada cómplice a medianoche, cada suspiro susurrado al oído y cada promesa han construido el hogar más hermoso que jamás soñé: tu corazón.`;

  if (tone === 'poetic') {
    return `Para mi amada ${name}, dueña de cada uno de mis latidos 💗✨,

Te escribo estas líneas con el corazón al desnudo y el alma desbordada de un amor puro y sincero. No hay en este mundo un tesoro más grande ni una bendición más sagrada que tenerte a mi lado${durationText}. 

Desde que entraste a mi universo, aprendí que el amor verdadero no es una palabra, sino una certeza diaria: la de mirarte y saber que no quiero nada más en esta vida que hacerte inmensamente feliz. Mientras el mundo corre deprisa, tú eres mi remanso de paz, mi reina, la flor más hermosa y delicada que jamás floreció en la faz de la tierra.

Lo que más me enamora y me cautiva de ti es, sin duda, ${attractionClause}. Tienes esa gracia celestial que embelesa todo a su paso y me hace dar gracias al cielo por el privilegio de amarte y ser correspondido.

${memorySection}

Quiero prometerte solemnemente hoy, ante este jardín eterno, que cuidaré de tu corazón como el tesoro más frágil y sagrado. Prometo ser tu abrazo firme en tus días grises, secar cada lágrima si alguna vez asoma, multiplicar cada una de tus risas y recordarte, todas las mañanas y todas las noches, lo infinitamente hermosa y amada que eres.

He preparado especialmente para ti esta flor azul cósmica y este prado botánico que florece al ritmo de suaves acordes románticos. Cada pétalo que se abre simboliza un motivo por el que te amo, y cada corazón que se eleva hacia el firmamento lleva grabado tu nombre: Mari, mi amor eterno.

Gracias por existir, por tu ternura sin medida y por enseñarme lo que significa amar con el alma.

Con devoción infinita, admiración y todo mi amor por siempre,
Tuyo/a en esta vida y en todas las que vengan. 💍💗🌹`;
  }

  if (tone === 'flirty') {
    return `¡Hola, mi hermosa princesa ${name}! 😍💘✨

Te escribo esta cartita porque ya no puedo disimular ni un segundo más lo perdidamente enamorado/a que estoy de ti. Es que, siendo totalmente sincero/a, ¡es físicamente imposible no derretirse con solo mirarte! Eres la mujer más hermosa, fascinante y encantadora de todo este planeta. 

No hay día en que no me descubra sonriendo como un tonto/a a la pantalla al recibir un mensaje tuyo. Y es que lo que más me atrae y me vuelve loco/a de ti es ${attractionClause}. Tienes un poder inexplicable sobre mí: con una sola mirada coqueta y una sonrisita tuya, me tienes a tus pies, listo/a para bajarte la luna entera si me la pides.

${memorySection}

Te prometo que voy a ser la persona que más te consienta en este mundo: llenarte de besitos en la frente, robarte abrazos apretados, prepararte tus antojos y mirarte siempre con esos ojos de enamoramiento total que solo tú me provocas. ¡No te escapas de mí porque este amor es para toda la vida!

Mira con atención la flor que florece en este jardín: cada destello y cada corazoncito flotante late al mismo ritmo que mi pecho cuando te pienso. Eres mi capricho favorito, mi sueño hecho realidad y la chica más preciosa del universo.

Te mando un beso gigante en los labios de esos que dejan sin aliento y mil caricias tiernas.
¡Te amo con locura, mi Mari hermosa! 💋🔥💓`;
  }

  if (tone === 'warm') {
    return `Mi dulce y amada ${name} 🌸💗✨,

Hoy quiero abrirte mi corazón para recordarte lo infinitamente especial y vital que eres para mí. No hay palabras suficientes en ningún idioma para expresar la calidez, la alegría y la paz profunda que traes a mi existencia${durationText}.

Eres esa persona mágica que convierte cualquier día normal en un recuerdo dorado. Admiro tu nobleza, tu dulzura inagotable, la delicadeza con la que tratas a quienes amas y esa bondad que ilumina tus ojitos cada vez que sonríes. Eres un verdadero ángel en la tierra, mi Mari.

Lo que más me cautiva y llena de ternura es ${attractionClause}. Estar contigo es como llegar a casa después de un largo viaje; es sentir que el corazón descansa en un remanso de amor y protección mutua.

${memorySection}

Prometo estar siempre a tu lado, celebrar cada uno de tus sueños, abrazarte fuerte cuando el mundo sea ruidoso y ser tu cómplice incondicional. Te amo no solo por lo perfecta que eres, sino por la persona tan feliz y completa que soy cuando estoy junto a ti.

Esta rosa y estas flores florecen como un homenaje a tu alma pura. Tómate un respiro, escucha la música y siente este abrazo apretado que te envío a través de la distancia.

Gracias por ser mi amor, mi refugio y mi luz constante.
Con todo mi corazón y un amor infinito,
Siempre tuyo/a. 🌷🤍✨`;
  }

  if (tone === 'nostalgic') {
    return `Mi adorada ${name}, mi rayito de luna y amor de mi vida 🌙💖,

Hoy me senté a contemplar el cielo y me invadió una marea de amor y nostalgia hermosa al revivir cada paso que nos ha traído hasta aquí. Qué regalo tan inmenso de la vida ha sido coincidir contigo y ver florecer este sentimiento tan profundo y sagrado${durationText}.

A veces el día a día nos envuelve, pero hoy quiero detenerme a recordarte lo que jamás dejará de ser verdad: eres la mujer de mi vida, el milagro que le dio sentido a mis anhelos y el amor más grande que jamás conoceré. Tu ternura, tu paciencia y ese modo tan tuyo de entenderme con una sola mirada son bendiciones que atesoro en lo más hondo de mi ser.

Me cautiva profundamente ${attractionClause}. Recordar cómo transformas mis días con tu sola presencia me hace suspirar de gratitud una y otra vez.

${memorySection}

Prometo seguir construyendo a tu lado un futuro lleno de amor, respeto y momentos mágicos. Te prometo un amor leal, de esos que maduran como el buen vino y que no se marchitan jamás, como esta rosa azul eterna que hoy te entrego.

Mira cómo giran y bailan las flores ante tus ojos: cada destello lleva un suspiro mío que vuela hacia ti para abrigarte.

Gracias por elegirme, por amarme y por ser el amor de mi vida, mi preciosa Mari.
Con amor eterno y devoción absoluta,
Por siempre y para siempre. 🌌💍💗`;
  }

  // default tone: 'sincere'
  return `Para el amor de mi vida, mi adorada ${name} 💍💗,

Con la mayor sinceridad y con el corazón palpitando de emoción, quiero escribirte estas palabras para declararte una vez más lo inmensamente agradecido y enamorado que estoy de ti. Eres la persona más maravillosa que ha pisado este mundo y el amor más puro y noble que he conocido.

Me cautiva todo de ti: tu fuerza, tu elegancia natural, tu bondad infinita y, muy especialmente, ${attractionClause}. No necesitas hacer nada extraordinario para enamorarme; basta tu simple presencia para llenar de sol y primavera todo mi universo.

${memorySection}

Quiero reiterarte hoy mi compromiso eterno de amarte, respetarte y cuidarte todos los días de mi vida. Seré tu compañero leal, tu apoyo inquebrantable en las dificultades y tu motivo constante para sonreír.

Esta rosa azul y este jardín floreciendo han sido creados con todo el amor de mi alma para ti, mi Mari. Que cada pétalo te recuerde lo valiosa, única e irreemplazable que eres para mí.

Te amo con cada fibra de mi ser, hoy, mañana y por toda la eternidad.

Con amor profundo e incondicional,
Tuyo/a por siempre. 🌹💖✨`;
}

export const APOLOGY_PRESETS = [
  {
    title: "Poética y Apasionada",
    tone: "poetic" as const,
    description: "Versos exquisitos y devoción total que comparan su belleza con las rosas eternas y declaran amor inmortal."
  },
  {
    title: "Romántica y Enamorada",
    tone: "flirty" as const,
    description: "Un tono pícaro, cariñoso y fascinante para derretir a Mari, declarándole cuánto te gusta y te atrae."
  },
  {
    title: "Dulce y Tierna",
    tone: "warm" as const,
    description: "Un abrazo al alma lleno de gratitud, caricias verbales y palabras de amor acogedoras."
  },
  {
    title: "Eterna y Nostálgica",
    tone: "nostalgic" as const,
    description: "Rememorando el milagro de haberse conocido y la promesa de envejecer y amarse siempre."
  },
  {
    title: "Sincera y Devota",
    tone: "sincere" as const,
    description: "Una declaración profunda, madura y honesta con la promesa inquebrantable de amarla sin fin."
  }
];

export const REFLECTION_QUESTIONS = [
  "¿Qué detalle de Mari hace que tu corazón se acelere cada vez que la ves?",
  "Si tuvieras que describir lo que sientes al abrazarla con una sola palabra, ¿cuál sería?",
  "¿Cuál es el recuerdo más dulce y romántico que guardas junto a Mari en tu pecho?",
  "Si pudieras pedir un solo deseo para su futuro juntos, ¿cuál le prometerías hoy?"
];

export const GENERATED_REASON_COMMENTS: Record<string, string> = {
  misunderstanding: "Mari posee una luz inusualmente dulce y celestial; una sola sonrisa suya tiene el poder sagrado de abrigar el alma entera, borrar cualquier preocupación terrenal y recordarte que el amor verdadero es el regalo más grande de la vida. ✨💖",
  distance: "Sus ojos son un remanso de ternura donde el tiempo se detiene. Cuando Mari te mira con amor, el universo entero calla para contemplar el milagro de dos almas que se reconocen y se juran lealtad eterna. 👀💘",
  harsh_words: "En un mundo a menudo agitado y frío, Mari es un refugio cálido de amor incondicional, caricias puras y nobleza sincera. Cuidar su corazón es la misión más hermosa de tu existencia. 🌸🛡️",
  forgotten_event: "La mágica complicidad que comparten está tejida con hilos invisibles de estrellas y latidos al unísono. Es ese amor único donde las palabras sobran y un simple abrazo lo cura todo. 💍💞",
  general: "Mari representa la definición perfecta de la dulzura y la belleza. Cada caricia, cada risa y cada gesto suyo es una obra de arte que inspira amor eterno y devoción infinita. 💌🌹"
};

export const DEEP_INTENSE_PHRASES_POOL = [
  "Mari, eres mi milagro cotidiano, el latido que transforma todo el caos del mundo en una melodía de paz perfecta.",
  "En un planeta de millones de almas, mis ojos y mi corazón solo te buscan a ti, mi dulce Mari.",
  "Tu existencia es una caricia al alma, el recordatorio más dulce de que el amor verdadero sí existe.",
  "Tus ojos tienen la magia de desarmarme entero; mirarte es encontrar el hogar donde siempre soñé vivir.",
  "Si el cielo se quedara sin estrellas, me bastaría la luz radiante de tu sonrisa para guiar mi camino, Mari.",
  "Ninguna rosa en la tierra, por hermosa que sea, podrá jamás igualar la pureza y nobleza de tu corazón.",
  "Cada caricia tuya se queda grabada con fuego dulce en lo más profundo de mi pecho.",
  "Eres ese refugio seguro donde puedo ser yo mismo y sentirme el ser más amado y feliz del universo.",
  "Tu voz es la melodía más dulce que ha escuchado mi corazón; apacigua mis dudas y enciende mi pasión.",
  "Me tienes completamente enamorado, Mari; amarte es el mayor honor y la alegría más grande de mi vida.",
  "Prometo ser el guardián de tus sueños, el abrazo que te proteja de todo viento frío y la sonrisa que te acompañe siempre.",
  "A veces te miro en silencio y el pecho se me llena de gratitud pura por el milagro de tenerte conmigo.",
  "Eres la poesía más hermosa que el destino escribió en mi vida, y prometo leerte con amor cada nuevo día.",
  "No hay distancia, ni tiempo, ni obstáculo capaz de apagar la llama viva y sagrada de lo que siento por ti, Mari.",
  "Tu risa es la cura para cualquier tristeza; verte feliz es mi mayor meta y mi satisfacción más plena.",
  "Me enamora tu ternura, me fascina tu inteligencia y me vuelve loco esa mirada coqueta que solo me regalas a mí.",
  "A tu lado el tiempo vuela y al mismo tiempo se vuelve eterno; cada minuto contigo vale más que mil vidas sin ti.",
  "Si tuviera que elegirte de nuevo entre un millón de vidas y un millón de personas, te elegiría a ti sin dudar un segundo.",
  "Eres mi musa, mi princesa, mi compañera de vida y el amor más grande que jamás podré sentir.",
  "Gracias por enseñarme lo dulce que es el amor sincero y por llenar mis días de caricias, risas y complicidad.",
  "Mari, contigo hasta los días más grises se visten de rosa, sol y primavera.",
  "Prometo amarte no solo en los momentos de dicha, sino abrazarte aún más fuerte en los días difíciles.",
  "Tus abrazos tienen la virtud de reconstruir cualquier pedacito roto de mi alma.",
  "Eres mi primer pensamiento al despertar y el suspiro enamorado que me acompaña antes de dormir.",
  "Qué hermoso es mirarte y sentir que el corazón descansa, sabiendo que encontré a mi alma gemela en ti, Mari."
];
