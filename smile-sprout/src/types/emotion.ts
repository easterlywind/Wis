export type Emotion = {
  readonly id: string;
  readonly emoji: string;
  readonly name: string;
  readonly color: string;
};

export const EMOTIONS = [
  {
    id: "emotion_happy",
    emoji: "😊",
    name: "Vui vẻ",
    color: "hsl(var(--emotion-happy))",
  },
  { id: "emotion_sad", emoji: "😢", name: "Buồn bã", color: "hsl(var(--emotion-sad))" },
  {
    id: "emotion_angry",
    emoji: "😡",
    name: "Giận dữ",
    color: "hsl(var(--emotion-angry))",
  },
  {
    id: "emotion_surprised",
    emoji: "😮",
    name: "Ngạc nhiên",
    color: "hsl(var(--emotion-surprised))",
  },
  {
    id: "emotion_fear",
    emoji: "😨",
    name: "Sợ hãi",
    color: "hsl(var(--emotion-fear))",
  },
  {
    id: "emotion_disgust",
    emoji: "🤢",
    name: "Ghê tởm",
    color: "hsl(var(--emotion-disgust))",
  },
  {
    id: "emotion_calm",
    emoji: "😌",
    name: "Bình tĩnh",
    color: "hsl(var(--emotion-calm))",
  },
  {
    id: "emotion_excited",
    emoji: "🤩",
    name: "Hào hứng",
    color: "hsl(var(--emotion-excited))",
  },
] as const satisfies readonly Emotion[];

const answerTextToEmotionId: Record<string, string> = {
  "Vui vẻ": "emotion_happy",
  "Buồn bã": "emotion_sad",
  "Giận dữ": "emotion_angry",
  "Ngạc nhiên": "emotion_surprised",
  "Sợ hãi": "emotion_fear",
  "Ghê tởm": "emotion_disgust",
  "Bình tĩnh": "emotion_calm",
  "Hào hứng": "emotion_excited",
};

export const getEmotionEmoji = (answerText: string) => {
  const emotionId = answerTextToEmotionId[answerText];
  return EMOTIONS.find((e) => e.id === emotionId)?.emoji ?? "unknow";
};

export const getEmotionColor = (answerText: string) => {
  const emotionId = answerTextToEmotionId[answerText];
  return (
    EMOTIONS.find((e) => e.id === emotionId)?.color ?? "hsl(var(--primary))"
  );
};
