import React, { memo } from 'react'
import { FiAlertCircle } from 'react-icons/fi'
import Styles from './input-styles.scss'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Footer: React.FC<Props> = (props: Props) => {
  return (
    <div className={Styles.inputContainer}>
      <input {...props}/>
      <span className={Styles.inputStatus}><FiAlertCircle color="#c53030" size={20} /></span>
    </div>
  )
}

export default memo(Footer)
