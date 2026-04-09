import type { Metadata } from "next";
import { PracticeQuizLab } from "./practice-quiz-lab";

export const metadata: Metadata = {
  title: "Quiz | ML Second Half Study Lab",
  description:
    "Practice exam generator with multiple-choice and fill-in-the-blank questions based on the second-half machine learning modules.",
};

export default function QuizPage() {
  return <PracticeQuizLab />;
}
