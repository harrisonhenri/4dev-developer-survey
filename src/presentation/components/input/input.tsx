import React from 'react'
import { FiAlertCircle } from 'react-icons/fi'
import Styles from './input-styles.scss'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
  const enableInput = (event: React.FocusEvent<HTMLInputElement>): void => {
    event.target.readOnly = false
  }

  return (
    <div className={Styles.inputContainer}>
      <input {...props} readOnly onFocus={enableInput}/>
      <span className={Styles.inputStatus}><FiAlertCircle color="#c53030" size={20} /></span>
    </div>
  )
}

export default Input
