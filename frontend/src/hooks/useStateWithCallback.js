
import { useCallback,useEffect, useState,useRef } from "react"
export const useStateWithCallback=(initialState)=>{

    const [state,setState]=useState(initialState)
   
    const cbRef=useRef()//in useRef whenever its current value changes it do not re render the whole component 
    const updateState=useCallback((newState,cb)=>{ //cb=callback
        cbRef.current=cb; 
        setState((prev)=> {
            return typeof newState ==='function' ? newState(prev):newState

        })
    },[])

    useEffect(() => {
        if(cbRef.current){

            cbRef.current(state)
            cbRef.current=null;
        }
    }, [state]);

    return [state,updateState]
}