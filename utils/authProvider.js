"use client"
import { AuthContextProvider } from "./authContext"
function AuthProviders({children}) {

  return (
    <AuthContextProvider>
      {children}
    </AuthContextProvider>
  )
}

export default AuthProviders