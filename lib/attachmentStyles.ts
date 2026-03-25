import type { AttachmentStyle, QuizQuestion } from './types';

export const ATTACHMENT_INFO: Record<AttachmentStyle, {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  gradient: string;
  emoji: string;
  tagline: string;
  description: string;
  strengths: string[];
  challenges: string[];
  inRelationship: string;
}> = {
  secure: {
    label: 'Secure',
    color: '#16a34a',
    bgColor: '#dcfce7',
    textColor: '#14532d',
    gradient: 'from-green-500 to-emerald-400',
    emoji: '🌿',
    tagline: 'Grounded & Open',
    description:
      'You feel comfortable with closeness and can rely on others without losing yourself. You communicate needs clearly and handle conflict with calm.',
    strengths: ['Clear communicator', 'Emotionally available', 'Trusts easily', 'Comfortable with intimacy'],
    challenges: ['May not understand anxious behaviors', 'Can seem too easygoing'],
    inRelationship:
      'You create a safe, consistent presence. Partners feel seen and supported. You balance independence with togetherness naturally.',
  },
  anxious: {
    label: 'Anxious',
    color: '#d97706',
    bgColor: '#fef3c7',
    textColor: '#78350f',
    gradient: 'from-amber-500 to-yellow-400',
    emoji: '🌊',
    tagline: 'Deeply Feeling',
    description:
      'You love deeply and crave closeness, but can worry about whether your partner truly cares. You notice every shift in energy and feel things intensely.',
    strengths: ['Highly empathetic', 'Devoted partner', 'Emotionally expressive', 'Deeply loving'],
    challenges: ['Fear of abandonment', 'Needs frequent reassurance', 'Can overthink'],
    inRelationship:
      'You bring passion and deep loyalty. With the right partner you blossom into your most loving self when you feel truly safe.',
  },
  avoidant: {
    label: 'Avoidant',
    color: '#2563eb',
    bgColor: '#dbeafe',
    textColor: '#1e3a8a',
    gradient: 'from-blue-600 to-sky-400',
    emoji: '🏔️',
    tagline: 'Independent & Thoughtful',
    description:
      'You value independence and self-reliance. Closeness can feel overwhelming at times, so you need space to process and recharge.',
    strengths: ['Self-sufficient', 'Level-headed', 'Respects boundaries', 'Great listener'],
    challenges: ['Difficulty expressing emotions', 'Pulls away under stress', 'Fears vulnerability'],
    inRelationship:
      'You offer steady, calm energy. Opening up takes time — but when you do, you are a devoted and thoughtful partner.',
  },
  disorganized: {
    label: 'Disorganized',
    color: '#9333ea',
    bgColor: '#f3e8ff',
    textColor: '#581c87',
    gradient: 'from-purple-600 to-violet-400',
    emoji: '🌀',
    tagline: 'Complex & Evolving',
    description:
      'You both crave and fear intimacy, which can feel confusing. Past experiences have made closeness feel unpredictable, but awareness is the first step.',
    strengths: ['Deep self-awareness potential', 'Highly resilient', 'Empathetic to pain', 'Growth-oriented'],
    challenges: ['Inconsistent behavior', 'Push/pull dynamic', 'Trust issues'],
    inRelationship:
      'You have the most to gain from a secure, patient partner. Healing is possible — many people with this style build beautiful relationships.',
  },
};

// Compatibility matrix: [0–100] score
export const COMPATIBILITY_MATRIX: Record<AttachmentStyle, Record<AttachmentStyle, number>> = {
  secure:       { secure: 96, anxious: 88, avoidant: 84, disorganized: 76 },
  anxious:      { secure: 88, anxious: 72, avoidant: 62, disorganized: 58 },
  avoidant:     { secure: 84, anxious: 62, avoidant: 74, disorganized: 56 },
  disorganized: { secure: 76, anxious: 58, avoidant: 56, disorganized: 48 },
};

export function getCompatibilityScore(a: AttachmentStyle, b: AttachmentStyle): number {
  return COMPATIBILITY_MATRIX[a][b];
}

export function getCompatibilityLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Exceptional Match',  color: '#16a34a' };
  if (score >= 80) return { label: 'Great Match',        color: '#22c55e' };
  if (score >= 70) return { label: 'Good Match',         color: '#84cc16' };
  if (score >= 60) return { label: 'Possible Match',     color: '#f59e0b' };
  return              { label: 'Growth Opportunity',   color: '#f97316' };
}

