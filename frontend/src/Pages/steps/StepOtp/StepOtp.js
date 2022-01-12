import React,{useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../../components/shared/Button/Button'
import Card from '../../../components/shared/Card/Card'
import TextInput from '../../../components/shared/textInput/TextInput'
import { verifyOtp } from '../../../http'
import { setAuth } from '../../../store/authSlice'
import styles from './StepOtp.module.css'

const StepOtp = ({onClick}) => {
    const dispatch = useDispatch()


    const [otp, setOtp] = useState('');
    const {phone,hash} = useSelector(state => state.auth.otp)


    const submit=async ()=>{
        if(!otp || !phone || !hash) return  
        try {
            const {data}=await verifyOtp({otp,phone,hash});
            dispatch(setAuth(data))
            console.log(data);
            // onClick();
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <div className={styles.cardWrapper}>
                <Card
                    title="Enter the code we just texted you"
                    icon="Lock"
                >
                    <TextInput
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <div className={styles.actionButtonWrap}>
                        <Button onClick={submit} text="Next" />
                    </div>
                    <p className={styles.bottomParagraph}>
                        By entering your number, you're agreeing to our Terms of
                        Service and Privacy Policy. Thanks!
                    </p>
                </Card>
            </div>
        </div>
    )
}

export default StepOtp
