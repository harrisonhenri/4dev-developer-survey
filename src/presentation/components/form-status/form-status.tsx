import React, { useContext } from 'react'
import { FiAlertCircle } from 'react-icons/fi'
import Styles from './form-status-styles.scss'
import Context from '@/presentation/context/form/form-context'

const FormStatus: React.FC = () => {
  const { state } = useContext(Context)

  const { main } = state

  return (
    <div data-testid='form-status' className={Styles.errorContainer}>

      {main && (
        <><span className={Styles.formStatus}><FiAlertCircle color="#c53030" size={20} /></span>
          <span className={Styles.error}>Erro</span>
        </>)
      }
    </div>
  )
}

export default FormStatus
