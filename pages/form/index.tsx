import { DateAnswer, ImageAnswer, SelectAnswer } from '@/components/form/FormAnswer';
import Step from '@/components/form/Step';
import { FormControlLabel, Checkbox, Select, MenuItem, OutlinedInput } from '@mui/material';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Form = () => {
    const { data, error } = useSWR('/form/questions.json', fetcher);

    const animalChoices = ["남방큰돌고래", "바다거북"];
    const [selectedAnimal, setSelectedAnimal] = useState('');
    const [step, setStep] = useState<number>(0);
    const [answers, setAnswers] = useState<string[]>(Array(10).fill(''));
    useEffect(() => {
        if (data && data[selectedAnimal]) setAnswers(Array(data[selectedAnimal].questions.length).fill(''));
        setStep(0);
        if (data && data[selectedAnimal]) console.log(data[selectedAnimal].questions)
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
    const dateIndex = (data && data[selectedAnimal])? data[selectedAnimal].dateIndex : null;
    const gpsIndex = (data && data[selectedAnimal])? data[selectedAnimal].gpsIndex : null;
    const questions = data[selectedAnimal]?.questions.slice(startIndex, steps[step]);
    console.log(answers)

    const setDefaultAnswer = (value: string[]) => {
        setAnswers(value);
    }

    return (
        <form>
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
                <>
                    <button onClick={prevStep}>Previous</button>
                    <button onClick={nextStep}>Next</button>
                </>
            }

        </form>
    )
}

export default Form;