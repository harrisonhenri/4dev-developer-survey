import React, { useContext } from 'react'
import { BarLoader } from 'react-spinners'
import Styles from './form-status-styles.scss'
import Context from '@/presentation/contexts/form/form-context'

const FormStatus: React.FC = () => {
  const { state } = useContext(Context)

  const { mainError, isLoading } = state

  return (
    <div data-testid='form-status' className={Styles.errorContainer}>

      <BarLoader
        color={'#123abc'}
        loading={isLoading}
      />

      {mainError && <span data-testid='main-error' className={Styles.error}>{mainError}</span>}
    </div>
  )
}

export default FormStatus
