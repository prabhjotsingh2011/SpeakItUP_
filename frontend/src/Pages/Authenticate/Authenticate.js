import React,{useState} from 'react'
import StepOtp from '../steps/StepOtp/StepOtp';
import StepPhoneEmail from '../steps/StepPhoneEmail/StepPhoneEmail';


const steps={
    1: StepPhoneEmail,
    2: StepOtp,
};


const Authenticate = () => {
    const [step, setStep] = useState(1);
    const Step=steps[step]
    
    const onNext=()=>{
        setStep(step+1);
    }
    return (
        <div>
            <Step onClick={onNext}/>
        </div>
    )
}

export default Authenticate
