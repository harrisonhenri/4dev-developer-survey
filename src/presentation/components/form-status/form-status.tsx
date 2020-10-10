import React from 'react'
import { FiAlertCircle } from 'react-icons/fi'
import Styles from './form-status-styles.scss'

const FormStatus: React.FC = () => {
  return (
    <div className={Styles.errorContainer}>
      <span className={Styles.formStatus}><FiAlertCircle color="#c53030" size={20} /></span>
      <span className={Styles.error}>Erro</span>
    </div>
  )
}

export default FormStatus
