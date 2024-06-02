import React from "react";
import styles from "./Input.module.css";

const Input = ({ title, type, placeholder, value, onChange, inputRef=null, required}) => {
    const [passwordVisible, setPasswordVisible] = React.useState(false);

    const togglePassword = () => {
        setPasswordVisible(!passwordVisible);
    }

    return (
        <div className={styles['input__container']}>
            <label>{title}</label>
            {
                type === "password" ? (
                    <div className={styles["input__password"]}>
                        <input 
                        type={passwordVisible ? "text" : "password"} 
                        placeholder={placeholder} 
                        value={value} 
                        onChange={onChange} 
                        ref={inputRef} 
                        required={required}/>

                        <span 
                        className="material-symbols-outlined" 
                        onClick={togglePassword}>{passwordVisible ? "visibility_off" : "visibility"}</span>
                    </div>
                ) : (
                    <input 
                    type={type} 
                    placeholder={placeholder} 
                    value={value} 
                    onChange={onChange} 
                    ref={inputRef} 
                    required={required}/>
                )
            
            }
        </div>
    );
}

export default Input;