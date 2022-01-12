import React, { useState } from 'react'
import Email from './Email/Email';
import Phone from './Phone/Phone';
import styles from './StepEmail.module.css'
const phoneEmailMap = {
    phone: Phone,
    email: Email
}

const StepPhoneEmail = ({ onClick }) => {
    const [type, setType] = useState('phone');
    const Component = phoneEmailMap[type];

    
    return (
        <>

            <div className={styles.cardWrapper}>
                <div>
                    <div className={styles.buttonWrap}>
                        <button onClick={() => setType('phone')}  className={`${styles.tabButton} ${type=== 'phone' ? styles.active : ''}`}>
                            <img src="/images/mobile.png" alt="" />
                        </button>
                        <button onClick={() => setType('email')} className={`${styles.tabButton} ${type=== 'email' ? styles.active : ''}`}>
                        <img src="/images/message.png" alt="" />
                        </button>
                    </div>
                    <Component onClick={onClick} />
                </div>
            </div>

        </>
    )
}

export default StepPhoneEmail
