import React from 'react'
import { Link , useHistory} from 'react-router-dom'
import Button from '../../components/shared/Button/Button'
import Card from '../../components/shared/Card/Card'
import styles from './Home.module.css'


const Home = () => {
    const signinLink={
        color:'#0077FF',
        fontWeight:'bold',
        textDecoration:'none',
        marginLeft:'10px',
    }
    const history=useHistory();
    const startRegister=()=>{   
        history.push('/authenticate');
    }
    return (
        <div className={styles.cardWrapper}>
            <Card title="Welcome to SpeakItUP" icon="mic">
                <p className={styles.text} > Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat placeat omnis accusantium dolor provident autem similique excepturi, natus ea. Magni placeat distinctio ad </p>

                <div>
                    <Button onClick={startRegister} text="Let's Go" />
                </div>


                <div className={styles.signinWrapper} > 
                    <span className={styles.hasInvite}>Haven't an invite text?</span>
                    
                </div>
            </Card>
            
        </div>
    )
}

export default Home