export function getCompatibilityInsight(userStyle: AttachmentStyle, theirStyle: AttachmentStyle): string {
  const insights: Partial<Record<AttachmentStyle, Partial<Record<AttachmentStyle, string>>>> = {
    secure: {
      secure:       'Two secure partners tend to build the most stable, fulfilling relationships. You both know how to communicate and give space.',
      anxious:      'Your calm presence helps soothe their fears. You can offer the consistency they crave without losing yourself.',
      avoidant:     "Your patience with space can unlock their emotional depth. You won't take their distance personally.",
      disorganized: 'Your steadiness can be transformative for them. Your secure base gives them space to heal and grow.',
    },
    anxious: {
      secure:       "Their consistency will ease your worries. You'll feel truly safe to love without holding back.",
      anxious:      'You both feel deeply — mutual understanding is natural, but setting calm communication patterns early is key.',
      avoidant:     "The classic push-pull — powerful chemistry but requires intentional work to bridge your different needs.",
      disorganized: 'Two people navigating emotional complexity. With shared awareness, you can create a deeply understanding bond.',
    },
    avoidant: {
      secure:       'They give you space without abandoning you — exactly what you need to slowly open up.',
      anxious:      "Their warmth can draw you out, but their need for closeness may feel overwhelming at first.",
      avoidant:     "You both understand needing space. The challenge is building bridges toward each other over time.",
      disorganized: 'Both styles can be unpredictable; shared patience and therapy awareness helps enormously.',
    },
    disorganized: {
      secure:       'Their steady, non-reactive love is the most healing environment for you. A truly transformative match.',
      anxious:      'You both crave connection and fear it — understanding each other\'s triggers builds deep compassion.',
      avoidant:     'Both styles need space but for different reasons. Creating safety takes intentional, patient work.',
      disorganized: 'The deepest understanding of each other\'s complexity — with commitment to growth, this can be powerful.',
    },
  };
  return (insights[userStyle]?.[theirStyle]) ??
    'Every connection is unique. Understanding each other\'s attachment needs is the foundation of a great relationship.';
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Anxious items
  { id: 1,  text: 'I worry that my partner will stop caring about me.',             category: 'anxious'      },
  { id: 2,  text: 'I need a lot of reassurance in romantic relationships.',          category: 'anxious'      },
  { id: 3,  text: 'I get anxious when a partner doesn\'t reply quickly.',            category: 'anxious'      },
  { id: 4,  text: 'I\'m afraid of being abandoned by people I love.',               category: 'anxious'      },
  { id: 5,  text: 'I often wonder if my partner really loves me.',                   category: 'anxious'      },
  // Avoidant items
  { id: 6,  text: 'I prefer not to share my feelings with romantic partners.',       category: 'avoidant'     },
  { id: 7,  text: 'I feel uncomfortable when partners want to get very close.',      category: 'avoidant'     },
  { id: 8,  text: 'I rely on myself rather than depending on a partner.',            category: 'avoidant'     },
  { id: 9,  text: 'I need a lot of personal space in relationships.',                category: 'avoidant'     },
  { id: 10, text: 'I pull away when relationships start to feel too intense.',       category: 'avoidant'     },
  // Secure items
  { id: 11, text: 'I find it easy to get emotionally close to others.',              category: 'secure'       },
  { id: 12, text: 'I\'m comfortable depending on romantic partners.',                category: 'secure'       },
  { id: 13, text: 'I don\'t worry much about being abandoned.',                      category: 'secure'       },
  { id: 14, text: 'I can share my thoughts and feelings freely with a partner.',     category: 'secure'       },
  { id: 15, text: 'I trust that my partners genuinely care about me.',               category: 'secure'       },
  // Disorganized items
  { id: 16, text: 'I sometimes push people away and then desperately want them back.', category: 'disorganized' },
  { id: 17, text: 'Closeness both comforts and frightens me.',                        category: 'disorganized' },
  { id: 18, text: 'I have conflicting feelings about intimacy in relationships.',      category: 'disorganized' },
  { id: 19, text: 'Past experiences make it hard for me to fully trust a partner.',   category: 'disorganized' },
  { id: 20, text: 'I sometimes feel overwhelmed by both wanting and fearing connection.', category: 'disorganized' },
];

export function calculateAttachmentStyle(answers: number[]): {
  style: AttachmentStyle;
  scores: Record<AttachmentStyle, number>;
} {
  const raw: Record<AttachmentStyle, number[]> = {
    anxious: [],
    avoidant: [],
    secure: [],
    disorganized: [],
  };

  QUIZ_QUESTIONS.forEach((q, i) => {
    if (answers[i] !== undefined) {
      raw[q.category].push(answers[i]);
    }
  });

  const avg = (arr: number[]) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const scores: Record<AttachmentStyle, number> = {
    anxious:      Math.round(avg(raw.anxious) * 20),
    avoidant:     Math.round(avg(raw.avoidant) * 20),
    secure:       Math.round(avg(raw.secure) * 20),
    disorganized: Math.round(avg(raw.disorganized) * 20),
  };

  const style = (Object.entries(scores) as [AttachmentStyle, number][]).reduce(
    (best, [k, v]) => (v > best[1] ? [k, v] : best),
    ['secure', 0] as [AttachmentStyle, number]
  )[0];

  return { style, scores };
}
