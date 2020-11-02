import React, { useState, useEffect, useContext } from 'react'
import Styles from './login-styles.scss'
import { FormContext, ApiContext } from '@/presentation/contexts/'
import { Validation } from '@/presentation/protocols'
import { Authentication } from '@/domain/usecases'
import { Link, useHistory } from 'react-router-dom'

import { LoginHeader, Footer, Input, FormStatus, SubmitButton } from '@/presentation/components'

type Props = {
  validation: Validation
  authentication: Authentication
}

const Login: React.FC<Props> = ({ validation, authentication }: Props) => {
  const { setCurrentAccount } = useContext(ApiContext)

  const history = useHistory()

  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
    mainError: '',
    email: '',
    password: '',
    emailError: '',
    passwordError: ''
  })

  useEffect(() => {
    const { email, password } = state

    const emailError = validation.validate('email', { email, password })
    const passwordError = validation.validate('password', { email, password })

    setState({
      ...state,
      emailError,
      passwordError,
      isFormInvalid: !!emailError || !!passwordError
    })
  }, [state.email, state.password, validation])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    try {
      if (state.isLoading || state.isFormInvalid) {
        return
      }
      setState({ ...state, isLoading: true })

      const { email, password } = state

      const account = await authentication.auth({ email, password })

      await setCurrentAccount(account)

      history.replace('/')
    } catch (error) {
      setState({ ...state, isLoading: false, mainError: error.message })
    }
  }

  return (
    <div className={Styles.loginContainer}>
      <LoginHeader />
      <FormContext.Provider value={{ state, setState }}>
        <form data-testid='form' className={Styles.form} onSubmit={handleSubmit}>
          <h2>Login</h2>
          <Input type="email" name="email" placeholder="E-mail"/>
          <Input type="password" name="password" placeholder="Senha"/>
          <SubmitButton text='Entrar'/>
          <Link data-testid='signup' to="/signup" className={Styles.link}>Criar conta</Link>
          <FormStatus />
        </form>
      </FormContext.Provider>
      <Footer/>
    </div>
  )
}

export default Login
