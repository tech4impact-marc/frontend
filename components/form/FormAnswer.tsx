import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import EXIF from 'exif-js';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormControl, Select, MenuItem, FormGroup, FormControlLabel, Checkbox, Radio, RadioGroup, OutlinedInput, Button } from '@mui/material';
import 'dayjs/locale/ko';
import dayjs from 'dayjs';

interface ShortAnswerProps {
    shortAnswer: string;
    setShortAnswer: (value: string) => void;
}

const ShortAnswer: React.FC<ShortAnswerProps> = ({ shortAnswer, setShortAnswer }) => {
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShortAnswer(e?.target?.value);
    };

    return (
        <FormControl fullWidth>
            <OutlinedInput
                placeholder='답변을 입력하세요'
                value={shortAnswer}
                onChange={handleTextChange}
                inputProps={{
                    'aria-label': 'weight',
                }}
            />
        </FormControl>
    );
};

const LocationAnswer: React.FC<ShortAnswerProps> = ({ shortAnswer, setShortAnswer }) => {
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShortAnswer(e?.target?.value);
    };

    const containerStyle = {
        display: 'flex',
        columnGap: "1rem",
        alignItems: 'center',
        width: '100%',
    };

    const gatherLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    setShortAnswer(`(${latitude}, ${longitude})`);
                    console.log(latitude, longitude)
                },
                function (error) {
                    // Handle errors
                    console.error(error);
                })
        }
    }

    return (
        <FormControl fullWidth>
            <div style={containerStyle}>
                <OutlinedInput
                    placeholder='답변을 입력하세요'
                    value={shortAnswer}
                    onChange={handleTextChange}
                    inputProps={{
                        'aria-label': 'weight',
                    }}
                    style={{ flex: "1" }}
                />
                <Button variant="contained" onClick={gatherLocation} disableElevation>현재 위치 사용하기</Button>
            </div>
        </FormControl>
    );
};

interface SelectAnswerProps {
    answer: string;
    choices: string[];
    setAnswer: (value: string) => void;
}

