import React, { useContext } from 'react'
import { FiAlertCircle } from 'react-icons/fi'
import Styles from './input-styles.scss'
import Context from '@/presentation/context/form/form-context'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
  const { errorState } = useContext(Context)

  const error = errorState[`${props.name}`]

  const enableInput = (event: React.FocusEvent<HTMLInputElement>): void => {
    event.target.readOnly = false
  }

  const getStatus = (): JSX.Element => {
    return <FiAlertCircle color="#c53030" size={20} />
  }

  const getTitle = (): string => {
    return error
  }

  return (
    <div className={Styles.inputContainer}>
      <input {...props} readOnly onFocus={enableInput}/>
      <span data-testid={`${props.name}-status`} title={getTitle()} className={Styles.inputStatus}>{getStatus()}</span>
    </div>
  )
}

export default Input
