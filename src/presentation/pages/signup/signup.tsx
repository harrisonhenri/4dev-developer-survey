import React, { useState, useEffect, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Styles from './signup-styles.scss'
import { FormContext, ApiContext } from '@/presentation/contexts/'
import { Validation } from '@/presentation/protocols'
import { AddAccount } from '@/domain/usecases'

import { LoginHeader, Footer, Input, FormStatus, SubmitButton } from '@/presentation/components'

type Props = {
  validation: Validation
  addAccount: AddAccount
}

const SignUp: React.FC<Props> = ({ validation, addAccount }: Props) => {
  const { setCurrentAccount } = useContext(ApiContext)

  const history = useHistory()

  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
    mainError: '',
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    nameError: '',
    emailError: '',
    passwordError: '',
    passwordConfirmationError: ''
  })

  useEffect(() => {
    const { name, email, password, passwordConfirmation } = state

    const nameError = validation.validate('name', { name, email, password, passwordConfirmation })
    const emailError = validation.validate('email', { name, email, password, passwordConfirmation })
    const passwordError = validation.validate('password', { name, email, password, passwordConfirmation })
    const passwordConfirmationError = validation.validate('passwordConfirmation', { name, email, password, passwordConfirmation })

    setState({
      ...state,
      nameError,
      emailError,
      passwordError,
      passwordConfirmationError,
      isFormInvalid: !!nameError || !!emailError || !!passwordError || !!passwordConfirmationError
    })
  }, [state.email, state.name, state.password, state.passwordConfirmation, validation])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    try {
      if (state.isLoading || state.isFormInvalid) {
        return
      }
      setState({ ...state, isLoading: true })

      const { name, email, password, passwordConfirmation } = state

      const account = await addAccount.add({ name, email, password, passwordConfirmation })

      await setCurrentAccount(account)

      history.replace('/')
    } catch (error) {
      setState({ ...state, isLoading: false, mainError: error.message })
    }
  }

  return (
    <div className={Styles.signupContainer}>
      <LoginHeader />
      <FormContext.Provider value={{ state, setState }}>
        <form data-testid='form' className={Styles.form} onSubmit={handleSubmit}>
          <h2>Cadastro</h2>
          <Input type="text" name="name" placeholder="Nome"/>
          <Input type="email" name="email" placeholder="E-mail"/>
          <Input type="password" name="password" placeholder="Senha"/>
          <Input type="password" name="passwordConfirmation" placeholder="Confirme sua senha"/>
          <SubmitButton text='Cadastrar'/>
          <Link data-testid='login' to="/login" className={Styles.link}>Voltar ao login</Link>
          <FormStatus />
        </form>
      </FormContext.Provider>
      <Footer/>
    </div>
  )
}

export default SignUp
