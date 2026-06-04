import { createContext, useContext, useState, useEffect } from 'react'
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../firebaseConfig'

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // READ MULTIPLE ADMINS FROM .ENV
    const adminEmailsString = import.meta.env.VITE_ADMIN_EMAILS
    const adminEmails = adminEmailsString ? adminEmailsString.split(',') : []

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider()
        return signInWithPopup(auth, provider)
    }

    const logout = () => {
        return signOut(auth)
    }

    const isAdmin = currentUser ? adminEmails.includes(currentUser.email) : false

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    const value = {
        currentUser,
        login,
        loginWithGoogle,
        logout,
        isAdmin,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}