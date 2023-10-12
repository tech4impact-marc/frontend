import React from 'react';
import { ShortAnswer, DateAnswer, ImageAnswer, SelectAnswer, CheckboxAnswer, RadioAnswer, LocationAnswer } from './FormAnswer';

interface AnswerTypeProps {
    type: string;
    key: number;
    answer: string;
    setAnswer: (value: string) => void;
    choices: string[];
}

const AnswerType: React.FC<AnswerTypeProps> = ({ type, answer, setAnswer, choices }) => {
    switch (type) {
        case "ShortAnswer":
            return (
                <ShortAnswer
                    shortAnswer={answer}
                    setShortAnswer={setAnswer}
                />
            )
        case "LocationAnswer":
                return (
                    <LocationAnswer
                        shortAnswer={answer}
                        setShortAnswer={setAnswer}
                    />
                )
        case "SelectAnswer":
            return (
                <SelectAnswer
                    answer={answer}
                    setAnswer={setAnswer}
                    choices={choices}
                />
            )
        case "CheckboxAnswer":
            return (
                <CheckboxAnswer
                    answer={answer}
                    setAnswer={setAnswer}
                    choices={choices}
                />
            )
        case "RadioAnswer":
            return (
                <RadioAnswer
                    answer={answer}
                    setAnswer={setAnswer}
                    choices={choices}
                />
            )
        case "DateAnswer":
            return (
                <DateAnswer
                    dateAnswer={answer}
                    setDateAnswer={setAnswer}
                />
            )
        // case "ImageAnswer":
        //     return (
        //         <ImageAnswer
        //             selectedImage={answer}
        //             setSelectedImage={setAnswer}
        //         />
        //     )
        default:
            return (
                <></>
            );
    }
}

interface Question {
    question: string;
    type: string;
    choices: string[];
}

interface StepProps {
    startIndex: number;
    dateIndex: number;
    gpsIndex: number;
    questions: Question[];
    answers: string[];
    setDefaultAnswer: (value: string[]) => void;
}

const Step: React.FC<StepProps> = ({ startIndex, dateIndex, gpsIndex, questions, answers, setDefaultAnswer }) => {

    return (
        <React.Fragment>
            {questions.map((question, index) => (
                <React.Fragment key={startIndex + index}>
                    <h4>{startIndex + index + 1}. {question.question}</h4>
                    {question.type !== "ImageAnswer" ?
                        <AnswerType
                            type={question.type}
                            key={startIndex + index}
                            answer={answers[startIndex + index] != undefined ? answers[startIndex + index] : ''}
                            setAnswer={(value: string) => {
                                const newAnswers = [...answers];
                                newAnswers[startIndex + index] = value;
                                setDefaultAnswer(newAnswers);
                            }}
                            choices={question.choices}
                        />
                        :
                        <ImageAnswer
                            key={startIndex + index}
                            selectedImage={answers[startIndex + index]}
                            setSelectedImage={(value, date, gps) => {
                                const newAnswers = [...answers];
                                newAnswers[startIndex + index] = value;
                                if (date && dateIndex) newAnswers[dateIndex] = date;
                                if (gps && gpsIndex) newAnswers[gpsIndex] = gps;
                                setDefaultAnswer(newAnswers);
                            }}
                        />

                    }

                </React.Fragment>
            ))
            }
        </React.Fragment >
    )
};

export default Step;