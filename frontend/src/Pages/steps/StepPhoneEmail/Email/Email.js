import React, { useState } from 'react'
import Button from '../../../../components/shared/Button/Button'
import Card from '../../../../components/shared/Card/Card'
import TextInput from '../../../../components/shared/textInput/TextInput'
import styles from '../StepEmail.module.css'

const Email = ({onClick}) => {
    const [email, setEmail] = useState('');
    return (
        <Card title="Enter your Email address" icon="message">
            <TextInput value={email} onChange={(e) => setEmail(e.target.value)} />
            <div>
                <div className={styles.actionButtonWrap}>

                    <Button onClick={onClick} text="Next" />
                </div>
                <p className={styles.bottomParagraph}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat veniam, provident tempore ab minima non minus reiciendis. Mollitia ea eaque repellendus inventore veritatis temporibus. Laudantium inventore odit nobis illo laboriosam.</p>
            </div>

        </Card>
    )
}

export default Email