const SelectAnswer: React.FC<SelectAnswerProps> = ({ answer, setAnswer, choices }) => {
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAnswer(e?.target?.value);
    };

    return (
        <FormControl fullWidth>
            <Select
                displayEmpty
                value={answer}
                onChange={handleTextChange}
                renderValue={(selected: string) => {
                    if (!selected) {
                        return <>답변을 선택하세요</>;
                    }
                    return selected;
                }}
                input={<OutlinedInput />}
            >
                {choices.map((choice, index) => (
                    <MenuItem value={choice} key={index}>{choice}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};


const CheckboxAnswer: React.FC<SelectAnswerProps> = ({ answer, setAnswer, choices }) => {
    const [selectedChoices, setSelectedChoices] = useState<boolean[]>(Array(choices.length).fill(false));

    const handleTextChange = (index: number) => {
        setSelectedChoices(prevSelectedChoices => {
            const updatedChoices = [...prevSelectedChoices];
            updatedChoices[index] = !updatedChoices[index];
            return updatedChoices
        })
    };

    useEffect(() => {
        const selectedChoicesText = choices
            .filter((choice, index) => selectedChoices[index])
            .join(', ');
        setAnswer(selectedChoicesText);
    }, [selectedChoices])

    return (
        <FormControl fullWidth>
            <FormGroup>
                {choices.map((choice, index) => (
                    <FormControlLabel
                        key={index}
                        control={
                            <Checkbox
                                value={choice}
                                onChange={() => handleTextChange(index)}
                                checked={selectedChoices[index]}
                            />
                        }
                        label={choice}
                    />
                ))}
            </FormGroup>
        </FormControl>
    );
};

const RadioAnswer: React.FC<SelectAnswerProps> = ({ answer, setAnswer, choices }) => {
    const [other, setOther] = useState('')

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAnswer(e?.target?.value);
        if (e?.target?.value !== "기타") {
            setOther('');
        }
    };

    const handleOtherTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOther(e?.target?.value);
        setAnswer("기타: " + e?.target?.value);
    };

    return (
        <FormControl fullWidth>
            <RadioGroup
                value={answer.includes("기타") ? "기타" : answer}
                onChange={handleTextChange}
            >
                {choices.map((choice, index) => (
                    <FormControlLabel
                        key={index}
                        control={
                            <Radio
                                value={choice}
                                onChange={handleTextChange}
                            />
                        }
                        label={choice == "기타" && answer.includes("기타") ?
                            <FormControl fullWidth>
                                <OutlinedInput
                                    placeholder='답변을 입력하세요'
                                    value={other}
                                    onChange={handleOtherTextChange}
                                    inputProps={{
                                        'aria-label': 'weight',
                                    }}
                                />
                            </FormControl>
                            :
                            choice
                        }
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
};

interface DateAnswerProps {
    dateAnswer: string;
    setDateAnswer: (value: string) => void;
}

const DateAnswer: React.FC<DateAnswerProps> = ({ dateAnswer, setDateAnswer }) => {
    return (
        <FormControl fullWidth>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                <DatePicker
                    label="날짜를 입력하세요"
                    value={dateAnswer ? dayjs(dateAnswer) : null} //ignore the error, this works...
                    onChange={(newValue: string) => setDateAnswer(newValue)}
                    slotProps={{ field: { clearable: true } }}
                />
            </LocalizationProvider>
        </FormControl>
    );
};



///////////////////////////////////////

function formatDate(inputDate: string) {
    const dateRegex1 = /^(\d{4}):(\d{1,2}):(\d{1,2}).*/;;
    const match1 = (typeof inputDate === 'string') && inputDate.match(dateRegex1);

    if (match1) {
        const year = match1[1];
        const month = String(match1[2]).padStart(2, '0');
        const day = String(match1[3]).padStart(2, '0');
        return `${year}/${month}/${day}`;
    }

    const dateObject = new Date(inputDate);
    if (!isNaN(dateObject.getTime())) {
        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, '0');
        const day = String(dateObject.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    }

    return '';
}

type SetGPSAnswerFunction = (...values: string[]) => void;

interface ImageAnswerProps {
    selectedImage: string;
    setSelectedImage: SetGPSAnswerFunction;
}

const ImageAnswer: React.FC<ImageAnswerProps> = ({ selectedImage, setSelectedImage }) => {
    const handleImageChange = (e: React.ChangeEvent<any>) => {
        const file = e.target.files[0];
        console.log(file)

        if (file && file.type.startsWith('image/')) {
            EXIF.getData(file, function () {
                const EXIF_info = EXIF.getAllTags(this);
                const date = formatDate(EXIF_info.DateTime ? EXIF_info.DateTime : file.lastModifiedDate);
                const GPSLatitude = EXIF_info.GPSInfo?.GPSLatitude;
                const GPSLongitude = EXIF_info.GPSInfo?.GPSLongitude;

                console.log(EXIF_info, EXIF_info.DateTime, date, file.lastModifiedDate);

                if (GPSLatitude && GPSLongitude) {
                    setSelectedImage(URL.createObjectURL(file), date, `(${GPSLatitude}, ${GPSLongitude})`);
                } else {
                    setSelectedImage(URL.createObjectURL(file), date)
                }
            });
        };
    }
    return (
        <React.Fragment>
            <input type="file" capture="environment" accept="image/*" onChange={handleImageChange} />
            {selectedImage &&
                <Image
                    src={selectedImage} alt="Selected Image"
                    width={500}
                    height={500}
                    style={{ objectFit: "contain" }}
                />
            }
        </React.Fragment>
    );
};

export { ShortAnswer, LocationAnswer, SelectAnswer, DateAnswer, ImageAnswer, CheckboxAnswer, RadioAnswer }