import React, { useState } from 'react';
import Step from '@/components/form/Step';

const steps = [4, 8]

console.log()

const allQuestions = [
    {
        "question": "이름을 적어주세요. 이름/닉네임 모두 가능합니다",
        "type": "ShortAnswer"
    },
    {
        "question": "현장 사진을 업로드해주세요",
        "type": "ImageAnswer"
    },
    {
        "question": "조사를 진행하신 날은 언제인가요",
        "type": "DateAnswer"
    },
    {
        "question": "발견 장소는 어디인가요",
        "type": "ShortAnswer"
    },
    {
        "question": "조사를 진행하신 지역은 어디인가요",
        "type": "ShortAnswer"
    },
    {
        "question": "돌고래를 보기에 좋은 환경이었나요",
        "type": "ShortAnswer"
    }
]


const Form = () => {
    const [step, setStep] = useState<number>(0);
    const startIndex = step == 0 ? 0 : steps[step - 1];
    const questions = allQuestions.slice(startIndex, steps[step]);
    const [answers, setAnswers] = useState<string[]>(Array(allQuestions.length).fill(''));
    // change answers format (maybe dictionary)

    const setDefaultAnswer = (value: string[]) => {
        setAnswers(value);
    }
    console.log(answers);

    const nextStep = (event: MouseEventHandler<HTMLButtonElement>) => {
        event.preventDefault();
        if (step < steps.length - 1) setStep(step + 1);
    };

    const prevStep = (event: MouseEventHandler<HTMLButtonElement>) => {
        event.preventDefault();
        if (step > 0) setStep(step - 1);
    };

    const handleSubmit = (event: FormEventHandler<HTMLFormElement>) => {
        event.preventDefault();
        alert("submit logic needed")
    }

    return (
        <form onSubmit={handleSubmit}>
            <Step
                currentStep={step}
                lastStep={steps.length == step + 1}
                startIndex={startIndex}
                prevStep={prevStep}
                nextStep={nextStep}
                questions={questions}
                answers={answers}
                setDefaultAnswer={setDefaultAnswer}
                handleSubmit={handleSubmit}
            />
        </form>
    )
};

export default Form;