import React, { useState } from 'react'
import Button from '../../../../components/shared/Button/Button'
import Card from '../../../../components/shared/Card/Card'
import TextInput from '../../../../components/shared/textInput/TextInput'
import { sendOtp } from '../../../../http'
import styles from '../StepEmail.module.css'
import { useDispatch } from 'react-redux'
import {  setOtp } from '../../../../store/authSlice'


const Phone = ({ onClick }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const dispatch = useDispatch()

    const submit = async () => {
        //server request
        if(!phoneNumber) return
        if (phoneNumber) {
            const {data} = await sendOtp({phone:phoneNumber})
            dispatch(setOtp({phone:data.phone,hash:data.hash}))
            
            console.log('====================================');
            console.log(data);
            console.log('====================================');
        }
        onClick();
    }
    return (
        <Card title="Enter your phone number" icon="phone">

            <TextInput value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <div>
                <div className={styles.actionButtonWrap}>

                    <Button onClick={submit} text="Next" />
                </div>
                <p className={styles.bottomParagraph}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat veniam, provident tempore ab minima non minus reiciendis. Mollitia ea eaque repellendus inventore veritatis temporibus. Laudantium inventore odit nobis illo laboriosam.</p>
            </div>

        </Card>
    )
}

export default Phone
