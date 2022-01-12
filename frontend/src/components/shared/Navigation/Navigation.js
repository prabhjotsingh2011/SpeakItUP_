import React from 'react'
import { Link } from 'react-router-dom'
import { logout } from '../../../http'
import { useDispatch, useSelector } from 'react-redux'
import styles from './Navigation.module.css'
import { setAuth } from '../../../store/authSlice'


const Navigation = () => {
    const dispatch = useDispatch()

    const brandStyle = {
        color: '#fff',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '22px',
        display: 'flex',
        alignItems: 'center'
    }
    const logoText = {
        marginLeft: '10px'
    }

    const { isAuth, user } = useSelector(state => state.auth)

    const logoutUser = async () => {
        try {

            const { data } = await logout()
            dispatch(setAuth(data))
        } catch (error) {
            console.log(error);
        }

    }
    return (
        <nav className={`${styles.navbar} container`}>
            <Link style={brandStyle} to='/'>
                <img src="/images/mic.png" alt="logo" srcset="" />
                <span style={logoText} >SpeakItUP</span>
            </Link>

            <div className={styles.navRight}>
                <h3>{user?.name}</h3>
                <Link to='/' >
                    <img src={user?.avatar} width="40" height="40" alt="" srcset="" className={styles.avatar} />
                </Link>
                {isAuth &&  <button onClick={logoutUser} className={styles.logoutButton}>
                <img src="https://img.icons8.com/color-glass/48/000000/exit.png" className={styles.logoutLogo}/>
                </button>}
            </div>
        </nav>
    )
}

export default Navigation
