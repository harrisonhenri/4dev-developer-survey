import React from 'react'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeRemoteAddAccount } from '@/main/factories/usecases/add-account/remote-add-account-factory'
import { SignUp } from '@/presentation/pages'
import { makeLocalSaveAccessToken } from '@/main/factories/usecases/save-access-token/local-save-access-token-factory'

export const makeSignUp: React.FC = () => {
  return <SignUp addAccount={makeRemoteAddAccount()} validation={makeSignUpValidation()} saveAccessToken={makeLocalSaveAccessToken()}/>
}
