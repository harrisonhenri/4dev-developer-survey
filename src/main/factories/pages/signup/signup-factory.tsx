import React from 'react'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeRemoteAddAccount } from '@/main/factories/usecases'
import { SignUp } from '@/presentation/pages'

export const makeSignUp: React.FC = () => {
  return <SignUp addAccount={makeRemoteAddAccount()} validation={makeSignUpValidation()} />
}
