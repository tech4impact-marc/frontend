import { DateAnswer, ImageAnswer, LocationAnswer, SelectAnswer } from '@/components/form/FormAnswer';
import Step from '@/components/form/Step';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());
 
const initialAnswer = {
    "id": "",
    "reportTypeLabel": "", // type에 대한 정보를 객체 형태로 더 자세히 줄 지도 고려 중
    "createdDateTime": "",
    "modifiedDateTime": "",
    "observedDateTime": "",
    "location": {
        "latitude": 0,
        "longitude": 0,
        "address": "",
        "addressDetail": ""
    },
    answers:[
    ],
    created_date_time: "",
    modified_date_time: ""
}

const initialLocationQuestion = {
    questionId: 3,
    latitude: 0,
    longitude: 0,
    address: "",
    address_detail: ""
}

const Form = () => {
    const { data, error } = useSWR('/form/questions.json', fetcher);

    const animalChoices = ["남방큰돌고래", "바다거북"];
    const [selectedAnimal, setSelectedAnimal] = useState('');
    const [step, setStep] = useState<number>(0);
    const [answers, setAnswers] = useState<string[]>(Array(10).fill(''));
    const [newAnswers, setNewAnswers] = useState(initialAnswer);
    useEffect(() => {
        if (data && data[selectedAnimal]) setAnswers(Array(data[selectedAnimal].questions.length).fill(''));
        if (data && data[selectedAnimal]) setNewAnswers(data[selectedAnimal].questions.map((question: any, index: number): any => {
            switch (question.questionId) {
                case 3:
                    return initialLocationQuestion;
                default:
                    return {
                        id: index,
                        modified_date_time: "",
                        questionId: question.questionId,
                        value: ""
                    }
            }
        }));
        setStep(0);
        if (data && data[selectedAnimal]) console.log(data[selectedAnimal].questions)
        console.log("newAnswers",newAnswers)
    }, [data, selectedAnimal]);

    if (error) return <div>Error loading data</div>;
    if (!data) return <div>Loading...</div>;


    const steps = data[selectedAnimal]?.steps; //implement useMemo later
    const nextStep: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        if (step < steps.length - 1) setStep(step + 1);
    };
    const prevStep: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        if (step > 0) setStep(step - 1);
    };

    const startIndex = step == 0 ? 0 : steps[step - 1];
    const dateIndex = (data && data[selectedAnimal]) ? data[selectedAnimal].dateIndex : null;
    const gpsIndex = (data && data[selectedAnimal]) ? data[selectedAnimal].gpsIndex : null;
    const questions = data[selectedAnimal]?.questions.slice(startIndex, steps[step]);
    console.log(answers)

    const setDefaultAnswer = (value: string[]) => {
        setAnswers(value);
    }
    const setDefaultNewAnswer = (value: any[]) => {
        setNewAnswers(value);
    }

    return (
        <form
            style={{
                padding: "1rem",
                maxWidth: "500px",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
            }}
        >
            <SelectAnswer
                answer={selectedAnimal}
                setAnswer={setSelectedAnimal}
                choices={animalChoices}
            />
            {questions &&
                <Step
                    startIndex={startIndex}
                    dateIndex={dateIndex}
                    gpsIndex={gpsIndex}
                    questions={questions}
                    answers={answers}
                    setDefaultAnswer={setDefaultAnswer}
                />
            }

            {selectedAnimal &&
                <div style={{ display: "flex", columnGap: "1rem", marginTop: "auto" }}>
                    {step != 0 && <Button variant="contained" onClick={prevStep} disableElevation>이전</Button>}
                    {step < steps.length - 1 && <Button variant="contained" onClick={nextStep} disableElevation>다음</Button>}
                    {step == steps.length - 1 && <Button variant="contained" onClick={nextStep} disableElevation>제출</Button>}
                </div>
            }

        </form>
    )
}

export default Form;