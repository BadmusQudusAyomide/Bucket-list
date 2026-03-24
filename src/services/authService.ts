import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import { mapUserProfile } from '../utils/firebaseMappers'
import type { UserProfile } from '../types/firebase'

const usersCollection = 'users'
const googleProvider = new GoogleAuthProvider()

googleProvider.setCustomParameters({
  prompt: 'select_account',
})

const ensureUserProfile = async (user: User): Promise<UserProfile> => {
  const profileRef = doc(db, usersCollection, user.uid)
  const snapshot = await getDoc(profileRef)

  if (!snapshot.exists()) {
    const fallbackProfile: UserProfile = {
      uid: user.uid,
      email: user.email ?? '',
      role: 'user',
      createdAt: null,
    }

    await setDoc(profileRef, {
      ...fallbackProfile,
      createdAt: serverTimestamp(),
    })

    return fallbackProfile
  }

  return mapUserProfile(snapshot.id, snapshot.data())
}

export const signupWithEmail = async (email: string, password: string) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password)

  await setDoc(doc(db, usersCollection, credential.user.uid), {
    uid: credential.user.uid,
    email,
    role: 'user',
    createdAt: serverTimestamp(),
  })

  return credential.user
}

export const loginWithEmail = async (email: string, password: string) => {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export const loginWithGoogle = async () => {
  const credential = await signInWithPopup(auth, googleProvider)
  await ensureUserProfile(credential.user)
  return credential.user
}

export const logout = async () => {
  await signOut(auth)
}

export const getUserProfile = async (user: User): Promise<UserProfile> => {
  return ensureUserProfile(user)
}
