import React, { useState,useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../../components/shared/Button/Button'
import Card from '../../../components/shared/Card/Card'
import TextInput from '../../../components/shared/textInput/TextInput'
import { activate } from '../../../http'
import { setAvatar } from '../../../store/activeSlice'
import styles from '../StepName/StepName'
import styled from './StepAvatar.module.css'
import { setAuth } from '../../../store/authSlice'
import Loader from '../../../components/shared/Loader/Loader'



const StepAvatar = ({ onClick }) => {
    const [image, setImage] = useState('/images/monkey-logo.jpg');
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const[Mounted,setMounted]=useState(false);

    const { name, avatar } = useSelector(state => state.activateSlice)


    const submit = async () => {
        if(!name || !avatar) return;
        setLoading(true)
        try {
            const { data } = await activate({ name, avatar })
            if (data.auth) {
                //check
                if(!Mounted){

                    dispatch(setAuth(data))
                }
            }
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
        setLoading(false)
    }


    useEffect(() => {
        return () => {
            setMounted(true);
        };
    }, []);

    const captureImage = (e) => {
        const file = e.target.files[0];

        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onloadend = function () {
            setImage(reader.result)
            dispatch(setAvatar(reader.result))
        }
    }

    if (loading) return <Loader message="Activating the user... Please wait!" />
    else {
        return (
            <div className='cardWrapper' >
                <Card
                    title={`"okay! ${name} "`}
                    icon="monkey"
                >
                    <p className={styled.subHeading} >How's this photo?</p>
                    <div className={styled.avatarWrapper}>
                        <img className={styled.avatarImage} src={image} alt="logo" />
                    </div>
                    <div>
                        <input
                            onChange={captureImage}
                            type="file"
                            id='avatarInput'
                            className={styled.avatarInput}

                        />
                        <label htmlFor="avatarInput" className={styled.avatarLabel} >Choose a different photo</label>
                    </div>
                    <div className={styles.actionButtonWrap}>
                        <Button onClick={submit} text="Next" />
                    </div>

                </Card>
            </div>
        )
    }
}

export default StepAvatar
