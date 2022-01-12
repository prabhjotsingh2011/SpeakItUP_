import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../../components/shared/Button/Button'
import Card from '../../../components/shared/Card/Card'
import TextInput from '../../../components/shared/textInput/TextInput'
import { setName } from '../../../store/activeSlice'
import styles from './StepName.module.css'

const StepName = ({onNext}) => {
    const dispatch = useDispatch()
    const {name} = useSelector(state => state.activateSlice)


    const [fullName, setFullName] = useState(name);
    const nextStep =()=>{
        if(!fullName) return;
        dispatch(setName(fullName))
        onNext();
    }



    return (
        <div className={styles.cardWrapper}>
            <Card
                    title="Enter your Full Name"
                    icon="googles"
                >
                    <TextInput
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <p className={styles.bottomParagraph}>
                        By entering your number, you're agreeing to our Terms of
                        Service and Privacy Policy. Thanks!
                    </p>
                    <div className={styles.actionButtonWrap}>
                        <Button onClick={nextStep} text="Next" />
                    </div>
                </Card>
        </div>
    )
}

export default StepName
