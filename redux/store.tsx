import { createStore } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// 초기 상태
const initialState = {
  signupUserInfo: {
    userName: '',
    userEmail: '',
    userProfile: {},
    // 다른 필요한 정보들 추가 가능
  },
  tokens: {},
  user: {},
  tokenExpiresAt: {
    accessToken: 0,
    refreshToken: 0,
  },
}

// 리듀서
const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SIGNUP_SET_USERNAME':
      return {
        ...state,
        signupUserInfo: { ...state.signupUserInfo, userName: action.payload },
      }
    case 'SIGNUP_SET_USEREMAIL':
      return {
        ...state,
        signupUserInfo: { ...state.signupUserInfo, userEmail: action.payload },
      }
    case 'SIGNUP_SET_USERPROFILE':
      return {
        ...state,
        signupUserInfo: { ...state.signupUserInfo, userProfile: action.payload },
      }
    case 'SET_TOKENS':
      return {
        ...state,
        tokens: action.payload,
      }
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      }
    case 'SET_ACCESSTOKEN_EXPIRESAT':
      return {
        ...state,
        tokenExpiresAt: { ...state.tokenExpiresAt, accessToken: action.payload },
      }
    case 'SET_REFRESHTOKEN_EXPIRESAT':
      return {
        ...state,
        tokenExpiresAt: { ...state.tokenExpiresAt, refreshToken: action.payload },
      }
    // 다른 액션 추가 가능
    default:
      return state
  }
}

const persistConfig = {
  key: 'root',
  storage: storage,
}

const persistedReducer = persistReducer(persistConfig, reducer)

// 스토어 생성
const store = createStore(persistedReducer)

const persistor = persistStore(store)

export { persistor, store }
